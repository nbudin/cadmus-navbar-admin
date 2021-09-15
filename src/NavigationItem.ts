export type NavigationItem = {
  id: string;
  position: number;
  title: string;
  page_id?: string;
  navigation_section_id?: string;
  expanded?: boolean;
  editing?: boolean;
};
