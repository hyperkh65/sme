import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">
              중소기업·소상공인을 위한<br />
              <span className="text-blue-600">정부 지원사업 통합 검색</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              흩어져 있는 정부·지자체 지원사업을<br />
              지금 신청 가능한 것만 선별해 제공합니다.
            </p>

            <div className="mt-10 flex gap-4">
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-white font-semibold hover:bg-blue-700 transition"
              >
                지원사업 검색하기
              </Link>
              <Link
                href="/guide"
                className="inline-flex items-center justify-center rounded-lg border px-8 py-4 font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                서비스 안내
              </Link>
            </div>
          </div>

          {/* 신뢰 카드 */}
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-slate-900">
                공공데이터 기반
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                정부·지자체 공식 데이터만을 활용하여
                신뢰할 수 있는 정보를 제공합니다.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-slate-900">
                신청 가능 사업만 제공
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                이미 마감된 공고는 자동으로 제외하여
                불필요한 탐색을 줄였습니다.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-slate-900">
                중소기업·소상공인 중심
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                대기업 위주가 아닌,
                실제 도움이 되는 지원사업을 중심으로 구성했습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-2xl font-bold text-slate-900 text-center">
          이런 분들께 추천합니다
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6">
            <p className="text-slate-700">
              ✔ 매번 지원사업 사이트를
              돌아다니기 번거로운 대표님
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <p className="text-slate-700">
              ✔ 마감 기한을 놓쳐
              지원금을 못 받은 경험이 있는 분
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <p className="text-slate-700">
              ✔ 지금 받을 수 있는 지원사업만
              빠르게 확인하고 싶은 분
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h3 className="text-2xl font-bold text-slate-900">
            지금 바로 확인해보세요
          </h3>
          <p className="mt-3 text-slate-600">
            지원사업은 타이밍입니다.
          </p>
          <Link
            href="/search"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-10 py-4 text-white font-semibold hover:bg-blue-700 transition"
          >
            지원사업 검색하기
          </Link>
        </div>
      </section>
    </main>
  )
}
