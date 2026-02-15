"use client";

import { usePredictions } from "@/context/PredictionContext";
import styles from "./PredictionTable.module.css";

const RISK_CLASS: Record<string, string> = {
  Low: styles.badgeLow,
  Medium: styles.badgeMedium,
  High: styles.badgeHigh,
};

export default function PredictionTable() {
  const { predictions } = usePredictions();

  if (predictions.length === 0) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>Prediction History</h2>
        <p className={styles.empty}>
          No predictions recorded this session.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Prediction History</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Cases/100k</th>
              <th>Median Age</th>
              <th>% 65+</th>
              <th>Risk</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((p, i) => (
              <tr key={p.id}>
                <td className={styles.muted}>{predictions.length - i}</td>
                <td>{p.cases_per_100k}</td>
                <td>{p.median_age}</td>
                <td>{p.aged_65_above}</td>
                <td>
                  <span className={`${styles.badge} ${RISK_CLASS[p.risk]}`}>
                    {p.risk}
                  </span>
                </td>
                <td className={styles.muted}>
                  {p.timestamp.toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
