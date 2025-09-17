import { IAutomationApiEndpoint } from 'src/redux/child-reducers/settings/automation/automation.types';

export interface IEndPointDialogProps {
  open: boolean;
  data: IAutomationApiEndpoint;
  isUpdate: boolean;
  onSave: (updatedData: IAutomationApiEndpoint) => void;
  onClose: () => void;
}
