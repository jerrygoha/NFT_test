import React, { Component } from 'react'
import { Route } from 'react-router'
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import TokensContainer from "./layouts/tokens/TokensContainer";
import IpfsTokensContainer from "./layouts/tokens/IpfsTokensContainer"


class HomeToken extends Component {

    render() {
        return (
            <div>
                <Navbar fluid={true}>
                    <Nav>
                        <LinkContainer to={"/tokens/tokensEmoji"}>
                            <NavItem className="Menu-sub-item">
                                Tokens(EMJ)
                            </NavItem>
                        </LinkContainer>
                        <LinkContainer to={"/tokens/tokensIpfs"}>
                            <NavItem className="Menu-sub-item">
                                Tokens(IPT)
                            </NavItem>
                        </LinkContainer>
                    </Nav>
                </Navbar>
                <Route path={"/tokens/tokensEmoji"} component={TokensContainer}/>
                <Route path={"/tokens/tokensIpfs"} component={IpfsTokensContainer}/>
            </div>

        );
    }
}

export default HomeToken