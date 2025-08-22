// src/infrastructure/repositories/Size-repository.impl.ts
import { SizeDataSource } from "../../../domain/datasources/products/size.datasource";
import { SizeOptions } from "../../../domain/entities/products/size.entity";
import { SizeRepository } from "../../../domain/repository/products/size.repository";

export class SizeRepositoryImpl implements SizeRepository {
  constructor(private readonly sizeDataSource: SizeDataSource) {}

  createSize(size: SizeOptions): Promise<SizeOptions> {
    return this.sizeDataSource.createSize(size);
  }

  updateSize(size: SizeOptions): Promise<SizeOptions> {
    return this.sizeDataSource.updateSize(size);
  }

  deleteSize(id: number): Promise<boolean> {
    return this.sizeDataSource.deleteSize(id);
  }

  findById(id: number): Promise<SizeOptions | null> {
    return this.sizeDataSource.findById(id);
  }

  findAll(): Promise<SizeOptions[] | null> {
    return this.sizeDataSource.findAll();
  }
}
