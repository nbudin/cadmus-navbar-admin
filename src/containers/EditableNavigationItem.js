import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  deleteNavigationItem,
  editNavigationItem,
  sortNavigationItems,
  toggleSectionExpanded,
} from '../actions';
import NavigationItem from '../components/NavigationItem';
import { NavigationItemPropType } from '../propTypes';

const mapStateToProps = (state, ownProps) => ({
  navigationItems: state.navigationItems,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDelete: () => {
    dispatch(deleteNavigationItem(ownProps.baseUrl, ownProps.navigationItem));
  },

  onEdit: () => {
    dispatch(editNavigationItem(ownProps.navigationItem));
  },

  onExpand: () => {
    dispatch(toggleSectionExpanded(ownProps.navigationItem.id));
  },

  onMoveNavigationItemInto: (movedItem, navigationItems) => {
    const newNavigationItems = navigationItems.reposition(
        movedItem.id,
        ownProps.navigationItem.id,
        1,
      );

    dispatch(sortNavigationItems(ownProps.baseUrl, newNavigationItems));
  },

  onMoveNavigationItemOnto: (movedItem, navigationItems) => {
    const newNavigationItems = navigationItems.reposition(
        movedItem.id,
        ownProps.navigationItem.navigation_section_id,
        ownProps.navigationItem.position,
      );

    dispatch(sortNavigationItems(ownProps.baseUrl, newNavigationItems));
  },
});

const EditableNavigationItem = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationItem);

EditableNavigationItem.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  navigationItem: NavigationItemPropType.isRequired,
};

export default EditableNavigationItem;
