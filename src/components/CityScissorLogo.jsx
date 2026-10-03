import React from 'react';

export default function CityScissorLogo({ className = "w-10 h-10", isGold = true, glow = true }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className} select-none`}>
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="goldGradientLogo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#F4E295" />
            <stop offset="55%" stopColor="#D4AF37" />
            <stop offset="85%" stopColor="#AA8214" />
            <stop offset="100%" stopColor="#F4E295" />
          </linearGradient>

          <linearGradient id="discBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1C1C28" />
            <stop offset="100%" stopColor="#0B0B10" />
          </linearGradient>

          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#D4AF37" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Circular Halo */}
        <circle
          cx="250"
          cy="250"
          r="238"
          fill="url(#discBg)"
          stroke="url(#goldGradientLogo)"
          strokeWidth="8"
          filter={glow ? "url(#logoGlow)" : undefined}
        />
        <circle
          cx="250"
          cy="250"
          r="224"
          fill="none"
          stroke="rgba(212, 175, 55, 0.25)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Left Wing (Feather Blades) */}
        <g fill="url(#goldGradientLogo)">
          <path d="M 215 170 C 170 145, 110 160, 65 190 C 105 198, 145 200, 185 208 C 198 195, 208 182, 215 170 Z" />
          <path d="M 205 208 C 160 190, 95 210, 68 235 C 108 240, 148 238, 185 238 C 193 228, 200 218, 205 208 Z" />
          <path d="M 198 242 C 160 230, 95 255, 78 280 C 115 280, 150 272, 185 264 C 190 256, 194 249, 198 242 Z" />
          <path d="M 190 270 C 160 262, 110 288, 95 310 C 128 305, 158 296, 185 285 C 188 280, 189 275, 190 270 Z" />
        </g>

        {/* Right Wing (Feather Blades) */}
        <g fill="url(#goldGradientLogo)">
          <path d="M 285 170 C 330 145, 390 160, 435 190 C 395 198, 355 200, 315 208 C 302 195, 292 182, 285 170 Z" />
          <path d="M 295 208 C 340 190, 405 210, 432 235 C 392 240, 352 238, 315 238 C 307 228, 300 218, 295 208 Z" />
          <path d="M 302 242 C 340 230, 405 255, 422 280 C 385 280, 350 272, 315 264 C 310 256, 306 249, 302 242 Z" />
          <path d="M 310 270 C 340 262, 390 288, 405 310 C 372 305, 342 296, 315 285 C 312 280, 311 275, 310 270 Z" />
        </g>

        {/* Left Unisex Profile: Male Silhouette */}
        <path
          d="M 195 300 C 185 305, 175 310, 168 318 C 160 326, 162 334, 160 342 C 158 350, 150 354, 152 360 C 154 366, 162 368, 165 375 C 168 382, 162 390, 168 395 C 175 400, 185 392, 192 385 C 200 375, 208 360, 212 345 Z"
          fill="url(#goldGradientLogo)"
        />

        {/* Right Unisex Profile: Female Silhouette with Flowing Locks */}
        <path
          d="M 305 300 C 315 305, 325 312, 332 320 C 340 330, 338 340, 342 348 C 346 356, 354 360, 350 368 C 345 376, 336 380, 335 390 C 334 398, 340 405, 332 410 C 322 415, 315 400, 308 385 C 300 370, 294 350, 290 340 Z"
          fill="url(#goldGradientLogo)"
        />

        {/* Central Crossed Scissors */}
        {/* Scissor Left Loop & Blade */}
        <g fill="url(#goldGradientLogo)">
          {/* Top Left Ring */}
          <circle cx="215" cy="180" r="32" stroke="url(#goldGradientLogo)" strokeWidth="12" fill="none" />
          {/* Top Right Ring with Tang/Rest */}
          <circle cx="285" cy="180" r="32" stroke="url(#goldGradientLogo)" strokeWidth="12" fill="none" />
          <path d="M 314 165 C 324 160, 334 165, 330 174 C 326 180, 316 182, 310 182 Z" />

          {/* Left Shank to Right Blade Tip */}
          <path d="M 224 206 L 246 250 L 295 385 C 295 385, 268 320, 252 260 L 230 216 Z" />

          {/* Right Shank to Left Blade Tip */}
          <path d="M 276 206 L 254 250 L 205 385 C 205 385, 232 320, 248 260 L 270 216 Z" />

          {/* Center Golden Pivot Screw */}
          <circle cx="250" cy="255" r="9" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}
