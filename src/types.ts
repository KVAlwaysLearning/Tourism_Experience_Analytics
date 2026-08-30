/**
 * Shared TypeScript definitions for Tourism Experience Analytics Platform
 */

export type TabType = "playground" | "eda" | "pipeline" | "benchmarks" | "code" | "narrative";

export type AlgorithmType = "gradient_boosting" | "random_forest" | "linear_regression";

export type VisitMode = "Couples" | "Family" | "Friends" | "Business" | "Solo";

export interface AttractionItem {
  id: number;
  name: string;
  category: string;
  city: string;
  country: string;
  continent: string;
  baseRating: number;
  visitCount: number;
  description: string;
  imageTag: string;
}

export interface PredictionResult {
  predictedRating: number;
  ratingConfidence: number;
  predictedVisitMode: VisitMode;
  modeProbabilities: Record<VisitMode, number>;
  recommendations: Array<{
    attraction: AttractionItem;
    hybridScore: number;
    cfScore: number;
    cbScore: number;
    matchReason: string;
  }>;
}

export interface ModelMetricRow {
  modelName: string;
  metric1: number;
  metric2: number;
  metric3: number;
  metric4?: number;
  isBest?: boolean;
  status: string;
}

export interface CleaningStat {
  table: string;
  initialRows: number;
  finalRows: number;
  initialNulls: number;
  finalNulls: number;
  cleaningAction: string;
}
