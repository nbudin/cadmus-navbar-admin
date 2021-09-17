import { useContext } from 'react';
import itemType from '../itemType';
import { NavigationItem } from '../NavigationItem';
import SectionDisclosureTriangle from './SectionDisclosureTriangle';
import DataContext from '../DataContext';

export type NavigationItemDisplayProps = {
  navigationItem: NavigationItem;
};

function NavigationItemDragOverlayDisplay({
  navigationItem,
}: NavigationItemDisplayProps): JSX.Element {
  const { navigationItemStore } = useContext(DataContext);

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

  const renderSectionItems = () => {
    if (itemType(navigationItem) !== 'Section' || !navigationItem.expanded) {
      return null;
    }

    return (
      <div className="w-100 mt-2">
        <ul className="list-group navigation-item-list">
          {navigationItemStore.getNavigationItemsInSection(navigationItem.id).map((sectionItem) => (
            <NavigationItemDragOverlayDisplay key={sectionItem.id} navigationItem={sectionItem} />
          ))}
        </ul>
      </div>
    );
  };

  const renderItemContent = () => (
    <div className="row w-100">
      <div className="col">
        <i className="bi-grip-vertical" /> {renderDisclosureTriangle()}
        <strong>{itemType(navigationItem)}:</strong> {navigationItem.title}
      </div>
    </div>
  );

  return <li className="list-group-item dragging">{renderItemContent()}</li>;
}

export default NavigationItemDragOverlayDisplay;
