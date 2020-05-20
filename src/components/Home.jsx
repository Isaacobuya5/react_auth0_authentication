import React from "react";
import { Link } from "react-router-dom";

const Home = props => {

    return (
        <div>
            <h1>Home page</h1>
            {props.auth.isAuthenticated() ? (
               <Link to="/profile">View Profile</Link>  
            ): (
            <button onClick={() => props.auth.login()}>Login</button>
            )}
           
        </div>
    );
};

export default Home;