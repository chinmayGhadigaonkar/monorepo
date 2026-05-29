import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/schema/auth";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import handleError from "@/utils/handleError";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await signUpSchema.parseAsync(await req.json());

        await prisma.user.findFirstOrThrow({
            where: {
                email,
            },
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { user, message: "User created successfully", status: SERVER_RESPONSE_STATUS.SUCCESS },
            { status: 201 }
        );
    } catch (error: unknown) {
        return handleError(error, NextResponse);
    }
}
