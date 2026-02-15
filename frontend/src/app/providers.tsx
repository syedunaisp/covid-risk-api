"use client";

import { PredictionProvider } from "@/context/PredictionContext";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <PredictionProvider>{children}</PredictionProvider>;
}
