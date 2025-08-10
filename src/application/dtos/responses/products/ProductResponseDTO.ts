import { Category } from "../../../../domain/entities/products/category.entity";
import { Product } from "../../../../domain/entities/products/product.entity";
import { Size } from "../../../../domain/entities/products/size.entity";
import { CategoryResponseDTO } from "../categories/CategoryResponseDTO";
import { SizeResponseDTO } from "../sizes/SizeResponseDTO";


export class ProductResponseDTO {
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
  
  // Campos opcionales según la relación solicitada
  categories?: CategoryResponseDTO[];
  sizes?: SizeResponseDTO[];
  // colors?: ColorResponse[];
  // ages?: AgeResponse[];
  // genres?: GenreResponse[];
  // details?: DetailResponse[];
  // images?: ImageResponse[];

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
    
    // Mapear solo las relaciones que estén presentes
    if (product.categories) {
      this.categories = product.categories.map((pc: Category) => 
        new CategoryResponseDTO(pc)
      );
    }
    
    if (product.sizes) {
      this.sizes = product.sizes.map((ps: Size) => 
        new SizeResponseDTO(ps)
      );
    }
    
    // if (product.productColors) {
    //   this.colors = product.productColors.map((pc: any) => 
    //     new ColorResponse(pc.color)
    //   );
    // }
    
    // if (product.productAges) {
    //   this.ages = product.productAges.map((pa: any) => 
    //     new AgeResponse(pa.age)
    //   );
    // }
    
    // if (product.productGenres) {
    //   this.genres = product.productGenres.map((pg: any) => 
    //     new GenreResponse(pg.genre)
    //   );
    // }
    
    // if (product.productDetails) {
    //   this.details = product.productDetails.map((pd: any) => 
    //     new DetailResponse(pd.detail)
    //   );
    // }
    
    // if (product.productImages) {
    //   this.images = product.productImages.map((pi: any) => 
    //     new ImageResponse(pi)
    //   );
    // }
  }
}