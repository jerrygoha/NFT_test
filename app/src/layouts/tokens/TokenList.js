import React from "react";
import {Alert, Col, Image, Panel, Row} from "react-bootstrap";
import {Button, ButtonGroup, ButtonToolbar} from "react-bootstrap";
import Glyphicon from "react-bootstrap/lib/Glyphicon";

import SendToken from "./SendToken";

export function TokenList(props) {

    let tokenList = props.items.map (e => (
            <Row key={e.tokenId}>
                <Col>
                    <Panel bsStyle="info">
                        <Panel.Heading>
                            <Panel.Title>
                                <Glyphicon glyph="th-large"/> Asset image
                            </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body style={{height: '130px'}}>
                            <div style={{position: 'relative'}}>
                                <Image src={e.f} className="Emoji-img" />
                                <Image src={e.e} className="Emoji-img" />
                                <Image src={e.m} className="Emoji-img" />
                                <p className="Token-desc">
                                    Token ID: EMJ-{e.tokenId}
                                    <br/>
                                    {e.approved != 0?`Approved: ${e.approved}`:''}
                                </p>
                            </div>
                        </Panel.Body>
                        <Panel.Footer>
                            <SendToken flag={props.flag && props.tokenId === e.tokenId}
                                       tokenId={props.tokenId}
                                       buttonType={props.buttonType}/>
                            <ButtonToolbar>
                                <ButtonGroup justified>
                                    <Button href="#" bsStyle="primary"
                                            onClick={props.handleTransfer} id={e.tokenId}>
                                        Transfer
                                    </Button>
                                    <Button href="#" bsStyle="info"
                                            onClick={props.handleApprove} id={e.tokenId}>
                                        Allow
                                    </Button>
                                    <Button href="#" bsStyle="danger"
                                            onClick={props.handleRemove} id={e.tokenId}>
                                        Remove
                                    </Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                        </Panel.Footer>
                    </Panel>
                </Col>
            </Row>
        )
    );

    if (tokenList.length === 0) {
        return (<Alert bsStyle="warning">
            <strong><span role="img" aria-label="Bell">🔔</span> You have no token. Create your own token!</strong>
        </Alert>);
    }

    return tokenList;
}
