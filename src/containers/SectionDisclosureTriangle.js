import { connect } from 'react-redux';
import { toggleSectionExpanded } from '../actions';
import DisclosureTriangle from '../components/DisclosureTriangle';

const mapStateToProps = (state, ownProps) => {
  const navigationSection = state.navigationItems.get(ownProps.navigationItemId);

  return {
    expanded: navigationSection.expanded,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(toggleSectionExpanded(ownProps.navigationItemId));
  },
});

const SectionDisclosureTriangle = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DisclosureTriangle);

export default SectionDisclosureTriangle;
