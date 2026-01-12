// 홈 디자인 v2 – 완전히 새 컨셉 (프리미엄 정책·비즈니스 서비스)
// app/page.tsx

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B1220] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-purple-600/30" />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-32">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm backdrop-blur">
            정부 · 지자체 공식 지원사업 데이터
          </span>

          <h1 className="mt-8 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            중소기업 지원사업을
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              한눈에, 정확하게
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            흩어진 정책자금·지원사업을 통합 분석하여
            대표님 기업에 맞는 사업만 선별해 제공합니다.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold shadow-lg hover:bg-blue-700 transition"
            >
              지원사업 바로 찾기
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-8 py-4 text-base font-semibold text-white/90 hover:bg-white/10 transition"
            >
              서비스 이용 가이드
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-t border-white/10 bg-black/30">
        <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <Stat label="연간 지원사업" value="5,000+" />
          <Stat label="정책자금 규모" value="수십조 원" />
          <Stat label="참여 기관" value="중앙·지자체" />
          <Stat label="업데이트 주기" value="매일" />
        </div>
      </section>

      {/* VALUE */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-3xl font-bold">왜 이 서비스를 사용해야 할까요?</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <ValueCard
            title="신청 가능한 사업만"
            desc="이미 종료된 공고, 조건 안 맞는 사업은 자동으로 제외합니다."
          />
          <ValueCard
            title="대표님 기준 필터링"
            desc="기업 규모, 업종, 지역 기준으로 실제 가능한 사업만 선별합니다."
          />
          <ValueCard
            title="공공데이터 기반"
            desc="정부·지자체 공식 데이터를 기반으로 신뢰도 높은 정보만 제공합니다."
          />
        </div>
      </section>

      {/* CONTENT + ADS */}
      <section className="mx-auto max-w-7xl px-6 pb-24 grid gap-12 md:grid-cols-3">
        <article className="md:col-span-2">
          <h3 className="text-2xl font-bold">이런 분들께 추천합니다</h3>
          <ul className="mt-6 space-y-3 text-slate-300">
            <li>• 정책자금·지원금 정보를 한 번에 보고 싶은 대표님</li>
            <li>• 매번 여러 공고 사이트를 확인하기 번거로운 분</li>
            <li>• 마감 전에 지원사업을 놓치고 싶지 않은 분</li>
          </ul>
          <p className="mt-6 text-sm text-slate-400">
            본 서비스는 무료로 제공되며, 광고 수익은 서비스 운영 및 고도화에 사용됩니다.
          </p>
        </article>

        <aside className="hidden md:block">
          <div className="sticky top-32 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 text-xs text-slate-400">ADVERTISEMENT</div>
            <div className="flex h-[250px] items-center justify-center rounded-xl bg-white/10 text-slate-400">
              AdSense 300×250
            </div>
          </div>
        </aside>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-white/10 bg-black/40">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold">지금 바로 확인해보세요</h2>
          <p className="mt-4 text-slate-300">
            지원사업은 타이밍입니다.
            <br className="hidden md:block" />
            마감 전에 정확한 정보를 확인하세요.
          </p>
          <Link
            href="/search"
            className="mt-10 inline-flex rounded-xl bg-blue-600 px-10 py-4 font-semibold hover:bg-blue-700 transition"
          >
            지원사업 검색하기
          </Link>
        </div>
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  )
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-3 text-slate-300">{desc}</p>
    </div>
  )
}
