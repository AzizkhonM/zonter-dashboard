import styles from "./styles/PageHeader.module.css";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div>
          <h1 className={styles.title}>{title}</h1>

          <p className={styles.description}>{description}</p>
        </div>

        {action && <div className={styles.action}>{action}</div>}
      </div>
    </header>
  );
}
