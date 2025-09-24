import { Address } from "../../../../domain/entities/users/address.entity";
import { AddressRepository } from "../../../../domain/repository/users/address.repository";

interface GetAddressByIdCase {
    execute: (id: number) => Promise<Address | null>;
}

export class GetAddressByIdUseCase implements GetAddressByIdCase {
    constructor(
        private readonly addressRepository: AddressRepository,
    ) {}

    async execute(id: number): Promise<Address | null> {
        return this.addressRepository.findById(id);
    }
}