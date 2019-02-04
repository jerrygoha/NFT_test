import IpfsTokens from './IpfsTokens'
import { drizzleConnect } from 'drizzle-react'
import { selectTokenAction } from "../../actions/customAction";

const mapStateToProps = state => {
    return {
        deedToken: state.contracts.DeedIPFSToken,
        selectedToken : state.customReducer.selectedToken,
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus
    }
}


const mapDispatchToProps = (dispatch) => (
    {
        onSelectToken: (params) => {dispatch(selectTokenAction(params))}
    }
);


const IpfsTokensContainer = drizzleConnect(IpfsTokens, mapStateToProps, mapDispatchToProps);

export default IpfsTokensContainer
