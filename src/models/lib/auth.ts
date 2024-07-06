import passport from 'passport';
/*
import { Issuer, Strategy} from 'openid-client';


 export async function useOidcStrategy(){

    const params = { 
      scope: 'openid dmens-api profile email',
      resources:{
        'http://localhost:8000/categories': {
          scope: 'dmens-api profile email'
        }
      } 
    };
    const usePKCE = "S256"; // optional, defaults to false, when true the code_challenge_method will be
    // resolved from the issuer configuration, instead of true you may provide
    // any of the supported values directly, i.e. "S256" (recommended) or "plain"
    Issuer.discover("http://localhost:44382/pauth").then((pIssuer)=>{
  console.log('issuer metadata :',pIssuer.metadata)
    const client = new pIssuer.Client({
      client_id: 'dmens-api2',
      client_secret: 'dmens-api2',
      redirect_uris: ["http://localhost:8000/redirect"],
      response_types: ['code']
    
    })
    passport.use('oidc', new Strategy({ client, params, usePKCE, passReqToCallback: true },
        (req:any, tokenSet, userinfo, done) => {
          console.log("tokenSet",tokenSet);
          console.log("userinfo",userinfo);
             // do whatever you want with tokenset and userinfo
          req.session.tokenSet = tokenSet;
          req.session.userinfo = userinfo;
          
        // return done(null, tokenSet.claims());
        if (userinfo) {
          return done(null, userinfo);
        }
  
        return done(null, false);
        }
    ));
 }).then(()=>console.log('useOidcStrategy initalized.......................!!!')).catch((err)=>console.error(err))
    
};
export const authorizeOidc= async (req:any, res:any,next:any)=>passport.authenticate("oidc", {}, async (err: any, user: any, info: any) => res.send({err, user, info}))(req, res,next);

 function resetOidcStrategy() {
 //debug('OidcStrategy: reset');
    passport.unuse('oidc');
  }
*/