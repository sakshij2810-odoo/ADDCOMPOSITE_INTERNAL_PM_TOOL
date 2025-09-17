import type { IFile } from 'src/types/file';
import type { TableProps } from 'src/components/table';

import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { FileManagerPanel } from 'src/sections/file-manager/file-manager-panel';
import { FileManagerActionSelected } from 'src/sections/file-manager/file-manager-action-selected';
import { FileManagerShareDialog } from 'src/sections/file-manager/file-manager-share-dialog';
import { FileManagerNewFolderDialog } from 'src/sections/file-manager/file-manager-new-folder-dialog';
import { IFileManager } from 'src/redux';
import { FileManagerFolderItem } from './FileManagerFolderItem';
import { FileManagerFileItem } from './FileManagerFileItem';




type Props = {
    table: TableProps;
    dataFiltered: IFileManager[];
    onOpenConfirm: () => void;
    onDeleteItem: (id: string) => void;
};

export function FileManagerCardView({ table, dataFiltered, onDeleteItem, onOpenConfirm }: Props) {
    const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

    const share = useBoolean();

    const files = useBoolean();

    const upload = useBoolean();

    const folders = useBoolean();

    const newFolder = useBoolean();

    const containerRef = useRef(null);

    const [folderName, setFolderName] = useState('');

    const [inviteEmail, setInviteEmail] = useState('');

    const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setInviteEmail(event.target.value);
    }, []);

    const handleChangeFolderName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(event.target.value);
    }, []);

    return (
        <>
            <Box ref={containerRef}>
                <FileManagerPanel
                    title="Folders"
                    subtitle={`${dataFiltered.filter((item) => item.type === 'folder').length} folders`}
                    onOpen={newFolder.onTrue}
                    collapse={folders.value}
                    onCollapse={folders.onToggle}
                />

                <Collapse in={!folders.value} unmountOnExit>
                    <Box
                        gap={3}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        }}
                    >
                        {dataFiltered
                            .filter((i) => i.type === 'folder')
                            .map((folder) => (
                                <FileManagerFolderItem
                                    key={folder.path}
                                    folder={folder}
                                    selected={selected.includes(folder.path)}
                                    onSelect={() => onSelectItem(folder.path)}
                                    onDelete={() => onDeleteItem(folder.path)}
                                    sx={{ maxWidth: 'auto' }}
                                />
                            ))}
                    </Box>
                </Collapse>

                <Divider sx={{ my: 5, borderStyle: 'dashed' }} />

                <FileManagerPanel
                    title="Files"
                    subtitle={`${dataFiltered.filter((item) => item.type !== 'folder').length} files`}
                    onOpen={upload.onTrue}
                    collapse={files.value}
                    onCollapse={files.onToggle}
                />

                <Collapse in={!files.value} unmountOnExit>
                    <Box
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        }}
                        gap={3}
                    >
                        {dataFiltered
                            .filter((i) => i.type !== 'folder')
                            .map((file) => (
                                <FileManagerFileItem
                                    key={file.path}
                                    file={file}
                                    selected={selected.includes(file.path)}
                                    onSelect={() => onSelectItem(file.path)}
                                    onDelete={() => onDeleteItem(file.path)}
                                    sx={{ maxWidth: 'auto' }}
                                />
                            ))}
                    </Box>
                </Collapse>

                {!!selected?.length && (
                    <FileManagerActionSelected
                        numSelected={selected.length}
                        rowCount={dataFiltered.length}
                        selected={selected}
                        onSelectAllItems={(checked) =>
                            onSelectAllItems(
                                checked,
                                dataFiltered.map((row) => row.path)
                            )
                        }
                        action={
                            <>
                                <Button
                                    size="small"
                                    color="error"
                                    variant="contained"
                                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                    onClick={onOpenConfirm}
                                    sx={{ mr: 1 }}
                                >
                                    Delete
                                </Button>

                                <Button
                                    color="primary"
                                    size="small"
                                    variant="contained"
                                    startIcon={<Iconify icon="solar:share-bold" />}
                                    onClick={share.onTrue}
                                >
                                    Share
                                </Button>
                            </>
                        }
                    />
                )}
            </Box>

            <FileManagerShareDialog
                open={share.value}
                inviteEmail={inviteEmail}
                onChangeInvite={handleChangeInvite}
                onClose={() => {
                    share.onFalse();
                    setInviteEmail('');
                }}
            />

            <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} />

            <FileManagerNewFolderDialog
                open={newFolder.value}
                onClose={newFolder.onFalse}
                title="New Folder"
                onCreate={() => {
                    newFolder.onFalse();
                    setFolderName('');
                    console.info('CREATE NEW FOLDER', folderName);
                }}
                folderName={folderName}
                onChangeFolderName={handleChangeFolderName}
            />
        </>
    );
}
