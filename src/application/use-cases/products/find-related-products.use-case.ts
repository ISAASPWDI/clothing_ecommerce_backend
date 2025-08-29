import { Product, ProductOptions } from "../../../domain/entities/products/product.entity";
import { ProductRepository } from "../../../domain/repository/products/product.repository";
import { RelationType } from "../../../infrastructure/database/helpers/ProductRelationsHelper";


interface GetRelatedProductsCase {
    execute: (
        productId: number,
        limit: number
    ) => Promise<Product[]>;
}
export class GetRelatedProductsUseCase implements GetRelatedProductsCase {
    constructor(
        private readonly productRepository: ProductRepository,
    ) { }
    
    async execute(productId: number, limit: number): Promise<Product[]> {
        return this.productRepository.findRelatedProducts(productId, limit)
    }
}