import React from "react";
import {Alert, Button, ButtonGroup, ButtonToolbar, Col, Image, Panel, Row} from "react-bootstrap";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import SendToken from "./IpfsSendToken";

export function IpfsTokenList(props) {

    let tokenList = props.items.map (e => (
            <Row key={e.tokenId}>
                <Col>
                    <Panel bsStyle="info">
                        <Panel.Heading>
                            <Panel.Title>
                                <Glyphicon glyph="th-large"/> IPFS Image
                            </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body style={{height: "130px"}}>
                            <div style={{position: 'relative'}}>
                                <Image src={`https://gateway.ipfs.io/ipfs/${e.hash}`} className="Ipfs-img" />
                                <p className="Token-desc">
                                    Token ID: IPT-{e.tokenId}
                                    <br/>
                                    IPFS Hash: <b>{e.hash}</b>
                                    <br/>
                                    {e.approved != 0?`Approved: ${e.approved}`:''}
                                </p>
                            </div>
                        </Panel.Body>
                        <Panel.Footer>
                            <SendToken />
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
