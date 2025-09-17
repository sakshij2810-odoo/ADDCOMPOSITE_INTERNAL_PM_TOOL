import { Grid, Stack } from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { DashboardContent } from 'src/layouts/dashboard'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { clearSingleQuestionnaireStateSync, clearSingleQuestionOptionStateSync, clearSingleQuestionStateSync, clearSingleServiceStateSync, fetchSingleQuestionnaireWithArgsAsync, fetchSingleQuestionOptionWithArgsAsync, fetchSingleQuestionWithArgsAsync, fetchSingleServiceWithArgsAsync, getServiceSubTypeOptions, IStoreState, LEAD_SERVICES_TYPE_LIST, upsertSingleAnswerWithCallbackAsync, upsertSingleQuestionnaireWithCallbackAsync, upsertSingleQuestionOptionWithCallbackAsync, upsertSingleQuestionWithCallbackAsync, upsertSingleServiceWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux'
import { LoadingButton } from '@mui/lab'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { useParams, useRouter } from 'src/routes/hooks'
import { ILoadState } from 'src/redux/store.enums'
import { main_app_routes } from 'src/routes/paths'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs'
import { ServiceSubTypeAutoSearch, ServiceTypeAutoSearch } from './auto-search'
import { DataTableV2RowRenderType, IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props'
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2'
import { QuestionnaireAutoSearch } from '../document-checklist/auto-search'


const SingleServiceForm: React.FC<{}> = () => {
    const { uuid } = useParams() as { uuid?: string };
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {
        data: singleObjectInfo,
        loading
    } = useAppSelector((storeState: IStoreState) => storeState.management.services.single_service);

    const {
        values,
        errors,
        isSubmitting,
        setSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: singleObjectInfo,
        validate: values => {
            let errors: any = {}
            if (!values.questionnaire_uuid) {
                errors.questionnaire_uuid = "*This is required field"
            }
            if (!values.services_type) {
                errors.services_type = "*This is required field"
            }
            if (!values.services_sub_type) {
                errors.services_sub_type = "*This is required field"
            }
            if (!values.country) {
                errors.country = "*This is required field"
            }
            if (!values.state_or_province) {
                errors.state_or_province = "*This is required field"
            }
            return errors
        },
        onSubmit: values => {
            // alert(JSON.stringify(values, null, 2));
            dispatch(upsertSingleServiceWithCallbackAsync({
                payload: values, onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        router.push(`${main_app_routes.app.documents_and_services}?tab=SERVICES`)
                    }
                },
            })).finally(() => {
                setSubmitting(false)
            })
        },
    });

    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSingleServiceWithArgsAsync(uuid))
    }, [uuid])


    useEffect(() => {
        setValues(singleObjectInfo)
    }, [singleObjectInfo])

    useEffect(() => {
        return () => {
            dispatch(clearSingleServiceStateSync())
        }
    }, [])

    const tasksTableProps: IDataTableV2Props = {
        // isPagination: true,
        // totalRecords: totalCount,
        // rowsPerPageOptions: pagination.rowsPerPage,
        isDataLoading: loading === ILoadState.pending,
        tableCommandBarProps: {
            preDefinedPlugins: {
                // dateFilter: {
                //     state: dateState,
                //     onChange: setDateState,
                // },
                // search: {
                //     state: searchState,
                //     onChange: setSearchState,
                // },
                // columnVisibility: {
                //     columnVisibility: columnsConfig.columnVisibility,
                //     onChange: setColumnVisibility,
                // },
                // refresh: {
                //     onClick: fetchList,
                // },
            },
            leftItems: {
                customPlugins: [



                ],
            },
            rightItems: {
                customPlugins: [],
            },
        },

        masterColumns: [

            {
                key: "title",
                headerName: "Title",
                fieldName: "title",
                enableSorting: true,
                renderType: DataTableV2RowRenderType.TEXT_DARK,
            },
            {
                key: "amount",
                headerName: "Amount",
                fieldName: "amount",
                enableSorting: true,
                renderType: DataTableV2RowRenderType.TEXT_DARK,
            },



        ],
        // tableTabProps: {
        //     selectedTab: tabs.selectedTab,
        //     tabs: tabs.tabs,
        //     onTabChange: (newSelectedTab) => {
        //         setSelectedTab(newSelectedTab);
        //     },
        // },

        rows: singleObjectInfo?.service_details || [],

        // onPageChange: (newPageNumber) => {
        //     setPagination({ ...pagination, pageNumber: newPageNumber });
        // },
        // onRowsPerPageChange: (pageNumber, newRowsPerPage) => {
        //     setPagination({
        //         pageNumber,
        //         rowsPerPage: newRowsPerPage,
        //     });
        // },

    };


    return (
        <DashboardContent metaTitle='Service Form' loading={ILoadState.pending === loading}>

            <CustomBreadcrumbs
                heading={`Service Form`}
                links={[
                    { name: 'Services', href: `${main_app_routes.app.documents_and_services}?tab=SERVICES` },
                    { name: `Service Form` },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <form onSubmit={handleSubmit}>
                <MuiStandardCard title='Service Form' divider>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="country" label="Country"
                                value={values.country}
                                onChange={(evt, newCountry) => {
                                    setValues({
                                        ...values,
                                        country: newCountry,
                                        state_or_province: "",
                                        services_type: "",
                                        services_sub_type: "",
                                        questionnaire_uuid: "",
                                        questionnaire_name: ""
                                    })
                                }}
                                error={errors.country}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiStateAutoComplete
                                label="State" country={values.country}
                                value={values.state_or_province}
                                onSelect={(newValue) => {
                                    setValues({
                                        ...values,
                                        state_or_province: newValue,
                                        services_type: "",
                                        services_sub_type: "",
                                        questionnaire_uuid: "",
                                        questionnaire_name: ""
                                    })
                                }}
                                error={errors.state_or_province}
                            />
                        </Grid>

                        <Grid item xs={12} md={3} lg={3}>
                            {/* <MuiFormFields.MuiSelect
                                name="services_type" label="Service Type"
                                value={values.services_type}
                                disabled={!values.country} error={errors.services_type}
                                options={LEAD_SERVICES_TYPE_LIST}
                                onChange={handleChange}
                            /> */}
                            <ServiceTypeAutoSearch
                                label='Service Type'
                                value={values.services_type}
                                onSelect={(newValue) => {
                                    setValues({
                                        ...values,
                                        services_type: newValue,
                                        services_sub_type: "",
                                        questionnaire_uuid: "",
                                        questionnaire_name: ""
                                    })
                                }}
                                error={errors.services_type}
                            />
                            {/* <MuiFormFields.MuiTextField
                                name="services_type" label="Services Type"
                                value={values.services_type} onChange={handleChange}
                                error={errors.services_type}
                            /> */}
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <ServiceSubTypeAutoSearch
                                label='Service Sub Type' serviceType={values.services_type}
                                disabled={!values.services_type}
                                value={values.services_sub_type}
                                onSelect={(newValue) => {
                                    setValues({
                                        ...values,
                                        services_sub_type: newValue,
                                        questionnaire_uuid: "",
                                        questionnaire_name: ""
                                    })
                                }}
                                error={errors.services_sub_type}
                            />
                            {/* <MuiFormFields.MuiTextField
                                name="services_sub_type" label="Services Sub Type"
                                value={values.services_sub_type} onChange={handleChange}
                                error={errors.services_sub_type}
                            /> */}
                        </Grid>


                        <Grid item xs={12} md={6} lg={6}>
                            <QuestionnaireAutoSearch
                                label="Questionnaire"
                                value={{
                                    questionnaire_uuid: values.questionnaire_uuid,
                                    questionnaire_name: values.questionnaire_name
                                }}
                                onSelect={(value) => setValues({
                                    ...values,
                                    questionnaire_uuid: value.questionnaire_uuid as string,
                                    questionnaire_name: value.questionnaire_name
                                })}
                                error={errors.questionnaire_uuid}
                            />
                        </Grid>

                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="status" label="Status"
                                value={values.status}
                                error={errors.status}
                                options={[
                                    { label: "Active", value: "ACTIVE" },
                                    { label: "In Active", value: "INACTIVE" },
                                ]}
                                onChange={handleChange}
                            />
                        </Grid>


                    </Grid>
                </MuiStandardCard>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton type="submit" variant="contained"
                        loading={isSubmitting}
                    >
                        {'Save changes'}
                    </LoadingButton>
                </Stack>
            </form>

            <MuiStandardCard title='Service Details' divider>
                <DataTableV2 {...tasksTableProps} />
            </MuiStandardCard>
        </DashboardContent>
    )
}

export default SingleServiceForm