import { AgeOptions } from "../../entities/products/age.entity";

export abstract class AgeDataSource {
    //Metodos para categorías
    abstract createAge(age: AgeOptions): Promise<AgeOptions>;
    abstract updateAge(age: AgeOptions): Promise<AgeOptions>;
    abstract deleteAge(id: number): Promise<boolean>;
    abstract findById(id: number): Promise<AgeOptions | null>;
    abstract findAll(): Promise<AgeOptions[] | null>;
}