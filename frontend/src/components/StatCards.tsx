"use client";

import { usePredictions } from "@/context/PredictionContext";
import styles from "./StatCards.module.css";

export default function StatCards() {
  const { predictions } = usePredictions();

  const total = predictions.length;
  const low = predictions.filter((p) => p.risk === "Low").length;
  const medium = predictions.filter((p) => p.risk === "Medium").length;
  const high = predictions.filter((p) => p.risk === "High").length;

  const cards = [
    { label: "Total Predictions", value: total, className: styles.total },
    { label: "Low Risk", value: low, className: styles.low },
    { label: "Medium Risk", value: medium, className: styles.medium },
    { label: "High Risk", value: high, className: styles.high },
  ];

  return (
    <div className={styles.grid}>
      {cards.map(({ label, value, className }) => (
        <div key={label} className={`${styles.card} ${className}`}>
          <p className={styles.value}>{value}</p>
          <p className={styles.label}>{label}</p>
        </div>
      ))}
    </div>
  );
}
