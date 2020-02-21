import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { NavigationItemPropType } from '../propTypes';
import useUniqueId from '../useUniqueId';

function SectionForm({ navigationItem, onChange, onSubmit }) {
  const formSubmitted = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  const titleChanged = useCallback(
    (event) => {
      onChange({ ...navigationItem, title: event.target.value });
    },
    [navigationItem, onChange],
  );

  const titleId = useUniqueId('title-');

  return (
    <form className="form" onSubmit={formSubmitted}>
      <div className="form-group">
        <label htmlFor="titleId">Title</label>
        <input
          id={titleId}
          type="text"
          className="form-control"
          onChange={titleChanged}
          value={navigationItem.title}
        />
      </div>
    </form>
  );
}

SectionForm.propTypes = {
  navigationItem: NavigationItemPropType.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SectionForm;
