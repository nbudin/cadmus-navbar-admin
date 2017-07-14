import React from 'react';
import PropTypes from 'prop-types';

const DisclosureTriangle = ({ onClick, expanded }) => {
  let disclosureTriangle;
  if (expanded) {
    disclosureTriangle = '▼';
  } else {
    disclosureTriangle = '►';
  }

  return (
    <span
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-pressed={expanded}
      tabIndex="0"
    >
      {disclosureTriangle}
    </span>
  );
};

DisclosureTriangle.propTypes = {
  onClick: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
};

export default DisclosureTriangle;
