// src/infrastructure/datasources/prisma/prisma-genre.datasource.ts
import { GenreDataSource } from "../../../domain/datasources/products/genre.datasource";
import { GenreOptions } from "../../../domain/entities/products/gender.entity";
import { prisma } from "../../database/prisma";

export class PrismaGenreDataSource implements GenreDataSource {
  async createGenre(genre: GenreOptions): Promise<GenreOptions> {
    const data = await prisma.genre.create({
      data: {
        genre: genre.genre,
      },
    });
    return { id: data.id, genre: data.genre };
  }

  async updateGenre(genre: GenreOptions): Promise<GenreOptions> {
    const data = await prisma.genre.update({
      where: { id: genre.id },
      data: {
        genre: genre.genre,
      },
    });
    return { id: data.id, genre: data.genre };
  }

  async deleteGenre(id: number): Promise<boolean> {
    await prisma.genre.delete({ where: { id } });
    return true;
  }

  async findById(id: number): Promise<GenreOptions | null> {
    const data = await prisma.genre.findUnique({ where: { id } });
    return data ? { id: data.id, genre: data.genre } : null;
  }

  async findAll(): Promise<GenreOptions[] | null> {
    const data = await prisma.genre.findMany();
    return data.map(d => ({ id: d.id, genre: d.genre }));
  }
}
