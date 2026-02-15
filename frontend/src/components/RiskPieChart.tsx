"use client";

import { usePredictions } from "@/context/PredictionContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./RiskPieChart.module.css";

const COLORS: Record<string, string> = {
  Low: "#16a34a",
  Medium: "#ea580c",
  High: "#dc2626",
};

export default function RiskPieChart() {
  const { predictions } = usePredictions();

  if (predictions.length === 0) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>Risk Distribution</h2>
        <p className={styles.empty}>
          No predictions yet. Go to the Predictor page to get started.
        </p>
      </div>
    );
  }

  const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0 };
  predictions.forEach((p) => {
    counts[p.risk]++;
  });

  const data = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Risk Distribution</h2>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "0.85rem",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: "0.85rem" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
