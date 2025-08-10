import { CategoryRepository } from "../../../../domain/repository/products/category.repository";

interface CategoriesUserCase{
    execute: (id: number) => Promise<boolean>;
}
export class DeleteCategoryUseCase implements CategoriesUserCase{
    constructor(
        private readonly categoryRepository: CategoryRepository,
    ){}
    async execute(id: number): Promise<boolean> {
        await this.categoryRepository.deleteCategory(id);
        return true
    }
}