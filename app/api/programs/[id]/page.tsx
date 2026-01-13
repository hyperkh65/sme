'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type ProgramDetail = {
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

function daysLeft(endDate?: string) {
  if (!endDate) return null
  const diff =
    new Date(endDate).getTime() - new Date().setHours(0, 0, 0, 0)
  return Math.ceil(diff / 86400000)
}

export default function ProgramDetailPage() {
  const { id } = useParams()
  const [program, setProgram] = useState<ProgramDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/programs?page=1`)
      .then(res => res.json())
      .then(data => {
        const found = (data.programs || []).find(
          (p: any) => String(p.id) === String(id),
        )
        setProgram(found || null)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <p className="py-40 text-center">불러오는 중…</p>
  }

  if (!program) {
    return (
      <p className="py-40 text-center text-slate-500">
        해당 지원사업을 찾을 수 없습니다.
      </p>
    )
  }

  const d = daysLeft(program.endDate)

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/search"
          className="text-sm text-blue-600 font-medium"
        >
          ← 목록으로 돌아가기
        </Link>

        <div className="mt-6 bg-white border rounded-2xl p-8">
          {/* HEADER */}
          <div className="flex justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold">
                {program.title}
              </h1>
              <p className="mt-2 text-slate-600">
                {program.agency} · {program.executor}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                  program.status === '신청가능'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {program.status}
                {d !== null && ` · D-${d}`}
              </span>
            </div>
          </div>

          {/* INFO */}
          <div className="mt-8 grid sm:grid-cols-2 gap-6 text-sm">
            <Info label="분야" value={program.field} />
            <Info label="지역" value={program.region} />
            <Info label="신청 시작일" value={program.startDate} />
            <Info label="신청 마감일" value={program.endDate} />
            <Info label="등록일" value={program.registeredAt} />
          </div>

          {/* ACTION */}
          {program.url && (
            <div className="mt-10">
              <a
                href={program.url}
                target="_blank"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
              >
                공고 원문 바로가기 →
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value?: string
}) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="font-medium">
        {value || '정보 없음'}
      </p>
    </div>
  )
}
