import { Box } from '@mui/material';
import { Button, ButtonProps, Tooltip } from '@mui/material'
import React, { useMemo } from 'react'
import { useAuthContext } from 'src/auth/hooks';

interface IButtonWithWriteAccessProps extends ButtonProps {
    module: string
}

export const ButtonWithWriteAccess: React.FC<IButtonWithWriteAccessProps> = ({ module: moduleKey, ...restProps }) => {
    const { accessibleModules } = useAuthContext();

    const isWriteAccess = useMemo(() => {
        const isExist = accessibleModules.find((module) => module.module_key === moduleKey)
        return isExist ? Boolean(isExist["edit_access"]) : false
    }, [moduleKey, accessibleModules])

    if (!isWriteAccess) return (
        <Tooltip title="Access Denied" ><Box component="span" sx={{ cursor: "not-allowed" }} ><Button {...restProps} disabled title='Access Denied!' /></Box></Tooltip>
    )

    return <Button {...restProps} />;
}
