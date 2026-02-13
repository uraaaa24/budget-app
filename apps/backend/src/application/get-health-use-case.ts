import type { HealthRepository } from "@/domain/health-repository.js";
import type { HealthStatus } from "@/domain/health-status.js";

export class GetHealthUseCase {
  constructor(private readonly healthRepository: HealthRepository) {}

  execute(): Promise<HealthStatus> {
    return this.healthRepository.getStatus();
  }
}
