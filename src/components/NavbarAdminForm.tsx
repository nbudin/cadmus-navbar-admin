import { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  closestCenter,
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  LayoutMeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import AddButton from './AddButton';
import ClientContext from '../ClientContext';
import { useNavigationItemEditing } from '../EditingNavigationItemContext';
import NavigationItemEditorModal from './NavigationItemEditorModal';
import PreviewNavigationBar from './PreviewNavigationBar';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DataContext, { DataContextValue, Page } from '../DataContext';
import { NavigationItem } from '../NavigationItem';
import NavigationItemDragOverlayDisplay from './NavigationItemDragOverlayDisplay';
import NavigationItemStore from '../NavigationItemStore';
import NavigationItemDisplay from './NavigationItemDisplay';

export type NavbarAdminFormProps = {
  pages: Page[];
  initialNavigationItemStore: NavigationItemStore;
};

const VIRTUAL_ROOT_SECTION: NavigationItem = {
  id: '__virtual_root_section',
  position: 1,
  title: 'virtualRoot',
  expanded: true,
};

const layoutMeasuring = {
  strategy: LayoutMeasuringStrategy.Always,
};

export default function NavbarAdminForm({
  pages,
  initialNavigationItemStore,
}: NavbarAdminFormProps): JSX.Element {
  const [canonicalStore, setCanonicalStore] = useState(initialNavigationItemStore);
  const [activeDragItemId, setActiveDragItemId] = useState<string>();
  const [dragWorkingStore, setDragWorkingStore] = useState<NavigationItemStore>(canonicalStore);
  const client = useContext(ClientContext);
  const { newNavigationLink, newNavigationSection } = useNavigationItemEditing();
  const [error, setError] = useState<Error>();

  const dataContextValue: DataContextValue = useMemo(
    () => ({
      navigationItemStore: activeDragItemId ? dragWorkingStore : canonicalStore,
      pages,
      setNavigationItemStore: setCanonicalStore,
    }),
    [canonicalStore, pages, setCanonicalStore, activeDragItemId, dragWorkingStore],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const flattenedItems = useMemo(
    () => dataContextValue.navigationItemStore.getFlattenedItems(),
    [dataContextValue.navigationItemStore],
  );

  useEffect(() => {
    client.addErrorSubscriber((err) => setError(err));
  }, [client]);

  const onMoveNavigationItemOnto = useCallback(async (movedItem, ontoItem, insertAfter) => {
    setDragWorkingStore((prevDragWorkingStore) => {
      const itemsInSection = prevDragWorkingStore.getNavigationItemsInSection(
        ontoItem.navigation_section_id,
      );
      const newIndex = itemsInSection.findIndex((item) => item.id === ontoItem.id);
      const newWorkingStore = prevDragWorkingStore.reposition(
        movedItem.id,
        ontoItem.navigation_section_id,
        newIndex + (insertAfter ? 1 : 0),
      );
      return newWorkingStore;
    });
  }, []);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveDragItemId(event.active.id);
      setDragWorkingStore(canonicalStore);
    },
    [canonicalStore],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      const activeItem = dragWorkingStore.get(active.id);
      const overItem = over
        ? over.id === VIRTUAL_ROOT_SECTION.id
          ? VIRTUAL_ROOT_SECTION
          : dragWorkingStore.get(over.id)
        : undefined;

      if (overItem && activeItem.id !== overItem.id) {
        onMoveNavigationItemOnto(
          activeItem,
          overItem,
          over?.id === VIRTUAL_ROOT_SECTION.id && over?.data.current?.side === 'bottom',
        );
      }
    },
    [dragWorkingStore, onMoveNavigationItemOnto],
  );

  const handleDragEnd = async () => {
    await client.sortNavigationItems(dragWorkingStore);
    setActiveDragItemId(undefined);
    setCanonicalStore(dragWorkingStore);
  };

  const handleDragCancel = () => {
    setActiveDragItemId(undefined);
    setDragWorkingStore(canonicalStore);
  };

  const { loadingNavigationItems, loadingPages } = client.requestsInProgress;
  if (loadingNavigationItems || loadingPages) {
    return <div>Loading...</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
      layoutMeasuring={layoutMeasuring}
    >
      <DataContext.Provider value={dataContextValue}>
        <div>
          {error && <div className="alert alert-danger">{error.message}</div>}

          <PreviewNavigationBar />
          <ul className="list-group navigation-item-list">
            <SortableContext
              items={flattenedItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {flattenedItems.map((navigationItem) => (
                <div
                  key={navigationItem.id}
                  className={navigationItem.navigation_section_id ? 'ms-4' : undefined}
                >
                  <NavigationItemDisplay
                    navigationItem={navigationItem}
                    isBeingDragged={activeDragItemId === navigationItem.id}
                  />
                </div>
              ))}
            </SortableContext>
          </ul>

          <ul className="list-inline mt-2">
            <li className="list-inline-item">
              <AddButton onClick={newNavigationSection}>Add section</AddButton>
            </li>
            <li className="list-inline-item">
              <AddButton onClick={() => newNavigationLink(undefined)}>Add link</AddButton>
            </li>
          </ul>

          <NavigationItemEditorModal />
        </div>
        <DragOverlay>
          {activeDragItemId && (
            <NavigationItemDragOverlayDisplay
              navigationItem={dragWorkingStore.get(activeDragItemId)}
            />
          )}
        </DragOverlay>
      </DataContext.Provider>
    </DndContext>
  );
}
