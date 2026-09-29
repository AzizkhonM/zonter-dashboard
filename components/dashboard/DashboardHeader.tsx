import styles from "./styles/DashboardHeader.module.css";

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
};

export default function DashboardHeader({
  title,
  subtitle,
  action,
}: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {action && <div className={styles.action}>{action}</div>}
    </header>
  );
}
