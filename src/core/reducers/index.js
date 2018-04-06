import { combineReducers } from 'redux';
import { uiReducer }       from 'core/reducers/reducer-ui';
import { loginReducer }    from 'core/reducers/reducer-login';
import { certificateReducer } from './reducer-certificates';
import { accountsReducer } from './reducer-accounts';

const rootReducer = combineReducers({
  ui: uiReducer,
  login: loginReducer,
  cert: certificateReducer,
  acc: accountsReducer
});

export default rootReducer;
