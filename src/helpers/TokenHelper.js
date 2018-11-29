import jwt from 'jsonwebtoken';

class TokenHelper {
  constructor(secret, signOptions, verifyOptions) {
    this.secret = secret;
    this.options = {
      sign: signOptions || {},
      verify: verifyOptions || {},
    };
  }

  sign(payload, options) {
    /*
      algorithm (default: HS256)
      expiresIn/exp: expressed in seconds or a string describing a time
                      span zeit/ms. Eg: 60, "2 days", "10h", "7d"
      notBefore/nbf: expressed in seconds or a string describing a time
                      span zeit/ms. Eg: 60, "2 days", "10h", "7d"
      audience/aud
      issuer/iss
      jwtid
      subject/sub
      noTimestamp
      header
      keyid
      mutatePayload: if true, the sign function will modify the payload
                      object directly. This is useful if you need a raw reference to the payload after claims have been applied to it but before it has been encoded into a token.
      */
    const extendOptions = Object.assign({}, this.options.sign, options || {});
    return jwt.sign(payload, this.secret, extendOptions);
  }

  signAsync(payload, options) {
    const extendOptions = Object.assign({}, this.options.sign, options || {});
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secret, extendOptions, (err, decoded) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(decoded);
      });
    });
  }

  verify(token, options) {
    /*
      algorithms: List of strings with the names of the allowed algorithms.
                  For instance, ["HS256", "HS384"].
      audience: if you want to check audience (aud), provide a value here. 
                The audience can be checked against a string, a regular expressionor a list of strings and/or regular expressions. Eg: "urn:foo", /urn:f[o]{2}/, [/urn:f[o]{2}/, "urn:bar"]
      issuer (optional): string or array of strings of valid values for
                          the iss field.
      ignoreExpiration: if true do not validate the expiration of the token.
      ignoreNotBefore...
      subject: if you want to check subject (sub), provide a value here
      clockTolerance: number of seconds to tolerate when checking the nbf and
                      exp claims, to deal with small clock differences among different servers
      maxAge: the maximum allowed age for tokens to still be valid. 
              It is expressed in seconds or a string describing a time span zeit/ms. Eg: 1000, "2 days", "10h", "7d".
      clockTimestamp: the time in seconds that should be used as the current
                      time for all necessary comparisons.
    */
    const extendOptions = Object.assign({}, this.options.verify, options || {});
    return jwt.verify(decodeURI(token), this.secret, extendOptions);
  }

  verifyAsync(token, options) {
    const secret = this.secret;
    const extendOptions = Object.assign({}, this.options.verify, options || {});
    return new Promise(function(resolve, reject) {
      jwt.verify(decodeURI(token), secret, extendOptions, (err, decoded) => {
        if (err) {
          return reject(new Error('This link is invalid or may be expired'));
        }
        resolve(decoded);
      });
    });
  }
}

export default TokenHelper;
