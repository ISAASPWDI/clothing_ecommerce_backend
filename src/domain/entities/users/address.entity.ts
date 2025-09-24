export interface AddressOptions {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    address: string;
    optAddress?: string | null;
    city: string;
    zipCode: string;
    phone: string;
}

export class Address {
    private props: AddressOptions;

    constructor(props: AddressOptions) {
        this.props = props;
    }

    // Getters
    get id(): number {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get firstName(): string {
        return this.props.firstName;
    }

    get lastName(): string {
        return this.props.lastName;
    }

    get address(): string {
        return this.props.address;
    }

    get optAddress(): string | null | undefined {
        return this.props.optAddress;
    }

    get city(): string {
        return this.props.city;
    }

    get zipCode(): string {
        return this.props.zipCode;
    }

    get phone(): string {
        return this.props.phone;
    }

    // Setters
    set userId(value: string) {
        this.props.userId = value;
    }

    set firstName(value: string) {
        this.props.firstName = value;
    }

    set lastName(value: string) {
        this.props.lastName = value;
    }

    set address(value: string) {
        this.props.address = value;
    }

    set optAddress(value: string | null | undefined) {
        this.props.optAddress = value;
    }

    set city(value: string) {
        this.props.city = value;
    }

    set zipCode(value: string) {
        this.props.zipCode = value;
    }

    set phone(value: string) {
        this.props.phone = value;
    }
}
