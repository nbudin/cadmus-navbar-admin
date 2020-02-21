import React from 'react';
import NavigationItemStore from './NavigationItemStore';

const DataContext = React.createContext({
  navigationItemStore: new NavigationItemStore([]),
  pages: [],
  loadError: null,
  setNavigationItemStore: () => {},
});

export default DataContext;
