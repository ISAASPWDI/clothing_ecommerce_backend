import { Category } from "../../../../domain/entities/products/category.entity";
import { CategoryRepository } from "../../../../domain/repository/products/category.repository";

interface CategoriesUserCase{
    execute: () => Promise<Category[] | null>;
}
export class GetAllCategoriesUseCase implements CategoriesUserCase{
    constructor(
        private readonly categoryRepository: CategoryRepository,
    ){}
    async execute(): Promise<Category[] | null> {
    return await this.categoryRepository.findAll();
  }
}