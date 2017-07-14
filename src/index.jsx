import React from 'react';
import PropTypes from 'prop-types';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import NavbarAdmin from './containers/NavbarAdmin';
import navbarAdminApp from './reducers';
import './styles/cadmus-navbar-admin.css';

const loggerMiddleware = createLogger();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  navbarAdminApp,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware,
    ),
  ),
);

const CadmusNavbarAdminApp = ({ baseUrl, pagesUrl }) => (
  <Provider store={store}>
    <NavbarAdmin baseUrl={baseUrl} pagesUrl={pagesUrl} />
  </Provider>
  );

CadmusNavbarAdminApp.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  pagesUrl: PropTypes.string.isRequired,
};

export {
  NavbarAdmin,
  navbarAdminApp,
};
export default CadmusNavbarAdminApp;
