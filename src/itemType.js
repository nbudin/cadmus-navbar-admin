function itemType(item) {
  if (item == null) {
    return null;
  }

  if (item.type === 'link' || item.page_id || item.navigation_section_id) {
    return 'Link';
  }
  return 'Section';
}

export default itemType;
