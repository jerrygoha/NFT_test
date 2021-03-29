import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';

import { getImgSrc } from '../../utils/emojiUtils';
import { TokenList } from './TokenList';
import '../../css/bootstrap/css/bootstrap.min.css';
import '../../App.css'

class Tokens extends Component {

    state = {
        items : [],
        flag: false,
        tokenId: null,
        buttonType: null
    }

    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.deedToken = this.contracts.DeedToken;
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
        this.deedToken.methods.burn.cacheSend(tokenId);
    }


    getTokenList = async (event) => {

        let t = 0, apr = 0, asset = null;
        let items = [];
        const totalSupply = await this.deedToken.methods.totalSupply().call();

        for (let j=0; j<totalSupply; j++) {

            t = await this.deedToken.methods.tokenByIndex(j).call();
            apr = await this.deedToken.methods.getApproved(t).call();

            if (await this.deedToken.methods.ownerOf(t).call() === this.props.accounts[0]) {
                asset = await this.deedToken.methods.allTokens(t).call();
                //console.log(asset);
                items.push({f: getImgSrc(asset.x, 'face'),
                            e: getImgSrc(asset.y, 'eyes'),
                            m: getImgSrc(asset.z, 'mouth'),
                            tokenId: t,
                            approved: apr});
            }
        }
        this.setState({items});


        if (event !== undefined) {
            console.log(event.returnValues);
        }

    }

    componentWillUnmount() {
        this.eventTransfer.unsubscribe();
    }

    async componentDidMount() {
        
        await this.getTokenList();
        //event listening
        this.eventTransfer = this.deedToken.events.Transfer().on("data", (event) => this.getTokenList(event));
        //console.log(this.eventTransfer);
    }

    render() {
        return (
            <Grid fluid={true} className="container">
                <TokenList items={this.state.items} flag={this.state.flag}
                           tokenId={this.state.tokenId} buttonType={this.state.buttonType}
                           handleTransfer={this.handleTransfer}
                           handleApprove={this.handleApprove}
                           handleRemove={this.handleRemove}
                />
            </Grid>
        )
    }
}

Tokens.contextTypes = {
    drizzle: PropTypes.object
}

export default Tokens
