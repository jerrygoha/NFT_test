import React from "react";
import {Image, Panel} from "react-bootstrap";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import { getImgSrc } from "../../utils/emojiUtils";

export default (props) => {

    const faceImg = getImgSrc(props.emoji.f, 'face');
    const eyeImg = getImgSrc(props.emoji.e, 'eyes');
    const mouthImg = getImgSrc(props.emoji.m, 'mouth');
    

    return (
        <Panel bsStyle="primary">
            <Panel.Heading>
                <Panel.Title>
                    <Glyphicon glyph="th-large" /> Asset image
                </Panel.Title>
            </Panel.Heading>
            <Panel.Body style={{height: '130px'}}>
                <div style={{position: 'relative'}}>
                    <Image src={faceImg} className="Emoji-img" />
                    <Image src={eyeImg} className="Emoji-img" />
                    <Image src={mouthImg} className="Emoji-img" />
                </div>
            </Panel.Body>
        </Panel>
    )
}
