

export const endPoints = {
    leads: {
        fetchleads:"/lead/get-leads",
        upsertLead: "/lead/auth-upsert-lead",
    },
    opportunity: {
        createOpportunity: "/lead/create-opportunity",
    },
    insurer: {
        createInsurer: "/insurance/create-insurer-code",
    },
    csioCompany: {
        upsertCSIOCompany: "/insurance/create-csio-company-record"
    },
    subInusrer: {
        upsertSubInsurer: "/insurance/create-insurer-sub",
    },
    policyComission : {
        upsertPolicyComission :  "/insurance/create-policy-commission"
    },
    insurerContacts: {
        upsertInsurerContacts: "/insurance/create-insurer-contacts"
    },
    underWriters: {
        upsertUnderwriters: "/insurance/create-underwriters"
    },
    brokerCodes: {
        createBrokerCode: "/insurance/create-broker-code"
    },
    brokerContacts: {
        createBorkerContact: "/insurance/create-broker-contracts"
    },
    branchOffice: {
        createBranchOffice: "/insurance/create-branch-office"
    },
    interestedParty: {
        createIntrestedParty: "/insurance/create-interested-party"
    },
    additionalIntrest: {
        createAdditionalIntrest: "/insurance/create-additional-interest"
    },
    appForms: {
        editAppForms: "/other/edit-apps-and-forms"
    },
    support: {
        upsertSupport: "/other/create-support-ticket"
    },
    legalPlus: {
        upsertLegal: "/other/upsert-legal-plus"
    }
}