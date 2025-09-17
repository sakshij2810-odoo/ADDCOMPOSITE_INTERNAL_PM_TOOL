import { ICreateWorkflow } from 'src/redux/child-reducers/settings/automation/automation.types';

export interface IWorkFlowRightPanelProps {
  open: boolean;
  nodeData: ICreateWorkflow;
  onClose: () => void;
  onConfirm: (code: string) => void;
}
