import { ProductDataSource } from "../../../domain/datasources/products/product.datasource";
import { Product, ProductOptions } from "../../../domain/entities/products/product.entity";
import { ProductRepository } from "../../../domain/repository/products/product.repository";
import { ProductRelationsOptions, RelationType, SortByOptions } from "../../database/helpers/ProductRelationsHelper";

export class ProductRepositoryImpl implements ProductRepository {
    constructor(
        private readonly productDataSource: ProductDataSource
    ) { }
    createProduct(product: Product, relations: ProductRelationsOptions): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    updateProduct(productId: number, product: Product, newRelations: ProductRelationsOptions): Promise<Product> {
        throw new Error("Method not implemented.");
    }

    findAll(relation: RelationType, id?: number): Promise<Product[]> {
        return this.productDataSource.findAll(relation, id)
    }
    findProductsByRelation(
        filterData: { key: string; ids: number[] }[],
        page: number = 1,
        maxPrice?: number,
        minPrice?: number,
        sortBy?: SortByOptions,
        searchTerm?: string
    ): Promise<{ products: Product[]; isProducts: boolean }> {
        return this.productDataSource.findProductsByRelation(filterData, page, maxPrice, minPrice,sortBy, searchTerm)
    }
    findProductBySlugOrId(identifier: string | number): Promise<ProductOptions | null>{
        return this.productDataSource.findProductBySlugOrId(identifier)
    }


    findRelatedProducts(
            productId: number,
            limit: number
        ): Promise<Product[]> {
            return this.productDataSource.findRelatedProducts(productId, limit )
        }

}