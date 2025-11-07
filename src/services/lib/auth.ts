// auth.ts

import { createRemoteJWKSet, jwtVerify, importSPKI, decodeJwt } from 'jose';
import { Request, Response, NextFunction } from 'express';
import { envs } from "../../common/index.js";

interface IauthConfig {
  jwksUri: string;
  localPublicKeys?: string[]; // PEM-encoded public keys
  expectedIssuers: string[];
  expectedAudiences: string[];

}


var authConfig: IauthConfig = {
  jwksUri: envs.jwks_uri() as string,
  expectedIssuers: envs.issuers(),
  expectedAudiences: envs.audiences(), // ['your-client-id'],
  //localPublicKeys: [process.env.LOCAL_PUBLIC_KEY_PEM!],
};

function getNestedObject(obj:Record<string,any>, path:string){
  return path.split('.').reduce((acc,key)=> acc?.[key],obj)
}

function createVerifiers() {
  const jwks = createRemoteJWKSet(new URL(authConfig.jwksUri));
  const localKeys = authConfig.localPublicKeys?.map(pem => importSPKI(pem, 'RS256')) ?? [];
  return { jwks, localKeys };
}

function validateClaims(payload: any) {

  const { iss, aud, exp } = payload;

  if (!authConfig.expectedIssuers.includes(iss)) throw new Error('Invalid issuer');
  if (typeof exp !== 'number' || exp * 1000 < Date.now()) throw new Error('Token expired');

  if (!aud) {
    throw new Error('missing required propery audience');
  }

  // check if type of aud is array or string and it does have match for audience property
  if ((Array.isArray(aud) && !authConfig.expectedAudiences?.some(a => aud.includes(a))) || (typeof aud === "string" && !authConfig.expectedAudiences.includes(aud))) {

    throw new Error('Invalid audience:' + aud);

  }

}

function validateRoles(payload: Record<string,any>, accessRoles?:string[]) {
  if (accessRoles?.length === 0) return;

  const hasRole = accessRoles?.some(role => (getNestedObject(payload,envs.accessRolesObjectPath()) as string[] || []).includes(role));
  if (!hasRole) throw new Error('Insufficient role');
}

export function oidcJwtMiddleware(accessRoles?: string[]) {
  const { jwks, localKeys } = createVerifiers();

  return async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - Missing Authorization header Bearer ' });
    }

    const token = authHeader.split(' ')[1];

    try {
      // decode token
      console.log(decodeJwt(token));

      
      const { payload } = await jwtVerify(token, jwks, {
        issuer: authConfig.expectedIssuers,
    audience: authConfig.expectedAudiences,
      });

    validateClaims(payload);

      if (accessRoles?.length)
        validateRoles(payload, accessRoles);

      req.user = payload;

      return next();
    } catch (jwksErr: any) {
      console.warn('JWKS verification failed:', jwksErr.message);

      for (const keyPromise of localKeys) {
        try {
          const key = await keyPromise;
          const { payload } = await jwtVerify(token, key);
          validateClaims(payload);
          validateRoles(payload);
          req.user = payload;
          return next();
        } catch {
          continue;
        }
      }

      return res.status(403).json({ error: 'Token verification failed or insufficient access role' });
    }
  };
}

//
// app.ts or routes.ts
/*
import express from 'express';

const app = express();

const authConfig = {
  jwksUri: 'https://your-issuer.com/.well-known/jwks.json',
  expectedIssuers: ['https://your-issuer.com/'],
  expectedAudiences: ['your-client-id'],
  localPublicKeys: [process.env.LOCAL_PUBLIC_KEY_PEM!],
};

app.get('/public', (req, res) => res.send('No auth required'));

app.get('/protected', oidcJwtMiddleware(authConfig), (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

app.get('/admin', oidcJwtMiddleware({ ...authConfig, requiredRoles: ['admin'] }), (req, res) => {
  res.json({ message: 'Admin access granted', user: req.user });
});

*/