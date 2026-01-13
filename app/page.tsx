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

export default function HomePage() {
  const [q, setQ] = useState('')
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/programs?page=1&perPage=5&sort=deadline')
      .then(res => res.json())
      .then(data => {
        setPrograms(data.programs || [])
        setLoading(false)
      })
  }, [])

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* HERO */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-bold">
            중소기업 지원사업 통합 포털
          </h1>
          <p className="mt-4 text-blue-100 max-w-2xl">
            흩어진 정부·지자체 지원사업을 한 곳에서 검색하고,
            지금 신청 가능한 사업만 확인하세요.
          </p>

          {/* SEARCH BAR */}
          <form
            action="/search"
            method="GET"
            className="mt-8 flex max-w-3xl bg-white rounded-xl overflow-hidden shadow"
          >
            <input
              name="q"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="지원사업명, 기관명으로 검색"
              className="flex-1 px-5 py-4 text-slate-900 outline-none"
            />
            <button
              type="submit"
              className="bg-blue-700 px-8 font-semibold"
            >
              검색
            </button>
          </form>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-4 gap-10">
        {/* MAIN LIST */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              마감 임박 지원사업
            </h2>
            <Link
              href="/search?sort=deadline"
              className="text-sm text-blue-600 font-medium"
            >
              전체 보기 →
            </Link>
          </div>

          {loading ? (
            <p className="py-20 text-center text-slate-500">
              불러오는 중…
            </p>
          ) : (
            <div className="space-y-4">
              {programs.map(p => {
                const d = dday(p.endDate)

                return (
                  <Link
                    key={p.id}
                    href={`/program/${p.id}`}
                    className="block bg-white border rounded-xl p-6 hover:shadow-md transition"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {p.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {p.agency} · {p.region}
                        </p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            d !== null && d <= 3
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {d !== null ? `D-${d}` : p.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold mb-3">
                이런 분께 추천합니다
              </h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• 정책자금 놓치기 싫은 대표님</li>
                <li>• 창업 초기 자금이 필요한 분</li>
                <li>• 지자체 지원사업 찾는 기업</li>
              </ul>
            </div>

            <div className="bg-white border rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-2">
                ADVERTISEMENT
              </div>
              <div className="h-[250px] flex items-center justify-center bg-slate-100 rounded">
                AdSense 300×250
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
