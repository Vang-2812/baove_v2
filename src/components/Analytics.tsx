'use client'

import * as React from 'react'
import Script from 'next/script'

interface Props {
  gaId?: string
}

export function Analytics({ gaId }: Props) {
  // Guard clause if gaId is empty
  const targetId = gaId || process.env.NEXT_PUBLIC_GA4_ID

  if (!targetId || targetId === 'G-XXXXXXXXXX') {
    return null
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${targetId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${targetId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

// Global analytics tracking helpers
export const trackEvent = (
  action: string,
  category: string,
  label: string,
  value?: number
) => {
  const win = window as unknown as { gtag?: (type: string, action: string, data: object) => void }
  if (typeof window !== 'undefined' && win.gtag) {
    win.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  } else {
    console.log(`📊 [Mock GA4 Event] ${action} | ${category} | ${label} ${value !== undefined ? `| ${value}` : ''}`)
  }
}
