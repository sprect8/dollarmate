import constants from 'core/types';

const initialState = {
  leftNavOpen: false,
  rightNavOpen: false,
  showModal: false,
  modalActions: [],
  modalTitle: '',
  addresses: [],
  roles: [],
  coinbase: null,
  contract: null,
  password: null
};

export function loginReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SELECT_USER:
      var userType = 99;

      if (action.coinbase) {
        userType = state.roles[state.addresses.indexOf(action.coinbase)].role;
      }
      
      return Object.assign({}, state, {
        coinbase: action.coinbase,
        userType: userType
      });
    case constants.LOGIN:
      return Object.assign({}, state, {
        addresses: action.addresses,
        coinbase: action.coinbase,
        contract: action.contract,
        password: action.password
      });

    case constants.LOGOUT:
      return Object.assign({}, state, {
        addresses: [],
        coinbase: null,
        password: null
      });

    case constants.ROLES_RETRIEVED:
      return Object.assign({}, state, {
        roles: action.roles
      });

    default:
      return state;
  }
}