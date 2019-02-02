import React, { Component } from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'

import {issue, tokens, ipfs} from './images'
import logo from './logo.png'
import MainContainer from "./MainContainer";
import IssueContainer from "./layouts/issue/IssueContainer";

import ipfsContainer from "./layouts/ipfs/ipfsContainer";
import HomeToken from "./HomeToken";


class Home extends Component {
    render() {
        return (
            <div>
                <div className="Menu-header">
                <Link to={"/"}><img src={logo} className="App-logo" alt="logo"/></Link>
                <Link to={"/issue"}><img src={issue} className="Menu-item" alt="issue"/></Link>
                <Link to={"/ipfs"}><img src={ipfs} className="Menu-item" alt="ipfs"/></Link>
                <Link to={"/tokens"}><img src={tokens} className="Menu-item" alt="tokens"/></Link>

                </div>
                <Route exact path={"/"} component={MainContainer}/>
                <Route path={"/issue"} component={IssueContainer}/>
                <Route path={"/tokens"} component={HomeToken}/>
                <Route path={"/ipfs"} component={ipfsContainer}/>
            </div>
        );
    }
}

export default Home