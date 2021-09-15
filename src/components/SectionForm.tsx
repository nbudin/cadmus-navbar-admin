import React, { useCallback } from 'react';
import useUniqueId from '../useUniqueId';
import { EditingNavigationItem } from '../EditingNavigationItemContext';

export type SectionFormProps = {
  navigationItem: EditingNavigationItem;
  onChange: React.Dispatch<EditingNavigationItem>;
  onSubmit: () => void;
};

function SectionForm({ navigationItem, onChange, onSubmit }: SectionFormProps): JSX.Element {
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

export default SectionForm;
