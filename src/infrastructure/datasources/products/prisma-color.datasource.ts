// src/infrastructure/datasources/prisma/prisma-genre.datasource.ts
import { ColorDataSource } from "../../../domain/datasources/products/color.datasource";
import { ColorOptions } from "../../../domain/entities/products/color.entity";
import { prisma } from "../../database/prisma";

export class PrismaColorDataSource implements ColorDataSource {
  async createColor(color: ColorOptions): Promise<ColorOptions> {
    const data = await prisma.color.create({
      data: {
        color: color.color
      },
    });
    return { id: data.id, color: data.color };
  }

  async updateColor(color: ColorOptions): Promise<ColorOptions> {
    const data = await prisma.color.update({
      where: { id: color.id },
      data: {
        color: color.color
      },
    });
    return { id: data.id, color: data.color };
  }

  async deleteColor(id: number): Promise<boolean> {
    await prisma.color.delete({ where: { id } });
    return true;
  }

  async findById(id: number): Promise<ColorOptions | null> {
    const data = await prisma.color.findUnique({ where: { id } });
    return data ? { id: data.id, color: data.color } : null;
  }

  async findAll(): Promise<ColorOptions[] | null> {
    const data = await prisma.color.findMany();
    return data.map(d => ({ id: d.id, color: d.color }));
  }
}
