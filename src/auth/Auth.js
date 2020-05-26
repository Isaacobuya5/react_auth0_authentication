import auth0 from "auth0-js";

const REDIRECT_ON_LOGIN = "redirect_on_login";

// private variables
//eslint-disable-next-line
let _idToken = null;
let _accessToken = null;
let _scopes = null;
let _expiresAt = null;

export default class Auth {

    // we need to pass React Router's history to constructor to enable Auth perform redirects
    constructor(history) {
        this.history = history;
        this.userProfile = null;
        this.requestedScopes = "openid profile email read:courses";
        // instantiate auth0 WebAuth
        this.auth0 = new auth0.WebAuth({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            responseType: "token id_token",
            scope: this.requestedScopes
        })
    }

    // method to login a user
    login = () => {
        // authorize() is contained within auth0.WebAuth
        // it redirects the user to the Auth0 login page
        // store current location before login
        localStorage.setItem(REDIRECT_ON_LOGIN, JSON.stringify(this.history.location));
        this.auth0.authorize();
    }

    // handling the token
    handleAuthentication = () => {
        this.auth0.parseHash((error, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                const redirectLocation = localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined" ? "/" : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));
                this.history.push(redirectLocation);
            } else if (error) {
                this.history.push("/");
                alert(`Error: ${error.error}. Check the console for details`);
                console.log(error);
            }
            localStorage.removeItem(REDIRECT_ON_LOGIN);
        })
    }

    setSession = authResult => {
        // set time that the token will expire
        // gives us the unix epuch time that the token will expire
         _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();

        // If there is a value on the scope param from the authResult
        // use it to set scopes in the session for the user. Otherwise
        // use the scopes as requested. If no scopes were requested
        // set it to nothing 
        _scopes = authResult.scope || this.requestedScopes || '';

        // save the tokens in local Storage
        _accessToken = authResult.accessToken;
        _idToken = authResult.idToken;
        // ask auth for a new token when the current token expires
        this.scheduleTokenRenewal();
    }

    // check if user is still logged in
    isAuthenticated = () => {
        const currentTime = new Date().getTime();
        return currentTime < _expiresAt;
    }

    // logout a user if logged in
    logout = () => {
        // navigate to home page after logout
        this.auth0.logout({
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            returnTo: "http://localhost:3000"
        });
    }

    // get the access token
    getAccessToken = () => {
        if (!_accessToken) {
            throw new Error("No access token found.")
        }
        return _accessToken;
    }

    // getting the user profile
    getUserProfile = cb => {
        // return user profile if already found.
        if (this.userProfile) return cb(this.userProfile);

        this.auth0.client.userInfo(this.getAccessToken(), (error, profile) => {
            if (profile) this.userProfile = profile;
            cb(profile, error);
        });
    };

    // check if a user has a given scope
    userHasScopes = (scopes) => {

        // getting the granted scopes
        const grantedScopes = ( _scopes || "").split(" ");

        return scopes.every(scope => grantedScopes.includes(scope));
    }

    // functiion to renewToken using Silent Authentication
    renewToken = (cb) => {
        this.auth0.checkSession({}, (err, result) => {
            if (err) {
                console.log(`Error: ${err.error} - ${err.error_description}`);
            } else {
                this.setSession(result);
            }
            // call an optional callback function if any
            if (cb) cb(err, result);
        });
    };

    // renew tokens automatically when token expires
    scheduleTokenRenewal = () => {
        const delay = _expiresAt - Date.now();
        if (delay > 0) setTimeout(() => this.renewToken(), delay);
    }

}