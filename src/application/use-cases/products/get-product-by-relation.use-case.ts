import { ProductOptions } from "../../../domain/entities/products/product.entity";
import { ProductRepository } from "../../../domain/repository/products/product.repository";
import { RelationType } from "../../../infrastructure/database/helpers/ProductRelationsHelper";
import { ProductResponseDTO } from "../../dtos/responses/products/ProductResponseDTO";

interface GetProductCase {
    execute: (
        filterData: { key: string; ids: number[] }[],
        page: number
    ) => Promise<{ products: ProductResponseDTO[]; isProducts: boolean }>;
}
export class GetProductsByRelationUseCase implements GetProductCase {
    constructor(
        private readonly productRepository: ProductRepository,
    ) { }
    async execute(
        filterData: { key: string; ids: number[] }[],
        page: number = 1
    ): Promise<{ products: ProductResponseDTO[]; isProducts: boolean }> {
        return this.productRepository.findProductsByRelation(filterData,page)
    }
}