import { crsDrawRoutes } from "./crs-draws/CRSDraws.router";
import { nocCodesRoutes } from "./noc-codes/NOCCodes.router";
import { studyProgramsRoutes } from "./study-program/StudyPrograms.router";


export const programsRoutes = [
    ...crsDrawRoutes,
    ...nocCodesRoutes,
    ...studyProgramsRoutes
]