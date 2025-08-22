import { SizeOptions } from "../../../../domain/entities/products/size.entity";
import { SizeRepository } from "../../../../domain/repository/products/size.repository";

interface SizesUseCase {
  execute: () => Promise<SizeOptions[] | null>;
}

export class GetAllSizesUseCase implements SizesUseCase {
  constructor(
    private readonly sizeRepository: SizeRepository
  ) {}

  async execute(): Promise<SizeOptions[] | null> {
    return await this.sizeRepository.findAll();
  }
}
