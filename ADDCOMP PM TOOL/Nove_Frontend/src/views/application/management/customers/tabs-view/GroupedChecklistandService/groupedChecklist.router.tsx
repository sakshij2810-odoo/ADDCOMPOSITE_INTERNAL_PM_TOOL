import { lazy } from "react";
import { main_app_routes } from "src/routes/paths";

const GroupedChecklist = lazy(() => import('./GroupedChecklistandService'));

export const groupedChecklistRoutes = [
    { path: main_app_routes.app.questionnaire.groupedChecklist, element: <GroupedChecklist /> },
]