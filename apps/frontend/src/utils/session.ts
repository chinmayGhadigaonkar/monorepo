import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

import { prisma } from "@/lib/prisma";
import { User } from "@/prisma-types/client";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) return null;

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password!);

                if (!isPasswordValid) return null;

                return user;
            },
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            const isExistingUser = await prisma.user.findUnique({
                where: { email: user.email! },
            });
            if (account?.type === "credentials" && !isExistingUser) {
                return false;
            }
            if (!isExistingUser) {
                await prisma.user.create({
                    data: {
                        name: user.name as string,
                        email: user.email as string,
                        profileImage: user.image as string,
                    },
                });
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                const dbUser = await prisma.user.findFirst({
                    where: { email: user.email! },
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.user = { ...(token.user as any), ...dbUser };
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = token.user as User;
            }
            return session;
        },
        redirect: async ({ baseUrl }) => {
            return `${baseUrl}`;
        },
    },
};
