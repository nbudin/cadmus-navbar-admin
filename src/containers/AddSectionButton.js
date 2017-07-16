import { connect } from 'react-redux';
import { addSection } from '../actions';
import AddButton from '../components/AddButton';

const mapStateToProps = () => ({ caption: 'Add section' });

const mapDispatchToProps = dispatch => ({
  onClick: () => {
    dispatch(addSection());
  },
});

const AddSectionButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddButton);

export default AddSectionButton;
