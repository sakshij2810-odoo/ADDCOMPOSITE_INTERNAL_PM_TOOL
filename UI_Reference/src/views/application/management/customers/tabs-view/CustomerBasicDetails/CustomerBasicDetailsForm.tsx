import { Checkbox, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useEffect } from 'react'
import { DashboardContent } from 'src/layouts/dashboard'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { clearSingleCustomerStateSync, fetchSingleCustomerWithArgsAsync, IStoreState, upsertSingleCustomerWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux'
import { LoadingButton } from '@mui/lab'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { useParams, useRouter } from 'src/routes/hooks'
import { ILoadState } from 'src/redux/store.enums'
import { AdditionalFamilyInformationView } from './components'
import { CustomerPersonalHistoryView } from './components/CustomerPersonalHistory'
import { CustomerRelativeInformationView } from './components/CustomerRelativeInformation'
import { CustomerMembershipOrAssociationView } from './components/CustomerMembershipOrAssociation'
import { WorkHistoryProfileTable } from 'src/mui-components/WorkHistoryProfile/WorkHistoryProfileTable'
import { EducationProfileTable } from 'src/mui-components/EducationProfile/EducationProfileTable'
import { TravelHistoryProfileTable } from 'src/mui-components/TravelHistoryProfile/TravelHistoryProfileTable'
import { CUSTOMER_STATUS_IN_COUNTRY_LIST } from 'src/redux/child-reducers/customers/customers.constants'
import { ListItemIcon } from '@mui/material'
import { AdjustOutlined, Circle } from '@mui/icons-material'
import { useCustomerContext } from '../../provider'
import { UserBranchAutoSearch } from '../../../user-profiles'
import { isValidEmail } from 'src/views/application/leads/private-leads/ManageSinglePrivateLead'


export const CustomerBasicDetailsForm = () => {
    const { customerInfo, onSaveSuccess } = useCustomerContext();
    const dispatch = useAppDispatch()

    const {
        values,
        errors,
        isSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit,
        setSubmitting
    } = useFormik({
        initialValues: customerInfo,
        validate: values => {
            let errors: any = {}
            if (!values.customer_first_name) {
                errors.customer_first_name = "*This is required field"
            }
            if (!values.customer_last_name) {
                errors.customer_last_name = "*This is required field"
            }

            if (!values.customer_email) {
                errors.customer_email = "*This is required field"
            } else if (isValidEmail(values.customer_email) === false) {
                errors.customer_email = "*Invalid email address."
            }
            if (!values.customer_dob) {
                errors.customer_dob = "*This is required field"
            }

            // if (!values.applicant_sex) {
            //     errors.applicant_sex = "*This is required field"
            // }
            // if (!values.marital_status) {
            //     errors.marital_status = "*This is required field"
            // }
            // if (!values.contact_number) {
            //     errors.contact_number = "*This is required field"
            // }
            // if (!values.email) {
            //     errors.email = "*This is required field"
            // }
            // if (values.marital_status === "MARRIED") {
            //     if (!values.spouse_name) {
            //         errors.spouse_name = "*This is required field"
            //     }
            //     if (!values.spouse_date_of_birth) {
            //         errors.spouse_date_of_birth = "*This is required field"
            //     }
            //     if (!values.spouse_sex) {
            //         errors.spouse_sex = "*This is required field"
            //     }
            // }
            return errors
        },
        onSubmit: values => {
            // alert(JSON.stringify(values, null, 2));
            setSubmitting(true)
            dispatch(upsertSingleCustomerWithCallbackAsync({
                payload: values, onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        onSaveSuccess(data)
                    }
                },
            })).finally(() => setSubmitting(false))
        },
    });


    useEffect(() => {
        setValues(customerInfo)
    }, [customerInfo])




    return (
        <DashboardContent metaTitle='Customer Information' disablePadding >
            <form onSubmit={handleSubmit}>
                {/* // 1. General Information */}
                <MuiStandardCard title='General Information' divider>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_first_name" label="Customer First Name" value={values.customer_first_name}
                                onChange={handleChange} error={errors.customer_first_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_last_name" label="Customer Last Name" value={values.customer_last_name}
                                onChange={handleChange} error={errors.customer_last_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_email" label="Customer Email" value={values.customer_email}
                                onChange={handleChange} error={errors.customer_email}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiPhoneNumberField
                                name="customer_phone_number" label="Contact Number"
                                value={values.customer_phone_number} onChange={handleChange} error={errors.customer_phone_number}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePickerV2
                                label="Customer DOB"
                                value={values.customer_dob}
                                onChange={(value) => setFieldValue("customer_dob", value)} error={errors.customer_dob}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_place_of_birth" label="Place of birth"
                                value={values.customer_place_of_birth} onChange={handleChange} error={errors.customer_phone_number}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="customer_country_of_birth" label="Country of birth"
                                value={values.customer_country_of_birth} onChange={(evt, newCountry) => setFieldValue("customer_country_of_birth", newCountry)}
                                error={errors.customer_country_of_birth}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="subtitle2">Customer Sex</Typography>
                            <MuiFormFields.MuiRadioGroup
                                row
                                name="customer_sex"
                                options={[
                                    { label: "Male", value: "MALE" },
                                    { label: "Female", value: "FEMALE" },
                                    { label: "Unknown", value: "OTHERS" },
                                ]}
                                value={values.customer_sex}
                                onChange={handleChange}
                                error={errors.customer_sex}
                                sx={{ pl: "2px" }}
                            />
                        </Grid>



                        <Grid item xs={12} md={12} lg={12} ><Typography variant="h6" >{"Address Details"}</Typography></Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_address_line1" label="Address Line 1"
                                value={values.customer_address_line1} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_address_line2" label="Address Line 2"
                                value={values.customer_address_line2} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_address_landmark" label="Landmark"
                                value={values.customer_address_landmark} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_address_city" label="City"
                                value={values.customer_address_city} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_address_state_or_province" label="State/Province"
                                value={values.customer_address_state_or_province} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_address_country" label="Country"
                                value={values.customer_address_country} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_address_postal_code" label="Postal Code"
                                value={values.customer_address_postal_code} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} ><Typography variant="h6" >{"Citizenship Details"}</Typography></Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="citizenship" label="Citizenship"
                                value={values.citizenship}
                                onChange={(evt, newCountry) => setFieldValue("citizenship", newCountry)}
                                error={errors.citizenship}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="current_country_of_residence" label="Current Country of residence"
                                value={values.current_country_of_residence}
                                onChange={(evt, newCountry) => setFieldValue("current_country_of_residence", newCountry)}
                                error={errors.current_country_of_residence}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="status_in_country"
                                label="Status in Country"
                                options={CUSTOMER_STATUS_IN_COUNTRY_LIST}
                                value={values.status_in_country} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="residency_expiry_date" label="Expiry Date"
                                value={values.residency_expiry_date} onChange={(value) => setFieldValue("residency_expiry_date", value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="previous_country_of_residence" label="Previous Country of residence"
                                value={values.previous_country_of_residence}
                                onChange={(evt, newCountry) => setFieldValue("previous_country_of_residence", newCountry)}
                                error={errors.previous_country_of_residence}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} ><Typography variant="h6" >{"Other Details"}</Typography></Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiNumberField
                                name="height" label="Height"
                                value={values.height} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="color_of_eyes" label="Color of Eyes"
                                value={values.color_of_eyes} onChange={handleChange}
                            />
                        </Grid>
                        {/* <Grid item xs={12} md={12}>
                            <Typography variant="subtitle2">Marital Status</Typography>
                            <MuiFormFields.MuiRadioGroup
                                row
                                // label='Marital Status'
                                name="marital_status"
                                options={[
                                    { label: "Annulled Marriage", value: "ANNULLED MARRIAGE" },
                                    { label: "Common-Law", value: "COMMON_LAW" },
                                    { label: "Divorced / Separated", value: "DIVORCED_OR_SEPARATED" },
                                    { label: "Legally / Separated", value: "LEGALLY_SEPARATED" },
                                    { label: "Married", value: "MARRIED" },
                                    { label: "Never Married / Single", value: "NEVER_MARRIED_OR_SINGLE" },
                                    { label: "Widowed", value: "WIDOWED" },
                                ]}
                                value={values.marital_status}
                                onChange={handleChange}
                                error={errors.marital_status}
                            />
                        </Grid> */}
                        <Grid item xs={12} md={3} lg={3}>
                            <UserBranchAutoSearch
                                label="Customer Branch"
                                error={errors.branch_uuid}
                                value={{
                                    branch_uuid: values.branch_uuid,
                                    branch_name: values.branch_name,
                                }}
                                onSelect={(value) => {
                                    setValues({
                                        ...values,
                                        branch_uuid: value.branch_uuid as string,
                                        branch_name: value.branch_name as string,
                                    });
                                }}
                            />
                        </Grid>
                    </Grid>
                </MuiStandardCard>

                {/* // 2. Passport Details */}
                <MuiStandardCard title='Passport Details' divider sx={{ mt: 2 }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="passport_details.passport_number" label="Passport Number" value={values.passport_details.passport_number}
                                onChange={handleChange} error={errors.passport_details?.passport_number}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="passport_details.country_of_issue" label="Country of Issue"
                                value={values.passport_details.country_of_issue}
                                onChange={(evt, newCountry) => setFieldValue("passport_details.country_of_issue", newCountry)}
                                error={errors.passport_details?.country_of_issue}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="passport_details.issue_date" label="Issue Date"
                                value={values.passport_details.issue_date} onChange={(value) => setFieldValue("passport_details.issue_date", value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="passport_details.expiry_date" label="Expiry Date"
                                value={values.passport_details.expiry_date} onChange={(value) => setFieldValue("passport_details.expiry_date", value)}
                            />
                        </Grid>
                    </Grid>
                </MuiStandardCard>
                <MuiStandardCard title='Canadian Visa Validity' divider sx={{ mt: 2 }} >
                    <Grid container spacing={2}>

                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="passport_details.valid_in_canada_from" label="From"
                                value={values.passport_details.valid_in_canada_from} onChange={(value) => setFieldValue("passport_details.valid_in_canada_from", value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="passport_details.valid_in_canada_to" label="To"
                                value={values.passport_details.valid_in_canada_to} onChange={(value) => setFieldValue("passport_details.valid_in_canada_to", value)}
                            />
                        </Grid>
                    </Grid>
                </MuiStandardCard>

                {/* // 3. National ID */}
                <MuiStandardCard title='National ID Details' divider sx={{ mt: 2 }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="national_identity_details.national_identity_document" label="Identity Document"
                                value={values.national_identity_details.national_identity_document}
                                onChange={handleChange} error={errors.national_identity_details?.national_identity_document}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="national_identity_details.country_of_issue" label="Country of Issue"
                                value={values.national_identity_details.country_of_issue}
                                onChange={(evt, newCountry) => setFieldValue("national_identity_details.country_of_issue", newCountry)}
                                error={errors.national_identity_details?.country_of_issue}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="national_identity_details.issue_date" label="Issue Date"
                                value={values.national_identity_details.issue_date} onChange={(value) => setFieldValue("national_identity_details.issue_date", value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="national_identity_details.expiry_date" label="Expiry Date"
                                value={values.national_identity_details.expiry_date} onChange={(value) => setFieldValue("national_identity_details.expiry_date", value)}
                            />
                        </Grid>
                    </Grid>
                </MuiStandardCard>

                {/* // 4. Marriage Information */}
                <MuiStandardCard title='Marriage Information' divider sx={{ mt: 2 }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="subtitle2">Marital Status</Typography>
                            <MuiFormFields.MuiRadioGroup
                                row
                                // label='Marital Status'
                                name="marriage_information.current_status"
                                options={[
                                    { label: "Annulled Marriage", value: "ANNULLED MARRIAGE" },
                                    { label: "Common-Law", value: "COMMON_LAW" },
                                    { label: "Divorced / Separated", value: "DIVORCED_OR_SEPARATED" },
                                    { label: "Legally / Separated", value: "LEGALLY_SEPARATED" },
                                    { label: "Married", value: "MARRIED" },
                                    { label: "Never Married / Single", value: "NEVER_MARRIED_OR_SINGLE" },
                                    { label: "Widowed", value: "WIDOWED" },
                                ]}
                                value={values.marriage_information.current_status}
                                onChange={handleChange}
                                error={errors.marriage_information?.current_status}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="marriage_information.date_of_marriage" label="Date of Marriage (If Married)"
                                value={values.marriage_information.date_of_marriage} onChange={(value) => setFieldValue("marriage_information.issue_date", value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={12} lg={12}> <Typography variant='subtitle2' mb={1}>Have you been previously married?</Typography></Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="marriage_information.previously_married"
                                options={[
                                    { label: "Yes", value: "YES" },
                                    { label: "No", value: "NO" },
                                ]}
                                value={values.marriage_information.previously_married}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker disabled={values.marriage_information.previously_married !== "YES"}
                                name="marriage_information.date_of_previous_marriage" label="Date of Previous Marriage"
                                value={values.marriage_information.date_of_previous_marriage} onChange={(value) => setFieldValue("marriage_information.date_of_previous_marriage", value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                label='Any Child from Previous Marriage?'
                                name="marriage_information.any_children_from_previous_marriage"
                                options={[
                                    { label: "Yes", value: "YES" },
                                    { label: "No", value: "NO" },
                                ]}
                                value={values.marriage_information.any_children_from_previous_marriage}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={12} lg={12}> <Typography variant='subtitle2' mb={1}>Divorce Information</Typography></Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="marriage_information.date_of_divoced" label="Date of Divoce"
                                value={values.marriage_information.date_of_divoced} onChange={(value) => setFieldValue("marriage_information.date_of_divoced", value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="marriage_information.date_of_separation" label="Date of Separation"
                                value={values.marriage_information.date_of_separation} onChange={(value) => setFieldValue("marriage_information.date_of_separation", value)}
                            />
                        </Grid>
                    </Grid>
                </MuiStandardCard>

                {/* // 9. Additional Family Information */}
                <AdditionalFamilyInformationView
                    title="Additional Family Information"
                    data={values.additional_family_information}
                    onChange={(family_his) => setFieldValue("additional_family_information", family_his)}
                />

                {/* // 5. Education Information */}
                <EducationProfileTable
                    title="Education Deatils"
                    data={values.educational_details || []}
                    onChange={(edu) => setFieldValue("educational_details", edu)}
                />
                {/* // 6. Work Information */}
                <WorkHistoryProfileTable
                    title="Work History"
                    hasWWorkExperience={true}
                    data={values.work_history_details || []}
                    onChange={(work_his) => setFieldValue("work_history_details", work_his)}
                />

                {/* // 7. Travel History in Canada */}
                <TravelHistoryProfileTable
                    module='CUSTOMER'
                    title="Travel History"
                    data={values.travel_history_in_canada || []}
                    onChange={(trvel_his) => setFieldValue("travel_history_in_canada", trvel_his)}
                />

                {/* // 8. Language Proficiency */}
                <MuiStandardCard title='Language Proficiency' divider sx={{ mt: 2 }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiLaunguageAutocomplete
                                name="native_language" label="Native Language"
                                value={values.native_language}
                                onSelect={(value) => setFieldValue("native_language", value)} error={errors.native_language}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiNumberField
                                name="ilets_overall_score" label="Ilets Overall Score"
                                value={values.ilets_overall_score}
                                onChange={handleChange} error={errors.ilets_overall_score}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} />
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiNumberField
                                name="ilets_reading" label="Reading"
                                value={values.ilets_reading}
                                onChange={handleChange} error={errors.ilets_reading}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiNumberField
                                name="ilets_listening" label="Listening"
                                value={values.ilets_listening}
                                onChange={handleChange} error={errors.ilets_listening}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiNumberField
                                name="ilets_speaking" label="Speaking"
                                value={values.ilets_speaking}
                                onChange={handleChange} error={errors.ilets_speaking}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiNumberField
                                name="ilets_writing" label="Writing"
                                value={values.ilets_writing}
                                onChange={handleChange} error={errors.ilets_writing}
                            />
                        </Grid>

                    </Grid>
                </MuiStandardCard>



                {/* // 10. Customer Father Personal Details */}
                <MuiStandardCard title="Personal Details of Customer's Father" divider sx={{ mt: 2 }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_father_details.first_name" label="First Name"
                                value={values.customer_father_details.first_name}
                                onChange={handleChange} error={errors.customer_father_details?.first_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_father_details.last_name" label="Last Name"
                                value={values.customer_father_details.last_name}
                                onChange={handleChange} error={errors.customer_father_details?.last_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} />
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePickerV2
                                label="Father DOB"
                                value={values.customer_father_details.dob} onChange={(value) => setFieldValue("customer_father_details.dob", value)} error={errors.customer_father_details?.dob}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_father_details.place_of_birth" label="Place of birth"
                                value={values.customer_father_details.place_of_birth}
                                onChange={handleChange} error={errors.customer_father_details?.place_of_birth}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="customer_father_details.country_of_birth" label="Country of birth"
                                value={values.customer_father_details.country_of_birth}
                                onChange={(evt, newCountry) => setFieldValue("customer_father_details.country_of_birth", newCountry)}
                                error={errors.customer_father_details?.country_of_birth}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="customer_father_details.date_of_death" label="Date of Death (if deceased)"
                                value={values.customer_father_details.date_of_death}
                                onChange={(value) => setFieldValue("customer_father_details.date_of_death", value)}
                                error={errors.customer_father_details?.date_of_death}
                            />
                        </Grid>

                    </Grid>
                </MuiStandardCard>

                {/* // 12. Customer Mother Personal Details */}
                <MuiStandardCard title="Personal Details of Customer's Mother" divider sx={{ mt: 2 }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_mother_details.first_name" label="First Name"
                                value={values.customer_mother_details.first_name}
                                onChange={handleChange} error={errors.customer_mother_details?.first_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_mother_details.last_name" label="Last Name"
                                value={values.customer_mother_details.last_name}
                                onChange={handleChange} error={errors.customer_mother_details?.last_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} />
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePickerV2
                                label="Mother DOB"
                                value={values.customer_mother_details.dob} onChange={(value) => setFieldValue("customer_mother_details.dob", value)} error={errors.customer_mother_details?.dob}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="customer_mother_details.place_of_birth" label="Place of birth"
                                value={values.customer_mother_details.place_of_birth}
                                onChange={handleChange} error={errors.customer_mother_details?.place_of_birth}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="customer_mother_details.country_of_birth" label="Country of birth"
                                value={values.customer_mother_details.country_of_birth}
                                onChange={(evt, newCountry) => setFieldValue("customer_mother_details.country_of_birth", newCountry)}
                                error={errors.customer_mother_details?.country_of_birth}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="customer_mother_details.date_of_death" label="Date of Death (if deceased)"
                                value={values.customer_mother_details.date_of_death}
                                onChange={(value) => setFieldValue("customer_mother_details.date_of_death", value)}
                                error={errors.customer_mother_details?.date_of_death}
                            />
                        </Grid>

                    </Grid>
                </MuiStandardCard>

                {/* // 13. Customer Personal History (Details of past 10 years. NO GAPS PLEASE: If you were travelling even for 1 day to another country include that too. If you were studying, then write studying. If you were unemployed then write unemployed.) */}
                <CustomerPersonalHistoryView
                    title="Customer Personal History"
                    data={values.customer_personal_history}
                    onChange={(personal_his) => setFieldValue("customer_personal_history", personal_his)}
                />
                {/* // 14. Customer membership or association with organization */}
                <MuiStandardCard title="Customer membership or association with organization" divider sx={{ mt: 2 }} >
                    <List dense sx={{ pb: 2 }}>
                        {["Government positions.", "Military Service"].map((item, index) => (
                            <ListItem key={index} sx={{ py: 0, pl: 0 }}>
                                <ListItemIcon >
                                    <AdjustOutlined fontSize='small' color='disabled' />
                                </ListItemIcon>
                                <ListItemText secondary primary={item} />
                            </ListItem>
                        ))}
                    </List>
                    <MuiFormFields.MuiCountryAutoComplete sx={{ maxWidth: 200 }}
                        name="membership_or_association.country_name" label="Country"
                        value={values.membership_or_association?.country_name} onChange={(evt, newCountry) => setFieldValue("membership_or_association.country_name", newCountry)}
                        error={errors.membership_or_association?.country_name}
                    />
                    <CustomerMembershipOrAssociationView
                        title="membership"
                        data={values.membership_or_association?.membership || []}
                        onChange={(personal_his) => setFieldValue("membership_or_association.membership", personal_his)}
                    />
                </MuiStandardCard>

                {/* // 16. Customer Relative Details */}
                <MuiStandardCard title="Relative Information" divider sx={{ mt: 2 }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant='subtitle1'>Do you have any relative in Canada?</Typography>
                            <Typography variant='subtitle2' color={"GrayText"} mb={1}>If yes then provide relationship details and status of the relative in Canada and location.</Typography>
                            <MuiFormFields.MuiSelect
                                sx={{ maxWidth: 200 }}
                                name="relative_in_canada"
                                options={[
                                    { label: "Yes", value: "YES" },
                                    { label: "No", value: "NO" },
                                ]}
                                value={values.relative_in_canada}
                                onChange={handleChange}
                            />
                        </Grid>


                    </Grid>
                    {values.relative_in_canada === "YES" &&
                        <CustomerRelativeInformationView
                            title="Relative Details and status"
                            data={values.relative_details_and_status}
                            onChange={(personal_his) => setFieldValue("relative_details_and_status", personal_his)}
                        />}
                </MuiStandardCard>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton type="submit" variant="contained"
                        loading={isSubmitting}
                    >
                        {'Save changes'}
                    </LoadingButton>
                </Stack>
            </form>

        </DashboardContent>
    )
}