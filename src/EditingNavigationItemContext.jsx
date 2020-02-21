import React, { useContext, useCallback } from 'react';
import DataContext from './DataContext';

const EditingNavigationItemContext = React.createContext({
  navigationItem: null,
  save: () => {},
  cancel: () => {},
  startEditing: () => {},
  navigationItemChanged: () => {},
});

export default EditingNavigationItemContext;

export function useNavigationItemEditing() {
  const { navigationItemStore, setNavigationItemStore } = useContext(DataContext);
  const { startEditing } = useContext(EditingNavigationItemContext);

  const editNavigationItem = useCallback(
    (navigationItem) => {
      startEditing(
        navigationItem,
        (newItem) => {
          setNavigationItemStore(
            navigationItemStore.update(newItem.id, () => newItem),
          );
        },
      );
    },
    [navigationItemStore, setNavigationItemStore, startEditing],
  );

  const navigationItemCreated = useCallback(
    (createdItem) => {
      setNavigationItemStore(
        navigationItemStore.add(createdItem),
      );
    },
    [setNavigationItemStore, navigationItemStore],
  );

  const newNavigationLink = useCallback(
    (navigationSectionId) => {
      startEditing(
        {
          id: null,
          type: 'link',
          navigation_section_id: navigationSectionId,
          title: '',
          page_id: null,
        },
        navigationItemCreated,
      );
    },
    [startEditing, navigationItemCreated],
  );

  const newNavigationSection = useCallback(
    () => {
      startEditing(
        {
          id: null,
          type: 'section',
          title: '',
        },
        navigationItemCreated,
      );
    },
    [startEditing, navigationItemCreated],
  );

  return {
    editNavigationItem, newNavigationLink, newNavigationSection,
  };
}
