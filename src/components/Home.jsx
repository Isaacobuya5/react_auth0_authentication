import React from "react";

const Home = props => {

    return (
        <div>
            <h1>Home page</h1>
            <button onClick={() => props.auth.login()}>Login</button>
        </div>
    );
};

export default Home;