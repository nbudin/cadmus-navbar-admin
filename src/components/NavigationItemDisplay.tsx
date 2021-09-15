import { useContext, useRef, useCallback, useState } from 'react';
import classNames from 'classnames';
import { useDrag, useDrop } from 'react-dnd';
import { ConfirmModal } from 'react-bootstrap4-modal';
import itemType from '../itemType';
import AddButton from './AddButton';
import { useNavigationItemEditing } from '../EditingNavigationItemContext';
import NavigationItemList from './NavigationItemList';
import { NavigationItem } from '../NavigationItem';
import SectionDisclosureTriangle from './SectionDisclosureTriangle';
import ClientContext from '../ClientContext';
import DataContext from '../DataContext';

export type NavigationItemDisplayProps = {
  navigationItem: NavigationItem;
};

function NavigationItemDisplay({ navigationItem }: NavigationItemDisplayProps): JSX.Element {
  const { navigationItemStore, setNavigationItemStore } = useContext(DataContext);
  const { editNavigationItem, newNavigationLink } = useNavigationItemEditing();
  const client = useContext(ClientContext);
  const ref = useRef<HTMLLIElement>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const expandNavigationItem = useCallback(
    (props) => {
      setNavigationItemStore(
        navigationItemStore.update(props.navigationItem.id, (item) => ({
          ...item,
          expanded: true,
        })),
      );
    },
    [navigationItemStore, setNavigationItemStore],
  );

  const onMoveNavigationItemOnto = useCallback(
    async (movedItem) => {
      const myItem = navigationItem;
      const sameSection = movedItem.navigation_section_id === myItem.navigation_section_id;
      const movingDown = sameSection && movedItem.position < myItem.position;

      let newNavigationItems;
      if (movingDown) {
        newNavigationItems = navigationItemStore.reposition(
          movedItem.id,
          myItem.navigation_section_id,
          myItem.position + 1,
        );
      } else {
        newNavigationItems = navigationItemStore.reposition(
          movedItem.id,
          myItem.navigation_section_id,
          myItem.position,
        );
      }

      await client.sortNavigationItems(newNavigationItems);
      setNavigationItemStore(navigationItemStore.applySort(newNavigationItems));
    },
    [client, setNavigationItemStore, navigationItemStore, navigationItem],
  );

  const onMoveNavigationItemInto = useCallback(
    async (movedItem) => {
      const newNavigationItems = navigationItemStore.reposition(movedItem.id, navigationItem.id, 1);

      await client.sortNavigationItems(newNavigationItems);
      setNavigationItemStore(navigationItemStore.applySort(newNavigationItems));
    },
    [client, navigationItem, navigationItemStore, setNavigationItemStore],
  );

  const [{ isDragging }, drag, preview] = useDrag({
    item: { navigationItem, type: 'NAVIGATION_ITEM' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'NAVIGATION_ITEM',
    drop: (_props, monitor) => {
      if (!monitor.canDrop()) {
        return;
      }

      const dragItem = monitor.getItem().navigationItem;

      if (navigationItem.id === dragItem.id) {
        return;
      }

      if (
        itemType(navigationItem) === 'Section' &&
        itemType(dragItem) === 'Link' &&
        navigationItem.expanded
      ) {
        onMoveNavigationItemInto(dragItem);
      } else {
        onMoveNavigationItemOnto(dragItem);
      }
    },
    hover: (props, monitor) => {
      const dragItem = monitor.getItem().navigationItem;

      if (
        itemType(navigationItem) === 'Section' &&
        itemType(dragItem) === 'Link' &&
        !navigationItem.expanded
      ) {
        expandNavigationItem(props);
      }
    },
    canDrop: (_props, monitor) => {
      const dragItem = monitor.getItem().navigationItem;
      const dragItemType = itemType(dragItem);
      const myItemType = itemType(navigationItem);
      const iAmInANavigationSection = navigationItem.navigation_section_id;

      // Can't drop a section onto a link that's already in a section
      if (dragItemType === 'Section' && myItemType === 'Link' && iAmInANavigationSection) {
        return false;
      }

      // Links can swap with other links, so don't allow drops except directly onto an item
      if (dragItemType === 'Link' && !monitor.isOver({ shallow: true })) {
        return false;
      }

      return true;
    },
  });

  const onClickDelete = () => {
    setIsConfirmingDelete(true);
  };
  const cancelDelete = () => {
    setIsConfirmingDelete(false);
  };
  const confirmDelete = async () => {
    await client.deleteNavigationItem(navigationItem);

    const newStore = navigationItemStore.delete(navigationItem.id);
    setNavigationItemStore(newStore);
  };

  const editNavigationItemClicked = () => {
    editNavigationItem(navigationItem);
  };
  const newLinkClicked = () => {
    newNavigationLink(navigationItem.id);
  };

  const renderDisclosureTriangle = () => {
    if (itemType(navigationItem) !== 'Section') {
      return null;
    }

    return (
      <span>
        <SectionDisclosureTriangle navigationSectionId={navigationItem.id} />{' '}
      </span>
    );
  };

  const renderConfirmDelete = () => (
    <ConfirmModal visible={isConfirmingDelete} onCancel={cancelDelete} onOK={confirmDelete}>
      Are you sure you want to delete {navigationItem.title} from the navigation bar?
    </ConfirmModal>
  );

  const renderSectionItems = () => {
    if (itemType(navigationItem) !== 'Section' || !navigationItem.expanded) {
      return null;
    }

    return (
      <div className="w-100 mt-2">
        <NavigationItemList navigationSectionId={navigationItem.id} />
        <ul className="list-inline mt-2">
          <li className="list-inline-item">
            <AddButton onClick={newLinkClicked}>Add link</AddButton>
          </li>
        </ul>
      </div>
    );
  };

  const renderItemContent = () => (
    <div className="row w-100">
      <div className="col">
        {renderDisclosureTriangle()}
        <strong>{itemType(navigationItem)}:</strong> {navigationItem.title}
      </div>
      <div className="col text-right">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={editNavigationItemClicked}
        >
          Edit
        </button>{' '}
        <button type="button" className="btn btn-danger btn-sm" onClick={onClickDelete}>
          Delete
        </button>
      </div>
    </div>
  );

  drag(preview(drop(ref)));

  return (
    <li className={classNames('list-group-item draggable', { dragging: isDragging })} ref={ref}>
      {renderItemContent()}
      {renderSectionItems()}
      {renderConfirmDelete()}
    </li>
  );
}

export default NavigationItemDisplay;
