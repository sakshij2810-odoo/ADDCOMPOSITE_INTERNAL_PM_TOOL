export interface ITableTabsProps {
  tabs: ITableTab[];
  selectedTab: any;
  onTabChange?: (newSelectedTab: any) => void;
}

export interface ITableTab {
  label: string;
   value: any;
  count: number;
  variant: TableTabsVariant;
}

export type TableTabsVariant =
  | "primary"
  | "warning"
  | "secondary"
  | "success"
  | "error"
  | "grey"
  | "default";
