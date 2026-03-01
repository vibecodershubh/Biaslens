import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@biaslens.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                // Lookup user in DB
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error("User not found");
                }

                // Compare passwords
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name || "Operator",
                };
            }
        })
    ],
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "BIASLENS_SECRET_KEY",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
