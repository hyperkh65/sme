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
      { error: 'DATA_GO_KR_SERVICE_KEY not set' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? 1)
  const perPage = Number(searchParams.get('perPage') ?? 20)
  const regionFilter = searchParams.get('region')

  try {
    const url =
      `${BASE_URL}?page=${page}&perPage=${perPage}` +
      `&returnType=JSON&serviceKey=${SERVICE_KEY}`

    const res = await fetch(url, {
      cache: 'no-store',
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('공공데이터 API 오류:', text)
      return NextResponse.json(
        { error: 'Public API error' },
        { status: 502 }
      )
    }

    const json = await res.json()

    const programs = (json.data ?? []).map((item: any) => {
      const region = extractRegion(item.사업명 ?? '')
      return {
        id: String(item.번호),
        title: item.사업명,
        field: item.분야,
        region,
        agency: item.소관기관,
        executor: item.수행기관,
        startDate: item.신청시작일자,
        endDate: item.신청종료일자,
        status: getStatus(item.신청종료일자),
        url: item.상세URL,
        registeredAt: item.등록일자,
      }
    })

    const filteredPrograms = regionFilter
      ? programs.filter(
          (p: any) =>
            p.region === regionFilter || p.region === '전국'
        )
      : programs

    return NextResponse.json({
      page: json.page,
      perPage: json.perPage,
      totalCount: json.totalCount,
      currentCount: filteredPrograms.length,
      programs: filteredPrograms,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'API fetch failed' },
      { status: 500 }
    )
  }
}
