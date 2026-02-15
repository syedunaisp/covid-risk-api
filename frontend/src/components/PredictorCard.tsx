"use client";

import { useState, useCallback, type FormEvent, type ChangeEvent } from "react";
import { usePredictions, type RiskLevel } from "@/context/PredictionContext";
import styles from "./PredictorCard.module.css";

interface FormFields {
  cases_per_100k: string;
  median_age: string;
  aged_65_above: string;
}

interface FieldErrors {
  cases_per_100k: boolean;
  median_age: boolean;
  aged_65_above: boolean;
}

const INITIAL_VALUES: FormFields = {
  cases_per_100k: "",
  median_age: "",
  aged_65_above: "",
};

const INITIAL_ERRORS: FieldErrors = {
  cases_per_100k: false,
  median_age: false,
  aged_65_above: false,
};

const RISK_STYLES: Record<RiskLevel, string> = {
  Low: styles.riskLow,
  Medium: styles.riskMedium,
  High: styles.riskHigh,
};

function validateField(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const num = parseFloat(trimmed);
  if (isNaN(num) || num < 0) return null;
  return num;
}

export default function PredictorCard() {
  const { addPrediction } = usePredictions();
  const [values, setValues] = useState<FormFields>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>(INITIAL_ERRORS);
  const [loading, setLoading] = useState(false);
  const [risk, setRisk] = useState<RiskLevel | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: keyof FormFields) => (e: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: false }));
      setErrorMsg(null);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setRisk(null);
      setErrorMsg(null);

      // Validate
      const newErrors: FieldErrors = { ...INITIAL_ERRORS };
      let hasError = false;
      const payload: Record<string, number> = {};

      for (const key of Object.keys(values) as (keyof FormFields)[]) {
        const parsed = validateField(values[key]);
        if (parsed === null) {
          newErrors[key] = true;
          hasError = true;
        } else {
          payload[key] = parsed;
        }
      }

      setErrors(newErrors);
      if (hasError) {
        setErrorMsg("Please fill in all fields with valid numbers.");
        return;
      }

      // Call API
      setLoading(true);
      try {
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(
            errData?.detail
              ? String(errData.detail)
              : `Server returned ${res.status}`
          );
        }

        const data = await res.json();
        if (!data.risk) {
          throw new Error("Unexpected response format.");
        }

        const riskResult = data.risk as RiskLevel;
        setRisk(riskResult);

        addPrediction({
          cases_per_100k: payload.cases_per_100k,
          median_age: payload.median_age,
          aged_65_above: payload.aged_65_above,
          risk: riskResult,
        });
      } catch (err) {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [values, addPrediction]
  );

  const inputFields: {
    key: keyof FormFields;
    label: string;
    placeholder: string;
  }[] = [
    {
      key: "cases_per_100k",
      label: "Cases per 100k",
      placeholder: "e.g. 450",
    },
    { key: "median_age", label: "Median Age", placeholder: "e.g. 38" },
    { key: "aged_65_above", label: "% Aged 65+", placeholder: "e.g. 16.5" },
  ];

  return (
    <div className={styles.card}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.icon} aria-hidden="true">
          &#x1F6E1;&#xFE0F;
        </div>
        <h1 className={styles.title}>COVID Risk Predictor</h1>
        <p className={styles.subtitle}>
          Enter regional data to assess the risk level
        </p>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        {inputFields.map(({ key, label, placeholder }) => (
          <div key={key} className={styles.inputGroup}>
            <label htmlFor={key} className={styles.label}>
              {label}
            </label>
            <input
              type="number"
              id={key}
              className={`${styles.field} ${errors[key] ? styles.fieldError : ""}`}
              placeholder={placeholder}
              min="0"
              step="any"
              inputMode="decimal"
              autoComplete="off"
              value={values[key]}
              onChange={handleChange(key)}
            />
          </div>
        ))}

        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? (
            <>
              <span className={styles.spinner} />
              Predicting&hellip;
            </>
          ) : (
            "Predict Risk"
          )}
        </button>
      </form>

      {/* Result */}
      <div
        className={`${styles.result} ${risk ? styles.resultVisible : ""}`}
        aria-live="polite"
      >
        <p className={styles.resultLabel}>Risk Level</p>
        <p
          className={`${styles.resultValue} ${risk ? RISK_STYLES[risk] : ""}`}
        >
          <span className={styles.indicator} />
          {risk?.toUpperCase()}
        </p>
        <div className={styles.divider} />
      </div>

      {/* Error */}
      {errorMsg && (
        <p className={styles.error} role="alert">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
