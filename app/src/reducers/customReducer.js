const initialState = {emoji:{f: null, e:null, m:null},
                      selectedToken: {flag:false, tokenId: null, buttonType: null},
                      stackId: null}

function customReducer (state = initialState, action) {

    //console.log(action.type);
    switch (action.type) {

        case 'SAY_HELLO' :
            return {
                ...state,
                sayHello: "Hello, " + action.payload
            };

        case 'EMOJI_CHANGED' :
            return {
                ...state,
                emoji: action.payload
            };

        case  'EMOJI_CREATE' :
            return {
                ...state,
                stackId: action.payload
            };

        case 'SELECT_TOKEN' :
            return {
                ...state,
                selectedToken: action.payload
            }

        default : return state
    }

}

export default customReducer;
