import { Category } from "../../../../domain/entities/products/category.entity";
import { CategoryRepository } from "../../../../domain/repository/products/category.repository";

interface CategoriesUserCase{
    execute: (category: Category) => Promise<Category>;
}
export class CreateCategoryUseCase implements CategoriesUserCase{
    constructor(
        private readonly categoryRepository: CategoryRepository,
    ){}
    async execute(category: Category): Promise<Category> {
        const existingSlug = await this.categoryRepository.findBySlug(category.slug)
        if(existingSlug) throw new Error("El slug proporcionado ya existe, prueba con otro")
        return this.categoryRepository.createCategory(category);
    }
}