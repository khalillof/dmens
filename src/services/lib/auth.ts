// auth.ts

import { createRemoteJWKSet, jwtVerify, importSPKI } from 'jose';
import { Request, Response, NextFunction } from 'express';
import { envs } from "../../common/index.js";

interface IauthConfig {
  jwksUri: string;
  localPublicKeys?: string[]; // PEM-encoded public keys
  expectedIssuers: string[];
  expectedAudiences: string[];
  accessRoles?: string[]; // Optional RBAC
}


var authConfig: IauthConfig = {
  jwksUri: envs.jwks_uri() as string,
  expectedIssuers: envs.issuers(),
  expectedAudiences: envs.audiences(), // ['your-client-id'],
  accessRoles: envs.accessRoles()
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
  if (typeof exp !== 'number' || exp * 1000 < Date.now()) throw new Error('Token expired');

    if( !aud) {
    throw new Error('missing required propery audience');
  }
  
  if (Array.isArray(aud) && !(authConfig.expectedAudiences?.some(a => aud.includes(a)))) {

    throw new Error('Invalid audience:' + aud);

  }
  
  if (typeof aud === "string" && !(authConfig.expectedAudiences.includes(aud))) {
    throw new Error('Invalid audience:' + aud);

  }


}

function validateRoles(payload: any) {
  if (!authConfig.accessRoles || authConfig.accessRoles.length === 0) return;

  const userRoles: string[] = payload.roles || [];
  const hasRole = authConfig.accessRoles?.some(role => userRoles.includes(role));
  if (!hasRole) throw new Error('Insufficient role');
}

export function oidcJwtMiddleware(requireAdminRole?: boolean) {
  const { jwks, localKeys } = createVerifiers();

  return async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - Missing Authorization header Bearer ' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const { payload } = await jwtVerify(token, jwks, {
        issuer: authConfig.expectedIssuers,
        audience: authConfig.expectedAudiences,
      });

      validateClaims(payload);

      if (requireAdminRole)
        validateRoles(payload);

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