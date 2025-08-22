import { ColorOptions } from "../../../../domain/entities/products/color.entity";
import { ColorRepository } from "../../../../domain/repository/products/color.repository";

interface ColorsUseCase {
  execute: () => Promise<ColorOptions[] | null>;
}

export class GetAllColorsUseCase implements ColorsUseCase {
  constructor(
    private readonly colorRepository: ColorRepository
  ) {}

  async execute(): Promise<ColorOptions[] | null> {
    return await this.colorRepository.findAll();
  }
}
