// src/infrastructure/repositories/Color-repository.impl.ts
import { ColorDataSource } from "../../../domain/datasources/products/color.datasource";
import { ColorOptions } from "../../../domain/entities/products/color.entity";
import { ColorRepository } from "../../../domain/repository/products/color.repository";

export class ColorRepositoryImpl implements ColorRepository {
  constructor(private readonly colorDataSource: ColorDataSource) {}

  createColor(color: ColorOptions): Promise<ColorOptions> {
    return this.colorDataSource.createColor(color);
  }

  updateColor(color: ColorOptions): Promise<ColorOptions> {
    return this.colorDataSource.updateColor(color);
  }

  deleteColor(id: number): Promise<boolean> {
    return this.colorDataSource.deleteColor(id);
  }

  findById(id: number): Promise<ColorOptions | null> {
    return this.colorDataSource.findById(id);
  }

  findAll(): Promise<ColorOptions[] | null> {
    return this.colorDataSource.findAll();
  }
}
