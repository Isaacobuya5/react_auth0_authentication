import React from 'react';
import { Switch, Route} from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Switch>
        <Route path="/" component={Home} exact/>
        <Route path="/profile" component={Profile} />
      </Switch>
    </div>
  );
}

export default App;
