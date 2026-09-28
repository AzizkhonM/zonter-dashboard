import styles from "./styles/PageHeader.module.css";

type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>

        <p className={styles.description}>{description}</p>
      </div>
    </header>
  );
}
