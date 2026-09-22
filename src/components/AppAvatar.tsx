interface AppAvatarProps {
  size?: number
  className?: string
  animated?: boolean
}

// Mascotte : un œil "^" (content) et un œil éclair bleu (comme l'icône de l'app).
export function AppAvatar({ size = 64, className = '', animated = false }: AppAvatarProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Mascotte Tracky"
    >
      <rect width="100" height="100" rx="24" fill="#0B1220" />
      <rect x="2" y="2" width="96" height="96" rx="22" fill="none" stroke="#24304A" strokeWidth="1.5" />

      {/* Œil gauche : éclair */}
      <g transform="translate(32,50) scale(0.42) translate(-51,-50)">
        <polygon points="62,6 20,56 44,56 38,94 82,40 50,40" fill="#3B82F6" />
        <polygon points="62,6 44,56 50,56 46,40 50,40" fill="#7FB0FF" opacity="0.55" />
      </g>

      {/* Œil droit : ^ */}
      <path
        d="M 58 48 L 68 37 L 78 48"
        stroke="#E7ECF5"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {animated && (
          <animate
            attributeName="d"
            values="M 58 48 L 68 37 L 78 48;M 58 44 L 68 44 L 78 44;M 58 48 L 68 37 L 78 48"
            dur="4s"
            repeatCount="indefinite"
            keyTimes="0;0.5;1"
          />
        )}
      </path>
    </svg>
  )
}
