"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@/prisma-types/client";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import handleError from "@/utils/handleError";

export const getUserAction = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                status: true,
                designation: true,
                profileImage: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return {
                message: "User not found",
                status: SERVER_RESPONSE_STATUS.FAILED,
                data: null,
            };
        }

        return {
            message: "User fetched successfully",
            status: SERVER_RESPONSE_STATUS.SUCCESS,
            data: {
                user,
            },
        };
    } catch (error) {
        return handleError(error);
    }
};

const updateUserAction = async (id: string, data: Partial<User>) => {
    try {
        // Validate user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return {
                message: "User not found",
                status: SERVER_RESPONSE_STATUS.FAILED,
                data: null,
            };
        }

        // Update user
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.status && { status: data.status }),
                ...(data.designation !== undefined && { designation: data.designation }),
                ...(data.profileImage !== undefined && { profileImage: data.profileImage }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                status: true,
                designation: true,
                profileImage: true,
                updatedAt: true,
            },
        });

        return {
            message: "User updated successfully",
            status: SERVER_RESPONSE_STATUS.SUCCESS,
            data: {
                user,
            },
        };
    } catch (error) {
        return handleError(error);
    }
};

export default updateUserAction;
