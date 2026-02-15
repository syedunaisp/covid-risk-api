"use client";

import { useState, useEffect } from "react";
import styles from "./GlobalStats.module.css";

interface CovidGlobalData {
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  todayCases: number;
  todayDeaths: number;
  affectedCountries: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

export default function GlobalStats() {
  const [data, setData] = useState<CovidGlobalData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch("https://disease.sh/v3/covid-19/all");
        if (!res.ok) throw new Error("Failed to fetch global data");
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load global COVID data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>Global COVID-19 Overview</h2>
        <p className={styles.loading}>Loading global data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>Global COVID-19 Overview</h2>
        <p className={styles.error}>{error || "No data available."}</p>
      </div>
    );
  }

  const stats = [
    { label: "Total Cases", value: formatNumber(data.cases), cls: styles.blue },
    { label: "Active", value: formatNumber(data.active), cls: styles.orange },
    {
      label: "Recovered",
      value: formatNumber(data.recovered),
      cls: styles.green,
    },
    { label: "Deaths", value: formatNumber(data.deaths), cls: styles.red },
    {
      label: "Today Cases",
      value: "+" + formatNumber(data.todayCases),
      cls: styles.blue,
    },
    {
      label: "Today Deaths",
      value: "+" + formatNumber(data.todayDeaths),
      cls: styles.red,
    },
    {
      label: "Countries",
      value: data.affectedCountries.toString(),
      cls: styles.purple,
    },
  ];

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Global COVID-19 Overview</h2>
      <p className={styles.source}>Source: disease.sh (Johns Hopkins CSSE)</p>
      <div className={styles.grid}>
        {stats.map(({ label, value, cls }) => (
          <div key={label} className={styles.stat}>
            <p className={`${styles.statValue} ${cls}`}>{value}</p>
            <p className={styles.statLabel}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
