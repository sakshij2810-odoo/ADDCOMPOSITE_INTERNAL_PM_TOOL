import { Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { useResponsive } from 'src/hooks/use-responsive'
import { ICustomerInvoice } from 'src/redux'

export interface IInvoiceAddressSectionProps {
    invoice: ICustomerInvoice
}
export const InvoiceAddressSection: React.FC<IInvoiceAddressSectionProps> = ({
    invoice
}) => {
    const mdUp = useResponsive('up', 'md');

    return (
        <Stack
            spacing={{ xs: 3, md: 5 }}
            direction={{ xs: 'column', md: 'row' }}
            divider={
                <Divider
                    flexItem
                    orientation={mdUp ? 'vertical' : 'horizontal'}
                    sx={{ borderStyle: 'dashed' }}
                />
            }
            sx={{ p: 3 }}
        >
            <Stack sx={{ width: 1 }}>
                <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h6" >
                        From: {invoice.company_name}
                    </Typography>

                    {/* <IconButton onClick={from.onTrue}>
                        <Iconify icon="solar:pen-bold" />
                    </IconButton> */}
                </Stack>

                <Stack spacing={1}>
                    <Typography variant="subtitle2">{invoice.company_address_line1}</Typography>
                    <Typography variant="subtitle2">{invoice.company_address_line2}</Typography>
                    <Typography variant="body2">{(`${invoice.company_city}, ${invoice.company_state}`).trim()}</Typography>
                    <Typography variant="body2"> {(`${invoice.company_country}, ${invoice.company_postal_code}`).trim()}</Typography>
                </Stack>
            </Stack>

            <Stack sx={{ width: 1 }}>
                <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h6" >
                        To: {invoice.customer_name}
                    </Typography>

                    {/* <IconButton onClick={to.onTrue}>
                        <Iconify icon={invoiceTo ? 'solar:pen-bold' : 'mingcute:add-line'} />
                    </IconButton> */}
                </Stack>

                <Stack spacing={1}>
                    <Typography variant="subtitle2">{invoice.customer_address_line1}</Typography>
                    <Typography variant="subtitle2">{invoice.customer_address_line2}</Typography>
                    <Typography variant="body2">{(`${invoice.customer_city}, ${invoice.customer_state}`).trim()}</Typography>
                    <Typography variant="body2"> {(`${invoice.customer_country}, ${invoice.customer_postal_code}`).trim()}</Typography>
                </Stack>

            </Stack>
        </Stack>
    )
}
