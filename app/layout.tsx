import './globals.css'

export const metadata = {
  title: 'SME Support Finder',
  description: '중소기업 지원사업 찾기',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}