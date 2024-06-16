import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { NextAuthConfig } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from "next-auth/providers/google";
import AzureAD from "next-auth/providers/microsoft-entra-id";

const prisma = new PrismaClient()

const authConfig = {
  adapter: PrismaAdapter(prisma),  
  session: { strategy: "jwt" },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }),
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: 'common',
      token: {
        url: `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
    },
      userinfo: {
        url: "https://graph.microsoft.com/oidc/userinfo",
    },
      authorization: {
          url: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`,
          params: {
              scope: "openid profile email User.Read"
          }
      },
      issuer: `https://login.microsoftonline.com/common/v2.0`
    })
  ],
  pages: {
    signIn: '/', //sigin page
    signOut: '/' //sigin out
  }
} satisfies NextAuthConfig;

export default authConfig;
