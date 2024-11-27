import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // if this authorizd returns TRUE the middleware would runs only for specifed routes that we have declared in matcher array
    authorized({ auth, request }) {
      return !!auth?.user;
      /*if (auth?.user) return true;
      else return false;*/
    },
    // this callback runs before actual sign up happens
    async signIn({ user, account, profile }) {
      try {
        // existingGuest === {user}(user's email in provider is exist in database) or existingGuest === null(user's email in provider is not found in database)
        const existingGuest = await getGuest(user.email);
        // create a new user or guest obj when there is no user found in our database
        if (!existingGuest)
          await createGuest({ email: user.email, fullName: user.name });

        // if user's email which signned in using provider were in guets or users in our database return true
        return true;
      } catch {
        // if user's email was not found in our users or guests database table return false
        // if there is an error happens in getGuest() this catch block will execute
        return false;
      }
    },

    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  // can be used to login / log out
  handlers: { GET, POST },
  // auth function can be used in any server component to get current session and act as middleware function
  auth,
  // to keep authenication flow on server(much better exprince) we use thses functions to signin or out
  signIn,
  signOut,
} = NextAuth(authConfig);
