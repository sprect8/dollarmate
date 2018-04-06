import constants from 'core/types';

const initialState = {
  balance: 0,
  iDinar: 0,
  tx: null,
  error: null    
};

export function accountsReducer(state = initialState, action) {
  switch (action.type) {
    case constants.IDINAR_SENT:
      
      return Object.assign({}, state, {
        tx: action.tx
      });

    case constants.ETH_BALANCE:
      return Object.assign({}, state, {
        balance: action.balance
      });

    case constants.IDINAR_BALANCE:
      return Object.assign({}, state, {
        iDinar: action.iDinar
      });

    case constants.ACC_ERROR:          
      return Object.assign({}, state, {
        coinbase: action.coinbase,
        error: action.error
      });

    default:
      return state;
  }
}