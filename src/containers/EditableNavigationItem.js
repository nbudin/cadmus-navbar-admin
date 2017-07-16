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

const mapStateToProps = state => ({
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
    const myItem = ownProps.navigationItem;
    const sameSection = (movedItem.navigation_section_id === myItem.navigation_section_id);
    const movingDown = (sameSection && movedItem.position < myItem.position);

    let newNavigationItems;
    if (movingDown) {
      newNavigationItems = navigationItems.reposition(
        movedItem.id,
        myItem.navigation_section_id,
        myItem.position + 1,
      );
    } else {
      newNavigationItems = navigationItems.reposition(
        movedItem.id,
        myItem.navigation_section_id,
        myItem.position,
      );
    }

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
