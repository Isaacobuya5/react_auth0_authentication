import React, {  useState } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import NavBar from "./components/NavBar";
import Callback from "./components/Callback";
import Public from "./components/Public";
import Private from "./components/Private";
import Courses from "./components/Courses";
import Admin from "./components/Admin";

import Auth from "./auth/Auth";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./contexts/AuthContexts";

function App(props) {
  // const auth = useMemo(() => new Auth(props.history), []);

  const [authObject,  ] = useState({
    auth: new Auth(props.history)
  });

  const { auth } = authObject;

  // we need to pass this props down to the home component as a prop with help of render props

  return (
    <div className="App">
      <AuthContext.Provider value={auth}>
      <NavBar/>
      <Switch>
        <div className="body">
        <Route path="/" render={props => <Home {...props} />} exact/>
          <PrivateRoute
            path="/profile"
            component={Profile}
          />
         <Route path="/callback" render={props => <Callback auth={auth} {...props}/>} />
          <Route path="/public" component={Public} />
          <PrivateRoute
            path="/private"
            component={Private}
          />
          <PrivateRoute
            path="/admin"
            component={Admin}
          />
          <PrivateRoute
            path="/courses"
            component={Courses}
            scopes={["read:courses"]}
          />
        </div>
      </Switch>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
