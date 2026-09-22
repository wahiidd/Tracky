interface AppAvatarProps {
  size?: number
  className?: string
  animated?: boolean
}

// Mascotte : reprend l'emblème de l'icône de l'app (fond navy + éclair) avec des yeux "^ ^".
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

      <g transform="translate(50,70) scale(0.52) translate(-50,-50)">
        <polygon points="62,6 20,56 44,56 38,94 82,40 50,40" fill="#3B82F6" />
        <polygon points="62,6 44,56 50,56 46,40 50,40" fill="#7FB0FF" opacity="0.55" />
      </g>

      <g stroke="#E7ECF5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 28 38 L 36 27 L 44 38">
          {animated && (
            <animate
              attributeName="d"
              values="M 28 38 L 36 27 L 44 38;M 28 34 L 36 34 L 44 34;M 28 38 L 36 27 L 44 38"
              dur="4s"
              repeatCount="indefinite"
              keyTimes="0;0.5;1"
              begin="0s"
            />
          )}
        </path>
        <path d="M 56 38 L 64 27 L 72 38">
          {animated && (
            <animate
              attributeName="d"
              values="M 56 38 L 64 27 L 72 38;M 56 34 L 64 34 L 72 34;M 56 38 L 64 27 L 72 38"
              dur="4s"
              repeatCount="indefinite"
              keyTimes="0;0.5;1"
              begin="0s"
            />
          )}
        </path>
      </g>
    </svg>
  )
}
