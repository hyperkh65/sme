'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Program = {
  id: string
  title: string
  field: string
  region: string
  agency: string
  endDate?: string
  status: string
  url?: string
}

export default function SearchPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [fields, setFields] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [region, setRegion] = useState('')
  const [field, setField] = useState('')
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('deadline')

  useEffect(() => {
    setLoading(true)
    fetch(
      `/api/programs?page=${page}&region=${region}&field=${field}&keyword=${keyword}&sort=${sort}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setPrograms(data.programs || [])
        setRegions(data.filters?.regions || [])
        setFields(data.filters?.fields || [])
        setLoading(false)
      })
  }, [page, region, field, keyword, sort])

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          지원사업 검색
        </h1>

        {/* 🔍 FILTER */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <input
            placeholder="검색어 (사업명)"
            className="border p-3 rounded"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <select
            className="border p-3 rounded"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">전체 지역</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            className="border p-3 rounded"
            value={field}
            onChange={(e) => setField(e.target.value)}
          >
            <option value="">전체 분야</option>
            {fields.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            className="border p-3 rounded"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="deadline">마감임박순</option>
            <option value="latest">최신등록순</option>
          </select>
        </div>

        {/* 📄 LIST */}
        {loading ? (
          <p className="text-center py-20">불러오는 중…</p>
        ) : (
          <div className="space-y-4">
            {programs.map((p) => (
              <div
                key={p.id}
                className="bg-white border rounded-xl p-6 hover:shadow transition"
              >
                <h2 className="text-lg font-bold">{p.title}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {p.agency} · {p.region} · {p.field}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`text-sm font-semibold ${
                      p.status === '신청가능'
                        ? 'text-green-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {p.status}
                  </span>

                  <Link
                    href={`/program/${p.id}`}
                    className="text-blue-600 font-medium"
                  >
                    상세보기 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔢 PAGINATION */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-30"
          >
            이전
          </button>
          <span className="px-4 py-2">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded"
          >
            다음
          </button>
        </div>
      </div>
    </main>
  )
}
