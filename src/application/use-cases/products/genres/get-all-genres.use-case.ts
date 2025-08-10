import { GenreOptions } from "../../../../domain/entities/products/gender.entity";
import { GenreRepository } from "../../../../domain/repository/products/genre.repository";

interface GenresUseCase {
  execute: () => Promise<GenreOptions[] | null>;
}

export class GetAllGenresUseCase implements GenresUseCase {
  constructor(
    private readonly genreRepository: GenreRepository
  ) {}

  async execute(): Promise<GenreOptions[] | null> {
    return await this.genreRepository.findAll();
  }
}
