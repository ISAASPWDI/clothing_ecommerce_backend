import { ProductRelationsOptions, RelationType, SortByOptions } from "../../../infrastructure/database/helpers/ProductRelationsHelper";
import { Product, ProductOptions } from "../../entities/products/product.entity";

export abstract class ProductDataSource {
    //Metodos para productos
    abstract createProduct(product: Product, relations: ProductRelationsOptions): Promise<Product>;
    abstract updateProduct(productId: number, product: Product, newRelations: ProductRelationsOptions): Promise<Product>;
    abstract deleteProduct(productId: number): Promise<boolean>;
    abstract findAll(relation: RelationType, id?: number): Promise<Product[]>;
    abstract findProductsByRelation(
        filterData: { key: string; ids: number[] }[],
        page: number,
        maxPrice?: number,
        minPrice?: number,
        sortBy?: SortByOptions,
        searchTerm?: string
    ): Promise<{ products: Product[]; isProducts: boolean }>;
    abstract findProductBySlugOrId(identifier: string | number): Promise<ProductOptions | null>
        abstract findRelatedProducts(
            productId: number,
            limit: number
        ): Promise<Product[]>
    // abstract findByColor(colorId: string): Promise<Product[]>;
    // abstract findByAge(ageId: string): Promise<Product[]>;
    // abstract updateStock(id: string, quantity: number): Promise<Product>;
    // abstract updateReviewCount(id: string): Promise<Product>;
}
