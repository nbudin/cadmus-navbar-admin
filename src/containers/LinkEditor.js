import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeEditingNavigationItem } from '../actions';
import LinkForm from '../components/LinkForm';
import { NavigationItemPropType } from '../propTypes';

const mapStateToProps = (state, _ownProps) => ({ pages: state.pages });

const mapDispatchToProps = (dispatch, ownProps) => ({
  onPageChanged: (newPage) => {
    dispatch(changeEditingNavigationItem({ page_id: newPage ? newPage.id : null }));
  },

  onTitleChanged: (newTitle) => {
    dispatch(changeEditingNavigationItem({ title: newTitle }));
  },
});

const LinkEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LinkForm);

LinkEditor.propTypes = {
  navigationItem: NavigationItemPropType.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default LinkEditor;
