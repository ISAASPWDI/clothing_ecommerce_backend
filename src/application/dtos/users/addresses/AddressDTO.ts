
import { AddressOptions } from "../../../domain/entities/users/address.entity";

export class AddressDTO {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    optAddress?: string | null;
    city: string;
    zipCode: string;
    phone: string;

  constructor(data: AddressOptions) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.address = data.address;
    this.optAddress = data.optAddress ?? null;
    this.city = data.city;
    this.zipCode = data.zipCode;
    this.phone = data.phone;
  }
}
