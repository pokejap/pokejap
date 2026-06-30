export default function PokejapLogo({ size = 44 }: { size?: number }) {
  const rays = [0,30,60,90,120,150,180,210,240,270,300,330]
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EF4444"/>
          <stop offset="100%" stopColor="#FBBF24"/>
        </linearGradient>
        <linearGradient id="redGrad" x1="22" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF2B2B"/>
          <stop offset="100%" stopColor="#B91C1C"/>
        </linearGradient>
        <linearGradient id="darkGrad" x1="22" y1="22" x2="22" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1A1A2E"/>
          <stop offset="100%" stopColor="#0A0A14"/>
        </linearGradient>
        <clipPath id="topHalf">
          <rect x="0" y="0" width="44" height="22"/>
        </clipPath>
        <clipPath id="bottomHalf">
          <rect x="0" y="22" width="44" height="22"/>
        </clipPath>
      </defs>

      {/* Outer glow ring */}
      <circle cx="22" cy="22" r="21" stroke="url(#ringGrad)" strokeWidth="1.5" opacity="0.8"/>

      {/* Top half — rouge */}
      <circle cx="22" cy="22" r="20" fill="url(#redGrad)" clipPath="url(#topHalf)"/>

      {/* Rayons soleil japonais */}
      {rays.map((deg) => (
        <line
          key={deg}
          x1="22" y1="22"
          x2={22 + 18 * Math.cos((deg - 90) * Math.PI / 180)}
          y2={22 + 18 * Math.sin((deg - 90) * Math.PI / 180)}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          clipPath="url(#topHalf)"
        />
      ))}

      {/* Bottom half — sombre */}
      <circle cx="22" cy="22" r="20" fill="url(#darkGrad)" clipPath="url(#bottomHalf)"/>

      {/* Bande blanche centrale */}
      <rect x="2" y="19.5" width="40" height="5" fill="white" rx="0.5"/>

      {/* Anneau bouton */}
      <circle cx="22" cy="22" r="7" fill="white"/>
      <circle cx="22" cy="22" r="7" stroke="#1A1A2E" strokeWidth="2" fill="none"/>

      {/* Core rouge */}
      <circle cx="22" cy="22" r="3.5" fill="url(#ringGrad)"/>

      {/* Reflet */}
      <ellipse cx="21" cy="20" rx="1.5" ry="1" fill="white" opacity="0.6"/>
      <ellipse cx="22" cy="10" rx="7" ry="3" fill="white" opacity="0.08"/>
    </svg>
  )
}
