import React, { Component } from 'react'
import PropTypes from 'prop-types';

import {Grid, Row, Col, Panel, Alert} from 'react-bootstrap';
import {Radio, FormGroup, Button, ButtonGroup, ButtonToolbar} from 'react-bootstrap';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import Asset from "./Asset";
import {FaceShape, EyeColor, MouthType} from "../../utils/emojiConst";
import TxInfo from "./TxInfo";

import '../../css/bootstrap/css/bootstrap.min.css';

class Issue extends Component {

    state = {
        flag : false
    };

    constructor(props, context) {
        super(props);

        this.emoji = this.props.emoji;
        this.contracts = context.drizzle.contracts;
        this.deedToken = this.contracts.DeedToken;
    }

    handleOptionClick = (e) => {
        this.setState({flag: false});

        let obj = {};
        obj[e.target.name] = e.target.value;
        this.emoji = {...this.emoji, ...obj};

        this.props.onEmojiChange(this.emoji);
    }

    handleCreateClick = () => {
        let _length = Object.keys(this.emoji).length; //{f:,e:,m:}

        for (let m in this.emoji) {
            if (this.emoji[m] === null) _length--;
        }

        if (_length < 1) {
            this.setState({flag: true});
        } else {
            const {f,e,m} = this.emoji;
            let x; let y; let z;
            f != null?x=f:x=0; //0=blank image
            e != null?y=e:y=0;
            m != null?z=m:z=0;

            //contract call
            const stackId = this.deedToken.methods.mint.cacheSend(x,y,z);
            this.props.onEmojiCreate(stackId);
        }
    }

    handleResetClick = () => {
        const resetObj = {f: null, e: null, m: null};
        this.props.onEmojiChange(resetObj);
        this.props.onEmojiCreate(null);
        this.emoji = resetObj;
        this.setState({flag: false});
    }

    mapOptions =  (e, name, emoji) => {
        return <Radio key={e.value}
                      name={name}
                      value={e.value}
                      inline={true}
                      onChange={this.handleOptionClick}
                      checked={emoji === e.value}>{e.name}</Radio>
    }

    render() {
        /*
        const face = FaceShape.map(f => {return <Radio value={f.value}
                   checked={this.props.emoji.f === f.value} onChange={this.handleOptionClick}
                   name="f" key={f.value} inline={true}>
                {f.name}
            </Radio>});

        const eye = EyeColor.map();
        */

        const face = FaceShape.map(f => this.mapOptions(f, 'f', this.props.emoji.f));
        const eye = EyeColor.map(e => this.mapOptions(e, 'e', this.props.emoji.e));
        const mouth = MouthType.map(m => this.mapOptions(m, 'm', this.props.emoji.m));

        return (
            <Grid fluid={true} className="container">
                <Row>
                    <Col>
                        <Asset emoji={this.props.emoji} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Panel bsStyle="success">
                            <Panel.Heading>
                                <Panel.Title>
                                    <Glyphicon glyph="expand" /> Token Creation
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Body className="custom-align-center">
                                <form>
                                    <FormGroup>
                                        {face}
                                        <br/>
                                        {eye}
                                        <br/>
                                        {mouth}
                                    </FormGroup>
                                </form>
                                <AlertMsg flag={this.state.flag}/>
                                <ButtonToolbar>
                                    <ButtonGroup justified>
                                        <Button href="#"
                                                bsStyle="primary"
                                                bsSize="large"
                                                onClick={this.handleCreateClick}>
                                            Create
                                        </Button>
                                        <Button href="#"
                                                bsStyle="info"
                                                bsSize="large"
                                                onClick={this.handleResetClick}>
                                            Reset
                                        </Button>
                                    </ButtonGroup>
                                </ButtonToolbar>
                            </Panel.Body>
                            <Panel.Footer>
                                <TxInfo />
                            </Panel.Footer>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        )
    }

}

Issue.contextTypes = {
    drizzle: PropTypes.object
}


function AlertMsg(props) {

    if (props.flag) {
        return (
            <Alert bsStyle="danger">
                <strong>You should check at least one option</strong>
            </Alert>
        )
    }
    return <br/>
}

export default Issue
