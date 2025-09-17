import { programTabsRoutes } from "../programs/program.router";
import { answersRoutes } from "./answers/Answers.router";
import { customersRoutes } from "./customers/Customers.router";
import { groupedChecklistRoutes } from "./customers/tabs-view/GroupedChecklistandService/groupedChecklist.router";
import { documentsAndServicesRoutes } from "./document-checklist-and-services/DocumentsAndService.router";
import { appSecurityRoutes } from "./security/Security.router";
import { servicesRoutes } from "./services/Services.router";
import { userProfilesRoutes } from "./user-profiles/UserProfiles.router";

export const managementRoutes = [
    ...appSecurityRoutes,
    ...userProfilesRoutes,
    ...customersRoutes,
    ...answersRoutes,
    ...servicesRoutes,
    ...groupedChecklistRoutes,
    ...programTabsRoutes,
    ...documentsAndServicesRoutes
]