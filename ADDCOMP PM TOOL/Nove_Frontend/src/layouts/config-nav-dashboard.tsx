import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';
import { MODULE_KEYS } from 'src/constants/enums';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  company: icon('ic:company'),
  security: icon('solar:folder-security-bold')
};

// ----------------------------------------------------------------------


export interface INavbarMenu {
  subheader: string,
  items: INavbarMenuItem[],
}

export interface INavbarMenuItem {
  title: string,
  path: string,
  icon?: React.ReactNode,
  modules: string[],
  allowFullAccess?: boolean,
  children?: INavbarMenuItem[],

}

export const dashboardNavMenuData: INavbarMenu[] = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      { title: 'App', path: paths.dashboard.root, icon: ICONS.dashboard, allowFullAccess: true, modules: [] },
      // { title: 'Ecommerce', path: paths.dashboard.general.ecommerce, icon: ICONS.ecommerce },
      // { title: 'Analytics', path: paths.dashboard.general.analytics, icon: ICONS.analytics },
      // { title: 'Banking', path: paths.dashboard.general.banking, icon: ICONS.banking },
      // { title: 'Booking', path: paths.dashboard.general.booking, icon: ICONS.booking },
      // { title: 'File', path: paths.dashboard.general.file, icon: ICONS.file },
      // { title: 'Course', path: paths.dashboard.general.course, icon: ICONS.course },
      // { title: 'Leads', path: paths.dashboard.general.leads, icon: ICONS.course },
      {
        title: 'Leads',
        path: paths.dashboard.leads.leads,
        icon: ICONS.course,
        modules: [MODULE_KEYS.LEADS],
        children: [
          { title: 'Leads', path: paths.dashboard.leads.leads, modules: [MODULE_KEYS.LEADS] },
          { title: 'Documents', path: paths.dashboard.leads.leads, modules: [MODULE_KEYS.LEADS] },
        ],
      },
      {
        title: 'Programs',
        path: paths.dashboard.programs.programs,
        icon: ICONS.kanban,
        allowFullAccess: true,
        modules: [MODULE_KEYS.NOC_CODES, MODULE_KEYS.CRS_DRAWS, MODULE_KEYS.STUDY_PROGRAM],
        children: [
          { title: 'CRS Draws', path: paths.dashboard.programs.crsDraws, allowFullAccess: true, modules: [MODULE_KEYS.CRS_DRAWS] },
          { title: 'NOC Codes', path: paths.dashboard.programs.nocCodes, allowFullAccess: true, modules: [MODULE_KEYS.NOC_CODES] },
          { title: 'Study Program', path: paths.dashboard.programs.studyProgram, allowFullAccess: true, modules: [MODULE_KEYS.STUDY_PROGRAM] },
        ],
      },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Company',
        path: paths.dashboard.general.company,
        icon: ICONS.banking,
        modules: [MODULE_KEYS.COMPANY_INFORMATION]
      },
      {
        title: 'Users',
        path: paths.dashboard.users,
        icon: ICONS.user,
        modules: [MODULE_KEYS.USERS]
      },
      {
        title: 'Customers',
        path: paths.dashboard.customers,
        icon: ICONS.product,
        modules: [MODULE_KEYS.CUSTOMERS]
      },
      {
        title: 'Security',
        path: paths.dashboard.security.root,
        icon: ICONS.lock,
        modules: [MODULE_KEYS.SECURITY],
        children: [
          { title: 'Security', path: paths.dashboard.security.securityGroups, modules: [MODULE_KEYS.SECURITY] },
          { title: 'Role Groups', path: paths.dashboard.security.roleGroups, modules: [MODULE_KEYS.SECURITY] },
          { title: 'Approvals', path: paths.dashboard.security.approvals, modules: [MODULE_KEYS.SECURITY] },

        ],
      },
      // {
      //   title: 'Product',
      //   path: paths.dashboard.product.root,
      //   icon: ICONS.product,
      //   modules: [],
      //   children: [
      //     { title: 'List', path: paths.dashboard.product.root, modules: [] },
      //     { title: 'Details', path: paths.dashboard.product.demo.details, modules: [] },
      //     { title: 'Create', path: paths.dashboard.product.new, modules: [] },
      //     { title: 'Edit', path: paths.dashboard.product.demo.edit, modules: [] },
      //   ],
      // },
      // {
      //   title: 'Order',
      //   path: paths.dashboard.order.root,
      //   icon: ICONS.order,
      //   children: [
      //     { title: 'List', path: paths.dashboard.order.root },
      //     { title: 'Details', path: paths.dashboard.order.demo.details },
      //   ],
      // },
      // {
      //   title: 'Invoice',
      //   path: paths.dashboard.invoice.root,
      //   icon: ICONS.invoice,
      //   children: [
      //     { title: 'List', path: paths.dashboard.invoice.root },
      //     { title: 'Details', path: paths.dashboard.invoice.demo.details },
      //     { title: 'Create', path: paths.dashboard.invoice.new },
      //     { title: 'Edit', path: paths.dashboard.invoice.demo.edit },
      //   ],
      // },
      // {
      //   title: 'Blog',
      //   path: paths.dashboard.post.root,
      //   icon: ICONS.blog,
      //   children: [
      //     { title: 'List', path: paths.dashboard.post.root },
      //     { title: 'Details', path: paths.dashboard.post.demo.details },
      //     { title: 'Create', path: paths.dashboard.post.new },
      //     { title: 'Edit', path: paths.dashboard.post.demo.edit },
      //   ],
      // },
      // {
      //   title: 'Job',
      //   path: paths.dashboard.job.root,
      //   icon: ICONS.job,
      //   children: [
      //     { title: 'List', path: paths.dashboard.job.root },
      //     { title: 'Details', path: paths.dashboard.job.demo.details },
      //     { title: 'Create', path: paths.dashboard.job.new },
      //     { title: 'Edit', path: paths.dashboard.job.demo.edit },
      //   ],
      // },
      // {
      //   title: 'Tour',
      //   path: paths.dashboard.tour.root,
      //   icon: ICONS.tour,
      //   children: [
      //     { title: 'List', path: paths.dashboard.tour.root },
      //     { title: 'Details', path: paths.dashboard.tour.demo.details },
      //     { title: 'Create', path: paths.dashboard.tour.new },
      //     { title: 'Edit', path: paths.dashboard.tour.demo.edit },
      //   ],
      // },
      // { title: 'File manager', path: paths.dashboard.fileManager, icon: ICONS.folder },
      // {
      //   title: 'Mail',
      //   path: paths.dashboard.mail,
      //   icon: ICONS.mail,
      //   info: (
      //     <Label color="error" variant="inverted">
      //       +32
      //     </Label>
      //   ),
      // },
      // { title: 'Chat', path: paths.dashboard.chat, icon: ICONS.chat },
      // { title: 'Calendar', path: paths.dashboard.calendar, icon: ICONS.calendar },
      // { title: 'Kanban', path: paths.dashboard.kanban, icon: ICONS.kanban },
    ],
  },
  /**
   * Item State
   */
  // {
  //   subheader: 'Misc',
  //   items: [
  //     {
  //       // default roles : All roles can see this entry.
  //       // roles: ['user'] Only users can see this item.
  //       // roles: ['admin'] Only admin can see this item.
  //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
  //       // Reference from 'src/guards/RoleBasedGuard'.
  //       title: 'Permission',
  //       path: paths.dashboard.permission,
  //       icon: ICONS.lock,
  //       roles: ['admin', 'manager'],
  //       caption: 'Only admin can see this item',
  //     },
  //     {
  //       title: 'Level',
  //       path: '#/dashboard/menu_level',
  //       icon: ICONS.menuItem,
  //       children: [
  //         {
  //           title: 'Level 1a',
  //           path: '#/dashboard/menu_level/menu_level_1a',
  //           children: [
  //             {
  //               title: 'Level 2a',
  //               path: '#/dashboard/menu_level/menu_level_1a/menu_level_2a',
  //             },
  //             {
  //               title: 'Level 2b',
  //               path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b',
  //               children: [
  //                 {
  //                   title: 'Level 3a',
  //                   path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b/menu_level_3a',
  //                 },
  //                 {
  //                   title: 'Level 3b',
  //                   path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b/menu_level_3b',
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         { title: 'Level 1b', path: '#/dashboard/menu_level/menu_level_1b' },
  //       ],
  //     },
  //     {
  //       title: 'Disabled',
  //       path: '#disabled',
  //       icon: ICONS.disabled,
  //       disabled: true,
  //     },
  //     {
  //       title: 'Label',
  //       path: '#label',
  //       icon: ICONS.label,
  //       info: (
  //         <Label
  //           color="info"
  //           variant="inverted"
  //           startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}
  //         >
  //           NEW
  //         </Label>
  //       ),
  //     },
  //     {
  //       title: 'Caption',
  //       path: '#caption',
  //       icon: ICONS.menuItem,
  //       caption:
  //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
  //     },
  //     {
  //       title: 'Params',
  //       path: '/dashboard/params?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
  //       icon: ICONS.parameter,
  //     },
  //     {
  //       title: 'External link',
  //       path: 'https://www.google.com/',
  //       icon: ICONS.external,
  //       info: <Iconify width={18} icon="prime:external-link" />,
  //     },
  //     { title: 'Blank', path: paths.dashboard.blank, icon: ICONS.blank },
  //   ],
  // },
];
