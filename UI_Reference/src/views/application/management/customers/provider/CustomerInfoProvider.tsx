import React, { useEffect, useState } from "react";
import { clearCustomersFullStateSync, clearPrivateLeadsFullStateSync, defaultBranch, defaultCustomer, defaultPrivateLead, fetchSingleBranchWithArgsAsync, fetchSingleCustomerWithArgsAsync, fetchSinglePrivateLeadWithArgsAsync, IBranch, ICustomer, IPrivateLead, IServiceType, IStoreState, useAppDispatch, useAppSelector } from "src/redux";
import { useParams } from "react-router";
import { useRouter } from "src/routes/hooks";
import { useSearchParamsV2 } from "src/routes/hooks/use-search-params";
import { useAuthContext } from "src/auth/hooks";

interface ILeadContext {
    customerInfo: ICustomer;
    branchInfo: IBranch
    onSaveSuccess: (lead: ICustomer) => void;
}

export const CustomerContext = React.createContext<ILeadContext>({
    branchInfo: defaultBranch,
    customerInfo: defaultCustomer,
    onSaveSuccess: () => { }
});

export const useCustomerContext = () => React.useContext(CustomerContext);

export const CustomerInfoProvider: React.FC<{ children: React.ReactNode }> = (
    props
) => {
    const { uuid } = useParams() as { uuid?: string };
    const dispatch = useAppDispatch()
    const { user: { branch_uuid } } = useAuthContext()
    const {
        data: singleCustomerInfo,
        loading
    } = useAppSelector((storeState: IStoreState) => storeState.leads.customers.single_customer);
    const {
        data: singleCustomerBranchInfo,
    } = useAppSelector((storeState: IStoreState) => storeState.dataManagement.branch.single_branch);
    const [currentCustomerInfo, setcurrentCustomerInfo] = useState(defaultCustomer);

    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSingleCustomerWithArgsAsync(uuid))
        dispatch(fetchSingleBranchWithArgsAsync(branch_uuid))
    }, [uuid, branch_uuid])


    useEffect(() => {
        setcurrentCustomerInfo(singleCustomerInfo);
    }, [singleCustomerInfo]);

    useEffect(() => {
        if (!currentCustomerInfo.branch_uuid) return
        dispatch(fetchSingleBranchWithArgsAsync(currentCustomerInfo.branch_uuid))
    }, [currentCustomerInfo.branch_uuid]);

    useEffect(() => {
        return () => {
            dispatch(clearCustomersFullStateSync())
        }
    }, [])


    const handleSaveInfoSuccess = (customer: ICustomer) => {
        setcurrentCustomerInfo(customer);
    }
    console.log("singleCustomerBranchInfoa= ==>", singleCustomerBranchInfo)

    return (
        <CustomerContext.Provider value={{
            branchInfo: singleCustomerBranchInfo,
            customerInfo: currentCustomerInfo,
            onSaveSuccess: handleSaveInfoSuccess
        }}>
            {props.children}
        </CustomerContext.Provider>
    );
};
