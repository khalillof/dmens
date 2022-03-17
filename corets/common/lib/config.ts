import {env} from 'process';
import path from 'path'

export const config = {
  port:env.PORT || 3000,
  auth:env.AUTH || true,
  secretKey: env.SECRET_KEY || '',
  jwtSecret: env.SECRET_KEY || '',
  getSchemaUploadPath:()=> path.resolve(__dirname,'../../' + env.SCHEMA_DIR +`/schema.${Date.now()}.json`) || path.resolve(__dirname,`../../schema.${Date.now()}.json`),
  schemaDir:path.resolve(__dirname,'../../' + env.SCHEMA_DIR)|| path.resolve(__dirname,'../../'),
  imagesUploadDir:path.resolve(__dirname,'../../' + env.IMAGES_UPLOAD_DIR)|| path.resolve(__dirname,'../../'),
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
