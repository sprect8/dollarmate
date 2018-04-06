import constants from 'core/types';

const initialState = {
  certificateId: null,
  certificate: null,
  certificates: [],
  error: null,
  certificateStatus: ""
};

export function certificateReducer(state = initialState, action) {
  switch (action.type) {
    case constants.CERT_LIST_FETCHED:
      
      return Object.assign({}, state, {
        certificates: action.certificates
      });

    case constants.CERT_FETCHED:
      return Object.assign({}, state, {
        certificate: action.certificate
      });

    case constants.CERT_VETTED:
    case constants.CERT_MINTED:
    case constants.CERT_LOCKED:
    case constants.CERT_UNLOCKED:
    case constants.CERT_REJECTED:          
      return Object.assign({}, state, {
        certificateId: action.certId,
        type: action.type
      });

    case constants.CERT_ERROR:          
      return Object.assign({}, state, {
        certificateId: action.certId,
        error: action.error
      });

    default:
      return state;
  }
}