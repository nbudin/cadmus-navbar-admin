import React, { useContext, useCallback } from 'react';
import DataContext from './DataContext';
import { NavigationItem } from './NavigationItem';

export type EditingNavigationItem = Omit<NavigationItem, 'id' | 'position'> &
  Pick<Partial<NavigationItem>, 'id'>;

export type EditingNavigationItemContextValue = {
  navigationItem?: EditingNavigationItem;
  startEditing: (
    navigationItem: EditingNavigationItem,
    onChange: React.Dispatch<NavigationItem>,
  ) => void;
  save: () => Promise<NavigationItem>;
  cancel: () => void;
  navigationItemChanged: React.Dispatch<EditingNavigationItem>;
};

const EditingNavigationItemContext = React.createContext<EditingNavigationItemContextValue>({
  navigationItem: undefined,
  save: async () => ({ id: '', position: 0, type: 'link', title: '' }),
  cancel: () => {},
  startEditing: () => {},
  navigationItemChanged: () => {},
});

export default EditingNavigationItemContext;

export function useNavigationItemEditing() {
  const { navigationItemStore, setNavigationItemStore } = useContext(DataContext);
  const { startEditing } = useContext(EditingNavigationItemContext);

  const editNavigationItem = useCallback(
    (navigationItem: NavigationItem) => {
      startEditing(navigationItem, (newItem) => {
        setNavigationItemStore(navigationItemStore.update(newItem.id, () => newItem));
      });
    },
    [navigationItemStore, setNavigationItemStore, startEditing],
  );

  const navigationItemCreated = useCallback(
    (createdItem: NavigationItem) => {
      setNavigationItemStore(navigationItemStore.add(createdItem));
    },
    [setNavigationItemStore, navigationItemStore],
  );

  const newNavigationLink = useCallback(
    (navigationSectionId: string | undefined) => {
      startEditing(
        {
          type: 'link',
          navigation_section_id: navigationSectionId,
          title: '',
          page_id: undefined,
        },
        navigationItemCreated,
      );
    },
    [startEditing, navigationItemCreated],
  );

  const newNavigationSection = useCallback(() => {
    startEditing(
      {
        type: 'section',
        title: '',
      },
      navigationItemCreated,
    );
  }, [startEditing, navigationItemCreated]);

  return {
    editNavigationItem,
    newNavigationLink,
    newNavigationSection,
  };
}
