'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

type Program = {
  id: string
  title: string
  agency: string
  region: string
  endDate?: string
  status: '신청가능' | '마감'
}

/* ===============================
   D-DAY 계산 (오늘 기준, 음수 방지)
================================ */
function dday(endDate?: string) {
  if (!endDate) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 마감일을 해당 날짜의 23:59:59로 고정
  const [y, m, d] = endDate.split('-').map(Number)
  const deadline = new Date(y, m - 1, d, 23, 59, 59)

  const diff = Math.ceil(
    (deadline.getTime() - today.getTime()) / 86400000
  )

  if (diff < 0) return null
  return diff
}

/* ===============================
   지역 매핑 (부분 포함 필터링)
================================ */
const REGION_MAP: Record<string, string[]> = {
  전국: ['전국'],
  서울: ['서울', '서울시', '서울특별시'],
  경기: ['경기', '경기도'],
  부산: ['부산', '부산시', '부산광역시'],
  대구: ['대구', '대구시', '대구광역시'],
  인천: ['인천', '인천시', '인천광역시'],
  광주: ['광주', '광주시', '광주광역시'],
  대전: ['대전', '대전시', '대전광역시'],
  울산: ['울산', '울산시', '울산광역시'],
  세종: ['세종', '세종시', '세종특별자치시'],
  강원: ['강원', '강원도'],
  충북: ['충북', '충청북도'],
  충남: ['충남', '충청남도'],
  전북: ['전북', '전라북도'],
  전남: ['전남', '전라남도'],
  경북: ['경북', '경상북도'],
  경남: ['경남', '경상남도'],
  제주: ['제주', '제주도', '제주특별자치도'],
}

export default function SearchPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [region, setRegion] = useState('')
  const [sort, setSort] = useState('deadline')

  /* ===============================
     API 호출
  ================================ */
  useEffect(() => {
    setLoading(true)
    fetch(
      `/api/programs?page=${page}&perPage=20&keyword=${keyword}&sort=${sort}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setPrograms(data.programs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [page, keyword, sort])

  /* ===============================
     프론트 지역 필터링 (핵심!)
  ================================ */
  const filteredPrograms = useMemo(() => {
    if (!region) return programs

    const keywords = REGION_MAP[region]
    if (!keywords) return programs

    return programs.filter((p) =>
      keywords.some((k) => p.region?.includes(k)),
    )
  }, [programs, region])

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}
      <header className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h1 className="text-3xl md:text-4xl font-bold">
            중소기업 지원사업 검색
          </h1>
          <p className="mt-3 text-blue-100">
            오늘 마감 공고, 놓치지 마세요.
          </p>

          <div className="mt-8 flex gap-3 bg-white p-4 rounded-2xl shadow">
            <input
              placeholder="사업명 / 기관명 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 rounded-lg border px-4 py-3 text-sm text-slate-900"
            />
            <button
              onClick={() => setPage(1)}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
            >
              검색
            </button>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 lg:grid-cols-4">
        {/* ===== FILTER ===== */}
        <aside>
          <div className="sticky top-24 bg-white border rounded-2xl p-6 space-y-6">
            <Filter
              label="지역"
              value={region}
              onChange={setRegion}
              options={[
                '전국',
                '서울',
                '경기',
                '부산',
                '대구',
                '인천',
                '광주',
                '대전',
                '울산',
                '세종',
                '강원',
                '충북',
                '충남',
                '전북',
                '전남',
                '경북',
                '경남',
                '제주',
              ]}
            />

            <Filter
              label="정렬"
              value={sort}
              onChange={setSort}
              options={[
                { label: '마감임박순', value: 'deadline' },
                { label: '최신등록순', value: 'latest' },
              ]}
            />
          </div>
        </aside>

        {/* ===== LIST ===== */}
        <section className="lg:col-span-3 space-y-6">
          {loading ? (
            <p className="py-40 text-center text-slate-500">
              불러오는 중…
            </p>
          ) : (
            filteredPrograms.map((p) => {
              const d = dday(p.endDate)

              return (
                <article
                  key={p.id}
                  className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {p.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {p.agency}
                      </p>
                    </div>

                    {/* ===== D-DAY BADGE ===== */}
                    <span
                      className={`h-fit rounded-full px-4 py-1.5 text-xs font-semibold ${
                        d === 0
                          ? 'bg-red-600 text-white animate-pulse'
                          : d !== null && d <= 3
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {d === 0 && '오늘 마감'}
                      {d !== null && d > 0 && `D-${d}`}
                      {d === null && '마감'}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between text-sm text-slate-500">
                    <span>지역: {p.region}</span>
                    <Link
                      href={`/program/${p.id}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      상세보기 →
                    </Link>
                  </div>
                </article>
              )
            })
          )}

          {/* ===== PAGINATION ===== */}
          <div className="flex justify-center gap-4 pt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              이전
            </button>
            <span className="px-4 py-2">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border px-4 py-2"
            >
              다음
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

/* ===============================
   FILTER COMPONENT
================================ */
function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: (string | { label: string; value: string })[]
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
      >
        <option value="">전체</option>
        {options.map((o) =>
          typeof o === 'string' ? (
            <option key={o} value={o}>
              {o}
            </option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </select>
    </div>
  )
}
