import React, { useMemo } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
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

function App(props) {
  const auth = useMemo(() => new Auth(props.history), []);

  // we need to pass this props down to the home component as a prop with help of render props

  return (
    <div className="App">
      <NavBar auth={auth} />
      <Switch>
        <div className="body">
        <Route path="/" render={props => <Home auth={auth} {...props} />} exact/>
          <PrivateRoute
            path="/profile"
            auth={auth}
            component={Profile}
          />
         <Route path="/callback" render={props => <Callback auth={auth} {...props}/>} />
          <Route path="/public" component={Public} />
          <PrivateRoute
            path="/private"
            auth={auth}
            component={Private}
          />
          <PrivateRoute
            path="/admin"
            auth={auth}
            component={Admin}
          />
          <PrivateRoute
            path="/courses"
            component={Courses}
            auth={auth}
            scopes={["read:courses"]}
          />
        </div>
      </Switch>
    </div>
  );
}

export default App;
