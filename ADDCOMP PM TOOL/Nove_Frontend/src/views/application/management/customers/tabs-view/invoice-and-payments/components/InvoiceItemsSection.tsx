import { Grid, SelectChangeEvent } from '@mui/material'
import { Box, Typography, Stack, Divider, MenuItem, InputAdornment, inputBaseClasses, Button } from '@mui/material'
import { produce } from 'immer'
import React from 'react'
import { Iconify } from 'src/components/iconify'
import { MuiFormFields } from 'src/mui-components'
import { defaultCustomerInvoiceItem, getServiceSubTypeOptions, ICustomerInvoiceItems, LEAD_SERVICES_TYPE_LIST } from 'src/redux'
import { capitalizeWords } from 'src/utils/format-word'
import { ServiceSubTypeDropdown, ServiceTypeDropdown } from 'src/views/application/management/services'

interface IInvoiceItemsSectionProps {
    invoiceItems: ICustomerInvoiceItems[]
    onChange: (items: ICustomerInvoiceItems[]) => void
}
export const InvoiceItemsSection: React.FC<IInvoiceItemsSectionProps> = ({
    invoiceItems, onChange
}) => {


    const handleChangeInvoiceItemField = (index: number, key: keyof ICustomerInvoiceItems) => (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<unknown>) => {
        const newState = produce(invoiceItems, (draftState) => {
            draftState[index][key as "price"] = evt.target.value as any
        })
        onChange(newState)
    }

    const handleAddNewItemClick = () => {
        onChange([...invoiceItems, defaultCustomerInvoiceItem])
    }

    const handleRemoveItemClick = (index: number) => {
        const newState = produce(invoiceItems, (draftState) => {
            draftState.splice(index, 1)
        })
        onChange(newState)
    }


    const handleInvoiceItemCountryChange = (index: number, values: ICustomerInvoiceItems) => {
        const newState = produce(invoiceItems, (draftState) => {
            draftState[index] = values
        })
        onChange(newState)
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
                Details:
            </Typography>

            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
                {invoiceItems.map((item, index) => (
                    <Stack key={index} alignItems="flex-end" spacing={1.5}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <MuiFormFields.MuiSelect // service + | payment - | 
                                        options={["SERVICE", "PAYMENT", "CORRECTION"].map((option) => ({ label: capitalizeWords(option), value: option }))}
                                        name="transaction_type" label="Transaction Type" value={item.transaction_type}
                                        onChange={handleChangeInvoiceItemField(index, "transaction_type")}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <MuiFormFields.MuiCountryAutoComplete
                                        name="country" label="Country"
                                        value={item.country}
                                        onChange={(evt, newCountry) => {
                                            handleInvoiceItemCountryChange(index, {
                                                ...item,
                                                country: newCountry,
                                                state_or_province: "",
                                                service_type: "",
                                                service_sub_type: "",
                                            })
                                        }}
                                    // error={errors.country}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <MuiFormFields.MuiStateAutoComplete
                                        label="State" country={item.country}
                                        value={item.state_or_province}
                                        onSelect={(newValue) => {
                                            handleInvoiceItemCountryChange(index, {
                                                ...item,
                                                state_or_province: newValue,
                                                service_type: "",
                                                service_sub_type: "",
                                            })
                                        }}
                                    // error={errors.state_or_province}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <ServiceTypeDropdown
                                        name='service_type'
                                        label='Service Type' country={item.country || ''} state={item.state_or_province || ""}
                                        disabled={!item.country || !item.state_or_province}
                                        value={item.service_type} onChange={(evt) => {
                                            handleInvoiceItemCountryChange(index, {
                                                ...item,
                                                service_type: evt.target.value as string,
                                                service_sub_type: "",
                                            })
                                        }}
                                    // error={errors.service_type}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <ServiceSubTypeDropdown
                                        name='service_sub_type'
                                        label='Service Sub Type'
                                        country={item.country as string}
                                        state={item.state_or_province}
                                        serviceType={item.service_type || ''}
                                        disabled={!item.country || !item.state_or_province || !item.service_type}
                                        value={item.service_sub_type}
                                        onChange={(sst) => {
                                            handleInvoiceItemCountryChange(index, {
                                                ...item,
                                                service_sub_type: sst.services_sub_type,
                                            })
                                        }}
                                    // error={errors.service_sub_type}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <MuiFormFields.MuiNumberField
                                        name="tax" label="Tax(%)" value={item.tax}
                                        sx={{ maxWidth: { md: 200 } }}
                                        onChange={handleChangeInvoiceItemField(index, "tax")}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <MuiFormFields.MuiNumberField
                                        name="price" label="Price($)" value={item.price}
                                        onChange={handleChangeInvoiceItemField(index, "price")}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <MuiFormFields.MuiTextField
                                        name="description" label="Description" value={item.description}
                                        onChange={handleChangeInvoiceItemField(index, "description")}
                                    />
                                </Grid>

                            </Grid>





                            {/* <MuiFormFields.MuiSelect
                                name="service_type" label="Service Type"
                                value={item.service_type}
                                options={LEAD_SERVICES_TYPE_LIST}
                                onChange={handleChangeInvoiceItemField(index, "service_type")}
                            /> */}

                            {/* <MuiFormFields.MuiSelect
                                name="service_sub_type" label="Service Sub Type"
                                value={item.service_sub_type}
                                disabled={!item.service_type}
                                options={getServiceSubTypeOptions(item.service_type as "PR")}
                                onChange={handleChangeInvoiceItemField(index, "service_sub_type")}
                            /> */}






                        </Stack>

                        <Button
                            size="small"
                            color="error"
                            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                            onClick={() => handleRemoveItemClick(index)}
                        >
                            Remove
                        </Button>
                    </Stack>
                ))}
            </Stack>

            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

            <Stack
                spacing={3}
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'flex-end', md: 'center' }}
            >
                <Button
                    size="small"
                    color="primary"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleAddNewItemClick}
                    sx={{ flexShrink: 0 }}
                >
                    Add Item
                </Button>
            </Stack>
        </Box>
    )
}
