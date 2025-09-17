import { crsDrawRoutes } from "../programs/crs-draws/CRSDraws.router";
import { nocCodesRoutes } from "../programs/noc-codes/NOCCodes.router";
import { privateLeadsRoute } from "./private-leads/PrivateLeads.router";
import { studyProgramsRoutes } from "../programs/study-program/StudyPrograms.router";
import { documentsRoutes } from "./documents/Documents.router";

export const leadsRoutes = [
    ...privateLeadsRoute,
    ...crsDrawRoutes,
    ...nocCodesRoutes,
    ...studyProgramsRoutes,
    ...documentsRoutes

]