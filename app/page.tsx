'use client'

import { useEffect, useState } from 'react'

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

export default function SearchPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [region, setRegion] = useState('')
  const [field, setField] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('deadline')

  useEffect(() => {
    setLoading(true)
    fetch(
      `/api/programs?page=${page}&perPage=30&region=${region}`
    )
      .then(res => res.json())
      .then(data => {
        let list: Program[] = data.programs || []

        // 분야 필터
        if (field) {
          list = list.filter(p => p.field === field)
        }

        // 상태 필터
        if (status) {
          list = list.filter(p => p.status === status)
        }

        // 정렬
        if (sort === 'deadline') {
          list = list.sort((a, b) =>
            (a.endDate || '').localeCompare(b.endDate || '')
          )
        }

        if (sort === 'latest') {
          list = list.sort((a, b) =>
            (b.registeredAt || '').localeCompare(a.registeredAt || '')
          )
        }

        setPrograms(list)
        setLoading(false)
      })
  }, [page, region, field, status, sort])

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">
        지원사업 검색
      </h1>

      {/* FILTER */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <select
          className="border p-3 rounded"
          value={region}
          onChange={e => setRegion(e.target.value)}
        >
          <option value="">전체 지역</option>
          <option value="서울">서울</option>
          <option value="경기">경기</option>
          <option value="부산">부산</option>
          <option value="대구">대구</option>
        </select>

        <select
          className="border p-3 rounded"
          value={field}
          onChange={e => setField(e.target.value)}
        >
          <option value="">전체 분야</option>
          <option value="경영">경영</option>
          <option value="기술">기술</option>
          <option value="금융">금융</option>
          <option value="수출">수출</option>
        </select>

        <select
          className="border p-3 rounded"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">전체 상태</option>
          <option value="신청가능">신청가능</option>
          <option value="마감">마감</option>
        </select>

        <select
          className="border p-3 rounded"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="deadline">마감임박순</option>
          <option value="latest">최신등록순</option>
        </select>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-center py-20">불러오는 중…</p>
      ) : (
        <div className="space-y-4">
          {programs.map((p, i) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between gap-4"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">
                  {p.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {p.agency} · {p.executor}
                </p>
                <p className="text-sm mt-2">
                  분야: {p.field} | 지역: {p.region}
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                    p.status === '신청가능'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {p.status}
                </span>
                <p className="text-sm mt-2">
                  마감일: {p.endDate || '상시'}
                </p>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    className="inline-block mt-3 text-blue-600 font-semibold"
                  >
                    공고 바로가기 →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 mt-10">
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
    </main>
  )
}
