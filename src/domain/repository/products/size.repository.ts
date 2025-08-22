import { SizeOptions } from "../../entities/products/size.entity";

export abstract class SizeRepository {
  abstract createSize(size: SizeOptions): Promise<SizeOptions>;
  abstract updateSize(size: SizeOptions): Promise<SizeOptions>;
  abstract deleteSize(id: number): Promise<boolean>;
  abstract findById(id: number): Promise<SizeOptions | null>;
  abstract findAll(): Promise<SizeOptions[] | null>;
}
