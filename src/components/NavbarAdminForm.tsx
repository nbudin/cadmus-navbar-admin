import { useContext, useRef, useState, useEffect } from 'react';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import { DndProvider, Preview } from 'react-dnd-multi-backend';

import AddButton from './AddButton';
import ClientContext from '../ClientContext';
import NavigationItemDisplay from './NavigationItemDisplay';
import { useNavigationItemEditing } from '../EditingNavigationItemContext';
import NavigationItemList from './NavigationItemList';
import NavigationItemEditorModal from './NavigationItemEditorModal';
import PreviewNavigationBar from './PreviewNavigationBar';
import { CSSProperties } from 'hoist-non-react-statics/node_modules/@types/react';
import { NavigationItem } from '../NavigationItem';

type NavigationDragItem = {
  type: string;
  item: NavigationItem;
  style: Partial<CSSProperties>;
};

export default function NavbarAdminForm(): JSX.Element {
  const client = useContext(ClientContext);
  const { newNavigationLink, newNavigationSection } = useNavigationItemEditing();
  const wrapperDivRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    client.addErrorSubscriber((err) => setError(err));
  }, [client]);

  const generatePreview = ({ type, item, style }: NavigationDragItem) => {
    if (type === 'NAVIGATION_ITEM') {
      return (
        <div style={{ ...style, width: `${wrapperDivRef.current?.offsetWidth}px` }}>
          <NavigationItemDisplay navigationItem={item} />
        </div>
      );
    }

    return <></>;
  };

  const { loadingNavigationItems, loadingPages } = client.requestsInProgress;
  if (loadingNavigationItems || loadingPages) {
    return <div>Loading...</div>;
  }

  return (
    <DndProvider options={HTML5toTouch}>
      <div ref={wrapperDivRef}>
        {error && <div className="alert alert-danger">{error.message}</div>}

        <PreviewNavigationBar />
        <NavigationItemList />

        <ul className="list-inline mt-2">
          <li className="list-inline-item">
            <AddButton onClick={newNavigationSection}>Add section</AddButton>
          </li>
          <li className="list-inline-item">
            <AddButton onClick={() => newNavigationLink(undefined)}>Add link</AddButton>
          </li>
        </ul>

        <Preview generator={generatePreview} />
        <NavigationItemEditorModal />
      </div>
    </DndProvider>
  );
}
