import React, { useContext, useCallback } from 'react';
import DataContext from './DataContext';
import { NavigationItem } from './NavigationItem';

export type EditingNavigationItem = Omit<NavigationItem, 'id' | 'position'> &
  Pick<Partial<NavigationItem>, 'id'> & {
    type: 'link' | 'section';
  };

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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cancel: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  startEditing: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  navigationItemChanged: () => {},
});

export default EditingNavigationItemContext;

export function useNavigationItemEditing(): {
  editNavigationItem: (navigationItem: EditingNavigationItem) => void;
  newNavigationLink: (navigationSectionId: string | undefined) => void;
  newNavigationSection: () => void;
} {
  const { navigationItemStore, setNavigationItemStore } = useContext(DataContext);
  const { startEditing } = useContext(EditingNavigationItemContext);

  const editNavigationItem = useCallback(
    (navigationItem: EditingNavigationItem) => {
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
