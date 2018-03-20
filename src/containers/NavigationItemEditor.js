import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { commitEditingNavigationItem, cancelEditingNavigationItem } from '../actions';
import NavigationItemEditorModal from '../components/NavigationItemEditorModal';

const mapStateToProps = state => ({
  navigationItem: state.editingNavigationItem,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSave: () => {
    dispatch(commitEditingNavigationItem(ownProps.client));
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
  client: PropTypes.shape({}).isRequired,
};

export default NavigationItemEditor;
