import { Page } from './DataContext';
import { EditingNavigationItem } from './EditingNavigationItemContext';
import NavigationItemStore from './NavigationItemStore';
import { NavigationItem } from './NavigationItem';

export type ErrorSubscriber<ErrorType = Error> = (error: ErrorType) => void;

export interface CadmusNavbarAdminClient<ErrorType = Error> {
  addErrorSubscriber(errorSubscriber: ErrorSubscriber<ErrorType>): void;
  fetchNavigationItems(): Promise<NavigationItem[]>;
  fetchPages(): Promise<Page[]>;
  deleteNavigationItem(navigationItem: NavigationItem): Promise<void>;
  saveNavigationItem(navigationItem: EditingNavigationItem): Promise<NavigationItem>;
  sortNavigationItems(newNavigationItems: NavigationItemStore): Promise<void>;

  requestsInProgress: {
    savingNavigationItem: boolean;
    deletingNavigationItem: boolean;
    loadingNavigationItems: boolean;
    loadingPages: boolean;
    sortingNavigationItems: boolean;
  };
}
