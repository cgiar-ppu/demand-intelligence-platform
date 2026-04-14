/**
 * Authentication service placeholder.
 * Will integrate with AWS Cognito for user management.
 */

const COGNITO_CONFIG = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
}

export interface AuthTokens {
  accessToken: string
  idToken: string
  refreshToken: string
}

export async function signIn(_email: string, _password: string): Promise<AuthTokens> {
  // TODO: Implement Cognito sign-in
  console.log('Auth config:', COGNITO_CONFIG)
  throw new Error('Authentication not yet implemented')
}

export async function signOut(): Promise<void> {
  // TODO: Implement Cognito sign-out
}

export async function refreshSession(_refreshToken: string): Promise<AuthTokens> {
  // TODO: Implement token refresh
  throw new Error('Token refresh not yet implemented')
}

export async function getAccessToken(): Promise<string | null> {
  // TODO: Return current access token from storage
  return null
}
