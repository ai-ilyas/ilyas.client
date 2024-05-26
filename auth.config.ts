import { NextAuthConfig } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    })
  ],
  pages: {
    signIn: '/', //sigin page
    signOut: '/' //sigin out
  }
} satisfies NextAuthConfig;

export default authConfig;
