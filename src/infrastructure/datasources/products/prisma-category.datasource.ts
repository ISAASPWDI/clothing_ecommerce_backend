import { CategoryDataSource } from "../../../domain/datasources/products/category.datasource";
import { Category } from "../../../domain/entities/products/category.entity";
import { prisma } from "../../database/prisma";

export class PrismaCategoryDataSource implements CategoryDataSource {
  
  async createCategory(category: Category): Promise<Category> {
    const newCategory = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        metaTitle: category.metaTitle ?? null,
        metaDescription: category.metaDescription ?? null,
        metaKeywords: category.metaKeywords ?? null,
      }
    });
        
    return new Category({
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      metaTitle: newCategory.metaTitle,
      metaDescription: newCategory.metaDescription,
      metaKeywords: newCategory.metaKeywords
    });
  }

  async updateCategory(category: Category): Promise<Category> {
    const existingCategory = await this.findById(category.id);
    if (!existingCategory) throw new Error("Categoría no encontrada");

    // Si existe la categoría
    const updatingCategory = new Category(existingCategory);

    if (category.name) updatingCategory.name = category.name;
    if (category.slug) updatingCategory.slug = category.slug;
    if (category.metaTitle) updatingCategory.metaTitle = category.metaTitle;
    if (category.metaDescription) updatingCategory.metaDescription = category.metaDescription;
    if (category.metaKeywords) updatingCategory.metaKeywords = category.metaKeywords;

    const updatedCategory = await prisma.category.update({
      where: { id: category.id },
      data: {
        name: updatingCategory.name,
        slug: updatingCategory.slug,
        metaTitle: updatingCategory.metaTitle,
        metaDescription: updatingCategory.metaDescription,
        metaKeywords: updatingCategory.metaKeywords
      }
    });

    return new Category({
      id: updatedCategory.id,
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      metaTitle: updatedCategory.metaTitle,
      metaDescription: updatedCategory.metaDescription,
      metaKeywords: updatedCategory.metaKeywords
    });
  }

  async deleteCategory(id: number): Promise<boolean> {
    const existingCategory = await this.findById(id);
    if (!existingCategory) {
      throw new Error("Categoría no encontrada");
    }

    await prisma.category.delete({
      where: { id: Number(id) }
    });

    return true;
  }

  async findById(id: number): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) return null;

    return new Category({
      id: category.id,
      name: category.name,
      slug: category.slug,
      metaTitle: category.metaTitle,
      metaDescription: category.metaDescription,
      metaKeywords: category.metaKeywords
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const found = await prisma.category.findUnique({
      where: { slug }
    });

    if (!found) return null;

    return new Category({
      id: found.id,
      name: found.name,
      slug: found.slug,
      metaTitle: found.metaTitle,
      metaDescription: found.metaDescription,
      metaKeywords: found.metaKeywords
    });
  }

  async findAll(): Promise<Category[] | null> {
    const rawCategories = await prisma.category.findMany();
    if (!rawCategories) return null;

    return rawCategories.map(cat => new Category({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      metaTitle: cat.metaTitle,
      metaDescription: cat.metaDescription,
      metaKeywords: cat.metaKeywords
    }));
  }
}
