// infrastructure/dtos/users/address-response.dto.ts

import { Address } from "../../../../../domain/entities/users/address.entity";



export class AddressResponseDTO {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    address: string;
    optAddress?: string | null;
    city: string;
    zipCode: string;
    phone: string;

    constructor(address: Address) {
        this.id = address.id;
        this.userId = address.userId;
        this.firstName = address.firstName;
        this.lastName = address.lastName;
        this.address = address.address;
        this.optAddress = address.optAddress;
        this.city = address.city;
        this.zipCode = address.zipCode;
        this.phone = address.phone;
    }
}