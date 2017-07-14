import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

export const NavigationItemPropType = PropTypes.shape({
  id: PropTypes.number,
  page_id: PropTypes.number,
  navigation_section_id: PropTypes.number,
  expanded: PropTypes.bool,
  editing: PropTypes.bool,
});

export const NavigationItemStorePropType = PropTypes.shape({
  navigationItems: ImmutablePropTypes.mapOf(
    NavigationItemPropType.isRequired,
    PropTypes.number.isRequired,
  ).isRequired,
});
