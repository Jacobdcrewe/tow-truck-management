export interface ISidebarItemModel {
  icon: JSX.Element;
  selectedIcon: JSX.Element;
  text: string;
  href?: string;
  needsLogin: boolean;
}
