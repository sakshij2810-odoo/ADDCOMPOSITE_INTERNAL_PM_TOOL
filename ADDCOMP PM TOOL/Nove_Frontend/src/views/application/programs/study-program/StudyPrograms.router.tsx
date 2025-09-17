import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';



const StudyProgramsTableView = lazy(() => import('./StudyProgramsTableView'));
const ManageSingleStudyProgram = lazy(() => import('./ManageSingleStudyProgram'));

export const studyProgramsRoutes = [
    { path: main_app_routes.app.programs.studyProgram, element: <StudyProgramsTableView /> },
    { path: `${main_app_routes.app.programs.studyProgram}/manage`, element: <ManageSingleStudyProgram /> },
    { path: `${main_app_routes.app.programs.studyProgram}/manage/:uuid`, element: <ManageSingleStudyProgram /> },
]