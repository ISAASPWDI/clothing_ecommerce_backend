// src/infrastructure/datasources/prisma/prisma-genre.datasource.ts
import { SizeDataSource } from "../../../domain/datasources/products/size.datasource";
import { SizeOptions } from "../../../domain/entities/products/size.entity";
import { prisma } from "../../database/prisma";

export class PrismaSizeDataSource implements SizeDataSource {
  async createSize(size: SizeOptions): Promise<SizeOptions> {
    const data = await prisma.size.create({
      data: {
        size: size.size
      },
    });
    return { id: data.id, size: data.size };
  }

  async updateSize(size: SizeOptions): Promise<SizeOptions> {
    const data = await prisma.size.update({
      where: { id: size.id },
      data: {
        size: size.size
      },
    });
    return { id: data.id, size: data.size };
  }

  async deleteSize(id: number): Promise<boolean> {
    await prisma.size.delete({ where: { id } });
    return true;
  }

  async findById(id: number): Promise<SizeOptions | null> {
    const data = await prisma.size.findUnique({ where: { id } });
    return data ? { id: data.id, size: data.size } : null;
  }

  async findAll(): Promise<SizeOptions[] | null> {
    const data = await prisma.size.findMany();
    return data.map(d => ({ id: d.id, size: d.size }));
  }
}
