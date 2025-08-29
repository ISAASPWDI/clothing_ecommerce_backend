import { Product, ProductOptions } from "../../../domain/entities/products/product.entity";
import { ProductRepository } from "../../../domain/repository/products/product.repository";
import { RelationType } from "../../../infrastructure/database/helpers/ProductRelationsHelper";


interface GetProductsBySlugCase {
    execute: (
        indentifier: string | number
    ) => Promise<ProductOptions | null>;
}
export class GetProductsBySlugUseCase implements GetProductsBySlugCase {
    constructor(
        private readonly productRepository: ProductRepository,
    ) { }
    
    async execute(indentifier: string | number): Promise<ProductOptions | null> {
        return this.productRepository.findProductBySlugOrId(indentifier)
    }
}