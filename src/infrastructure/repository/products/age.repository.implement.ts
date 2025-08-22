// src/infrastructure/repositories/age-repository.impl.ts
import { AgeDataSource } from "../../../domain/datasources/products/age.datasource";
import { AgeOptions } from "../../../domain/entities/products/age.entity";
import { AgeRepository } from "../../../domain/repository/products/age.repository";

export class AgeRepositoryImpl implements AgeRepository {
  constructor(private readonly ageDataSource: AgeDataSource) {}

  createAge(age: AgeOptions): Promise<AgeOptions> {
    return this.ageDataSource.createAge(age);
  }

  updateAge(age: AgeOptions): Promise<AgeOptions> {
    return this.ageDataSource.updateAge(age);
  }

  deleteAge(id: number): Promise<boolean> {
    return this.ageDataSource.deleteAge(id);
  }

  findById(id: number): Promise<AgeOptions | null> {
    return this.ageDataSource.findById(id);
  }

  findAll(): Promise<AgeOptions[] | null> {
    return this.ageDataSource.findAll();
  }
}
