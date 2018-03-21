import React from 'react';
import PropTypes from 'prop-types';

const AddButton = ({ children, onClick }) => (
  <button type="button" className="btn btn-sm btn-secondary" onClick={onClick}>
    {children}
  </button>
  );

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default AddButton;
