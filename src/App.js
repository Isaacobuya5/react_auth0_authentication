import React, { useMemo } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import NavBar from "./components/NavBar";
import Callback from "./components/Callback";
import Public from "./components/Public";
import Private from "./components/Private";

import Auth from "./auth/Auth";

function App(props) {

  const auth = useMemo(() => new Auth(props.history),[]);

  // we need to pass this props down to the home component as a prop with help of render props

  return (
    <div className="App">
      <NavBar auth={auth}/>
      <Switch>
        <div className="body">
        <Route path="/" render={props => <Home auth={auth} {...props} />} exact/>
        <Route path="/profile" render={props => auth.isAuthenticated() ? (<Profile auth={auth} {...props}/>) : (<Redirect to="/" />) } />
        <Route path="/callback" render={props => <Callback auth={auth} {...props}/>} />
        <Route path="/public" component={Public} />
        <Route path="/private" render={props => auth.isAuthenticated() ? (<Private auth={auth} {...props}/>) : (<Redirect to="/" />) } />
        </div>
      </Switch>
    </div>
  );
}

export default App;
