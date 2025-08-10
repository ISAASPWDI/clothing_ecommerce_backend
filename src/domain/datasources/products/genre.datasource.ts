import { GenreOptions } from "../../entities/products/gender.entity";

export abstract class GenreDataSource {
    //Metodos para categorías
    abstract createGenre(genre: GenreOptions): Promise<GenreOptions>;
    abstract updateGenre(genre: GenreOptions): Promise<GenreOptions>;
    abstract deleteGenre(id: number): Promise<boolean>;
    abstract findById(id: number): Promise<GenreOptions | null>;
    abstract findAll(): Promise<GenreOptions[] | null>;
}