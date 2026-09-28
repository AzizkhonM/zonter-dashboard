"use client";

import styles from "./styles/Filter.module.css";

type FilterOption<T extends string> = {
  value: T;
  label: string;
};

type FilterProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: FilterOption<T>[];
};

export default function Filter<T extends string>({
  value,
  onChange,
  options,
}: FilterProps<T>) {
  return (
    <div className={styles.filter}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.filterButton} ${
            value === option.value ? styles.active : ""
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
