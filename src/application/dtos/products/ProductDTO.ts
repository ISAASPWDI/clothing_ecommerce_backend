import { Product, ProductOptions } from "../../../domain/entities/products/product.entity";

export class ProductDTO implements ProductOptions {
    id: number;
    name: string;
    slug: string;
    price: number;
    description?: string;
    quantity: number;
    reviewCount: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  
    constructor(product: Product) {
      this.id = product.id;
      this.name = product.name;
      this.slug = product.slug;
      this.price = product.price;
      this.description = product.description ?? undefined;
      this.quantity = product.quantity;
      this.reviewCount = product.reviewCount;
      this.metaTitle = product.metaTitle ?? undefined;
      this.metaDescription = product.metaDescription ?? undefined;
      this.metaKeywords = product.metaKeywords ?? undefined;
    }
  }