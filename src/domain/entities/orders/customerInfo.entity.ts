
export class CustomerInfo {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city?: string;
  province?: string;
  zipCode: string;

  constructor(props: CustomerInfo) {

    if (!props.firstName) throw new Error("CustomerInfo: firstName is required");
    if (!props.lastName) throw new Error("CustomerInfo: lastName is required");
    if (!props.email) throw new Error("CustomerInfo: email is required");
    if (!props.phone) throw new Error("CustomerInfo: phone is required");
    if (!props.address) throw new Error("CustomerInfo: address is required");
    if (!props.zipCode) throw new Error("CustomerInfo: zipCode is required");
    
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.phone = props.phone;
    this.address = props.address;
    this.apartment = props.apartment;
    this.city = props.city;
    this.province = props.province;
    this.zipCode = props.zipCode;
  }
}