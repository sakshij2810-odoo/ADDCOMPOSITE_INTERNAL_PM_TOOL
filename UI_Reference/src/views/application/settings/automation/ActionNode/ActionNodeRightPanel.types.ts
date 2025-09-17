import { IWorkFlowAction } from 'src/redux/child-reducers/settings/automation/automation.types';

export interface IActionNodeRightPanelProps {
  open: boolean;
  nodeData: IWorkFlowAction;
  onClose: () => void;
}
