type ActionCardProps = {
    icon: string;
    title: string;
    description: string;
    href: string;
    linkText: string;
    highlight?: boolean;
  };
  
  export default function ActionCard({
    icon,
    title,
    description,
    href,
    linkText,
    highlight = false,
  }: ActionCardProps) {
    return (
      <div className={`action-card ${highlight ? "highlight" : ""}`}>
        <div className="action-icon">{icon}</div>
  
        <h3 className="action-title">{title}</h3>
  
        <p className="action-description">{description}</p>
  
        <a href={href} className="action-link">
          {linkText}
          <span className="arrow">→</span>
        </a>
      </div>
    );
  }