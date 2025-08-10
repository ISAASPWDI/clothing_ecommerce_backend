import { Category } from "../../../../domain/entities/products/category.entity";
import { CategoryRepository } from "../../../../domain/repository/products/category.repository";

interface CategoriesUserCase{
    execute: (category: Category) => Promise<Category>;
}
export class UpdateCategoryUseCase implements CategoriesUserCase{
    constructor(
        private readonly categoryRepository: CategoryRepository,
    ){}
    async execute(category: Category): Promise<Category> {
        if(!category.id) throw new Error("No se proporcionó el ID")
        return this.categoryRepository.updateCategory(category);
    }
}