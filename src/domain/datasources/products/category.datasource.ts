import { Category } from "../../entities/products/category.entity";

export abstract class CategoryDataSource {
    //Metodos para categorías
    abstract createCategory(category: Category): Promise<Category>;
    abstract updateCategory(category: Category): Promise<Category>;
    abstract deleteCategory(id: number): Promise<boolean>;
    abstract findById(id: number): Promise<Category | null>;
    abstract findBySlug(slug: string): Promise<Category | null>;
    abstract findAll(): Promise<Category[] | null>;
    // abstract getProductCategories(productId: string): Promise<Category[]>;
}