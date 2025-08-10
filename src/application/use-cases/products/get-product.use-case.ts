import { Product } from "../../../domain/entities/products/product.entity";
import { ProductRepository } from "../../../domain/repository/products/product.repository";
import { RelationType } from "../../../infrastructure/database/helpers/ProductRelationsHelper";


interface GetProductsCase {
    execute: (
        relation: RelationType,
        id?: number
    ) => Promise<Product[]>;
}
export class GetProductsUseCase implements GetProductsCase {
    constructor(
        private readonly productRepository: ProductRepository,
    ) { }
    
    async execute(relation: RelationType, id?: number): Promise<Product[]> {
        return this.productRepository.findAll(relation, id);
    }
}