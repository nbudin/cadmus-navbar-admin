import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import NavbarAdmin from './containers/NavbarAdmin';
import navbarAdminApp from './reducers';
import RESTClient from './RESTClient';
import './styles/cadmus-navbar-admin.css';

const loggerMiddleware = createLogger();

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

class CadmusNavbarAdminApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      store: createStore(
        navbarAdminApp,
        composeEnhancers(
          applyMiddleware(
            thunkMiddleware,
            loggerMiddleware,
          ),
        ),
      ),
      client: new RESTClient(props),
    };
  }

  render = () => (
    <Provider store={this.state.store}>
      <NavbarAdmin client={this.state.client} />
    </Provider>
  )
}

export {
  NavbarAdmin,
  navbarAdminApp,
};
export default CadmusNavbarAdminApp;
