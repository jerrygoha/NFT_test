import React, { Component } from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'

import MainContainer from "./MainContainer";
import IssueContainer from "./layouts/issue/IssueContainer";
import logo from './logo.png'
import {issue, tokens, ipfs} from './images'

class Home extends Component {
    render() {
        return (
            <div>
                <div className="Menu-header">
                    <Link to={"/"}><img src={logo} className="App-logo" alt="logo"/></Link>
                    <Link to={"/issue"}><img src={issue} className="Menu-item" alt="issue"/></Link>
                    <Link to={"/tokens"}><img src={tokens} className="Menu-item" alt="tokens"/></Link>
                    <Link to={"/ipfs"}><img src={ipfs} className="Menu-item" alt="ipfs"/></Link>
                </div>
                <Route exact path={"/"} component={MainContainer} />
                <Route path={"/issue"} component={IssueContainer} />
                {/*<Route path={"/tokens"} component={TokensContainer} />*/}
                {/*<Route path={"/ipfs"} component={ipfsContainer} />*/}
            </div>
        );
    }
}

export default Home
