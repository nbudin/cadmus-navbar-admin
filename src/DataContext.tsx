import React from 'react';
import NavigationItemStore from './NavigationItemStore';

export type Page = {
  id: string;
  name: string;
};

export type DataContextValue = {
  navigationItemStore: NavigationItemStore;
  setNavigationItemStore: React.Dispatch<NavigationItemStore>;
  loadError?: Error;
  pages: Page[];
};

const DataContext = React.createContext<DataContextValue>({
  navigationItemStore: new NavigationItemStore([]),
  pages: [],
  loadError: undefined,
  setNavigationItemStore: () => {},
});

export default DataContext;
