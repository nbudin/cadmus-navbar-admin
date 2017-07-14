import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import { NavigationItemPropType } from '../propTypes';

class LinkForm extends React.Component {
  static propTypes = {
    navigationItem: NavigationItemPropType.isRequired,
    pages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
    onPageChanged: PropTypes.func.isRequired,
    onTitleChanged: PropTypes.func.isRequired,
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

    if (titleIsBlank || titleExactlyMatchesPage) {
      this.props.onTitleChanged(page ? page.name : '');
    }

    this.props.onPageChanged(page);
  }

  titleChanged = (event) => {
    this.props.onTitleChanged(event.target.value);
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
          <label htmlFor={pageId}>Page</label>
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
          <label htmlFor={titleId}>Title</label>
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

export default LinkForm;
