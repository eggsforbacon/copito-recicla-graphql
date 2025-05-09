import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/prisma';


export default NextAuth({
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findFirst({
          where: { email: credentials?.email },
        });

        console.log("user", user);
        

        if (user && bcrypt.compareSync(credentials!.password, user.password)) {
          return { id: user.id, name: user.name, email: user.email };
        }
        throw new Error("Login failed");;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = { name: token.name, email: token.email };
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    error: '/auth',
    signIn: 'https://copitorecicla.com/reciclaje'
  }
});
