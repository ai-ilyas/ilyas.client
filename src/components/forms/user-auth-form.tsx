'use client';
import GitHubSignInButton from '../github-auth-button';
import GoogleSignInButton from '../google-auth-button';
import MicrosoftSignInButton from '../microsoft-auth-button';

export default function UserAuthForm() {
  return (
    <>
      <GoogleSignInButton/>
      <MicrosoftSignInButton />
      <GitHubSignInButton />
    </>
  );
}
