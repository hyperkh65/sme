'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

type Program = {
  id: string
  title: string
  agency: string
  region: string
  endDate?: string
  status: '신청가능' | '마감'
}

export default function SearchPage() {
  /* =======================
     상태
  ======================= */
  const [page, setPage] = useState(1)
  const [region, setRegion] = useState('')
  const [status, setStatus] = useState('')
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState<'deadline' | 'latest'>('deadline')

  /* =======================
     데이터 로딩 (React Query)
  ======================= */
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['programs', page, region, status, keyword, sort],
    queryFn: async () => {
      const res = await fetch(
        `/api/programs?page=${page}&region=${region}&status=${status}&keyword=${keyword}&sort=${sort}`,
      )
      return res.json()
    },
    keepPreviousData: true,
  })

  const programs: Program[] = data?.programs ?? []
  const totalPages: number = data?.totalPages ?? 1

  /* =======================
     UI
  ======================= */
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-2xl font-extrabold">
            중소기업 지원사업 검색
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            검색 · 필터 · 페이지 이동까지 한 번에
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-4">
        {/* FILTER */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-5 rounded-xl border bg-white p-5">
            <h3 className="text-sm font-semibold">필터</h3>

            {/* 검색 */}
            <input
              placeholder="사업명 검색"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            {/* 지역 */}
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">전체 지역</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
            </select>

            {/* 상태 */}
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">전체 상태</option>
              <option value="신청가능">신청가능</option>
              <option value="마감">마감</option>
            </select>

            {/* 정렬 */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="deadline">마감임박순</option>
              <option value="latest">최신순</option>
            </select>

            <button
              onClick={() => {
                setRegion('')
                setStatus('')
                setKeyword('')
                setPage(1)
              }}
              className="w-full rounded-lg border py-2 text-sm hover:bg-slate-50"
            >
              필터 초기화
            </button>
          </div>
        </aside>

        {/* LIST */}
        <section className="lg:col-span-2 space-y-6">
          {isFetching && (
            <div className="text-xs text-slate-400">
              결과 업데이트 중…
            </div>
          )}

          {/* 로딩 */}
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-slate-200"
                />
              ))}
            </div>
          )}

          {/* 결과 */}
          {!isLoading &&
            programs.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border bg-white p-6 transition hover:shadow-md"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-sm text-slate-500">
                      {p.agency}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {p.status}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-sm text-slate-500">
                  <span>
                    {p.region} · 마감 {p.endDate || '상시'}
                  </span>
                  <Link
                    href={`/program/${p.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    자세히 보기 →
                  </Link>
                </div>
              </article>
            ))}

          {/* 페이지네이션 */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </section>
      </div>
    </main>
  )
}

/* =======================
   Pagination
======================= */
function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (p: number) => void
}) {
  return (
    <div className="flex flex-col items-center gap-4 pt-6">
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (p) => (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`h-9 w-9 rounded-lg text-sm font-medium ${
                p === page
                  ? 'bg-blue-600 text-white'
                  : 'border bg-white hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span>페이지 이동</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          className="w-20 rounded-lg border px-2 py-1 text-center"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const v = Number(
                (e.target as HTMLInputElement).value,
              )
              if (v >= 1 && v <= totalPages) onChange(v)
            }
          }}
        />
        <span>/ {totalPages}</span>
      </div>
    </div>
  )
}
