import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Grid} from 'react-bootstrap';

import { IpfsTokenList } from "./IpfsTokenList";
import '../../css/bootstrap/css/bootstrap.min.css';
import '../../App.css'


class IpfsTokens extends Component {

    state = {
        items : [],
        flag: false,
        tokenId: null,
        buttonType: null
    }

    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.deedIpfsToken = this.contracts.DeedIPFSToken;

        this.isTokenList = true;
    }

    handleTransfer = (e) => {
        this.showInputAddress(e.target.id, 'T');
    }

    handleApprove = (e) => {
        this.showInputAddress(e.target.id, 'A');
    }

    showInputAddress = (tokenId, buttonType) => {
        if (!this.state.flag) {
            this.setState({flag: true, tokenId, buttonType});
        } else {
            this.setState({flag: false, tokenId, buttonType});
        }
    }

    handleRemove = (e) => {
        const tokenId = e.target.id;
        this.deedIpfsToken.methods.burn.cacheSend(tokenId);
    }

    componentWillUnmount() {
        this.isTokenList = false;
    }

    async componentDidMount() {
        await this.getTokenList();
        this.deedIpfsToken.events.Transfer().on("data", (event) => this.getTokenList(event));
    }

    getTokenList = async (event) => {

        if (this.isTokenList) {
            let t = 0, apr = 0, ipfsHash = null;
            let items = [];
            const totalSupply = await this.deedIpfsToken.methods.totalSupply().call();

            for (let j=0; j<totalSupply; j++) {

                t = await this.deedIpfsToken.methods.tokenByIndex(j).call();
                apr = await this.deedIpfsToken.methods.getApproved(t).call();

                if (await this.deedIpfsToken.methods.ownerOf(t).call() === this.props.accounts[0]) {
                    ipfsHash = await this.deedIpfsToken.methods.tokenURI(t).call();
                    items.push({hash: ipfsHash, tokenId: t, approved: apr});
                }
            }
            this.setState({items});
        }

        if (event !== undefined) {
            console.log(event.returnValues);
        }

    }


    render() {

        return (
            <Grid fluid={true} className="container">
                <IpfsTokenList items={this.state.items}
                               flag={this.state.flag}
                               tokenId={this.state.tokenId}
                               buttonType={this.state.buttonType}
                               handleTransfer={this.handleTransfer}
                               handleApprove={this.handleApprove}
                               handleRemove={this.handleRemove}
                />
            </Grid>
        )
    }
}

IpfsTokens.contextTypes = {
    drizzle: PropTypes.object
}

export default IpfsTokens