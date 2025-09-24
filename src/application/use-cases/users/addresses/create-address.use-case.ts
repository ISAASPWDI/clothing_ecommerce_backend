import { Address } from "../../../../domain/entities/users/address.entity";
import { AddressRepository } from "../../../../domain/repository/users/address.repository";

interface AddressUseCase {
    execute: (address: Address) => Promise<Address>;
}

export class CreateAddressUseCase implements AddressUseCase {
    constructor(
        private readonly addressRepository: AddressRepository,
    ) { }

    async execute(address: Address): Promise<Address> {
        // Validaciones básicas
        if (!address.userId || address.userId <= 0) {
            throw new Error("El ID de usuario es requerido");
        }
        if (!address.firstName.trim()) {
            throw new Error("El nombre es requerido");
        }
        if (!address.lastName.trim()) {
            throw new Error("El apellido es requerido");
        }
        if (!address.address.trim()) {
            throw new Error("La dirección es requerida");
        }
        if (!address.city.trim()) {
            throw new Error("La ciudad es requerida");
        }
        if (!address.zipCode.trim()) {
            throw new Error("El código postal es requerido");
        }
        if (!address.phone.trim()) {
            throw new Error("El teléfono es requerido");
        }

        return this.addressRepository.createAddress(address);
    }
}