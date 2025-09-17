import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';



const TaskActivitiesTableView = lazy(() => import('./TaskActivitiesTableView'));

export const taskActivitiesRoutes = [
    { path: main_app_routes.app.tasks.taskActivities, element: <TaskActivitiesTableView /> },
]