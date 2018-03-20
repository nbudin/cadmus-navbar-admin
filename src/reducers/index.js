import { combineReducers } from 'redux';
import editingNavigationItem from './editingNavigationItem';
import error from './error';
import navigationItems from './navigationItems';
import pages from './pages';

export default combineReducers({
  editingNavigationItem,
  error,
  navigationItems,
  pages,
});
