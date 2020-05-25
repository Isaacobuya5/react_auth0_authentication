import React, { useContext} from "react";
import { Link } from "react-router-dom";
import AuthContext from "../contexts/AuthContexts";

const Home = props => {

    const auth  = useContext(AuthContext);
    return (
        <div>
            <h1>Home page</h1>
            {auth.isAuthenticated() ? (
               <Link to="/profile">View Profile</Link>  
            ): (
            <button onClick={() => auth.login()}>Login</button>
            )}
           
        </div>
    );
};

export default Home;