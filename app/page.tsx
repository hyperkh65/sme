// app/search/page.tsx
// 검색 페이지 v1 – 실서비스용 UI + API 연동 구조

'use client'

import { useEffect, useState } from 'react'

// ===== 타입 정의 =====
interface SupportProgram {
  id: string
  title: string
  agency: string
  region: string
  deadline: string
  summary: string
}

// ===== 임시 API 엔드포인트 =====
// 나중에 실제 API 주소로 교체
const API_URL = '/api/programs'

export default function SearchPage() {
  const [programs, setPrograms] = useState<SupportProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState('')

  useEffect(() => {
    async function fetchPrograms() {
      setLoading(true)
      try {
        const res = await fetch(`${API_URL}?region=${region}`)
        const data = await res.json()
        setPrograms(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [region])

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-2xl font-bold">지원사업 검색</h1>
          <p className="mt-2 text-slate-600">
            현재 신청 가능한 정부·지자체 지원사업만 보여드립니다.
          </p>
        </div>
      </section>

      {/* 필터 */}
      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap gap-4">
          <select
            className="rounded-lg border px-4 py-2"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">전체 지역</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="부산">부산</option>
          </select>
        </div>
      </section>

      {/* 결과 리스트 */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        {loading ? (
          <div className="py-20 text-center text-slate-500">불러오는 중...</div>
        ) : programs.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            조건에 맞는 지원사업이 없습니다.
          </div>
        ) : (
          <div className="grid gap-6">
            {programs.map((p) => (
              <article
                key={p.id}
                className="rounded-xl border bg-white p-6 hover:shadow transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{p.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{p.agency}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    {p.region}
                  </span>
                </div>

                <p className="mt-4 text-slate-700">{p.summary}</p>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">마감일: {p.deadline}</span>
                  <a
                    href={`/program/${p.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    상세보기 →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
