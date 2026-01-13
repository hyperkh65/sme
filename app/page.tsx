'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useState } from 'react'

type Program = {
  id: string
  title: string
  agency: string
  region: string
  field?: string
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
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  // 검색 상태
  const [q, setQ] = useState('')
  const [region, setRegion] = useState('')
  const [field, setField] = useState('')

  useEffect(() => {
    fetch('/api/programs?page=1&perPage=6&sort=deadline')
      .then(res => res.json())
      .then(data => {
        setPrograms(data.programs || [])
        setLoading(false)
      })
  }, [])

  // 🔥 AdSense 재실행 (중요)
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================= AdSense Global Script ================= */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8940400388075870"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* ================= HERO / SEARCH ================= */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            중소기업 지원사업 통합 포털
          </h1>
          <p className="mt-4 text-blue-100 max-w-2xl">
            정부·지자체 지원사업을 한 번에 검색하고,
            지금 신청 가능한 공고만 확인하세요.
          </p>

          {/* 검색 폼 */}
          <form
            action="/search"
            method="GET"
            className="mt-8 bg-white rounded-2xl shadow-lg p-6 grid gap-4 md:grid-cols-6"
          >
            <input
              name="keyword"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="지원사업명, 기관명 검색"
              className="md:col-span-2 border rounded-lg px-4 py-3 text-slate-900"
            />

            <select
              name="region"
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="border rounded-lg px-3 py-3 text-slate-900"
            >
              <option value="">전체 지역</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
            </select>

            <select
              name="field"
              value={field}
              onChange={e => setField(e.target.value)}
              className="border rounded-lg px-3 py-3 text-slate-900"
            >
              <option value="">전체 분야</option>
              <option value="경영">경영</option>
              <option value="기술">기술</option>
              <option value="금융">금융</option>
              <option value="수출">수출</option>
            </select>

            <input type="hidden" name="sort" value="deadline" />

            <button
              type="submit"
              className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              지원사업 검색
            </button>
          </form>
        </div>
      </section>

      {/* ================= AUTO AD ================= */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <ins
          className="adsbygoogle block"
          data-ad-client="ca-pub-8940400388075870"
          data-ad-slot="5158151469"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid gap-10 lg:grid-cols-4">
        {/* ===== MAIN LIST ===== */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">마감 임박 지원사업</h2>
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
                        <h3 className="font-semibold text-lg text-slate-900">
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

          {/* ===== 970x90 AD ===== */}
          <div className="mt-10 flex justify-center">
            <ins
              className="adsbygoogle inline-block"
              style={{ width: 970, height: 90 }}
              data-ad-client="ca-pub-8940400388075870"
              data-ad-slot="1739739148"
            />
          </div>
        </div>

        {/* ===== SIDEBAR ===== */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold mb-3">
                이런 분께 추천합니다
              </h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• 정책자금·지원금 놓치기 싫은 대표님</li>
                <li>• 창업 초기 자금이 필요한 분</li>
                <li>• 지자체 지원사업을 찾는 기업</li>
              </ul>
            </div>

            {/* ===== 970x250 AD ===== */}
            <div className="bg-white border rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-2">
                ADVERTISEMENT
              </div>
              <ins
                className="adsbygoogle inline-block"
                style={{ width: 970, height: 250 }}
                data-ad-client="ca-pub-8940400388075870"
                data-ad-slot="4966757696"
              />
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
