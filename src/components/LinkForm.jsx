import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import { NavigationItemPropType } from '../propTypes';
import { withDataContext } from '../DataContext';

class LinkForm extends React.Component {
  static propTypes = {
    navigationItem: NavigationItemPropType.isRequired,
    pages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit();
  }

  pageSelected = (event) => {
    let page = null;
    if (event.target.value) {
      page = this.props.pages.find(existingPage => (
        existingPage.id.toString() === event.target.value
      ));
    }

    const currentPage = this.props.pages.find(existingPage => (
      existingPage.id === this.props.navigationItem.page_id
    ));

    const titleIsBlank = !this.props.navigationItem.title;
    const titleExactlyMatchesPage = (
      currentPage && this.props.navigationItem.title === currentPage.name
    );

    const updatedItem = { ...this.props.navigationItem };

    if (titleIsBlank || titleExactlyMatchesPage) {
      updatedItem.title = (page ? page.name : '');
    }

    updatedItem.page_id = (page ? page.id : null);
    this.props.onChange(updatedItem);
  }

  titleChanged = (event) => {
    this.props.onChange({ ...this.props.navigationItem, title: event.target.value });
  }

  render = () => {
    const pageId = this.nextUniqueId();
    const titleId = this.nextUniqueId();

    const options = this.props.pages.map(page => (
      <option key={page.id} value={page.id}>{page.name}</option>
    ));

    return (
      <form className="form" onSubmit={this.onSubmit}>
        <div className="form-group">
          <label htmlFor={pageId}>Page to link to</label>
          <select
            id={pageId}
            className="form-control"
            onChange={this.pageSelected}
            value={this.props.navigationItem.page_id || ''}
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
            onChange={this.titleChanged}
            value={this.props.navigationItem.title}
          />
        </div>
      </form>
    );
  }
}

export default withDataContext(LinkForm);
