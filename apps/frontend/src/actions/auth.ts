"use server";

import bcrypt from "bcryptjs";
import z from "zod";

import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/schema/auth";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import handleError from "@/utils/handleError";

export const signUpAction = async (data: z.infer<typeof signUpSchema>) => {
    try {
        const { name, email, password } = data;

        let user = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (user) {
            return {
                message: "User already exists.",
                status: SERVER_RESPONSE_STATUS.FAILED,
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return {
            message: "User created successfully",
            status: SERVER_RESPONSE_STATUS.SUCCESS,
            data: {
                user,
            },
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};


