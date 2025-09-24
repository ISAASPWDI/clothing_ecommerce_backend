import { Address } from "../../entities/users/address.entity";

export abstract class AddressRepository {
    abstract createAddress(address: Address): Promise<Address>;
    abstract updateAddress(address: Address): Promise<Address>;
    abstract deleteAddress(id: number): Promise<boolean>;
    abstract findById(id: number): Promise<Address | null>;
    abstract findAll(): Promise<Address[] | null>;
    abstract findByUserId(userId: number): Promise<Address[] | null>;
}