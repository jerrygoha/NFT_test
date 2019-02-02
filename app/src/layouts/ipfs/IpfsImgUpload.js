import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Button, ButtonGroup, ButtonToolbar} from 'react-bootstrap';
import {FilePond, registerPlugin } from 'react-filepond';

import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';

import logo from './ipfs-logo.png';
import ipfs from '../../utils/ipfs';
import '../../css/filepond-custom.css';
import '../../App.css';

class IpfsImgUpload extends Component {

    state = {
        ipfsHash: null,
        buffer: '',
        files: [],
        imageUrl: null
    };

    constructor(props, context) {
        super(props);

        registerPlugin(FilePondPluginImagePreview);

        this.contracts = context.drizzle.contracts;
        this.deedIpfsToken = this.contracts.DeedIPFSToken;
    }

    componentDidMount() {
        document.addEventListener("FilePond:addfile", this.readFile);
    }


    readFile = () => {

        //console.log(file.detail.file.filename);
        //console.log(this.pond.props.children[0].props.src);
        if (this.pond != null) {

            const file = this.pond.props.children[0].props.src; //single file

            let reader = new window.FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => this.fileToBuffer(reader);
        }
    };

    fileToBuffer = async (reader) => {
        //buffering ready to upload to IPFS
        const buffer = await Buffer.from(reader.result);
        this.setState({buffer});
    }


    handleUpload = async () => {

        if (this.state.files.length > 0) {
            this.setState({ ipfsHash: 'Uploading...'});
            await ipfs.add(this.state.buffer, (err, ipfsHash) => {
                //console.log(err, ipfsHash);
                //setState by setting ipfsHash to ipfsHash[0].hash
                this.setState({ ipfsHash:ipfsHash[0].hash }, ()=>console.log("Hash=" + this.state.ipfsHash));
                this.deedIpfsToken.methods.mint.cacheSend(ipfsHash[0].hash);
            })
        }
    }

    handleView = async () => {
        const that = this;
        const hash = this.state.ipfsHash;
        //const hash = 'QmQBtWJWVs3pmaw7SSPcyEYoUuxuLdFpao9v9d4fa6weae';

        if (hash !== null) {
            ipfs.cat(hash, function (err, data) {
                if (err) {
                    throw err
                }

                const arrayBufferView = new Uint8Array(data);
                const blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL( blob );
                that.setState({imageUrl});

                //console.log(imageUrl);
                //console.log(file.toString('base64'));
            });
        }
    }

    handleReset = () => {
        this.setState({imageUrl: null});
        this.pond.removeFile();
    }

    render() {
        return (
            <div className="container">
                <div style={{textAlign: 'center'}}>
                    <img src={logo} alt="ipfs-logo" />
                    <h1>IPFS Image Upload</h1>
                    <br/><br/>
                </div>
                <div>
                    <FilePond ref={ref => this.pond = ref}
                              onupdatefiles={(fileItems) => {
                                  // Set current file objects to this.state
                                  this.setState({
                                      files: fileItems.map(fileItem => fileItem.file)
                                  });
                              }}>
                        {this.state.files.map(file => (
                            <input type="file" key={file} src={file} />
                        ))}
                    </FilePond>
                </div>
                <div>
                    {this.state.imageUrl && <img src={this.state.imageUrl} className="img-view"/>} {this.state.ipfsHash}
                </div>
                <div style={{marginTop:"10px"}}>
                    <ButtonToolbar>
                        <ButtonGroup justified>
                            <Button href="#" bsStyle="primary" onClick={this.handleUpload}>
                                Upload & Create
                            </Button>
                            <Button href="#" bsStyle="success" onClick={this.handleView}>
                                View
                            </Button>
                            <Button href="#" bsStyle="info" onClick={this.handleReset}>
                                Reset
                            </Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
            </div>
        )
    }
}


IpfsImgUpload.contextTypes = {
    drizzle: PropTypes.object
}

export default IpfsImgUpload
