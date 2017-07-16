import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { commitEditingNavigationItem, cancelEditingNavigationItem } from '../actions';
import NavigationItemEditorModal from '../components/NavigationItemEditorModal';

const mapStateToProps = state => ({
  navigationItem: state.editingNavigationItem,
  isCommittingEditingNavigationItem: state.requestsInProgress.committingEditingNavigationItem,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSave: () => {
    dispatch(commitEditingNavigationItem(ownProps.baseUrl));
  },

  onCancel: () => {
    dispatch(cancelEditingNavigationItem());
  },
});

const NavigationItemEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationItemEditorModal);

NavigationItemEditor.propTypes = {
  baseUrl: PropTypes.string.isRequired,
};

export default NavigationItemEditor;
