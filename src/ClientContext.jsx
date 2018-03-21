import React from 'react';
import PropTypes from 'prop-types';
import createReactContext from 'create-react-context';

const ClientContext = createReactContext({ client: null });

export const ClientContextConsumer = ClientContext.Consumer;

export const ClientContextProvider = ({ client, children }) => (
  <ClientContext.Provider value={{ client }}>{children}</ClientContext.Provider>
);

ClientContextProvider.propTypes = {
  client: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

ClientContextProvider.defaultProps = {
  children: null,
};

export const withClient = WrappedComponent => props => (
  <ClientContextConsumer>
    {({ client }) => (
      <WrappedComponent {...props} client={client} />
    )}
  </ClientContextConsumer>
);
