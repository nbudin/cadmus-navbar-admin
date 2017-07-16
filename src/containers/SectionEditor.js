import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeEditingNavigationItem } from '../actions';
import SectionForm from '../components/SectionForm';
import { NavigationItemPropType } from '../propTypes';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onTitleChanged: (newTitle) => {
    dispatch(changeEditingNavigationItem({ title: newTitle }));
  },
});

const SectionEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SectionForm);

SectionEditor.propTypes = {
  navigationItem: NavigationItemPropType.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SectionEditor;
