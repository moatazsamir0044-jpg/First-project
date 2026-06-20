import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const alt = 'BirdNest – Serviced Apartments & Holiday Homes in Egypt'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Brand tokens
const CREAM = '#efe8e1'
const INK = '#292a2b'
const ORANGE = '#f4603d'
const GREEN = '#237c58'

export default async function OpengraphImage() {
  const [recoleta, gilroy] = await Promise.all([
    readFile(join(process.cwd(), 'public/fonts/Recoleta-SemiBold.otf')),
    readFile(join(process.cwd(), 'public/fonts/Gilroy-Regular.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: CREAM,
          padding: '72px',
          fontFamily: 'Gilroy',
        }}
      >
        {/* Decorative lattice corner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '999px',
                backgroundColor: ORANGE,
              }}
            />
            <span style={{ fontSize: '34px', fontWeight: 700, color: INK, fontFamily: 'Recoleta' }}>
              BirdNest
            </span>
          </div>
          <span style={{ fontSize: '24px', color: GREEN, fontWeight: 600 }}>birdnestlife.com</span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '76px',
              fontFamily: 'Recoleta',
              color: INK,
              lineHeight: 1.05,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            Your Home Away From&nbsp;<span style={{ color: ORANGE }}>Home</span>
          </div>
          <div style={{ fontSize: '34px', color: INK, opacity: 0.6, marginTop: '24px' }}>
            Verified serviced apartments &amp; holiday homes across Egypt
          </div>
        </div>

        {/* Location strip */}
        <div style={{ display: 'flex', gap: '14px' }}>
          {['New Cairo', 'North Coast', 'El Gouna', 'Sheikh Zayed'].map(loc => (
            <div
              key={loc}
              style={{
                fontSize: '24px',
                color: INK,
                backgroundColor: '#ffffff',
                padding: '12px 24px',
                borderRadius: '999px',
                display: 'flex',
              }}
            >
              {loc}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Recoleta', data: recoleta, weight: 600, style: 'normal' },
        { name: 'Gilroy', data: gilroy, weight: 400, style: 'normal' },
      ],
    }
  )
}
