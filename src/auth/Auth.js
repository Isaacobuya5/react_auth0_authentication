import auth0 from "auth0-js";

export default class Auth {

    // we need to pass React Router's history to constructor to enable Auth perform redirects
    constructor(history) {
        this.history = history;
        // instantiate auth0 WebAuth
        this.auth0 = new auth0.WebAuth({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
            responseType: "token id_token",
            scope: "openid profile email"
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

        // save the tokens in local Storage
        localStorage.setItem("access_token", authResult.accessToken);
        localStorage.setItem("id_token", authResult.idToken);
        localStorage.setItem("expires_at", expiresAt);
    }


}