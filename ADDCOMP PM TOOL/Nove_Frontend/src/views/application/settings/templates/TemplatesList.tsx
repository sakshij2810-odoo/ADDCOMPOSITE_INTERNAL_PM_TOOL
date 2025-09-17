/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-template */
import React from 'react';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { main_app_routes, paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { StatusRenderer } from 'src/mui-components/ActiveInActiveStatus';
import { CustomLink } from 'src/mui-components/CustomLink/CustomLink';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import {
  DataTableV2RowRenderType,
  IDataTableV2Props,
} from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  clearRecordCountStateSync,
  createTabsWithRecordcounts,
  fetchRecordCountAsync,
  fetchTemplateListAsync,
  ICreateTemplate,
  ILoadState,
  IStoreState,
  useAppDispatch,
  useAppSelector,
  useRecordCountStore,
} from 'src/redux';

const TemplatesList: React.FC = () => {
  const router = useRouter();
  const {
    list: templatesList,
    totalRecords: count,
    loading: dataLoading,
  } = useAppSelector((storeState: IStoreState) => storeState.templates);

  const { data: recordCountArray, loading: recordCountLoading } = useRecordCountStore();

  const [openConfirm, setOpenConfirm] = React.useState<ICreateTemplate | null>(null);
  const [pagination, setPagination] = React.useState({
    pageNumber: 1,
    rowsPerPage: 10,
    extraFetchFactor: 1,
  });

  const dispatch = useAppDispatch();

  const {
    state: { dateState, searchState, tabs, columnsConfig },
    setDateState,
    setSelectedTab,
    setTableTabs,
    setSearchState,
    setColumnVisibility,
  } = useTableV2State({
    filtersInitialState: {
      defaultDateRange: 'allTimes',
      selectedTab: '-1',
    },
  });

  const fetchList = () => {
    dispatch(
      fetchTemplateListAsync({
        pageNumber: pagination.pageNumber,
        rowsInPerPage: pagination.rowsPerPage,
        limit: pagination.rowsPerPage * pagination.extraFetchFactor,
        status: tabs.selectedTab,
        date: dateState.dates,
        searchValue: searchState,
      })
    );

    dispatch(
      fetchRecordCountAsync("latest_workflow_basic")
    );
  };

  React.useEffect(() => {
    fetchList();
  }, [pagination, dateState.dates, tabs.selectedTab, searchState]);

  const handleConfirm = () => {
    if (openConfirm) {
      // Add your confirmation logic here if needed
      setOpenConfirm(null);
      fetchList();
    }
  };

  const templatesTableProps: IDataTableV2Props = {
    isPagination: true,
    extraFetchFactor: pagination.extraFetchFactor,
    rowsPerPageOptions: pagination.rowsPerPage,
    isDataLoading: dataLoading === ILoadState.pending,
    uniqueRowKeyName: 'id',
    tableCommandBarProps: {
      preDefinedPlugins: {
        dateFilter: {
          state: dateState,
          onChange: setDateState,
        },
        search: {
          state: searchState,
          onChange: setSearchState,
          loadInitialFilterOncePopoverOpened: [
            {
              column: ['template_name'],
              logicalOperator: 'OR',
              operator: 'CONTAINS',
              value: '',
            },
          ],
        },
        columnVisibility: {
          columnVisibility: columnsConfig.columnVisibility,
          onChange: setColumnVisibility,
        },
        refresh: {
          onClick: fetchList,
        },
      },
      leftItems: {
        customPlugins: [],
      },
      rightItems: {
        customPlugins: [],
      },
    },
    masterColumns: [
      {
        key: 'view',
        headerName: 'Actions',
        fieldName: '',
        renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
        width: '90px',
        isFirstColumnSticky: true,
        onRowCellRender: (value, row: ICreateTemplate) => {
          return (
            <StandardTableActions
              onEditClick={() => {
                router.push(
                  `${main_app_routes.app.settings.templates}/manage/${row.template_code}`
                );
              }}
              onDuplicateClick={() => {
                router.push(`${main_app_routes.app.settings.templates}/clone/${row.template_code}`);
              }}
              onDeleteClick={row.status === 'ACTIVE' ? () => setOpenConfirm(row) : undefined}
              onRestoreClick={row.status === 'INACTIVE' ? () => setOpenConfirm(row) : undefined}
            />
          );
        },
      },
      {
        key: 'template_name',
        headerName: 'Name',
        fieldName: 'template_name',
        renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
        onRowCellRender: (value, row) => {
          return (
            <CustomLink
              to={`${main_app_routes.app.settings.templates}/manage-template/${row.template_code}`}
              label={row.template_name}
            />
          );
        },
      },
      {
        key: 'table_name',
        headerName: 'Module',
        fieldName: 'table_name',
        renderType: DataTableV2RowRenderType.TEXT,
      },
      {
        key: 'column',
        headerName: 'Sub Modules',
        fieldName: 'column',
        renderType: DataTableV2RowRenderType.TEXT,
      },
      {
        key: 'status',
        headerName: 'Status',
        fieldName: 'status',
        renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
        onRowCellRender: (value, row: ICreateTemplate) => {
          return <StatusRenderer status={row.status} />;
        },
      },
    ],
    rows: templatesList,
    totalRecords: count,
    tableTabProps: {
      selectedTab: tabs.selectedTab,
      tabs: tabs.tabs,
      onTabChange: (newSelectedTab) => {
        setSelectedTab(newSelectedTab);
      },
    },
    onPageChange: (newPageNumber) => {
      setPagination({ ...pagination, pageNumber: newPageNumber });
    },
    onRowsPerPageChange: (pageNumber, newRowsPerPage) => {
      setPagination({
        pageNumber,
        rowsPerPage: newRowsPerPage,
        extraFetchFactor: 1,
      });
    },
  };

  React.useEffect(() => {
    const tabsData = createTabsWithRecordcounts(
      [
        { label: 'Active', value: 'ACTIVE', variant: 'success' },
        { label: 'Inactive', value: 'INACTIVE', variant: 'error' },
      ],
      recordCountArray
    );
    setTableTabs(tabsData);
  }, [recordCountArray]);

  React.useEffect(() => {
    return () => {
      dispatch(clearRecordCountStateSync());
    };
  }, [dispatch]);

  const handleClick = () => {
    router.push(`${main_app_routes.app.settings.templates}/manage`);
  };

  return (
    <DashboardContent metaTitle="Templates list">
      <CustomBreadcrumbs
        heading="Templates"
        links={[
          { name: 'Dashboard', href: main_app_routes.app.settings.templates },
          { name: 'Templates' },
        ]}
        action={
          <Button
            onClick={handleClick}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create Template
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DataTableV2 {...templatesTableProps} selectionMode="multiple" />

      {openConfirm && (
        <ConfirmDialog
          open={true}
          content={
            <Typography variant="h4">
              {openConfirm.status === 'ACTIVE'
                ? 'Are you sure you want to delete this template?'
                : 'Are you sure you want to restore this template?'}
            </Typography>
          }
          onClose={() => setOpenConfirm(null)}
          action={<Button onClick={handleConfirm}>Confirm</Button>}
          title=""
        />
      )}
    </DashboardContent>
  );
};

export default TemplatesList;
