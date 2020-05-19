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
        <div className="body">
        <Route path="/" component={Home} exact/>
        <Route path="/profile" component={Profile} />
        </div>
      </Switch>
    </div>
  );
}

export default App;
