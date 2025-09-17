import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';


import { varAlpha } from 'src/theme/styles';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { getFileS3Structure, getFolderS3Structure, IFileManager, renameSingleFileWithCallbackAsync, renameSingleFolderWithCallbackAsync, useAppDispatch } from 'src/redux';
import { Tooltip } from '@mui/material';
import { MuiFormFields } from 'src/mui-components';


// ----------------------------------------------------------------------

type Props = {
    row: IFileManager;
    selected: boolean;
    onSelectRow: () => void;
    onDeleteRow: () => void;
    onDoubleClick: () => void;
};

export function FileManagerTableRow({ row, selected, onSelectRow, onDeleteRow, onDoubleClick }: Props) {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const { copy } = useCopyToClipboard();

    const [inviteEmail, setInviteEmail] = useState('');
    const [editableMode, setEditableMode] = useState({
        isEditable: false,
        value: ""
    })
    const isFileEditable = useBoolean()

    const details = useBoolean();

    const share = useBoolean();

    const confirm = useBoolean();

    const popover = usePopover();

    const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setInviteEmail(event.target.value);
    }, []);

    const handleClick = useDoubleClick({
        click: () => {
            details.onTrue();
        },
        doubleClick: () => console.info('DOUBLE CLICK'),
    });

    const handleCopy = useCallback(() => {
        toast.success('Copied!');
        copy(row.path);
    }, [copy, row.path]);

    const defaultStyles = {
        borderTop: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
        borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
        '&:first-of-type': {
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderLeft: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
        },
        '&:last-of-type': {
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            borderRight: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
        },
    };

    const handleOnSaveClick = () => {
        const fileExtenstion = row.name.split(".")[1] || ""
        const pathSuffix = fileExtenstion ? "." + fileExtenstion : ""
        const newValue = `${editableMode.value}${pathSuffix}`
        if (newValue === row.name) return;
        if (row.type === "folder") {
            console.log("Rename Folder ==>", getFolderS3Structure(row.path, editableMode.value))
            dispatch(renameSingleFolderWithCallbackAsync({
                payload: getFolderS3Structure(row.path, newValue),
                onSuccess(isSuccess, data) {
                    setEditableMode({ isEditable: false, value: "" })
                },
            }))
        } else {
            console.log("Rename File ==>", getFileS3Structure(row.path, editableMode.value))
            dispatch(renameSingleFileWithCallbackAsync({
                payload: getFileS3Structure(row.path, newValue),
                onSuccess(isSuccess, data) {
                    setEditableMode({ isEditable: false, value: "" })
                },
            }))
        }

    }
    return (
        <>
            <TableRow
                selected={selected}
                sx={{
                    borderRadius: 2,
                    [`&.${tableRowClasses.selected}, &:hover`]: {
                        backgroundColor: 'background.paper',
                        boxShadow: theme.customShadows.z20,
                        transition: theme.transitions.create(['background-color', 'box-shadow'], {
                            duration: theme.transitions.duration.shortest,
                        }),
                        '&:hover': { backgroundColor: 'background.paper', boxShadow: theme.customShadows.z20 },
                    },
                    [`& .${tableCellClasses.root}`]: { ...defaultStyles },
                    ...(details.value && { [`& .${tableCellClasses.root}`]: { ...defaultStyles } }),
                }}
                onDoubleClick={() => row.type === "folder" ? onDoubleClick() : null}
            >
                <TableCell onClick={handleClick}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <FileThumbnail file={row.name} />

                        {editableMode.isEditable ?
                            <>
                                <MuiFormFields.MuiTextField
                                    name=''
                                    value={editableMode.value}
                                    onChange={(evt) => setEditableMode({ ...editableMode, value: evt.target.value })}
                                />
                                <Button onClick={handleOnSaveClick}>Save</Button>
                                <Button
                                    color='error'
                                    onClick={() => setEditableMode({ ...editableMode, isEditable: false })}>Cancel</Button>
                            </>
                            :
                            <>
                                <Typography
                                    noWrap
                                    variant="inherit"
                                    sx={{
                                        maxWidth: 360,
                                        cursor: 'pointer',
                                        ...(details.value && { fontWeight: 'fontWeightBold' }),
                                    }}
                                >
                                    {row.name}
                                </Typography>
                                {/* <Tooltip title="Edit File Name">
                                    <IconButton onClick={() => setEditableMode({
                                        isEditable: true,
                                        value: row.name.split(".")[0]
                                    })}>
                                        <Iconify icon="solar:pen-bold" />
                                    </IconButton>
                                </Tooltip> */}
                            </>
                        }

                    </Stack>
                </TableCell>

                <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                    {row.size || "--"}
                </TableCell>

                <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                    {row.type}
                </TableCell>

                <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                    <ListItemText
                        primary={row.last_modified?.split("at")[0].trim()}
                        secondary={row.last_modified?.split("at")[1].trim()}
                        primaryTypographyProps={{ typography: 'body2' }}
                        secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
                    />
                </TableCell>



                <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                    <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                <MenuList>
                    <MenuItem
                        onClick={() => {
                            popover.onClose();
                            setEditableMode({
                                isEditable: true,
                                value: row.name.split(".")[0]
                            })
                        }}
                    >
                        <Iconify icon="solar:pen-bold" />
                        Rename
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            popover.onClose();
                            handleCopy();
                        }}
                    >
                        <Iconify icon="eva:link-2-fill" />
                        Copy Link
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            popover.onClose();
                            share.onTrue();
                        }}
                    >
                        <Iconify icon="solar:share-bold" />
                        Share
                    </MenuItem>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <MenuItem
                        onClick={() => {
                            confirm.onTrue();
                            popover.onClose();
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                </MenuList>
            </CustomPopover>

            {/* <FileManagerFileDetails
                item={row}
                favorited={favorite.value}
                onFavorite={favorite.onToggle}
                onCopyLink={handleCopy}
                open={details.value}
                onClose={details.onFalse}
                onDelete={onDeleteRow}
            /> */}

            {/* <FileManagerShareDialog
                open={share.value}
                shared={row.shared}
                inviteEmail={inviteEmail}
                onChangeInvite={handleChangeInvite}
                onCopyLink={handleCopy}
                onClose={() => {
                    share.onFalse();
                    setInviteEmail('');
                }}
            /> */}

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
