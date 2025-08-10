import { Genre } from "../../../../domain/entities/products/gender.entity";

export class GenderResponseDTO {
  id: number; 
  genre: string;
  
  constructor(genre: Genre) {
    this.id = genre.id;
    this.genre = genre.genre;
  }
}