//const passport = require('passport');
const FacebookStrategy = require('passport-facebook-token');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const { dbStore , config} = require('../../common');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');


class PassportStrategies {

  // local 
  static LocalDefault() {
    return new LocalStrategy(verifyPasswordSafe)
  }

  static Local2(){
    return new LocalStrategy(
      function(username, password, cb) {
          dbStore['user'].model.findOne({ username: username })
              .then((err, user) => {
                if (err) { return cb(err); }
                  if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
                  
                  // Function defined at bottom of app.js
                  const isValid = validPassword(password, user.hash, user.salt);
                  
                  if (isValid) {
                      return cb(null, false, { message: 'Incorrect username or password.' });
                  } else {
                      return cb(null, user);
                  }
              })
              .catch((err) => {   
                  cb(err);
              });
  });
  }

  // JWT stratigy
  static JwtAuthHeaderAsBearerTokenStrategy() {
    return new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secretKey,
      issuer: '',//'accounts.examplesoft.com',
      audience: '', //'yoursite.net'
    }, function (jwt_payload, done) {
      dbStore['user'].model.findOne({ id: jwt_payload.sub }, errorResultCallback);
    });
  }
  // JWT stratigy
  static JwtQueryParameterStrategy() {
    return new JwtStrategy(
      {
        secretOrKey: config.jwtSecret,
        jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token')
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    );
  }

  // facebook strategy
  static Facebook() {
    return new FacebookStrategy({
      clientID: config.facebook.clientId,
      clientSecret: config.facebook.clientSecret
    }, function (accessToken, refreshToken, profile, done){

      dbStore['user'].findOne({ facebookId: profile.id }, errorResultCallback(err, user,done, ()=>{

          user = { username: profile.displayName };
          user.facebookId = profile.id;
          user.firstname = profile.name.givenName;
          user.lastname = profile.name.familyName;
          user.email = profile.email
          user.save(errorResultCallback)
        
      })
      )}
    );
  } 
}
module.exports = {PassportStrategies};

function validPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}


function verifyPasswordSafe(username, password, cb) {
  dbStore['user'].findOne({ username: username }).then((err, user)=>{
    if (err) { return cb(err); }
    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(user.hash, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, user);
    });
  });
}

function genHashedPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  
  return {
    salt: salt,
    hash: genHash
  };
}

function errorResultCallback(err, obj, cb, orDoSomething){
  if (err) { return cb(err, false); }
  else if (obj) { return cb(null,obj); }
  else{
    return orDoSomething && typeof orDoSomething === 'function' ? orDoSomething(err, obj,cb) : cb(null, false)
  }
}

/**
 * This function is used in conjunction with the `passport.authenticate()` method.  See comments in
 * `passport.use()` above ^^ for explanation

 passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});
 */
/**
* This function is used in conjunction with the `app.use(passport.session())` middleware defined below.
* Scroll down and read the comments in the PASSPORT AUTHENTICATION section to learn how this works.
* 
* In summary, this method is "set" on the passport object and is passed the user ID stored in the `req.session.passport`
* object later on.

passport.deserializeUser(function(id, cb) {
  dbStore['user'].findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
  });
});
*/