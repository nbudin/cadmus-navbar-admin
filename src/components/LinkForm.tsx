import { useCallback, useContext } from 'react';
import DataContext from '../DataContext';
import useUniqueId from '../useUniqueId';
import { EditingNavigationItem } from '../EditingNavigationItemContext';

export type LinkFormProps = {
  navigationItem: EditingNavigationItem;
  onChange: React.Dispatch<EditingNavigationItem>;
  onSubmit: () => void;
};

export default function LinkForm({
  navigationItem,
  onChange,
  onSubmit,
}: LinkFormProps): JSX.Element {
  const { pages } = useContext(DataContext);

  const formSubmitted = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  const pageSelected = useCallback(
    (event) => {
      let page = null;
      if (event.target.value) {
        page = pages.find((existingPage) => existingPage.id.toString() === event.target.value);
      }

      const currentPage = pages.find((existingPage) => existingPage.id === navigationItem.page_id);

      const titleIsBlank = !navigationItem.title;
      const titleExactlyMatchesPage = currentPage && navigationItem.title === currentPage.name;

      const updatedItem = { ...navigationItem };

      if (titleIsBlank || titleExactlyMatchesPage) {
        updatedItem.title = page ? page.name : '';
      }

      updatedItem.page_id = page?.id;
      onChange(updatedItem);
    },
    [navigationItem, onChange, pages],
  );

  const titleChanged = useCallback(
    (event) => {
      onChange({ ...navigationItem, title: event.target.value });
    },
    [navigationItem, onChange],
  );

  const pageId = useUniqueId('page-');
  const titleId = useUniqueId('title-');

  const options = pages.map((page) => (
    <option key={page.id} value={page.id}>
      {page.name}
    </option>
  ));

  return (
    <form className="form" onSubmit={formSubmitted}>
      <div className="form-group">
        <label htmlFor={pageId}>Page to link to</label>
        <select
          id={pageId}
          className="form-control"
          onChange={pageSelected}
          value={navigationItem.page_id || ''}
        >
          <option />
          {options}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor={titleId}>Text of link on navigation bar</label>
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
