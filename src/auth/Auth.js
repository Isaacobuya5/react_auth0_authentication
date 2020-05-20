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
}