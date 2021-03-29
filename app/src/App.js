import React, { Component } from "react";
import { DrizzleProvider } from "@drizzle/react-plugin";
import { LoadingContainer } from "@drizzle/react-components";
import { BrowserRouter as Router } from "react-router-dom";

import "./App.css";
import drizzleOptions from "./drizzleOptions";
import store from "./store";
import Home from "./Home";

class App extends Component {
  render() {
    return (
      <DrizzleProvider options={drizzleOptions} store={store}>
        <LoadingContainer>
            <Router>
                <Home/>
            </Router>
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
