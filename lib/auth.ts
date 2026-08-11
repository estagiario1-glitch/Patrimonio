import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/lib/models/User";
import dbConnect from "@/lib/mongoose";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();
        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
        });

        if (!user || !user.password) {
          return null;
        }

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Registra novos usuários do Google no MongoDB
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await dbConnect();
        const existing = await User.findOne({ email: user.email.toLowerCase() });

        if (!existing) {
          await User.create({
            name: user.name ?? "Usuário",
            email: user.email.toLowerCase(),
            image: user.image ?? undefined,
            role: "viewer",
          });
        } else if (!existing.image && user.image) {
          existing.image = user.image;
          await existing.save();
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          // Busca o usuário recém-criado/existente no banco
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email!.toLowerCase() });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
          }
        } else {
          // Fluxo de e-mail e senha
          token.role = (user as any).role || "viewer";
          token.id = user.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};