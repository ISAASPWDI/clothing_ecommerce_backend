export enum AuthType {
  MANUAL = "MANUAL",
  PROVIDER = "PROVIDER"
}

export enum RolType {
  ADMIN = "ADMIN",
  USER = "USER"
}


export interface UserOptions {
  id: string;
  addressId?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  password?: string | null;
  phone?: string | null;
  authType: AuthType;
  rol: RolType;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  id: string;
  addressId?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  password?: string | null;
  phone?: string | null;
  authType: AuthType;
  rol: RolType;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  constructor(userOptions: UserOptions) {
    this.id = userOptions.id;
    this.addressId = userOptions.addressId ?? null;
    this.firstName = userOptions.firstName ?? null;
    this.lastName = userOptions.lastName ?? null;
    this.password = userOptions.password ?? null;
    this.phone = userOptions.phone ?? null;
    this.authType = userOptions.authType;
    this.rol = userOptions.rol;
    this.name = userOptions.name ?? null;
    this.email = userOptions.email;
    this.emailVerified = userOptions.emailVerified ?? null;
    this.image = userOptions.image ?? null;
    this.createdAt = userOptions.createdAt ?? new Date();
    this.updatedAt = userOptions.updatedAt ?? new Date();
  }

}
