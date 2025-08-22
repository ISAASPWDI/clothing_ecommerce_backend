// src/infrastructure/datasources/prisma/prisma-genre.datasource.ts
import { AgeDataSource } from "../../../domain/datasources/products/age.datasource";
import { AgeOptions } from "../../../domain/entities/products/age.entity";
import { prisma } from "../../database/prisma";

export class PrismaAgeDataSource implements AgeDataSource {
  async createAge(age: AgeOptions): Promise<AgeOptions> {
    const data = await prisma.age.create({
      data: {
        range: age.range,
      },
    });
    return { id: data.id, range: data.range };
  }

  async updateAge(age: AgeOptions): Promise<AgeOptions> {
    const data = await prisma.age.update({
      where: { id: age.id },
      data: {
        range: age.range
      },
    });
    return { id: data.id, range: data.range };
  }

  async deleteAge(id: number): Promise<boolean> {
    await prisma.age.delete({ where: { id } });
    return true;
  }

  async findById(id: number): Promise<AgeOptions | null> {
    const data = await prisma.age.findUnique({ where: { id } });
    return data ? { id: data.id, range: data.range } : null;
  }

  async findAll(): Promise<AgeOptions[] | null> {
    const data = await prisma.age.findMany();
    return data.map(d => ({ id: d.id, range: d.range }));
  }
}
