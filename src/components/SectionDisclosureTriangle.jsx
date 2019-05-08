import React from 'react';
import PropTypes from 'prop-types';
import { withDataContext } from '../DataContext';

class SectionDisclosureTriangle extends React.Component {
  static propTypes = {
    navigationItemStore: PropTypes.shape({
      get: PropTypes.func.isRequired,
      update: PropTypes.func.isRequired,
    }).isRequired,
    setNavigationItemStore: PropTypes.func.isRequired,
    navigationSectionId: PropTypes.number.isRequired,
  }

  toggleExpanded = () => {
    this.props.setNavigationItemStore(
      this.props.navigationItemStore.update(
        this.props.navigationSectionId,
        section => ({ ...section, expanded: !section.expanded }),
      ),
    );
  }

  render = () => {
    const navigationSection = this.props.navigationItemStore.get(this.props.navigationSectionId);

    let disclosureTriangle;
    if (navigationSection.expanded) {
      disclosureTriangle = '▼';
    } else {
      disclosureTriangle = '►';
    }

    return (
      <span
        onClick={this.toggleExpanded}
        style={{ cursor: 'pointer' }}
        role="button"
        aria-pressed={navigationSection.expanded}
        tabIndex="0"
      >
        {disclosureTriangle}
      </span>
    );
  }
}

export default withDataContext(SectionDisclosureTriangle);
