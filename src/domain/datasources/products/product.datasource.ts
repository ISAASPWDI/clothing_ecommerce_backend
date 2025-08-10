import { ProductRelationsOptions, RelationType } from "../../../infrastructure/database/helpers/ProductRelationsHelper";
import { Product } from "../../entities/products/product.entity";

export abstract class ProductDataSource {
    //Metodos para productos
    abstract createProduct(product: Product, relations: ProductRelationsOptions): Promise<Product>;
    abstract updateProduct(productId: number, product: Product, newRelations: ProductRelationsOptions): Promise<Product>;
    abstract deleteProduct(productId: number): Promise<boolean>;
    abstract findAll(relation: RelationType, id?: number): Promise<Product[]>;
    abstract findProductsByRelation(filterData: { key: string; ids: number[] }[], page: number): Promise<{ products: Product[]; isProducts: boolean }>;
    // abstract findByColor(colorId: string): Promise<Product[]>;
    // abstract findByAge(ageId: string): Promise<Product[]>;
    // abstract updateStock(id: string, quantity: number): Promise<Product>;
    // abstract updateReviewCount(id: string): Promise<Product>;
}