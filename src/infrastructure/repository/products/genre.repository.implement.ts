// src/infrastructure/repositories/genre-repository.impl.ts
import { GenreDataSource } from "../../../domain/datasources/products/genre.datasource";
import { GenreOptions } from "../../../domain/entities/products/gender.entity";
import { GenreRepository } from "../../../domain/repository/products/genre.repository";

export class GenreRepositoryImpl implements GenreRepository {
  constructor(private readonly genreDataSource: GenreDataSource) {}

  createGenre(genre: GenreOptions): Promise<GenreOptions> {
    return this.genreDataSource.createGenre(genre);
  }

  updateGenre(genre: GenreOptions): Promise<GenreOptions> {
    return this.genreDataSource.updateGenre(genre);
  }

  deleteGenre(id: number): Promise<boolean> {
    return this.genreDataSource.deleteGenre(id);
  }

  findById(id: number): Promise<GenreOptions | null> {
    return this.genreDataSource.findById(id);
  }

  findAll(): Promise<GenreOptions[] | null> {
    return this.genreDataSource.findAll();
  }
}
