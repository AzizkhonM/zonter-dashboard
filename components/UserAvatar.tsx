type UserAvatarProps = {
    name?: string | null;
    size?: number;
  };
  
  export default function UserAvatar({
    name,
    size = 48,
  }: UserAvatarProps) {
    const initials = name
      ? name
          .trim()
          .split(/\s+/)
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";
  
    return (
      <div
        className="user-avatar"
        style={{
          width: size,
          height: size,
        }}
      >
        {initials}
  
        <style jsx>{`
          .user-avatar {
            border-radius: 50%;
            background: var(--primary);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${size * 0.33}px;
            font-weight: 600;
            flex-shrink: 0;
            user-select: none;
          }
        `}</style>
      </div>
    );
  }