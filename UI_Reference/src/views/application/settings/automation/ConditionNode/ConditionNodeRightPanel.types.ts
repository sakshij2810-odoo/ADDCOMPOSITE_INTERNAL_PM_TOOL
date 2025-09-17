import { IWorkFlowCondition } from 'src/redux/child-reducers/settings/automation/automation.types';

export interface IConditionNodeRightPanelProps {
  open: boolean;
  nodeData: IWorkFlowCondition;
  onClose: () => void;
}
