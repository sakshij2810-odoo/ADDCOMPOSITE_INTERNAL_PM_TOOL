import type { CardProps } from '@mui/material/Card';
import type { TableHeadCustomProps } from 'src/components/table';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useEffect, useState } from 'react';
import { fetchLatestLeadsAsync } from './services/app-services.services';
import { IPrivateLead } from 'src/redux';
import { useRouter } from 'src/routes/hooks';
import { main_app_routes } from 'src/routes/paths';

// ----------------------------------------------------------------------

;

export function LatestLeadsDashboard() {
  const router = useRouter();
  const [latestLeads, setLatestLeads] = useState<IPrivateLead[]>([])
  useEffect(() => {
    fetchLatestLeadsAsync().then((result) => {
      setLatestLeads(result)
    })
  }, [])

  const handleViewMoreClick = () => {
    router.push(`${main_app_routes.app.leads.root}`)
  }

  return (
    <Card >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <CardHeader title={"Latest Leads"} sx={{ mb: 3 }} />
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          onClick={handleViewMoreClick}
        >
          View all
        </Button>
      </Box>
      <Scrollbar sx={{ minHeight: 200 }}>
        <Table sx={{ minWidth: 680 }}>
          <TableHeadCustom headLabel={[
            { id: 'status', label: 'Status' },
            { id: 'applicant_first_name', label: 'Applicant First Name' },
            { id: 'applicant_last_name', label: 'Applicant Last Name' },
            { id: 'email', label: 'Email' },
            { id: 'nationality', label: 'Nationality' },
            { id: 'service_type', label: 'Service Type' },
            { id: 'service_sub_type', label: 'Service Sub Type' },
          ]} />

          <TableBody>
            {latestLeads.map((row) => (
              <RowItem key={row.leads_uuid} row={row} />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

    </Card>
  );
}

// ----------------------------------------------------------------------

type RowItemProps = {
  row: IPrivateLead;
};

function RowItem({ row }: RowItemProps) {
  const popover = usePopover();

  const handleDownload = () => {
    popover.onClose();
    console.info('DOWNLOAD', row.leads_uuid);
  };

  const handlePrint = () => {
    popover.onClose();
    console.info('PRINT', row.leads_uuid);
  };

  const handleShare = () => {
    popover.onClose();
    console.info('SHARE', row.leads_uuid);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', row.leads_uuid);
  };

  return (
    <>
      <TableRow>
        <TableCell>{row.status}</TableCell>

        <TableCell>{row.applicant_first_name}</TableCell>
        <TableCell>{row.applicant_last_name}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.nationality}</TableCell>
        <TableCell>{row.service_type}</TableCell>
        <TableCell>{row.service_sub_type}</TableCell>
      </TableRow>
    </>
  );
}
