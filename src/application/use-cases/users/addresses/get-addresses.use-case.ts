import { Address } from "../../../../domain/entities/users/address.entity";
import { AddressRepository } from "../../../../domain/repository/users/address.repository";

interface GetAddressesCase {
    execute: () => Promise<Address[] | null>;
}

export class GetAddressesUseCase implements GetAddressesCase {
    constructor(
        private readonly addressRepository: AddressRepository,
    ) {}

    async execute(): Promise<Address[] | null> {
        return this.addressRepository.findAll();
    }
}