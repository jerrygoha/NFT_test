export const sayHelloAction = (params) => ({type: 'SAY_HELLO', payload: params});
export const emojiChangeAction = (params) => ({type: 'EMOJI_CHANGED', payload: params});
export const selectTokenAction = (params, contract) => ({type: 'SELECT_TOKEN', payload: params, contract});

export const emojiCreateAction = (params, contract) => ({type: 'EMOJI_CREATE', payload: params, contract});
