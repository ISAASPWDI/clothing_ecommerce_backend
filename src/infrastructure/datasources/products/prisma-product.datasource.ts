import { ProductDataSource } from "../../../domain/datasources/products/product.datasource";
import { ProductDTO } from "../../../application/dtos/products/ProductDTO";
import { Product, ProductOptions } from "../../../domain/entities/products/product.entity";
import { prisma } from "../../database/prisma";
import { ProductRelationsHelper, ProductRelationsOptions, RELATION_CONFIGS, RELATION_MAPPINGS, RelationType } from "../../database/helpers/ProductRelationsHelper";
import { ProductResponseDTO } from "../../../application/dtos/responses/products/ProductResponseDTO";

export class PrismaProductDataSource implements ProductDataSource {

  constructor(
    private readonly productRelationsHelper = new ProductRelationsHelper()
  ) { }
  async createProduct(
    product: Product,
    relations: ProductRelationsOptions = {}
  ): Promise<Product> {
    await this.productRelationsHelper.validateRelations(relations);

    const created = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        price: product.price,
        description: product.description,
        quantity: product.quantity,
        reviewCount: product.reviewCount,
        metaTitle: product.metaTitle ?? null,
        metaDescription: product.metaDescription ?? null,
        metaKeywords: product.metaKeywords ?? null,
      }
    });

    for (const relationKey of Object.keys(relations) as Array<keyof ProductRelationsOptions>) {
      const relationIds = relations[relationKey];
      if (Array.isArray(relationIds) && relationIds.length > 0) {
        const relationType = relationKey.replace("Ids", "") as RelationType;
        await this.productRelationsHelper.createProductRelations(created.id, relationType, relationIds);
      }
    }

    return new Product({
      id: created.id,
      name: created.name,
      slug: created.slug,
      price: created.price.toNumber(),
      description: created.description ?? undefined,
      quantity: created.quantity,
      reviewCount: created.reviewCount,
      metaTitle: created.metaTitle ?? undefined,
      metaDescription: created.metaDescription ?? undefined,
      metaKeywords: created.metaKeywords ?? undefined,
    });
  }

  async updateProduct(
    productId: number,
    product: Product,
    newRelations: ProductRelationsOptions = {}
  ): Promise<Product> {
    await this.productRelationsHelper.validateRelations(newRelations);

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name: product.name,
        slug: product.slug,
        price: product.price,
        description: product.description,
        quantity: product.quantity,
        reviewCount: product.reviewCount,
        metaTitle: product.metaTitle ?? null,
        metaDescription: product.metaDescription ?? null,
        metaKeywords: product.metaKeywords ?? null,
      }
    });

    for (const relationKey of Object.keys(newRelations) as Array<keyof ProductRelationsOptions>) {
      const newRelationIds = newRelations[relationKey] || [];
      if (Array.isArray(newRelationIds)) {
        const relationType = relationKey.replace("Ids", "") as RelationType;
        await this.productRelationsHelper.updateProductRelationsDifferential(productId, relationType, newRelationIds);
      }
    }

    return new Product({
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      price: updated.price.toNumber(),
      description: updated.description ?? undefined,
      quantity: updated.quantity,
      reviewCount: updated.reviewCount,
      metaTitle: updated.metaTitle ?? undefined,
      metaDescription: updated.metaDescription ?? undefined,
      metaKeywords: updated.metaKeywords ?? undefined,
    });
  }

  async deleteProduct(productId: number): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    await prisma.product.delete({
      where: { id: productId }
    });

    return true
  }

async findAll(relation: RelationType, relationId?: number): Promise<any[]> {
  const config = RELATION_CONFIGS[relation];

  if (!config) {
    throw new Error(`Relación no válida: ${relation}`);
  }

  // Construir la cláusula WHERE basada en la relación y el ID
  let whereClause: any = {};
  
  if (relationId) {
    switch (relation) {
      case 'genre':
        whereClause = {
          productGenres: {
            some: {
              genreId: relationId
            }
          }
        };
        break;
      case 'category':
        whereClause = {
          productCategories: {
            some: {
              categoryId: relationId
            }
          }
        };
        break;
      case 'size':
        whereClause = {
          productSizes: {
            some: {
              sizeId: relationId
            }
          }
        };
        break;
      case 'color':
        whereClause = {
          productColors: {
            some: {
              colorId: relationId
            }
          }
        };
        break;
      case 'age':
        whereClause = {
          productAges: {
            some: {
              ageId: relationId
            }
          }
        };
        break;
      case 'detail':
        whereClause = {
          productDetails: {
            some: {
              detailId: relationId
            }
          }
        };
        break;
      case 'image':
        whereClause = {
          productImages: {
            some: {
              imageId: relationId
            }
          }
        };
        break;
      default:
        // Si no hay un caso específico, no filtrar
        whereClause = {};
    }
  }
  // Si no hay relationId, traer todos los productos
  // whereClause permanece como {} (objeto vacío)

  const products = await prisma.product.findMany({
    where: whereClause,
    include: config.include,
  });

  if (products.length === 0) return [];

  // Mezclar aleatoriamente los productos
  const shuffled = [...products];
  if (shuffled.length > 12) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }

  const resolveRelation = this.productRelationsHelper.relationResolvers[relation];

  return shuffled.slice(0, 12).map(product => {
    const resolvedData = resolveRelation(product);

    const baseProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price.toNumber(),
      description: product.description ?? undefined,
      quantity: product.quantity,
      reviewCount: product.reviewCount,
      metaTitle: product.metaTitle ?? undefined,
      metaDescription: product.metaDescription ?? undefined,
      metaKeywords: product.metaKeywords ?? undefined,
    };

    switch (relation) {
      case 'category':
        return { ...baseProduct, categories: resolvedData };
      case 'size':
        return { ...baseProduct, sizes: resolvedData };
      case 'color':
        return { ...baseProduct, colors: resolvedData };
      case 'age':
        return { ...baseProduct, ages: resolvedData };
      case 'genre':
        return { ...baseProduct, genres: resolvedData };
      case 'detail':
        return { ...baseProduct, details: resolvedData };
      case 'image':
        return { ...baseProduct, images: resolvedData };
      default:
        return baseProduct;
    }
  });
}




async findProductsByRelation(
  filterData: { key: string; ids: number[] }[],
  page: number = 1
): Promise<{ products: Product[]; isProducts: boolean }> {
  const filterObject: { [key: string]: number[] } = {};
  const validateKeys: string[] = [];

  for (const { key, ids } of filterData) {
    if (!Array.isArray(ids) || ids.length === 0) continue;
    if (!filterObject[key]) filterObject[key] = [];
    filterObject[key].push(...ids);
    validateKeys.push(key);
  }

  const isValidated = await this.productRelationsHelper.validateForeignKeys(validateKeys);
  if (!isValidated) throw new Error(`Ninguna clave es válida`);

  const whereFilters: Record<string, any> = {};
  for (const key in filterObject) {
    const mappingEntry = Object.entries(RELATION_MAPPINGS).find(
      ([, val]) => val.foreignKey === key
    );
    if (!mappingEntry) continue;
    const { model, foreignKey } = mappingEntry[1];
    whereFilters[model] = {
      some: {
        [foreignKey]: { in: filterObject[key] },
      },
    };
  }

  if (Object.keys(whereFilters).length === 0) {
    throw new Error('No se pudo construir ningún filtro válido');
  }

  const take = 32;
  const skip = (page - 1) * take;
  const totalCount = await prisma.product.count({ where: whereFilters });

  if (skip >= totalCount) return { products: [], isProducts: false };

  const result = await prisma.product.findMany({
    where: whereFilters,
    skip,
    take,
  });

  const products = result.map(product => new Product({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price.toNumber(),
    description: product.description ?? undefined,
    quantity: product.quantity,
    reviewCount: product.reviewCount,
    metaTitle: product.metaTitle ?? undefined,
    metaDescription: product.metaDescription ?? undefined,
    metaKeywords: product.metaKeywords ?? undefined,
  }));

  return {
    products,
    isProducts: skip + take < totalCount,
  };
}









}