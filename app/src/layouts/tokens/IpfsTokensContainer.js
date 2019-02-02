import IpfsTokens from './IpfsTokens'
import { drizzleConnect } from 'drizzle-react'

const mapStateToProps = state => {
    return {
        deedToken: state.contracts.DeedToken,
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus
    }
}


const IpfsTokensContainer = drizzleConnect(IpfsTokens, mapStateToProps);

export default IpfsTokensContainer
