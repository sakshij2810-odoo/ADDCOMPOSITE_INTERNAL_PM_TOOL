import { useState, useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { _allFiles, FILE_TYPE_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { fileFormat } from 'src/components/file-thumbnail';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, rowInPage, getComparator } from 'src/components/table';
import { FileManagerFilters } from 'src/sections/file-manager/file-manager-filters';
import { FileManagerFiltersResult } from 'src/sections/file-manager/file-manager-filters-result';
import { FileManagerNewFolderDialog } from 'src/sections/file-manager/file-manager-new-folder-dialog';
import { fetchFilesAndFoldersFromS3BucketAsync, IFileManager, IStoreState, useAppDispatch, useAppSelector } from 'src/redux';
import { IDatePickerControl } from 'src/types/common';
import { FileManagerCardView, FileManagerTable } from './components';
import { useFileManagerRoute } from './hooks';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { main_app_routes } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';


// ----------------------------------------------------------------------

function FileManagerTableView() {
    const { s3Path, breadcrumbs } = useFileManagerRoute();

    const table = useTable({ defaultRowsPerPage: 10 });

    const openDateRange = useBoolean();
    const router = useRouter();

    const confirm = useBoolean();

    const upload = useBoolean();
    const dispatch = useAppDispatch();
    const {
        data: multipleDataArray,
        count: totalCount,
        loading: dataLoading
    } = useAppSelector((storeState: IStoreState) => storeState.general.files_and_folders_list);
    const [view, setView] = useState('list');

    const [tableData, setTableData] = useState<IFileManager[]>([]);

    useEffect(() => {
        setTableData(multipleDataArray)
    }, [multipleDataArray])

    const filters = useSetState<IFileFilters>({
        name: '',
        type: [],
        startDate: null,
        endDate: null,
    });

    const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);


    useEffect(() => {
        dispatch(fetchFilesAndFoldersFromS3BucketAsync(s3Path))
    }, [s3Path])



    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
        dateError,
    });

    const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

    const canReset =
        !!filters.state.name ||
        filters.state.type.length > 0 ||
        (!!filters.state.startDate && !!filters.state.endDate);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleChangeView = useCallback(
        (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
            if (newView !== null) {
                setView(newView);
            }
        },
        []
    );

    const handleDeleteItem = useCallback((key: string) => {
        const deleteRow = tableData.filter((row) => row.path !== key);

        toast.success('Delete success!');

        setTableData(deleteRow);

        table.onUpdatePageDeleteRow(dataInPage.length);
    },
        [dataInPage.length, table, tableData]
    );

    const handleDeleteItems = useCallback(() => {
        const deleteRows = tableData.filter((row) => !table.selected.includes(row.path));

        toast.success('Delete success!');

        setTableData(deleteRows);

        table.onUpdatePageDeleteRows({
            totalRowsInPage: dataInPage.length,
            totalRowsFiltered: dataFiltered.length,
        });
    }, [dataFiltered.length, dataInPage.length, table, tableData]);

    const renderFilters = (
        <Stack
            spacing={2}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-end', md: 'center' }}
        >
            <FileManagerFilters
                filters={filters}
                dateError={dateError}
                onResetPage={table.onResetPage}
                openDateRange={openDateRange.value}
                onOpenDateRange={openDateRange.onTrue}
                onCloseDateRange={openDateRange.onFalse}
                options={{ types: FILE_TYPE_OPTIONS }}
            />

            <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
                <ToggleButton value="list">
                    <Iconify icon="solar:list-bold" />
                </ToggleButton>

                <ToggleButton value="grid">
                    <Iconify icon="mingcute:dot-grid-fill" />
                </ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    );

    const renderResults = (
        <FileManagerFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
        />
    );

    const handleDoubleClick = (folderPath: string) => {
        router.push(folderPath)
    }

    return (
        <>
            <DashboardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4">File manager</Typography>
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                        onClick={upload.onTrue}
                    >
                        Upload
                    </Button>
                </Stack>

                <Stack spacing={2.5} sx={{ my: { xs: 3, md: 5 } }}>
                    {renderFilters}

                    {canReset && renderResults}
                </Stack>
                <CustomBreadcrumbs
                    disableRoot
                    links={breadcrumbs}
                    sx={{ mb: 1, pl: 1 }}
                />

                {notFound ? (
                    <EmptyContent filled sx={{ py: 10 }} />
                ) : (
                    <>
                        {view === 'list' ? (
                            <FileManagerTable
                                table={table}
                                dataFiltered={dataFiltered}
                                onDeleteRow={handleDeleteItem}
                                notFound={notFound}
                                onOpenConfirm={confirm.onTrue}
                                onDoubleClick={handleDoubleClick}
                            />
                        ) : (
                            <FileManagerCardView
                                table={table}
                                dataFiltered={dataFiltered}
                                onDeleteItem={handleDeleteItem}
                                onOpenConfirm={confirm.onTrue}
                            />
                        )}
                    </>
                )}
            </DashboardContent>

            <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} />

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete <strong> {table.selected.length} </strong> items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteItems();
                            confirm.onFalse();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}
export default FileManagerTableView
// ----------------------------------------------------------------------
export type IFileFilters = {
    name: string;
    type: string[];
    startDate: IDatePickerControl;
    endDate: IDatePickerControl;
};

type ApplyFilterProps = {
    dateError: boolean;
    inputData: IFileManager[];
    filters: IFileFilters;
    comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
    const { name, type, startDate, endDate } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter(
            (file) => file.path.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }

    if (type.length) {
        inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
    }

    if (!dateError) {
        if (startDate && endDate) {
            inputData = inputData.filter((file) => fIsBetween(file.last_modified, startDate, endDate));
        }
    }

    return inputData;
}
