'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Program = {
  id: string
  title: string
  field: string
  region: string
  agency: string
  executor: string
  startDate?: string
  endDate?: string
  status: '신청가능' | '마감'
  url?: string
  registeredAt?: string
}

/* ---------------- utils ---------------- */

function daysLeft(endDate?: string) {
  if (!endDate) return null
  const diff =
    new Date(endDate).getTime() - new Date().setHours(0, 0, 0, 0)
  return Math.ceil(diff / 86400000)
}

function deadlineColor(d?: number | null) {
  if (d === null) return 'bg-slate-100 text-slate-500'
  if (d <= 1) return 'bg-red-100 text-red-700'
  if (d <= 3) return 'bg-orange-100 text-orange-700'
  if (d <= 7) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

/* ---------------- page ---------------- */

export default function SearchPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  // filters
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [region, setRegion] = useState('')
  const [field, setField] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState<'deadline' | 'latest'>('deadline')

  /* ---------- fetch ---------- */
  useEffect(() => {
    setLoading(true)
    fetch(
      `/api/programs?page=${page}&q=${q}&region=${region}&field=${field}&status=${status}`,
    )
      .then(res => res.json())
      .then(data => {
        setPrograms(data.programs || [])
        setLoading(false)
      })
  }, [page, q, region, field, status])

  /* ---------- sort ---------- */
  const sortedPrograms = useMemo(() => {
    const list = [...programs]
    if (sort === 'deadline') {
      return list.sort(
        (a, b) =>
          (daysLeft(a.endDate) ?? 9999) -
          (daysLeft(b.endDate) ?? 9999),
      )
    }
    return list.sort((a, b) =>
      (b.registeredAt || '').localeCompare(a.registeredAt || ''),
    )
  }, [programs, sort])

  const urgentTop5 = sortedPrograms
    .filter(p => p.status === '신청가능')
    .slice(0, 5)

  /* ---------------- UI ---------------- */

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold">
            정부·지자체 지원사업 검색
          </h1>
          <p className="mt-2 text-slate-600">
            현재 신청 가능한 사업만 자동 선별합니다.
          </p>

          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="사업명 검색"
            className="mt-4 w-full border rounded-lg px-4 py-3"
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-4 gap-8">
        {/* FILTER */}
        <aside className="space-y-6">
          <Filter title="지역">
            <Select value={region} onChange={setRegion}>
              <option value="">전체</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
            </Select>
          </Filter>

          <Filter title="분야">
            <Select value={field} onChange={setField}>
              <option value="">전체</option>
              <option value="경영">경영</option>
              <option value="기술">기술</option>
              <option value="금융">금융</option>
              <option value="수출">수출</option>
            </Select>
          </Filter>

          <Filter title="상태">
            <Select value={status} onChange={setStatus}>
              <option value="">전체</option>
              <option value="신청가능">신청가능</option>
              <option value="마감">마감</option>
            </Select>
          </Filter>

          <Filter title="정렬">
            <Select value={sort} onChange={v => setSort(v as any)}>
              <option value="deadline">마감임박순</option>
              <option value="latest">최신등록순</option>
            </Select>
          </Filter>

          {/* URGENT */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-semibold text-red-600 mb-3">
              🔥 마감임박 TOP 5
            </h3>
            <div className="space-y-2">
              {urgentTop5.map(p => {
                const d = daysLeft(p.endDate)
                return (
                  <Link
                    key={p.id}
                    href={`/program/${p.id}`}
                    className="block text-sm"
                  >
                    <div className="font-medium line-clamp-2">
                      {p.title}
                    </div>
                    {d !== null && (
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${deadlineColor(
                          d,
                        )}`}
                      >
                        D-{d}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </aside>

        {/* LIST */}
        <section className="lg:col-span-3 space-y-4">
          {loading ? (
            <p className="py-20 text-center">불러오는 중…</p>
          ) : (
            sortedPrograms.map(p => {
              const d = daysLeft(p.endDate)
              return (
                <article
                  key={p.id}
                  className="bg-white border rounded-xl p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {p.title}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {p.agency} · {p.executor}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded text-sm font-semibold ${deadlineColor(
                          d,
                        )}`}
                      >
                        {p.status}
                        {d !== null && ` · D-${d}`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between text-sm">
                    <span>
                      {p.region} · {p.field}
                    </span>
                    <Link
                      href={`/program/${p.id}`}
                      className="text-blue-600 font-medium"
                    >
                      상세보기 →
                    </Link>
                  </div>
                </article>
              )
            })
          )}

          {/* PAGINATION */}
          <div className="flex justify-center gap-3 pt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 border rounded disabled:opacity-30"
            >
              이전
            </button>
            <span className="px-4 py-2">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border rounded"
            >
              다음
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

/* ---------------- components ---------------- */

function Filter({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  )
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border rounded px-3 py-2"
    >
      {children}
    </select>
  )
}
