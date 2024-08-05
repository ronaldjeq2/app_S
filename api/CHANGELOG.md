# CHANGELOG
## v1.12.5

- Added api for get senati's campusList #143

## v1.12.3

- Fixed   brithdays's bug #141
## v1.12.3

- Fixed bug to response with status 200  when ocurring timeout #134

## v1.12.1

- Fixed virtual course assitance #134
- Fixed list brithday with date February 29 #135

## v1.3.0

- Added GET endpoint /account/ssb to get autologin code for sinfo on app
- Added 'hash' value (encrypted pass) to jwt token
- Changed account/token error messages to spanish
- Added CryptoJs to encrypt pwd with secret key
- Added JavaScriptObfuscator to obfuscate auto login code for SSB
- Fix not required token on news endpoint
- Added current instance to info swagger documentation
- Modified token validate function to return invalid when hash no exist on decoded token
- Added instance property to jwt token
- Enabled unicodeEscapeSequence for js code obfuscator
