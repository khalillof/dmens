import {env} from 'process';

export const config = {
  auth:env.AUTH || true,
  secretKey: env.SECRET_KEY || '',
  jwtSecret: env.SECRET_KEY || '',
  cores_domains: env.NODE_ENV === 'development'? env.CORES_DMAINS_DEV?.split(',') || [] : env.CORES_DMAINS_PROD?.split(',') || [],
  mongoUrl: {
    'dev': env.DB_CONNECTION_DEV || '',
    'local': env.DB_CONNECTION_LOCAL || '',
    'prod': env.DB_CONNECTION_PROD || '',
    'admin': env.DB_CONNECTION_ADMIN || '',
    'cluster': env.DB_CONNECTION_CLUSTER || ''
  },
  facebook: {
    'clientId': env.FACEBOOK_CLIENT_ID || '',
    'clientSecret': env.FACEBOOK_CLIENT_SECRET || ''
  }

}
