import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import ClientContext from './ClientContext';
import DataContext from './DataContext';
import EditingNavigationItemContext from './EditingNavigationItemContext';
import NavbarAdminForm from './components/NavbarAdminForm';
import NavigationItemStore from './NavigationItemStore';
import './styles/cadmus-navbar-admin.css';

function useDataContextValue(client) {
  const [navigationItemStore, setNavigationItemStore] = useState(new NavigationItemStore([]));
  const [pages, setPages] = useState([]);
  const [loadError, setLoadError] = useState(null);

  useEffect(
    () => {
      client.fetchNavigationItems()
        .catch((err) => { setLoadError(err); })
        .then((data) => {
          setNavigationItemStore(new NavigationItemStore(data));
        });

      client.fetchPages()
        .catch((err) => { setLoadError(err); })
        .then((data) => { setPages(data); });
    },
    [client],
  );

  const contextValue = useMemo(
    () => ({ navigationItemStore, pages, loadError, setNavigationItemStore }),
    [navigationItemStore, pages, loadError, setNavigationItemStore],
  );

  return contextValue;
}

function useEditingNavigationItemContextValue(client) {
  const [navigationItem, setNavigationItem] = useState(null);
  const [saveCallback, setSaveCallback] = useState(null);

  const save = useCallback(
    async () => {
      const response = await client.saveNavigationItem(navigationItem);
      if (saveCallback) {
        saveCallback(response);
      }
      setNavigationItem(null);
      setSaveCallback(null);
      return response;
    },
    [client, saveCallback, navigationItem],
  );

  const cancel = useCallback(
    () => {
      setNavigationItem(null);
      setSaveCallback(null);
    },
    [],
  );

  const startEditing = useCallback(
    (initialNavigationItem, newSaveCallback) => {
      setNavigationItem(initialNavigationItem);
      // otherwise React will try to call newSaveCallback as if it were a state updater function
      setSaveCallback(() => newSaveCallback);
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      navigationItem,
      save,
      cancel,
      startEditing,
      navigationItemChanged: setNavigationItem,
    }),
    [navigationItem, save, cancel, startEditing],
  );

  return contextValue;
}

const CadmusNavbarAdminApp = ({ client }) => {
  const dataContextValue = useDataContextValue(client);
  const editingNavigationItemContextValue = useEditingNavigationItemContextValue(client);

  return (
    <ClientContext.Provider value={client}>
      <DataContext.Provider value={dataContextValue}>
        <EditingNavigationItemContext.Provider value={editingNavigationItemContextValue}>
          <NavbarAdminForm />
        </EditingNavigationItemContext.Provider>
      </DataContext.Provider>
    </ClientContext.Provider>
  );
};

CadmusNavbarAdminApp.propTypes = {
  client: PropTypes.shape({}).isRequired,
};

export default CadmusNavbarAdminApp;
