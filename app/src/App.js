import React, { Component } from "react";
import { DrizzleProvider } from "drizzle-react";
import {LoadingContainer} from "drizzle-react-components";

import "./App.css";
import drizzleOptions from "./drizzleOptions";
import MainContainer from "./MainContainer";
import store from "./store";

class App extends Component {
  render() {
    return (
      <DrizzleProvider options={drizzleOptions} store={store}>
        <LoadingContainer>
          <MainContainer />
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
