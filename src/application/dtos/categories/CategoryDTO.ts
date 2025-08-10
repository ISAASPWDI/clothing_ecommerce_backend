import { CategoryOptions } from "../../../domain/entities/products/category.entity";

export class CategoryDTO {
  id: number;
  name: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;

  constructor(data: CategoryOptions) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.metaTitle = data.metaTitle ?? null;
    this.metaDescription = data.metaDescription ?? null;
    this.metaKeywords = data.metaKeywords ?? null;
  }
}
