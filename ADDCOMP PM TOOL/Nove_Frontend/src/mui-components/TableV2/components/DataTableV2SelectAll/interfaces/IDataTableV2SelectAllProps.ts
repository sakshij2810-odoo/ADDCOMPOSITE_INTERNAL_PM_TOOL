
export interface IDataTableV2SelectAllProps {
    checkedType: IDataTableV2SelectAllCheckedType;
    onChange: (type: IDataTableV2SelectAllCheckedType) => void;
}

export type IDataTableV2SelectAllCheckedType = 'OnlyThisPage' | 'AllPages' | false;