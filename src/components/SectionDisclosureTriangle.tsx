import { useContext } from 'react';
import DataContext from '../DataContext';

export type SectionDisclosureTriangleProps = {
  navigationSectionId: string;
};

function SectionDisclosureTriangle({
  navigationSectionId,
}: SectionDisclosureTriangleProps): JSX.Element {
  const { navigationItemStore, setNavigationItemStore } = useContext(DataContext);

  const toggleExpanded = () => {
    setNavigationItemStore(
      navigationItemStore.update(navigationSectionId, (section) => ({
        ...section,
        expanded: !section.expanded,
      })),
    );
  };

  const navigationSection = navigationItemStore.get(navigationSectionId);

  let disclosureTriangle;
  if (navigationSection.expanded) {
    disclosureTriangle = '▼';
  } else {
    disclosureTriangle = '►';
  }

  return (
    <span
      onClick={toggleExpanded}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-pressed={navigationSection.expanded}
      tabIndex={0}
    >
      {disclosureTriangle}
    </span>
  );
}

export default SectionDisclosureTriangle;
