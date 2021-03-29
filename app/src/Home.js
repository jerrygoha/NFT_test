import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

import { issue, tokens } from './images/menu'
import MainContainer from "./MainContainer";
import IssueContainer from "./layouts/issue/IssueContainer";
import HomeToken from "./HomeToken";

import logo from './logo.png'

class Home extends Component {
    render() {
        return (
            <div>
                <div className="Menu-header">
                <Link to={"/"}><img src={logo} className="App-logo" alt="logo"/></Link>
                <Link to={"/issue"}><img src={issue} className="Menu-item" alt="issue"/></Link>
                <Link to={"/tokens"}><img src={tokens} className="Menu-item" alt="tokens"/></Link>

                </div>
                <Route exact path={"/"} component={MainContainer}/>
                <Route path={"/issue"} component={IssueContainer}/>
                <Route path={"/tokens"} component={HomeToken}/>
                
            </div>
        );
    }
}

export default Home
