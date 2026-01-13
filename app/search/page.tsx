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

function dday(endDate?: string) {
  if (!endDate) return null
  const diff =
    new Date(endDate).getTime() -
    new Date().setHours(0, 0, 0, 0)
  return Math.ceil(diff / 86400000)
}

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
      `/api/programs?page=${page}&perPage=20&region=${region}&status=${status}&keyword=${keyword}&sort=${sort}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setPrograms(data.programs || [])
        setLoading(false)
      })
  }, [page, region, status, keyword, sort])

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-slate-900">
            중소기업 지원사업 검색
          </h1>
          <p className="mt-3 text-slate-600">
            정부·지자체 지원사업을 한 곳에서 검색하세요.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-6 flex gap-3">
            <input
              placeholder="사업명 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 rounded-xl border px-4 py-3 text-sm"
            />
            <button
              onClick={() => setPage(1)}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
            >
              검색
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 lg:grid-cols-4">
        {/* FILTER */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border bg-white p-6 space-y-6">
            <Filter
              label="지역"
              value={region}
              onChange={setRegion}
              options={['서울', '경기', '부산', '대구']}
            />
            <Filter
              label="상태"
              value={status}
              onChange={setStatus}
              options={['신청가능', '마감']}
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

        {/* LIST */}
        <section className="lg:col-span-3 space-y-6">
          {loading ? (
            <p className="text-center py-40 text-slate-500">
              불러오는 중…
            </p>
          ) : (
            programs.map((p) => {
              const d = dday(p.endDate)

              return (
                <article
                  key={p.id}
                  className="rounded-2xl border bg-white p-6 hover:shadow-md transition"
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

                    <span
                      className={`h-fit rounded-full px-4 py-1.5 text-xs font-semibold ${
                        p.status === '신청가능'
                          ? d !== null && d <= 3
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {p.status}
                      {d !== null && ` · D-${d}`}
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

          {/* PAGINATION */}
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
