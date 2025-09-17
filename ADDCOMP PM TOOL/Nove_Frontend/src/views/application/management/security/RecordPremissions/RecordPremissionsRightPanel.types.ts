import { ISecurityGroup } from "src/redux";

export interface IRecordPremissionsRightPanelProps {
  open: boolean;
  module: ISecurityGroup;
  onClose: () => void;
  onSave: (updatedModule: ISecurityGroup) => void;
}
