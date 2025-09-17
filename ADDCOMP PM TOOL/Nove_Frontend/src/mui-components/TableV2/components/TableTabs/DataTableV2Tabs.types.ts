export interface IDataTableV2TabsProps {
  tabs: IDataTableV2Tab[];
  selectedTab: any;
  onTabChange?: (newSelectedTab: any) => void;
}

export interface IDataTableV2Tab {
  label: string;
   value: any;
  count: number;
  variant: DataTableV2TabsVariant;
}

export type DataTableV2TabsVariant =
  | "primary"
  | "warning"
  | "secondary"
  | "success"
  | "error"
  | "grey"
  | "default";
