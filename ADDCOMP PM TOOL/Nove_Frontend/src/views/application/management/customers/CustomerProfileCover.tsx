import type { IUserProfileCover } from 'src/types/user';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';

import { varAlpha, bgGradient } from 'src/theme/styles';
import { useCustomerContext } from './provider';
import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function CustomerProfileCover() {
    const theme = useTheme();
    const { customerInfo } = useCustomerContext();
    const { user } = useMockedUser()

    return (
        <Box
            sx={{
                ...bgGradient({
                    color: `0deg, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.8)}, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.8)}`,
                    // imgUrl: user.photoURL,
                }),
                height: 1,
                color: 'common.white',
            }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                sx={{
                    left: { md: 24 },
                    bottom: { md: 95 },
                    zIndex: { md: 10 },
                    pt: { xs: 6, md: 0 },
                    position: { md: 'absolute' },
                }}
            >
                <Avatar
                    alt={(`${customerInfo.customer_first_name} ${customerInfo.customer_last_name || ""}`).trim()}
                    src={user.photoURL}
                    sx={{
                        mx: 'auto',
                        width: { xs: 64, md: 128 },
                        height: { xs: 64, md: 128 },
                        border: `solid 2px ${theme.vars.palette.common.white}`,
                    }}
                >
                    {customerInfo.customer_first_name?.charAt(0).toUpperCase()}
                </Avatar>

                <ListItemText
                    sx={{ mt: 5, ml: { md: 3 }, textAlign: { xs: 'center', md: 'unset' } }}
                    primary={(`${customerInfo.customer_first_name} ${customerInfo.customer_last_name || ""}`).trim()}
                    secondary={""}
                    primaryTypographyProps={{ typography: 'h4' }}
                    secondaryTypographyProps={{
                        mt: 0.5,
                        color: 'inherit',
                        component: 'span',
                        typography: 'body2',
                        sx: { opacity: 0.48 },
                    }}
                />
            </Stack>
        </Box>
    );
}
