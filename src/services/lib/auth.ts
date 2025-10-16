// auth.ts

import { createRemoteJWKSet, jwtVerify, importSPKI } from 'jose';
import { Request, Response, NextFunction } from 'express';
import { envs } from "../../common/index.js";

interface IauthConfig {
  jwksUri: string;
  localPublicKeys?: string[]; // PEM-encoded public keys
  expectedIssuers: string[];
  expectedAudiences: string[];
  requiredRoles?: string[]; // Optional RBAC
}


const authConfig: IauthConfig = {
  jwksUri: envs.jwks_uri() as string,
  expectedIssuers: envs.issuers(),
  expectedAudiences: envs.audiences() // ['your-client-id'],
  //localPublicKeys: [process.env.LOCAL_PUBLIC_KEY_PEM!],
};


function createVerifiers() {
  const jwks = createRemoteJWKSet(new URL(authConfig.jwksUri));
  const localKeys = authConfig.localPublicKeys?.map(pem => importSPKI(pem, 'RS256')) ?? [];
  return { jwks, localKeys };
}

function validateClaims(payload: any) {
  const { iss, aud, exp } = payload;

  if (!authConfig.expectedIssuers.includes(iss)) throw new Error('Invalid issuer');
  if (!authConfig.expectedAudiences.includes(aud)) throw new Error('Invalid audience');
  if (typeof exp !== 'number' || exp * 1000 < Date.now()) throw new Error('Token expired');
}

function validateRoles(payload: any) {
  if (!authConfig.requiredRoles || authConfig.requiredRoles.length === 0) return;

  const userRoles: string[] = payload.roles || [];
  const hasRole = authConfig.requiredRoles?.some(role => userRoles.includes(role));
  if (!hasRole) throw new Error('Insufficient role');
}

export function oidcJwtMiddleware() {
  const { jwks, localKeys } = createVerifiers();

  return async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized or Missing Authorization header Bearer ' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const { payload } = await jwtVerify(token, jwks, {
        issuer: authConfig.expectedIssuers,
        audience: authConfig.expectedAudiences,
      });

      validateClaims(payload);
      validateRoles(payload);
      req.user = payload;
      return next();
    } catch (jwksErr:any) {
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

      return res.status(403).json({ error: 'Token verification failed or insufficient role' });
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