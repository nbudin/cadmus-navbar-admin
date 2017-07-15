import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { commitEditingNavigationItem, cancelEditingNavigationItem } from '../actions';
import NavigationItemEditorModal from '../components/NavigationItemEditorModal';

const mapStateToProps = (state, _ownProps) => ({
  navigationItem: state.editingNavigationItem,
  isCommittingEditingNavigationItem: state.requestsInProgress.committingEditingNavigationItem,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSave: () => {
    dispatch(commitEditingNavigationItem(ownProps.baseUrl, ownProps.csrfToken));
  },

  onCancel: (newTitle) => {
    dispatch(cancelEditingNavigationItem());
  },
});

const NavigationItemEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationItemEditorModal);

NavigationItemEditor.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  csrfToken: PropTypes.string,
};

NavigationItemEditor.defaultProps = {
  csrfToken: null,
};

export default NavigationItemEditor;
