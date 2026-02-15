"use client";

import StatCards from "@/components/StatCards";
import RiskPieChart from "@/components/RiskPieChart";
import GlobalStats from "@/components/GlobalStats";
import PredictionTable from "@/components/PredictionTable";
import styles from "./dashboard.module.css";

export default function DashboardClient() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>
          Session analytics and global COVID-19 data
        </p>
      </header>

      {/* Stat cards row */}
      <section className={styles.section}>
        <StatCards />
      </section>

      {/* Charts + Global stats row */}
      <section className={styles.row}>
        <div className={styles.colChart}>
          <RiskPieChart />
        </div>
        <div className={styles.colStats}>
          <GlobalStats />
        </div>
      </section>

      {/* Prediction history table */}
      <section className={styles.section}>
        <PredictionTable />
      </section>
    </div>
  );
}
