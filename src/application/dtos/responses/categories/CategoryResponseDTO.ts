
import { Category } from "../../../../domain/entities/products/category.entity";

export class CategoryResponseDTO {
  id: number; 
  name: string;
  slug: string;
  
  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.slug = category.slug;
  }
}