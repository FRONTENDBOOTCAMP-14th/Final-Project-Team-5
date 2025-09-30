import '@/styles/main.css'
import type { PropsWithChildren } from 'react'

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko-KR">
      <head>
        <link
          as="font"
          rel="stylesheet"
          fetchPriority="high"
          crossOrigin="anonymous"
          href="https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css"
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}