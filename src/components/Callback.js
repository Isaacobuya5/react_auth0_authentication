import React, { useEffect} from 'react';

const Callback = (props) => {

    useEffect(() => {
        // check if url contains access_token, id_token or error
        if (/access_token|id_token|error/.test(props.location.hash)) {
            props.auth.handleAuthentication();
        } else {
            throw new Error("Invalid callback URL");
        }
    },[props.auth, props.location.hash]);
   return <h1>Loading...</h1>
};

export default Callback;