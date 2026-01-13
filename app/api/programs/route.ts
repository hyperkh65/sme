import { NextResponse } from 'next/server'

const SERVICE_KEY = process.env.DATA_GO_KR_SERVICE_KEY
const BASE_URL =
  'https://api.odcloud.kr/api/3034791/v1/uddi:fa09d13d-bce8-474e-b214-8008e79ec08f'

function extractRegion(title: string): string {
  const match = title?.match(/^\[(.*?)\]/)
  return match ? match[1] : '전국'
}

function getStatus(endDate?: string): '신청가능' | '마감' {
  if (!endDate) return '신청가능'
  return new Date(endDate) >= new Date() ? '신청가능' : '마감'
}

export async function GET(req: Request) {
  if (!SERVICE_KEY) {
    return NextResponse.json({ error: 'SERVICE_KEY missing' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? 1)
  const perPage = Number(searchParams.get('perPage') ?? 20)
  const region = searchParams.get('region')
  const field = searchParams.get('field')
  const keyword = searchParams.get('keyword')
  const sort = searchParams.get('sort') ?? 'deadline'

  try {
    const res = await fetch(
      `${BASE_URL}?page=1&perPage=1000&returnType=JSON&serviceKey=${encodeURIComponent(
        SERVICE_KEY,
      )}`,
      { cache: 'no-store' },
    )

    if (!res.ok) {
      const t = await res.text()
      console.error(t)
      return NextResponse.json({ error: 'Public API error' }, { status: 502 })
    }

    const json = await res.json()

    let programs = (json.data ?? []).map((item: any) => {
      const region = extractRegion(item.사업명)
      const endDate = item.신청종료일자

      return {
        id: String(item.번호),
        title: item.사업명,
        field: item.분야,
        region,
        agency: item.소관기관,
        executor: item.수행기관,
        startDate: item.신청시작일자,
        endDate,
        registeredAt: item.등록일자,
        url: item.상세URL,
        status: getStatus(endDate),
      }
    })

    // 🔍 검색
    if (keyword) {
      programs = programs.filter((p) => p.title.includes(keyword))
    }

    // 🎯 필터
    if (region) {
      programs = programs.filter(
        (p) => p.region === region || p.region === '전국',
      )
    }

    if (field) {
      programs = programs.filter((p) => p.field === field)
    }

    // 🔃 정렬
    if (sort === 'deadline') {
      programs.sort(
        (a, b) =>
          new Date(a.endDate ?? '9999').getTime() -
          new Date(b.endDate ?? '9999').getTime(),
      )
    }

    if (sort === 'latest') {
      programs.sort(
        (a, b) =>
          new Date(b.registeredAt ?? '').getTime() -
          new Date(a.registeredAt ?? '').getTime(),
      )
    }

    // 📌 필터 옵션 자동 생성
    const regions = Array.from(new Set(programs.map((p) => p.region)))
    const fields = Array.from(new Set(programs.map((p) => p.field)))

    // 📄 페이지네이션
    const totalCount = programs.length
    const start = (page - 1) * perPage
    const paginated = programs.slice(start, start + perPage)

    return NextResponse.json({
      page,
      perPage,
      totalCount,
      programs: paginated,
      filters: {
        regions,
        fields,
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'API fetch failed' }, { status: 500 })
  }
}
