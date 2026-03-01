import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password, name } = body;

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists with this email" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || "Operator",
            },
        });

        // Strip password before returning
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            { user: userWithoutPassword, message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
