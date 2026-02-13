import type { HealthStatus } from "./health-status.js";

export interface HealthRepository {
  getStatus(): Promise<HealthStatus>;
}
