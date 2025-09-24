import { AddressDataSource } from "../../../../domain/datasources/users/address.datasource";
import { Address } from "../../../../domain/entities/users/address.entity";
import { prisma } from "../../../database/prisma";

export class PrismaAddressDataSource implements AddressDataSource {
    
    async createAddress(address: Address): Promise<Address> {
        const newAddress = await prisma.address.create({
            data: {
                userId: address.userId.toString(),
                firstName: address.firstName,
                lastName: address.lastName,
                address: address.address,
                optAddress: address.optAddress,
                city: address.city,
                zipCode: address.zipCode,
                phone: address.phone,
            }
        });
        
        return new Address({
            id: newAddress.id,
            userId: newAddress.userId,
            firstName: newAddress.firstName,
            lastName: newAddress.lastName,
            address: newAddress.address,
            optAddress: newAddress.optAddress,
            city: newAddress.city,
            zipCode: newAddress.zipCode,
            phone: newAddress.phone,
        });
    }

    async updateAddress(address: Address): Promise<Address> {
        const existingAddress = await this.findById(address.id);
        if (!existingAddress) throw new Error("Dirección no encontrada");

        // Si existe la dirección, creamos una copia para actualizarla
        const updatingAddress = new Address(existingAddress);

        if (address.firstName) updatingAddress.firstName = address.firstName;
        if (address.lastName) updatingAddress.lastName = address.lastName;
        if (address.address) updatingAddress.address = address.address;
        if (address.optAddress !== undefined) updatingAddress.optAddress = address.optAddress;
        if (address.city) updatingAddress.city = address.city;
        if (address.zipCode) updatingAddress.zipCode = address.zipCode;
        if (address.phone) updatingAddress.phone = address.phone;

        const updatedAddress = await prisma.address.update({
            where: { id: address.id },
            data: {
                firstName: updatingAddress.firstName,
                lastName: updatingAddress.lastName,
                address: updatingAddress.address,
                optAddress: updatingAddress.optAddress,
                city: updatingAddress.city,
                zipCode: updatingAddress.zipCode,
                phone: updatingAddress.phone,
            }
        });

        return new Address({
            id: updatedAddress.id,
            userId: updatedAddress.userId,
            firstName: updatedAddress.firstName,
            lastName: updatedAddress.lastName,
            address: updatedAddress.address,
            optAddress: updatedAddress.optAddress,
            city: updatedAddress.city,
            zipCode: updatedAddress.zipCode,
            phone: updatedAddress.phone,
        });
    }

    async deleteAddress(id: number): Promise<boolean> {
        const existingAddress = await this.findById(id);
        if (!existingAddress) {
            throw new Error("Dirección no encontrada");
        }

        await prisma.address.delete({
            where: { id: Number(id) }
        });

        return true;
    }

    async findById(id: number): Promise<Address | null> {
        const address = await prisma.address.findUnique({
            where: { id }
        });

        if (!address) return null;

        return new Address({
            id: address.id,
            userId: address.userId,
            firstName: address.firstName,
            lastName: address.lastName,
            address: address.address,
            optAddress: address.optAddress,
            city: address.city,
            zipCode: address.zipCode,
            phone: address.phone,
        });
    }

    async findAll(): Promise<Address[] | null> {
        const rawAddresses = await prisma.address.findMany({
            orderBy: {
                id: 'desc' // Las más recientes primero
            }
        });
        
        if (!rawAddresses || rawAddresses.length === 0) return [];

        return rawAddresses.map(addr => new Address({
            id: addr.id,
            userId: addr.userId,
            firstName: addr.firstName,
            lastName: addr.lastName,
            address: addr.address,
            optAddress: addr.optAddress,
            city: addr.city,
            zipCode: addr.zipCode,
            phone: addr.phone,
        }));
    }

    async findByUserId(userId: number): Promise<Address[] | null> {
        const rawAddresses = await prisma.address.findMany({
            where: { userId: userId.toString() },
            orderBy: {
                id: 'desc'
            }
        });
        
        if (!rawAddresses || rawAddresses.length === 0) return [];

        return rawAddresses.map(addr => new Address({
            id: addr.id,
            userId: addr.userId,
            firstName: addr.firstName,
            lastName: addr.lastName,
            address: addr.address,
            optAddress: addr.optAddress,
            city: addr.city,
            zipCode: addr.zipCode,
            phone: addr.phone,
        }));
    }
}