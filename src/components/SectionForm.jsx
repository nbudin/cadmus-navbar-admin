import React from 'react';
import PropTypes from 'prop-types';
import { NavigationItemPropType } from '../propTypes';

class SectionForm extends React.Component {
  static propTypes = {
    navigationItem: NavigationItemPropType.isRequired,
    onTitleChanged: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  titleChanged = (event) => {
    this.props.onTitleChanged(event.target.value);
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit();
  }

  render = () => (
    <form className="form" onSubmit={this.onSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input type="text" className="form-control" onChange={this.titleChanged} value={this.props.navigationItem.title} />
      </div>
    </form>
    )
}

export default SectionForm;
