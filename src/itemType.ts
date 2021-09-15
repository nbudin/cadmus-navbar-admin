import { NavigationItem } from './NavigationItem';

function itemType(
  item?: Pick<NavigationItem, 'page_id' | 'navigation_section_id'>,
): string | undefined {
  if (item == null) {
    return undefined;
  }

  if (item.page_id != null) {
    return 'Link';
  }
  return 'Section';
}

export default itemType;
