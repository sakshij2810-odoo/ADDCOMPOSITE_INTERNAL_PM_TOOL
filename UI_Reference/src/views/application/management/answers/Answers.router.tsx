import { lazy } from 'react';
import { main_app_routes, paths } from 'src/routes/paths';



const AnswersTableView = lazy(() => import('./AnswersTableView'));
const ManageSingleAnswer = lazy(() => import('./ManageSingleAnswer'));

export const answersRoutes = [
    // { path: main_app_routes.app.questionnaire.answers, element: <AnswersTableView /> },
    // { path: `${main_app_routes.app.questionnaire.answers}/manage`, element: <ManageSingleAnswer /> },
    // { path: `${main_app_routes.app.questionnaire.answers}/manage/:uuid`, element: <ManageSingleAnswer /> },
]