import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import DataContext from '../DataContext';

function SectionDisclosureTriangle({ navigationSectionId }) {
  const { navigationItemStore, setNavigationItemStore } = useContext(DataContext);

  const toggleExpanded = () => {
    setNavigationItemStore(
      navigationItemStore.update(
        navigationSectionId,
        section => ({ ...section, expanded: !section.expanded }),
      ),
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
      tabIndex="0"
    >
      {disclosureTriangle}
    </span>
  );
}

SectionDisclosureTriangle.propTypes = {
  navigationSectionId: PropTypes.number.isRequired,
};

export default SectionDisclosureTriangle;
