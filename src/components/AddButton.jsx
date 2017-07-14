import React from 'react';
import PropTypes from 'prop-types';

const AddButton = ({ caption, onClick }) => (
  <button type="button" className="btn btn-sm btn-secondary" onClick={onClick}>
    {caption}
  </button>
  );

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  caption: PropTypes.string.isRequired,
};

export default AddButton;
