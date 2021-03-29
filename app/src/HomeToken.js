import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import TokensContainer from "./layouts/tokens/TokensContainer";


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
                        
                    </Nav>
                </Navbar>
                <Route path={"/tokens/tokensEmoji"} component={TokensContainer}/>
            </div>

        );
    }
}

export default HomeToken
