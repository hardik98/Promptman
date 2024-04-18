import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectToDB();

        // Lookup user in the database based on email
        const sessionUser = await User.findOne({
          email: session.user.email,
        });

        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }

        return session;
      } catch (error) {
        console.error("Error retrieving session user:", error);
        return session;
      }
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        // Check if user already exists in the database
        const userExist = await User.findOne({
          email: profile.email,
        });

        // If user does not exist, create a new user
        if (!userExist) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", ""),
            image: profile.picture,
          });
        }

        return true; // Sign in successful
      } catch (error) {
        console.error("Error during sign in:", error);
        return false; // Sign in failed
      }
    },
  },
});

export { handler as GET, handler as POST };
