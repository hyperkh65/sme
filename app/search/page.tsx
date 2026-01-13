'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/* =========================
   타입
========================= */
type Program = {
  id: string
  title: string
  agency: string
  region: string
  endDate?: string
  status: '신청가능' | '마감'
}

/* =========================
   지역 매핑 (UX 핵심)
========================= */
const REGION_MAP: Record<string, string[]> = {
  서울: ['서울', '서울특별시'],
  경기: ['경기', '경기도'],
  부산: ['부산', '부산광역시'],
  대구: ['대구', '대구광역시'],
  인천: ['인천', '인천광역시'],
  광주: ['광주', '광주광역시'],
  대전: ['대전', '대전광역시'],
  울산: ['울산', '울산광역시'],
  세종: ['세종', '세종특별자치시'],
  강원: ['강원', '강원도'],
  충북: ['충북', '충청북도'],
  충남: ['충남', '충청남도'],
  전북: ['전북', '전북특별자치도'],
  전남: ['전남', '전라남도'],
  경북: ['경북', '경상북도'],
  경남: ['경남', '경상남도'],
  제주: ['제주', '제주특별자치도'],
}

/* =========================
   지역 정규화 (표시용)
========================= */
function normalizeRegion(region: string) {
  for (const [key, values] of Object.entries(REGION_MAP)) {
    if (values.includes(region)) return key
  }
  return region
}

/* =========================
   D-Day (오늘 기준, 오류 수정)
========================= */
function dday(endDate?: string) {
  if (!endDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)
  return Math.ceil((end.getTime() - today.getTime()) / 86400000)
}

/* =========================
   페이지
========================= */
export default function SearchPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [region, setRegion] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('deadline')

  useEffect(() => {
    setLoading(true)
    fetch(
      `/api/programs?page=${page}&perPage=20&keyword=${keyword}&status=${status}&sort=${sort}`,
    )
      .then((res) => res.json())
      .then((data) => {
        let list: Program[] = data.programs || []

        // 지역 필터 (서울 ↔ 서울특별시)
        if (region) {
          const targets = REGION_MAP[region] ?? [region]
          list = list.filter(
            (p) => targets.includes(p.region) || p.region === '전국',
          )
        }

        setPrograms(list)
        setLoading(false)
      })
  }, [page, keyword, region, status, sort])

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h1 className="text-3xl md:text-4xl font-bold">
            중소기업 지원사업 검색
          </h1>
          <p className="mt-3 text-blue-100 max-w-2xl">
            정부·지자체 지원사업을 한 곳에서 검색하고, 마감 임박 공고를
            놓치지 마세요.
          </p>

          {/* 검색바 */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow grid gap-4 md:grid-cols-6">
            <input
              placeholder="사업명, 기관명 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="md:col-span-2 rounded-lg border px-4 py-3 text-slate-900"
            />

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-lg border px-3 py-3 text-slate-900"
            >
              <option value="">전체 지역</option>
              {Object.keys(REGION_MAP).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border px-3 py-3 text-slate-900"
            >
              <option value="">전체 상태</option>
              <option value="신청가능">신청가능</option>
              <option value="마감">마감</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border px-3 py-3 text-slate-900"
            >
              <option value="deadline">마감임박순</option>
              <option value="latest">최신등록순</option>
            </select>

            <button
              onClick={() => setPage(1)}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
            >
              검색
            </button>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 lg:grid-cols-4">
        {/* ===== LIST ===== */}
        <section className="lg:col-span-3 space-y-6">
          {loading ? (
            <p className="text-center py-40 text-slate-500">불러오는 중…</p>
          ) : (
            programs.map((p) => {
              const d = dday(p.endDate)

              return (
                <Link
                  key={p.id}
                  href={`/program/${p.id}`}
                  className="block bg-white border rounded-2xl p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {p.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {p.agency} · {normalizeRegion(p.region)}
                      </p>
                    </div>

                    <span
                      className={`h-fit px-4 py-1.5 rounded-full text-xs font-semibold ${
                        p.status === '마감'
                          ? 'bg-slate-200 text-slate-600'
                          : d !== null && d <= 3
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {p.status}
                      {d !== null && ` · D-${d}`}
                    </span>
                  </div>
                </Link>
              )
            })
          )}

          {/* 페이지네이션 */}
          <div className="flex justify-center gap-4 pt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="border rounded-lg px-4 py-2 disabled:opacity-40"
            >
              이전
            </button>
            <span className="px-4 py-2 font-medium">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="border rounded-lg px-4 py-2"
            >
              다음
            </button>
          </div>
        </section>

        {/* ===== SIDEBAR + ADS ===== */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white border rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-2">ADVERTISEMENT</div>
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-8940400388075870"
              data-ad-slot="5158151469"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-2">ADVERTISEMENT</div>
            <ins
              className="adsbygoogle"
              style={{ display: 'inline-block', width: 300, height: 250 }}
              data-ad-client="ca-pub-8940400388075870"
              data-ad-slot="4966757696"
            />
          </div>
        </aside>
      </div>
    </main>
  )
}
