import { ProductOptions } from "../../../domain/entities/products/product.entity";
import { ProductRepository } from "../../../domain/repository/products/product.repository";
import { SortByOptions } from "../../../infrastructure/database/helpers/ProductRelationsHelper";


interface GetProductCase {
    execute: (
        filterData: { key: string; ids: number[] }[],
        page: number,
        maxPrice?: number,
        minPrice?: number,
        sortBy?: SortByOptions,
        searchTerm?: string
    ) => Promise<{ products: ProductOptions[]; isProducts: boolean }>;
}
export class GetProductsByRelationUseCase implements GetProductCase {
    constructor(
        private readonly productRepository: ProductRepository,
    ) { }
    async execute(
        filterData: { key: string; ids: number[] }[],
        page: number,
        maxPrice?: number,
        minPrice?: number,
        sortBy?: SortByOptions,
        searchTerm?: string
    ): Promise<{ products: ProductOptions[]; isProducts: boolean }> {
        return this.productRepository.findProductsByRelation(filterData, page, maxPrice, minPrice, sortBy, searchTerm)
    }
}