import { Age, AgeOptions } from '../../../domain/entities/products/age.entity';
import { Category, CategoryOptions } from '../../../domain/entities/products/category.entity';
import { Color, ColorOptions } from '../../../domain/entities/products/color.entity';
import { Detail, DetailOptions } from '../../../domain/entities/products/detail.entity';
import { GenreOptions } from '../../../domain/entities/products/gender.entity';
import { Image, ImageOptions } from '../../../domain/entities/products/image.entity';
import { Size, SizeOptions } from '../../../domain/entities/products/size.entity';
import { prisma } from '../prisma';

// Definimos los tipos válidos para las relaciones y sus modelos asociados
export type RelationType = 'category' | 'color' | 'age' | 'genre' | 'size' | 'detail' | 'image';

export type SortByOptions = 'newest' | 'price_asc' | 'price_desc';
export interface RelationMapping {
  model: string;
  foreignKey: string;
}

export interface ProductRelationsOptions {
  categoryIds?: number[];
  colorIds?: number[];
  ageIds?: number[];
  genreIds?: number[];
  sizeIds?: number[];
  detailIds?: number[];
  imageIds?: number[];
}
export const RELATION_CONFIGS = {
  category: { 
    type: 'many-to-many', 
    model: 'productCategories', 
    include: { productCategories: { include: { category: true } } }
  },
  size: { 
    type: 'many-to-many', 
    model: 'productSizes', 
    include: { productSizes: { include: { size: true } } }
  },
  color: { 
    type: 'many-to-many', 
    model: 'productColors', 
    include: { productColors: { include: { color: true } } }
  },
  age: { 
    type: 'many-to-many', 
    model: 'productAges', 
    include: { productAges: { include: { age: true } } }
  },
  genre: { 
    type: 'many-to-many', 
    model: 'productGenres', 
    include: { productGenres: { include: { genre: true } } }
  },
  detail: { 
    type: 'one-to-many', 
    model: 'productDetails', 
    include: { productDetails: true }
  },
  image: { 
    type: 'one-to-many', 
    model: 'productImages', 
    include: { productImages: true }
  }
};
export const relationResolvers: Record<RelationType, (product: any) => any[]> = {
  category: (product) =>
    product.productCategories?.map((cp: { category: CategoryOptions }) => ({
      id: cp.category.id,
      name: cp.category.name,
      slug: cp.category.slug,
      metaTitle: cp.category.metaTitle ?? undefined,
      metaDescription: cp.category.metaDescription ?? undefined,
      metaKeywords: cp.category.metaKeywords ?? undefined,
    })) ?? [],

  size: (product) =>
    product.productSizes?.map((sp: { size: SizeOptions}) => ({
      id: sp.size.id,
      size: sp.size.size
    })) ?? [],

  color: (product) => 
    product.productColors?.map((cp: { color: ColorOptions }) => ({
      id: cp.color.id,
      color: cp.color.color
    })) ?? [],

  age: (product) => 
    product.productAges?.map((ap: { age: AgeOptions}) => ({
      id: ap.age.id,
      range: ap.age.range
    })) ?? [],

  genre: (product) => 
    product.productGenres?.map((gp: { genre: GenreOptions}) => ({
      id: gp.genre.id,
      genre: gp.genre.genre
    })) ?? [],

  // Relaciones uno-a-muchos - devolver objetos planos
  detail: (product) =>
    product.productDetails?.map((detail: DetailOptions) => ({
      id: detail.id,
      key: detail.key,
      value: detail.value
    })) ?? [],

  image: (product) => 
    product.productImages?.map((image: ImageOptions) => ({
      id: image.id,
      imagePath: image.imagePath,
      alt: image.alt,
      sortOrder: image.sortOrder,
      isMain: image.isMain,
    })) ?? [],
};


export const RELATION_MAPPINGS: Record<RelationType, RelationMapping> = {
  category: { model: 'productCategories', foreignKey: 'categoryId' },
  color: { model: 'productColors', foreignKey: 'colorId' },
  age: { model: 'productAges', foreignKey: 'ageId' },
  genre: { model: 'productGenres', foreignKey: 'genreId' },
  size: { model: 'productSizes', foreignKey: 'sizeId' },
  detail: { model: 'productDetails', foreignKey: 'detailId' },
  image: { model: 'productImages', foreignKey: 'id' },
};


export class ProductRelationsHelper {
  private relationMappings = RELATION_MAPPINGS;
  public relationResolvers = relationResolvers;
  async validateForeignKeys(validateKeys: string[]): Promise<boolean> {

    const arrayOfValidatedKey: string[] = []
    const validatedKeys = Object.values(RELATION_MAPPINGS);
    for (const { foreignKey } of validatedKeys) {
      arrayOfValidatedKey.push(foreignKey)
    }
    if (!validateKeys.some(key => arrayOfValidatedKey.includes(key))) {
      return false;
    }

    return true;
  }
  async createProductRelations(productId: number, relationType: RelationType, relationIds: number[]): Promise<void> {

    const mappingInfo = this.relationMappings[relationType];
    if (!mappingInfo) throw new Error(`La relación ${relationType} no esta soportada`)
    const { model, foreignKey } = mappingInfo;
    //Verificar si el modelo existe
    const prismaModel = (prisma as any)[model];

    if (!prismaModel) throw new Error(`El modelo ${model} no existe`);

    await prismaModel.createMany({
      data: relationIds.map((relationId) => ({
        productId,
        [String(foreignKey)]: relationId,
      })),
      skipDuplicates: true,
    });
  }
  async updateProductRelationsDifferential(
    productId: number,
    relationType: RelationType,
    newRelationIds: number[]
  ): Promise<void> {
    const mappingInfo = this.relationMappings[relationType];
    if (!mappingInfo) throw new Error(`La relación ${relationType} no está soportada`);

    const { model, foreignKey } = mappingInfo;
    const prismaModel = (prisma as any)[model];

    if (!prismaModel) throw new Error(`El modelo ${model} no existe`);

    // 1. Obtener las relaciones actuales
    const currentRelations = await prismaModel.findMany({
      where: { productId },
      select: { [foreignKey]: true }
    });

    const currentRelationIds = currentRelations.map((rel: Record<string, any>) => rel[foreignKey]);

    // 2. Calcular diferencias
    const idsToAdd = newRelationIds.filter((id: number) => !currentRelationIds.includes(id));
    const idsToRemove = currentRelationIds.filter((id: number) => !newRelationIds.includes(id));

    // 3. Realizar operaciones de forma diferencial

    // Eliminar las relaciones que ya no existen
    if (idsToRemove.length > 0) {
      await prismaModel.deleteMany({
        where: {
          productId,
          [foreignKey]: { in: idsToRemove }
        }
      });
    }

    // Añadir solo las nuevas relaciones
    if (idsToAdd.length > 0) {
      await this.createProductRelations(productId, relationType, idsToAdd);
    }
  }
  async validateEntityIds(entityName: string, ids: number[]): Promise<boolean> {
    if (!ids.length) return true;

    const prismaModel = (prisma as any)[entityName];
    if (!prismaModel) throw new Error(`La entidad ${entityName} no se encontró`);

    const count = await prismaModel.count({
      where: {
        id: { in: ids },
      },
    });

    return count === ids.length;
  }

  async validateRelations(relations: ProductRelationsOptions): Promise<void> {
    const validations: Promise<boolean>[] = [];

    // Utilizamos los nombres de modelos definidos en RELATION_MAPPINGS
    if (relations.categoryIds?.length) {
      validations.push(this.validateEntityIds(
        this.relationMappings.category.model,
        relations.categoryIds
      ));
    }
    if (relations.colorIds?.length) {
      validations.push(this.validateEntityIds(
        this.relationMappings.color.model,
        relations.colorIds
      ));
    }
    if (relations.ageIds?.length) {
      validations.push(this.validateEntityIds(
        this.relationMappings.age.model,
        relations.ageIds
      ));
    }
    if (relations.genreIds?.length) {
      validations.push(this.validateEntityIds(
        this.relationMappings.genre.model,
        relations.genreIds
      ));
    }
    if (relations.sizeIds?.length) {
      validations.push(this.validateEntityIds(
        this.relationMappings.size.model,
        relations.sizeIds
      ));
    }
    if (relations.detailIds?.length) {
      validations.push(this.validateEntityIds(
        this.relationMappings.detail.model,
        relations.detailIds
      ));
    }
    if (relations.imageIds?.length) {
      validations.push(this.validateEntityIds(
        this.relationMappings.image.model,
        relations.imageIds
      ));
    }


    const results = await Promise.all(validations);

    if (results.some((result) => !result)) {
      throw new Error('Algunas entidades relacionadas no existen');
    }
  }
}