import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const SERVICE_KEY = process.env.DATA_GO_KR_SERVICE_KEY
const BASE_URL =
  'https://api.odcloud.kr/api/3034791/v1/uddi:fa09d13d-bce8-474e-b214-8008e79ec08f'

/* ======================
   유틸
====================== */

function normalizeRegion(raw?: string) {
  if (!raw) return '전국'
  if (raw.includes('서울')) return '서울'
  if (raw.includes('경기')) return '경기'
  if (raw.includes('부산')) return '부산'
  if (raw.includes('대구')) return '대구'
  if (raw.includes('인천')) return '인천'
  if (raw.includes('광주')) return '광주'
  if (raw.includes('대전')) return '대전'
  if (raw.includes('울산')) return '울산'
  return '기타'
}

/**
 * status 판단 전용
 * - endDate가 오늘 이전이면 마감
 * - 오늘 포함 이후면 신청가능
 */
function getStatus(endDate?: string): '신청가능' | '마감' {
  if (!endDate) return '신청가능'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  return end.getTime() < today.getTime()
    ? '마감'
    : '신청가능'
}

/* ======================
   API
====================== */

export async function GET(req: Request) {
  if (!SERVICE_KEY) {
    return NextResponse.json(
      { error: 'SERVICE_KEY missing' },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(req.url)

  const page = Number(searchParams.get('page') ?? 1)
  const perPage = Number(searchParams.get('perPage') ?? 20)
  const region = searchParams.get('region')
  const status = searchParams.get('status')
  const keyword = searchParams.get('keyword')?.trim()
  const sort = searchParams.get('sort') ?? 'deadline'
  const id = searchParams.get('id')

  try {
    const res = await fetch(
      `${BASE_URL}?page=1&perPage=1000&returnType=JSON&serviceKey=${SERVICE_KEY}`,
      { cache: 'no-store' },
    )

    const json = await res.json()

    let programs = (json.data ?? []).map((item: any) => {
      const title = item.사업명 ?? ''
      const regionRaw = title + (item.지역 ?? '')
      const region = normalizeRegion(regionRaw)
      const endDate = item.신청종료일자

      const status = getStatus(endDate)

      return {
        id: String(item.번호),
        title,
        agency: item.소관기관,
        executor: item.수행기관,
        field: item.지원분야 ?? '기타',
        region,
        startDate: item.신청시작일자,
        endDate,
        status,
        registeredAt: item.등록일자,
        url: item.사업공고URL,
      }
    })

    /* ===== 단건 조회 ===== */
    if (id) {
      const program = programs.find((p) => p.id === id)
      return NextResponse.json({ program: program ?? null })
    }

    /* ===== 검색 ===== */
    if (keyword) {
      programs = programs.filter(
        (p) =>
          p.title.includes(keyword) ||
          p.agency?.includes(keyword),
      )
    }

    /* ===== 필터 ===== */
    if (region) {
      programs = programs.filter((p) => p.region === region)
    }

    if (status) {
      programs = programs.filter((p) => p.status === status)
    }

    /* ===== 정렬 ===== */
    if (sort === 'deadline') {
      // 신청가능 먼저, 마감은 뒤로
      programs.sort((a, b) => {
        if (a.status === '마감' && b.status !== '마감') return 1
        if (a.status !== '마감' && b.status === '마감') return -1

        return (
          new Date(a.endDate ?? '').getTime() -
          new Date(b.endDate ?? '').getTime()
        )
      })
    }

    if (sort === 'latest') {
      programs.sort(
        (a, b) =>
          new Date(b.registeredAt ?? '').getTime() -
          new Date(a.registeredAt ?? '').getTime(),
      )
    }

    /* ===== 페이지네이션 ===== */
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
