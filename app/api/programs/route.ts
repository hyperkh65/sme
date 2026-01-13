import { NextResponse } from 'next/server'

const SERVICE_KEY = process.env.DATA_GO_KR_SERVICE_KEY
const BASE_URL =
  'https://api.odcloud.kr/api/3034791/v1/uddi:fa09d13d-bce8-474e-b214-8008e79ec08f'

function extractRegion(title: string): string {
  const match = title.match(/^\[(.*?)\]/)
  return match ? match[1] : '전국'
}

function getStatus(endDate?: string): '신청가능' | '마감' {
  if (!endDate) return '신청가능'
  return new Date(endDate) >= new Date() ? '신청가능' : '마감'
}

export async function GET(req: Request) {
  if (!SERVICE_KEY) {
    return NextResponse.json(
      { error: 'SERVICE_KEY missing' },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(req.url)

  const page = Number(searchParams.get('page') ?? 1)
  const perPage = Number(searchParams.get('perPage') ?? 10)
  const region = searchParams.get('region')
  const status = searchParams.get('status')
  const keyword = searchParams.get('keyword')?.trim()
  const sort = searchParams.get('sort') ?? 'deadline'

  try {
    /* 1️⃣ 공공 API에서 넉넉히 가져오기 */
    const res = await fetch(
      `${BASE_URL}?page=1&perPage=1000&returnType=JSON&serviceKey=${SERVICE_KEY}`,
      { cache: 'no-store' },
    )

    const json = await res.json()

    let programs = (json.data ?? []).map((item: any) => {
      const region = extractRegion(item.사업명 ?? '')
      const endDate = item.신청종료일자

      return {
        id: String(item.번호),
        title: item.사업명,
        agency: item.소관기관,
        region,
        endDate,
        status: getStatus(endDate),
        registeredAt: item.등록일자,
      }
    })

    /* 2️⃣ 검색 */
    if (keyword) {
      programs = programs.filter((p) =>
        p.title.includes(keyword),
      )
    }

    /* 3️⃣ 필터 */
    if (region) {
      programs = programs.filter(
        (p) => p.region === region || p.region === '전국',
      )
    }

    if (status) {
      programs = programs.filter((p) => p.status === status)
    }

    /* 4️⃣ 정렬 */
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

    /* 5️⃣ 페이지네이션 */
    const totalCount = programs.length
    const totalPages = Math.ceil(totalCount / perPage)
    const start = (page - 1) * perPage
    const paginated = programs.slice(start, start + perPage)

    return NextResponse.json({
      page,
      perPage,
      totalPages,
      totalCount,
      programs: paginated,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'API fetch failed' },
      { status: 500 },
    )
  }
}
