import { Suspense } from "react";
import { Outlet } from "react-router";
import { SplashScreen } from "src/components/loading-screen";
import { PublicLayout } from "src/layouts/public";
import { publicRoutes } from "src/views/public";



export const publicNavRoutes = [
    {
        path: 'public',
        element: (
            <Suspense fallback={<SplashScreen />}>
                <PublicLayout>
                    <Outlet />
                </PublicLayout>
            </Suspense>
        ),
        children: publicRoutes,
    },
];