import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "magic-link",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        token: { label: "Token", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email is required");
        }

        const email = credentials.email.toLowerCase();
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Check if this is an admin email
        if (adminEmail && email === adminEmail) {
          // Admin requires a password
          if (!credentials.password) {
            throw new Error("Password required for admin access");
          }
          if (!adminPassword) {
            throw new Error("Admin password not configured on server");
          }
          if (credentials.password !== adminPassword) {
            throw new Error("Incorrect admin password");
          }

          // Admin login successful
          await connectDB();
          let admin = await User.findOne({ email });

          // Auto-create admin user if missing
          if (!admin) {
            admin = await User.create({
              email,
              name: "Ateeb",
              role: "admin",
              active: true,
            });
          }

          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: "admin",
          };
        }

        // Regular client flow — email only
        await connectDB();
        const user = await User.findOne({
          email,
          active: true,
        });

        if (!user) {
          throw new Error("No account found with this email");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "client";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role =
          (token.role as string) || "client";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};