import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addLink } from '../actions';
import AddButton from '../components/AddButton';

const mapStateToProps = () => ({ caption: 'Add link' });

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(addLink(ownProps.navigationSectionId));
  },
});

const AddLinkButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddButton);

AddLinkButton.propTypes = {
  navigationSectionId: PropTypes.number,
};

export default AddLinkButton;
