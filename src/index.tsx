import { useState, useEffect, useMemo, useCallback } from 'react';
import ClientContext from './ClientContext';
import DataContext, { DataContextValue, Page } from './DataContext';
import EditingNavigationItemContext, {
  EditingNavigationItem,
  EditingNavigationItemContextValue,
} from './EditingNavigationItemContext';
import NavbarAdminForm from './components/NavbarAdminForm';
import NavigationItemStore from './NavigationItemStore';
import { CadmusNavbarAdminClient } from './CadmusNavbarAdminClient';
import { NavigationItem } from './NavigationItem';

function useDataContextValue(client: CadmusNavbarAdminClient): DataContextValue {
  const [navigationItemStore, setNavigationItemStore] = useState(new NavigationItemStore([]));
  const [pages, setPages] = useState<Page[]>([]);
  const [loadError, setLoadError] = useState<Error>();

  useEffect(() => {
    client
      .fetchNavigationItems()
      .then((data) => {
        setNavigationItemStore(new NavigationItemStore(data));
      })
      .catch((err) => {
        setLoadError(err);
      });

    client
      .fetchPages()
      .then((data) => {
        setPages(data);
      })
      .catch((err) => {
        setLoadError(err);
      });
  }, [client]);

  const contextValue: DataContextValue = useMemo(
    () => ({ navigationItemStore, pages, loadError, setNavigationItemStore }),
    [navigationItemStore, pages, loadError, setNavigationItemStore],
  );

  return contextValue;
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
}
