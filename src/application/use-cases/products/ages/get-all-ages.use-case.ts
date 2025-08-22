import { AgeOptions } from "../../../../domain/entities/products/age.entity";
import { AgeRepository } from "../../../../domain/repository/products/age.repository";

interface AgesUseCase {
  execute: () => Promise<AgeOptions[] | null>;
}

export class GetAllAgesUseCase implements AgesUseCase {
  constructor(
    private readonly ageRepository: AgeRepository
  ) {}

  async execute(): Promise<AgeOptions[] | null> {
    return await this.ageRepository.findAll();
  }
}
