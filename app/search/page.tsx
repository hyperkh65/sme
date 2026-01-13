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
  summary?: string
}

export default function SearchPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch('/api/programs')
      .then((res) => res.json())
      .then((data) => {
        setPrograms(data.programs || [])
        setLoading(false)
      })
  }, [])

  const filtered = programs.filter((p) =>
    region ? p.region === region || p.region === '전국' : true,
  )

  return (
    <main className="min-h-screen bg-slate-50">
      {/* TOP BAR */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              중소기업 지원사업 검색
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              지금 신청 가능한 정부·지자체 지원사업만 제공합니다
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            홈으로
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 lg:grid-cols-4">
        {/* FILTER */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-800">
              검색 조건
            </h2>

            <div className="mt-5">
              <label className="block text-xs font-medium text-slate-600">
                지역
              </label>
              <select
                className="mt-2 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
          </div>
        </aside>

        {/* LIST */}
        <section className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              총 <b className="text-slate-900">{filtered.length}</b>건
            </span>
          </div>

          {loading ? (
            <div className="rounded-xl border bg-white py-20 text-center text-slate-400">
              데이터를 불러오는 중입니다…
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="rounded-xl border bg-white p-6 transition hover:border-blue-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {p.agency}
                      </p>
                    </div>
                    <span
                      className={`rounded-md px-3 py-1 text-xs font-semibold ${
                        p.status === '신청가능'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex gap-4 text-slate-500">
                      <span>지역: {p.region}</span>
                      <span>마감: {p.endDate || '상시'}</span>
                    </div>
                    <Link
                      href={`/program/${p.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      자세히 보기 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* AD */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-xl border bg-white p-4">
              <div className="mb-2 text-[10px] text-slate-400">
                ADVERTISEMENT
              </div>
              <div className="flex h-[250px] items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                AdSense 300×250
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
