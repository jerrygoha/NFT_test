import React, { Component } from 'react'
import PropTypes from 'prop-types';

import {Grid, Row, Col, Panel, Alert} from 'react-bootstrap';
import {Button, ButtonGroup, ButtonToolbar} from 'react-bootstrap';
import {FormGroup, Radio} from 'react-bootstrap';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import {FaceShape, EyeColor, MouthType} from '../../utils/emojiConst'
import {Asset} from "./Asset";

import '../../css/bootstrap/css/bootstrap.min.css';
import '../../App.css'


class Issue extends Component {

    state = {
        flag: false
    };

    constructor(props, context) {
        super(props);

        this.emoji = this.props.emoji;
        this.resetObj = {f: null, e: null, m: null};

        this.contracts = context.drizzle.contracts;
        this.deedToken = this.contracts.DeedToken;
    }


    handleOptionClick = (e) => {

        this.setState({flag: false});

        let obj = {};
        obj[e.target.name] = e.target.value; //image value
        this.emoji = Object.assign({}, this.emoji, obj);

        this.props.onEmojiChange(this.emoji)
    }

    handleCreateClick = () => {

        let _length = Object.keys(this.props.emoji).length;
        for (let m in this.props.emoji) {
            if (this.props.emoji[m] === null) _length--;
        }

        if (_length < 1) {
            this.setState({flag: true});
        } else {

            const {f,e,m} = this.props.emoji;

            let x; let y; let z;
            f != null?x=f:x=0;
            e != null?y=e:y=0;
            m != null?z=m:z=0;

            this.deedToken.methods.mint.cacheSend(x,y,z);
        }
    }

    handleResetClick = () => {
        this.props.onEmojiChange(this.resetObj);
        this.emoji = this.resetObj;
        this.setState({flag: false});
    }

    render() {

        const face = FaceShape.map(f => {return <Radio key={f.value} name="f" value={f.value} inline={true} onChange={this.handleOptionClick} checked={this.props.emoji.f === f.value}>{f.name}</Radio>})


        const eye = EyeColor.map(e => {return <Radio key={e.value} name="e" value={e.value} inline={true} onChange={this.handleOptionClick} checked={this.props.emoji.e === e.value}>{e.name}</Radio>})
        const mouth = MouthType.map(m => {return <Radio key={m.value} name="m" value={m.value} inline={true} onChange={this.handleOptionClick} checked={this.props.emoji.m === m.value}>{m.name}</Radio>})

        return (
            <Grid fluid={true} className="container">
                <Row>
                    <Col>
                        <Asset emoji={this.props.emoji}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Panel bsStyle="success">
                            <Panel.Heading>
                                <Panel.Title>
                                    <Glyphicon glyph="file" /> Token Creation
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
                                        <Button href="#" bsStyle="primary" bsSize="large" onClick={this.handleCreateClick}>
                                            Create
                                        </Button>
                                        <Button href="#" bsStyle="info" bsSize="large" onClick={this.handleResetClick}>
                                            Reset
                                        </Button>
                                    </ButtonGroup>
                                </ButtonToolbar>

                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        )

    }

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


Issue.contextTypes = {
    drizzle: PropTypes.object
}


export default Issue