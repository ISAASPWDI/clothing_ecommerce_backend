import { CategoryDataSource } from "../../../domain/datasources/products/category.datasource";
import { Category } from "../../../domain/entities/products/category.entity";
import { CategoryRepository } from "../../../domain/repository/products/category.repository";

export class CategoryRepositoryImpl implements CategoryRepository {
    constructor(
        private readonly categoryDataSource: CategoryDataSource
    ) {}
    createCategory(category: Category): Promise<Category> {
        return this.categoryDataSource.createCategory(category);
    }
    updateCategory(category: Category): Promise<Category> {
        return this.categoryDataSource.updateCategory(category)
    }
    deleteCategory(id: number): Promise<boolean> {
        return this.categoryDataSource.deleteCategory(id)
    }
    findById(id: number): Promise<Category | null> {
        return this.categoryDataSource.findById(id)
    }
    findBySlug(slug: string): Promise<Category | null> {
        return this.categoryDataSource.findBySlug(slug)
    }
    findAll(): Promise<Category[] | null> {
        return this.categoryDataSource.findAll();
    }
    
}