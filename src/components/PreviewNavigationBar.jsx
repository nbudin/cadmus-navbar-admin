import React from 'react';
import PropTypes from 'prop-types';
import { withDataContext } from '../DataContext';
import itemType from '../itemType';
import PreviewLink from './PreviewLink';
import PreviewSection from './PreviewSection';

class PreviewNavigationBar extends React.Component {
  static propTypes = {
    navigationItemStore: PropTypes.shape({
      getRoots: PropTypes.func.isRequired,
      getNavigationItemsInSection: PropTypes.func.isRequired,
    }).isRequired,
  };

  renderNavigationItems = () => (
    this.props.navigationItemStore.getRoots().map((item) => {
      const type = itemType(item);

      if (type === 'Link') {
        return <PreviewLink navigationItem={item} key={item.id} />;
      }

      return <PreviewSection navigationItem={item} key={item.id} />;
    })
  )

  render = () => (
    <nav className="navbar navbar-light bg-faded navbar-toggleable-md mb-4">
      <div className="navbar-brand">
        Preview
      </div>

      <div className="collapse navbar-collapse" id="preview-navbar-collapse-1">
        <ul className="nav navbar-nav mr-auto">
          {this.renderNavigationItems()}
        </ul>
      </div>
    </nav>
  );
}

export default withDataContext(PreviewNavigationBar);
