import { Age } from "./age.entity";
import { Category } from "./category.entity";
import { Color } from "./color.entity";
import { Detail } from "./detail.entity";
import { GenreOptions } from "./gender.entity";
import { Image } from "./image.entity";
import { Size } from "./size.entity";

export interface ProductOptions {
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

    // Relaciones
    categories?: Category[];
    sizes?: Size[];
    colors?: Color[];
    ages?: Age[];
    genres?: GenreOptions[];
    details?: Detail[];
    images?: Image[];
  }
  
  export class Product {
    private props: ProductOptions;
  
    constructor(props: ProductOptions) {
      this.props = props;
    }
    
    // Getters
    get id(): number {
      return this.props.id;
    }
  
    get name(): string {
      return this.props.name;
    }
  
    get slug(): string {
      return this.props.slug;
    }
  
    get price(): number {
      return this.props.price;
    }
  
    get description(): string | undefined {
      return this.props.description;
    }
  
    get quantity(): number {
      return this.props.quantity;
    }
  
    get reviewCount(): number {
      return this.props.reviewCount;
    }
  
    get metaTitle(): string | undefined {
      return this.props.metaTitle;
    }
  
    get metaDescription(): string | undefined {
      return this.props.metaDescription;
    }
  
    get metaKeywords(): string | undefined {
      return this.props.metaKeywords;
    }
    
    // Relaciones

    get categories(): Category[] | undefined {
      return this.props.categories;
    }

    get sizes(): Size[] | undefined {
      return this.props.sizes;
    }

    get colors(): Color[] | undefined {
      return this.props.colors;
    }
    get ages(): Age[] | undefined {
      return this.props.ages;
    }
    get genres(): GenreOptions[] | undefined {
      return this.props.genres;
    }
    get detail(): Detail[] | undefined {
      return this.props.details;
    }
    // Setters

    set metaTitle(title: string | undefined) {      
        this.props.metaTitle = title;
    }
  
    set metaDescription(description: string | undefined) {
      this.props.metaDescription = description;
    }
  
    set metaKeywords(keywords: string | undefined) {
      this.props.metaKeywords = keywords;
    }
  
    set price(price: number) {
      if (price < 0) throw new Error("El precio no puede ser negativo");
      this.props.price = price;
    }
  
    set quantity(q: number) {
      if (q < 0) throw new Error("La cantidad no puede ser negativa");
      this.props.quantity = q;
    }
  }
  