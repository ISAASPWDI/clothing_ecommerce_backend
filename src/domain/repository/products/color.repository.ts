import { ColorOptions } from "../../entities/products/color.entity";

export abstract class ColorRepository {
  abstract createColor(color: ColorOptions): Promise<ColorOptions>;
  abstract updateColor(color: ColorOptions): Promise<ColorOptions>;
  abstract deleteColor(id: number): Promise<boolean>;
  abstract findById(id: number): Promise<ColorOptions | null>;
  abstract findAll(): Promise<ColorOptions[] | null>;
}
