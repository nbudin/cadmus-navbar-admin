import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addSection } from '../actions';
import AddButton from '../components/AddButton';

const mapStateToProps = (_state, _ownProps) => ({ caption: 'Add section' });

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(addSection());
  },
});

const AddSectionButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddButton);

export default AddSectionButton;
