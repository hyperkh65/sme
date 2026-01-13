'use client'

import { useEffect } from 'react'

type Props = {
  slot: string
  style?: React.CSSProperties
  responsive?: boolean
}

export default function AdSense({
  slot,
  style = { display: 'block' },
  responsive = true,
}: Props) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client="ca-pub-8940400388075870"
      data-ad-slot={slot}
      data-ad-format={responsive ? 'auto' : undefined}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  )
}
