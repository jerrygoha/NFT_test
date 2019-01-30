import Tokens from './Tokens'
import { drizzleConnect } from 'drizzle-react'

const mapStateToProps = state => {
    return {
        deedToken: state.contracts.DeedToken,
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus
    }
}


const TokensContainer = drizzleConnect(Tokens, mapStateToProps);

export default TokensContainer
