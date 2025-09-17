
export interface ISelectAllProps {
    checkedType: ISelectAllCheckedType;
    onChange: (type: ISelectAllCheckedType) => void;
}

export type ISelectAllCheckedType = 'OnlyThisPage' | 'AllPages' | false;