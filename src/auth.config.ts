import { NextAuthConfig } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from "next-auth/providers/google";
import AzureAD from "next-auth/providers/microsoft-entra-id";
import { ConvexAdapter } from '../convex/convexAdapter';
import { importPKCS8, SignJWT } from "jose";

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL!.replace(
  /.cloud$/,
  ".site",
);

const authConfig = {
  adapter: ConvexAdapter,  
  callbacks: {
    async session({ session, token }) {
      const privateKey = await importPKCS8(
        process.env.CONVEX_AUTH_PRIVATE_KEY!,
        "RS256",
      );
      const convexToken = await new SignJWT({
        sub: token.sub,
      })
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(CONVEX_SITE_URL)
        .setAudience("convex")
        .setExpirationTime("1h")
        .sign(privateKey);
      return { ...session, convexToken };
    },
  },
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

declare module "next-auth" {
  interface Session {
    convexToken: string;
  }
}

export default authConfig;
