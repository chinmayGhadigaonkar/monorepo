"server only";

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { Prisma } from "@/prisma-types/client";
import { ErrorResponse, SERVER_RESPONSE_STATUS } from "@/types/base";

import { ForbiddenError, GeneralError } from "./error";

export default function handleError(error: unknown): ErrorResponse;
export default function handleError(
    error: unknown,
    res: typeof NextResponse
): NextResponse<ErrorResponse>;

export default function handleError(error: unknown, res?: typeof NextResponse) {
    const errorObj: ErrorResponse = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: (error as any).message || "Something went wrong",
        status: SERVER_RESPONSE_STATUS.FAILED,
    };
    let status = 500;

    if (error instanceof GeneralError) {
        status = 400;
        errorObj.message = error.message;
    }

    if (error instanceof ForbiddenError) {
        status = 403;
        errorObj.message = error.message;
    }

    if (error instanceof ZodError) {
        status = 422;
        errorObj.message = error.issues[0].message || "Invalid input";
    }

    if (error instanceof Error && error.name === "PrismaClientKnownRequestError") {
        const prismaError = error as Prisma.PrismaClientKnownRequestError;
        const modelName = (prismaError.meta?.modelName as string) || "Field";
        status = 400;
        console.log(prismaError.code);
        if (prismaError.code === "P2002") {
            errorObj.message = `${modelName} already exists.`;
        } else if (prismaError.code === "P2025") {
            errorObj.message = `${modelName} not found.`;
        }
    }

    return res ? NextResponse.json(errorObj, { status }) : errorObj;
}
