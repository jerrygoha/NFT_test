function customReducer (state = {}, action) {

    //console.log(action.type);
    switch (action.type) {

        case 'SAY_HELLO' :
            return {
                ...state,
                sayHello: "Hello, " + action.payload
            };

        default : return state
    }

}

export default customReducer;