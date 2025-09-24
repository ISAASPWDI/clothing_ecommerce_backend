import { AddressDataSource } from "../../../../domain/datasources/users/address.datasource";
import { Address } from "../../../../domain/entities/users/address.entity";
import { AddressRepository } from "../../../../domain/repository/users/address.repository";

export class AddressRepositoryImpl implements AddressRepository {
    constructor(
        private readonly addressDataSource: AddressDataSource
    ) {}

    createAddress(address: Address): Promise<Address> {
        return this.addressDataSource.createAddress(address);
    }

    updateAddress(address: Address): Promise<Address> {
        return this.addressDataSource.updateAddress(address);
    }

    deleteAddress(id: number): Promise<boolean> {
        return this.addressDataSource.deleteAddress(id);
    }

    findById(id: number): Promise<Address | null> {
        return this.addressDataSource.findById(id);
    }

    findAll(): Promise<Address[] | null> {
        return this.addressDataSource.findAll();
    }
    findByUserId(userId: number): Promise<Address[] | null> {
        return this.addressDataSource.findByUserId(userId);
    }
}