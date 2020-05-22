import auth0 from "auth0-js";

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
        this.auth0.authorize();
    }

    // handling the token
    handleAuthentication = () => {
        this.auth0.parseHash((error, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                this.history.push("/")
            } else if (error) {
                this.history.push("/");
                alert(`Error: ${error.error}. Check the console for details`);
                console.log(error);
            }
        })
    }

    setSession = authResult => {
        // set time that the token will expire
        // gives us the unix epuch time that the token will expire
        const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());

        // If there is a value on the scope param from the authResult
        // use it to set scopes in the session for the user. Otherwise
        // use the scopes as requested. If no scopes were requested
        // set it to nothing 
        const scopes = authResult.scope || this.requestedScopes || '';

        // save the tokens in local Storage
        localStorage.setItem("access_token", authResult.accessToken);
        localStorage.setItem("id_token", authResult.idToken);
        localStorage.setItem("expires_at", expiresAt);
        localStorage.setItem("scopes", JSON.stringify(scopes));
    }

    // check if user is still logged in
    isAuthenticated = () => {
        const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
        const currentTime = new Date().getTime();
        return currentTime < expiresAt;
    }

    // logout a user if logged in
    logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("scopes");
        // upon logout clear user profile
        this.userProfile = null;
        // navigate to home page after logout
        this.auth0.logout({
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            returnTo: "http://localhost:3000"
        });
    }

    // get the access token
    getAccessToken = () => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
            throw new Error("No access token found.")
        }

        console.log(accessToken);
        return accessToken;
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
        const grantedScopes = (
            JSON.parse(localStorage.getItem("scopes")) || ""
        ).split(" ");

        return scopes.every(scope => grantedScopes.includes(scope));
    }


}