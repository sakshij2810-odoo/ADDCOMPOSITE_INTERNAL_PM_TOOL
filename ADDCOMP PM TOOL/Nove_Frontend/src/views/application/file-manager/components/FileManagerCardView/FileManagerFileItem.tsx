import type { CardProps } from '@mui/material/Card';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { maxLine } from 'src/theme/styles';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { IFileManager } from 'src/redux';

// ----------------------------------------------------------------------

type Props = CardProps & {
    selected?: boolean;
    file: IFileManager;
    onDelete: () => void;
    onSelect?: () => void;
};

export function FileManagerFileItem({ file, selected, onSelect, onDelete, sx, ...other }: Props) {
    const share = useBoolean();

    const confirm = useBoolean();

    const details = useBoolean();

    const popover = usePopover();

    const checkbox = useBoolean();

    const { copy } = useCopyToClipboard();


    const [inviteEmail, setInviteEmail] = useState('');

    const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setInviteEmail(event.target.value);
    }, []);

    const handleCopy = useCallback(() => {
        toast.success('Copied!');
        copy(file.path);
    }, [copy, file.path]);

    const renderIcon = (
        <Box
            onMouseEnter={checkbox.onTrue}
            onMouseLeave={checkbox.onFalse}
            sx={{ display: 'inline-flex', width: 36, height: 36 }}
        >
            {(checkbox.value || selected) && onSelect ? (
                <Checkbox
                    checked={selected}
                    onClick={onSelect}
                    icon={<Iconify icon="eva:radio-button-off-fill" />}
                    checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                    inputProps={{ id: `item-checkbox-${file.path}`, 'aria-label': `Item checkbox` }}
                    sx={{ width: 1, height: 1 }}
                />
            ) : (
                <FileThumbnail file={file.name} sx={{ width: 1, height: 1 }} />
            )}
        </Box>
    );

    const renderAction = (
        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
        </Stack>
    );

    const renderText = (
        <>
            <Typography
                variant="subtitle2"
                onClick={details.onTrue}
                sx={(theme) => ({
                    ...maxLine({ line: 2, persistent: theme.typography.subtitle2 }),
                    mt: 2,
                    mb: 0.5,
                    width: 1,
                })}
            >
                {file.name}
            </Typography>

            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    maxWidth: 0.99,
                    whiteSpace: 'nowrap',
                    typography: 'caption',
                    color: 'text.disabled',
                }}
            >
                {file.size}

                <Box
                    component="span"
                    sx={{
                        mx: 0.75,
                        width: 2,
                        height: 2,
                        flexShrink: 0,
                        borderRadius: '50%',
                        bgcolor: 'currentColor',
                    }}
                />
                <Typography noWrap component="span" variant="caption">
                    {file.last_modified}
                </Typography>
            </Stack>
        </>
    );

    return (
        <>
            <Paper
                variant="outlined"
                sx={{
                    p: 2.5,
                    display: 'flex',
                    borderRadius: 2,
                    cursor: 'pointer',
                    position: 'relative',
                    bgcolor: 'transparent',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    ...((checkbox.value || selected) && {
                        bgcolor: 'background.paper',
                        boxShadow: (theme) => theme.customShadows.z20,
                    }),
                    ...sx,
                }}
                {...other}
            >
                {renderIcon}

                {renderText}

                {/* {renderAvatar} */}

                {renderAction}
            </Paper>

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
        item={file}
        favorited={favorite.value}
        onFavorite={favorite.onToggle}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={() => {
          details.onFalse();
          onDelete();
        }}
      />

      <FileManagerShareDialog
        open={share.value}
        shared={file.shared}
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
                    <Button variant="contained" color="error" onClick={onDelete}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
