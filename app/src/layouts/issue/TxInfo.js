import React, { Component } from 'react'
import PropTypes from 'prop-types';

class TxInfo extends Component {

    constructor(props, context) {
        super(props);
        this.drizzle = context.drizzle;
    }

    //use stackId for getting transaction hash
    render() {

        const state = this.drizzle.store.getState();
        const stackId = state.customReducer.stackId

        if (stackId !== undefined && stackId !== null) {
            return (
                <p>
                    {state.transactionStack[stackId]}
                </p>
            )
        } else {
            return null;
        }
    }
}

TxInfo.contextTypes = {
    drizzle: PropTypes.object
}


export default TxInfo