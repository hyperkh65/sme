'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Program = {
  id: string
  title: string
  agency: string
  region: string
  endDate?: string
  status: '신청가능' | '마감'
}

function isClosingSoon(endDate?: string) {
  if (!endDate) return false
  const diff =
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  return diff <= 7 && diff >= 0
}

export default function SearchPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [region, setRegion] = useState('')

  useEffect(() => {
    loadPrograms(1, true)
  }, [])

  const loadPrograms = async (targetPage: number, reset = false) => {
    setLoading(true)
    const res = await fetch(`/api/programs?page=${targetPage}`)
    const data = await res.json()

    const newItems: Program[] = data.programs || []

    if (newItems.length === 0) setHasMore(false)

    setPrograms((prev) =>
      reset ? newItems : [...prev, ...newItems],
    )
    setLoading(false)
  }

  const filtered = programs.filter((p) =>
    region ? p.region === region || p.region === '전국' : true,
  )

  const closingSoon = filtered.filter(
    (p) => p.status === '신청가능' && isClosingSoon(p.endDate),
  )

  const normalPrograms = filtered.filter(
    (p) => !closingSoon.includes(p),
  )

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-xl font-bold text-slate-900">
            중소기업 지원사업 검색
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            마감임박 사업을 먼저 확인하세요
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 lg:grid-cols-4">
        {/* FILTER */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-white p-5">
            <label className="text-xs font-medium text-slate-600">
              지역
            </label>
            <select
              className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="">전체</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
            </select>
          </div>
        </aside>

        {/* LIST */}
        <section className="lg:col-span-2 space-y-8">
          {/* 마감임박 */}
          {closingSoon.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-red-600">
                ⏰ 마감임박 지원사업
              </h2>
              <div className="space-y-3">
                {closingSoon.map((p) => (
                  <ProgramCard key={p.id} program={p} urgent />
                ))}
              </div>
            </div>
          )}

          {/* 일반 목록 */}
          <div className="space-y-3">
            {normalPrograms.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>

          {/* LOAD MORE */}
          {hasMore && (
            <div className="pt-6 text-center">
              <button
                onClick={() => {
                  const next = page + 1
                  setPage(next)
                  loadPrograms(next)
                }}
                disabled={loading}
                className="rounded-lg border bg-white px-8 py-3 text-sm font-medium hover:bg-slate-100 disabled:opacity-50"
              >
                {loading ? '불러오는 중…' : '더 보기'}
              </button>
            </div>
          )}
        </section>

        {/* AD */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-white p-4">
            <div className="mb-2 text-[10px] text-slate-400">
              ADVERTISEMENT
            </div>
            <div className="flex h-[250px] items-center justify-center rounded-lg bg-slate-100 text-slate-400">
              AdSense 300×250
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

/* 카드 컴포넌트 */
function ProgramCard({
  program,
  urgent = false,
}: {
  program: Program
  urgent?: boolean
}) {
  return (
    <article
      className={`rounded-xl border bg-white p-5 ${
        urgent ? 'border-red-300 bg-red-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">
            {program.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {program.agency}
          </p>
        </div>
        <span
          className={`rounded-md px-3 py-1 text-xs font-semibold ${
            urgent
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-50 text-blue-700'
          }`}
        >
          {urgent ? '마감임박' : program.status}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          지역: {program.region} · 마감:{' '}
          {program.endDate || '상시'}
        </span>
        <Link
          href={`/program/${program.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          자세히 보기 →
        </Link>
      </div>
    </article>
  )
}
