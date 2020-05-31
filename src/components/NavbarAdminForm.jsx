import React, { useContext, useRef } from 'react';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import { DndProvider, Preview } from 'react-dnd-multi-backend';

import AddButton from './AddButton';
import ClientContext from '../ClientContext';
import NavigationItem from './NavigationItem';
import { useNavigationItemEditing } from '../EditingNavigationItemContext';
import NavigationItemList from './NavigationItemList';
import NavigationItemEditorModal from './NavigationItemEditorModal';
import PreviewNavigationBar from './PreviewNavigationBar';

function NavbarAdminForm() {
  const client = useContext(ClientContext);
  const { newNavigationLink, newNavigationSection } = useNavigationItemEditing();
  const wrapperDivRef = useRef();

  const generatePreview = (type, item, style) => {
    if (type === 'NAVIGATION_ITEM') {
      return (
        <div style={{ ...style, width: `${wrapperDivRef.current.offsetWidth}px` }}>
          <NavigationItem navigationItem={item} />
        </div>
      );
    }

    return null;
  };

  const renderError = (error) => {
    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }

    return null;
  };

  const { loadingNavigationItems, loadingPages } = client.requestsInProgress;
  if (loadingNavigationItems || loadingPages) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <DndProvider options={HTML5toTouch}>
      <div ref={wrapperDivRef}>
        {renderError(client.error)}

        <PreviewNavigationBar />
        <NavigationItemList />

        <ul className="list-inline mt-2">
          <li className="list-inline-item">
            <AddButton onClick={newNavigationSection}>Add section</AddButton>
          </li>
          <li className="list-inline-item">
            <AddButton onClick={newNavigationLink}>Add link</AddButton>
          </li>
        </ul>

        <Preview generator={generatePreview} />
        <NavigationItemEditorModal />
      </div>
    </DndProvider>
  );
}

export default NavbarAdminForm;
