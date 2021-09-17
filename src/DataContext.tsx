import React from 'react';
import NavigationItemStore from './NavigationItemStore';

export type Page = {
  id: string;
  name: string;
};

export type DataContextValue = {
  navigationItemStore: NavigationItemStore;
  setNavigationItemStore: React.Dispatch<NavigationItemStore>;
  pages: Page[];
};

const DataContext = React.createContext<DataContextValue>({
  navigationItemStore: new NavigationItemStore([]),
  pages: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setNavigationItemStore: () => {},
});

export default DataContext;
