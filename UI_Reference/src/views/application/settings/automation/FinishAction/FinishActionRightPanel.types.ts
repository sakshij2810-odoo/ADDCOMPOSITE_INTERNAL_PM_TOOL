import { IWorkflowFinishEmail } from 'src/redux/child-reducers/settings/automation/automation.types';

export interface IWorkflowFinishActionProps {
  open: boolean;
  nodeData: IWorkflowFinishEmail;
  onClose: () => void;
}
