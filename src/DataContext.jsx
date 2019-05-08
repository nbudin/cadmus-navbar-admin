import React from 'react';
import PropTypes from 'prop-types';
import createReactContext from 'create-react-context';
import { withClient } from './ClientContext';
import NavigationItemStore from './NavigationItemStore';

const DataContext = createReactContext({
  navigationItemStore: new NavigationItemStore([]),
  pages: [],
  loadError: null,
  setNavigationItemStore: () => {},
});

const DataContextConsumer = DataContext.Consumer;

class DataContextProvider extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      fetchNavigationItems: PropTypes.func.isRequired,
      fetchPages: PropTypes.func.isRequired,
    }).isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      navigationItemStore: null,
      pages: null,
    };
  }

  componentDidMount = () => {
    this.props.client.fetchNavigationItems()
      .catch((loadError) => { this.setState({ loadError }); })
      .then((navigationItems) => {
        this.setState({ navigationItemStore: new NavigationItemStore(navigationItems) });
      });

    this.props.client.fetchPages()
      .catch((loadError) => { this.setState({ loadError }); })
      .then((pages) => { this.setState({ pages }); });
  }

  setNavigationItemStore = (navigationItemStore) => { this.setState({ navigationItemStore }); }

  render = () => (
    <DataContext.Provider
      value={{
        navigationItemStore: this.state.navigationItemStore,
        pages: this.state.pages,
        loadError: this.state.loadError,
        setNavigationItemStore: this.setNavigationItemStore,
      }}
    >
      {this.props.children}
    </DataContext.Provider>
  );
}

const DataContextProviderWithClient = withClient(DataContextProvider);

export { DataContextProviderWithClient as DataContextProvider };

export const withDataContext = WrappedComponent => props => (
  <DataContextConsumer>
    {dataProps => (
      (dataProps.navigationItemStore == null || dataProps.pages == null) ?
      (<div>Loading...</div>) :
      (<WrappedComponent {...props} {...dataProps} />)
    )}
  </DataContextConsumer>
);
