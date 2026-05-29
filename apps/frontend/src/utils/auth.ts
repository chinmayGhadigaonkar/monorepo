import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

// If your Prisma file is located elsewhere, you can change the path
const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:8000";

export const auth = betterAuth({
    baseURL: baseUrl,
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:8000",
        baseUrl, // production URL from env
    ],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        github: {
            clientId: process.env.NEXT_PUBLIC_GITHUB_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET!,
        },
    },
    user: {
        additionalFields: { lastUsedWorkspaceId: { type: "string" } },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            void sendEmail(
                user.email,
                "Verify your email address",
                `
                <h1>Verify your email address</h1>
                <p>Click the link to verify your email: ${url}</p>
                `
            );
        },
    },
});
