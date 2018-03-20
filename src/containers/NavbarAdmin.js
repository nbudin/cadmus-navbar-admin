import { connect } from 'react-redux';
import { fetchNavigationItems, fetchPages } from '../actions';
import NavbarAdminForm from '../components/NavbarAdminForm';

const mapStateToProps = (state) => {
  const {
    navigationItems,
    isLoadingNavigationItems,
    isLoadingPages,
    error,
    editingNavigationItem,
  } = state;

  return {
    navigationItems,
    isLoadingNavigationItems,
    isLoadingPages,
    error,
    editingNavigationItem,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchNavigationItems: () => {
    dispatch(fetchNavigationItems(ownProps.client));
  },

  fetchPages: () => {
    dispatch(fetchPages(ownProps.client));
  },
});

const NavbarAdmin = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavbarAdminForm);

export default NavbarAdmin;
