import { combineReducers } from 'redux';
import csrfToken from './csrfToken';
import editingNavigationItem from './editingNavigationItem';
import error from './error';
import navigationItems from './navigationItems';
import pages from './pages';
import requestsInProgress from './requestsInProgress';

export default combineReducers({
  csrfToken,
  editingNavigationItem,
  error,
  navigationItems,
  pages,
  requestsInProgress,
});
