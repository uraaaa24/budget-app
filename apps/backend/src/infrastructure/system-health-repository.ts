import type { HealthRepository } from "@/domain/health-repository.js";
import type { HealthStatus } from "@/domain/health-status.js";

export class SystemHealthRepository implements HealthRepository {
  async getStatus(): Promise<HealthStatus> {
    return {
      service: "budget-backend",
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
