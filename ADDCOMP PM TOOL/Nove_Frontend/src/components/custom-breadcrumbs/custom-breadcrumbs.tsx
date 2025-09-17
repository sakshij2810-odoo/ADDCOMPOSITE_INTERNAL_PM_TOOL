import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { BreadcrumbsLink } from './breadcrumb-link';

import type { BreadcrumbsLinkProps, CustomBreadcrumbsProps } from './types';
import { main_app_routes } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function CustomBreadcrumbs({
  links,
  action,
  heading,
  moreLink,
  activeLast,
  slotProps,
  disableRoot,
  sx,
  ...other
}: CustomBreadcrumbsProps) {
  const breadCrumbLinks: BreadcrumbsLinkProps[] = (disableRoot ? [] : [{ name: 'Dashboard', href: main_app_routes.root }] as BreadcrumbsLinkProps[]).concat(links || [])
  const lastLink = breadCrumbLinks.length > 0 ? breadCrumbLinks[breadCrumbLinks.length - 1].name : undefined;

  const renderHeading = (
    <Typography variant="h4" sx={{ mb: 2, ...slotProps?.heading }}>
      {heading}
    </Typography>
  );

  const renderLinks = (
    <Breadcrumbs separator={<Separator />} sx={slotProps?.breadcrumbs} {...other}>
      {breadCrumbLinks.map((link, index) => (
        <BreadcrumbsLink
          key={link.name ?? index}
          link={link}
          activeLast={activeLast}
          disabled={link.name === lastLink}
        />
      ))}
    </Breadcrumbs>
  );

  const renderAction = <Box sx={{ flexShrink: 0, ...slotProps?.action }}> {action} </Box>;

  const renderMoreLink = (
    <Box component="ul">
      {moreLink?.map((href) => (
        <Box key={href} component="li" sx={{ display: 'flex' }}>
          <Link href={href} variant="body2" target="_blank" rel="noopener" sx={slotProps?.moreLink}>
            {href}
          </Link>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box gap={2} display="flex" flexDirection="column" sx={sx} {...other}>
      <Box display="flex" alignItems="center">
        <Box sx={{ flexGrow: 1 }}>
          {heading && renderHeading}

          {!!breadCrumbLinks.length && renderLinks}
        </Box>

        {action && renderAction}
      </Box>

      {!!moreLink && renderMoreLink}
    </Box>
  );
}

// ----------------------------------------------------------------------

function Separator() {
  return (
    <Box
      component="span"
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: 'text.disabled',
      }}
    />
  );
}
