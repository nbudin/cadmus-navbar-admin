import { useState, useEffect, useMemo, useCallback } from 'react';
import ClientContext from './ClientContext';
import { Page } from './DataContext';
import EditingNavigationItemContext, {
  EditingNavigationItem,
  EditingNavigationItemContextValue,
} from './EditingNavigationItemContext';
import NavbarAdminForm from './components/NavbarAdminForm';
import NavigationItemStore from './NavigationItemStore';
import { CadmusNavbarAdminClient } from './CadmusNavbarAdminClient';
import { NavigationItem } from './NavigationItem';

async function fetchInitialClientData(client: CadmusNavbarAdminClient) {
  return Promise.all([client.fetchNavigationItems(), client.fetchPages()]);
}

function useEditingNavigationItemContextValue(
  client: CadmusNavbarAdminClient,
): EditingNavigationItemContextValue {
  const [navigationItem, setNavigationItem] = useState<EditingNavigationItem>();
  const [saveCallback, setSaveCallback] = useState<(navigationItem: NavigationItem) => void>();

  const save = useCallback(async () => {
    if (navigationItem == null) {
      throw new Error('No navigation item is currently being edited');
    }

    const response = await client.saveNavigationItem(navigationItem);
    if (saveCallback) {
      saveCallback(response);
    }
    setNavigationItem(undefined);
    setSaveCallback(undefined);
    return response;
  }, [client, saveCallback, navigationItem]);

  const cancel = useCallback(() => {
    setNavigationItem(undefined);
    setSaveCallback(undefined);
  }, []);

  const startEditing = useCallback((initialNavigationItem, newSaveCallback) => {
    setNavigationItem(initialNavigationItem);
    // otherwise React will try to call newSaveCallback as if it were a state updater function
    setSaveCallback(() => newSaveCallback);
  }, []);

  const contextValue: EditingNavigationItemContextValue = useMemo(
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

export type CadmusNavbarAdminAppProps = {
  client: CadmusNavbarAdminClient;
};

export default function CadmusNavbarAdminApp({ client }: CadmusNavbarAdminAppProps): JSX.Element {
  const [initialNaviationItemStore, setInitialNavigationItemStore] =
    useState<NavigationItemStore>();
  const [initialPages, setInitialPages] = useState<Page[]>();
  const [fetchError, setFetchError] = useState<Error>();

  useEffect(() => {
    fetchInitialClientData(client)
      .then(([navigationItems, pages]) => {
        setInitialNavigationItemStore(new NavigationItemStore(navigationItems));
        setInitialPages(pages);
      })
      .catch((error) => setFetchError(error));
  }, [client]);

  const editingNavigationItemContextValue = useEditingNavigationItemContextValue(client);

  if (fetchError) {
    return <div className="alert alert-danger">{fetchError.message}</div>;
  }

  if (!initialNaviationItemStore || !initialPages) {
    return <>Loading...</>;
  }

  return (
    <ClientContext.Provider value={client}>
      <EditingNavigationItemContext.Provider value={editingNavigationItemContextValue}>
        <NavbarAdminForm
          initialNavigationItemStore={initialNaviationItemStore}
          pages={initialPages}
        />
      </EditingNavigationItemContext.Provider>
    </ClientContext.Provider>
  );
}
