import { AddressRepository } from "../../../../domain/repository/users/address.repository";

interface DeleteAddressCase {
    execute: (id: number) => Promise<boolean>;
}

export class DeleteAddressUseCase implements DeleteAddressCase {
    constructor(
        private readonly addressRepository: AddressRepository,
    ) {}

    async execute(id: number): Promise<boolean> {
        const existingAddress = await this.addressRepository.findById(id);
        if (!existingAddress) {
            throw new Error("Dirección no encontrada");
        }

        return this.addressRepository.deleteAddress(id);
    }
}