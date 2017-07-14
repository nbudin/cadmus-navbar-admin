import { connect } from 'react-redux';
import { fetchNavigationItems, fetchPages } from '../actions';
import NavbarAdminForm from '../components/NavbarAdminForm';

const mapStateToProps = (state, ownProps) => {
  const { navigationItems, isLoadingNavigationItems, isLoadingPages, error, editingNavigationItem } = state;
  return { navigationItems, isLoadingNavigationItems, isLoadingPages, error, editingNavigationItem };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchNavigationItems: () => {
    dispatch(fetchNavigationItems(ownProps.baseUrl));
  },

  fetchPages: () => {
    dispatch(fetchPages(ownProps.pagesUrl));
  },
});

const NavbarAdmin = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavbarAdminForm);

export default NavbarAdmin;
