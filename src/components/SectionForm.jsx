import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import { NavigationItemPropType } from '../propTypes';

class SectionForm extends React.Component {
  static propTypes = {
    navigationItem: NavigationItemPropType.isRequired,
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

  titleChanged = (event) => {
    this.props.onChange({ ...this.props.navigationItem, title: event.target.value });
  }

  render = () => {
    const titleId = this.nextUniqueId();

    return (
      <form className="form" onSubmit={this.onSubmit}>
        <div className="form-group">
          <label htmlFor="titleId">Title</label>
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

export default SectionForm;
