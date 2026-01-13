// app/search/page.tsx
// 검색 페이지 디자인 v2 – A단계 (Mock 데이터, 광고/UX 완성)

'use client'

import { useState } from 'react'
import Link from 'next/link'

// ===== Mock 데이터 (A단계 전용) =====
const MOCK_PROGRAMS = [
  {
    id: '1',
    title: '소상공인 경영안정자금 지원사업',
    agency: '중소벤처기업부',
    region: '전국',
    deadline: '상시',
    summary: '경영에 어려움을 겪는 소상공인을 위한 저금리 정책자금 지원 사업입니다.',
    status: '신청가능',
  },
  {
    id: '2',
    title: '청년 창업 초기자금 지원',
    agency: '서울특별시',
    region: '서울',
    deadline: '2026-03-31',
    summary: '만 39세 이하 청년 창업가를 대상으로 사업 초기 자금을 지원합니다.',
    status: '신청가능',
  },
  {
    id: '3',
    title: '중소기업 스마트공장 구축 지원',
    agency: '산업통상자원부',
    region: '경기',
    deadline: '2026-02-15',
    summary: '제조 중소기업의 디지털 전환을 위한 스마트공장 구축 비용을 지원합니다.',
    status: '신청가능',
  },
]

export default function SearchPage() {
  const [region, setRegion] = useState('')

  const filtered = MOCK_PROGRAMS.filter((p) =>
    region ? p.region === region || p.region === '전국' : true,
  )

  return (
    <main className="min-h-screen bg-slate-100">
      {/* 상단 헤더 */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-2xl font-bold">지원사업 검색</h1>
          <p className="mt-2 text-slate-600">
            지금 신청 가능한 정부·지자체 지원사업만 모았습니다.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-10 lg:grid-cols-4">
        {/* 필터 영역 */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border bg-white p-6">
            <h2 className="font-semibold">조건 필터</h2>

            <div className="mt-6">
              <label className="text-sm font-medium">지역</label>
              <select
                className="mt-2 w-full rounded-lg border px-3 py-2"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">전체</option>
                <option value="서울">서울</option>
                <option value="경기">경기</option>
              </select>
            </div>
          </div>
        </aside>

        {/* 결과 리스트 */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-slate-500">
              총 {filtered.length}건의 지원사업
            </span>
          </div>

          <div className="space-y-6">
            {filtered.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border bg-white p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{p.agency}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    {p.status}
                  </span>
                </div>

                <p className="mt-4 text-slate-700">{p.summary}</p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm">
                  <div className="flex gap-4 text-slate-500">
                    <span>지역: {p.region}</span>
                    <span>마감: {p.deadline}</span>
                  </div>
                  <Link
                    href={`/program/${p.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    상세보기 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 광고 영역 */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border bg-white p-4">
              <div className="mb-2 text-xs text-slate-400">ADVERTISEMENT</div>
              <div className="flex h-[250px] items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                AdSense 300×250
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
