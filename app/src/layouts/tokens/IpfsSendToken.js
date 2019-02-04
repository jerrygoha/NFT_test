import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Button, Form, FormControl, FormGroup, InputGroup} from "react-bootstrap";

class IpfsSendToken extends Component {

    constructor(props, context) {
        super(props);
        this.drizzleStore = context.drizzle.store;
        this.contracts = context.drizzle.contracts;
        this.deedIpfsToken = this.contracts.DeedIPFSToken;
    }

    handleSubmit = () => {

        const state = this.drizzleStore.getState();

        const tokenId = state.customReducer.selectedToken.tokenId;
        const buttonType = state.customReducer.selectedToken.buttonType;
        const from = state.accounts[0];
        const to = this.toAddress.value;

        if (buttonType === 'T') { //transferFrom
            this.deedIpfsToken .methods.transferFrom.cacheSend(from, to, tokenId);

        } else if (buttonType === "A") { //approve
            this.deedIpfsToken .methods.approve.cacheSend(to, tokenId);
        }

    }

    render () {

        const state = this.drizzleStore.getState();

        if (state.customReducer.selectedToken.flag) {
            return (
                <Form inline style={{marginBottom: "5px"}}>
                    <FormGroup controlId="addr">
                        <InputGroup>
                            <InputGroup.Addon>@</InputGroup.Addon>
                            <FormControl type="text" label="Text"
                                         placeholder="Enter Ethereum address"
                                         style={{width: "366px"}}
                                         inputRef={ref => this.toAddress = ref}/>
                        </InputGroup>{' '}
                        <Button type="button" onClick={this.handleSubmit}>Submit</Button>
                    </FormGroup>
                </Form>
            )
        }
        return <br/>
    }
}


IpfsSendToken.contextTypes = {
    drizzle: PropTypes.object
}

export default IpfsSendToken;
