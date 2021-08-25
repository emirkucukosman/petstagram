import React, { Suspense, Fragment, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import GuestGuard from "src/components/GuestGuard";
import AuthGuard from "src/components/AuthGuard";
import MainLayout from "src/layouts/MainLayout";

export const renderRoutes = (routes: any[]) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            exact={route.exact}
            path={route.path}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes ? renderRoutes(route.routes) : <Component {...props} />}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes: any[] = [
  {
    exact: true,
    path: "/404",
    component: lazy(() => import("src/views/errors/NotFoundView")),
  },
  {
    path: "/auth",
    layout: MainLayout,
    guard: GuestGuard,
    routes: [
      {
        exact: true,
        path: "/auth/sign-in",
        component: lazy(() => import("src/views/auth/SignInView")),
      },
      {
        exact: true,
        path: "/auth/sign-up",
        component: lazy(() => import("src/views/auth/SignUpView")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    path: "/profile",
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: "/profile",
        guard: AuthGuard,
        component: lazy(() => import("src/views/profile/ProfileView")),
      },
      {
        exact: true,
        path: "/profile/user/:username",
        component: lazy(() => import("src/views/profile/UserProfileView")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    path: "/post",
    layout: MainLayout,
    guard: AuthGuard,
    routes: [
      {
        exact: true,
        path: "/post/share",
        component: lazy(() => import("src/views/post/SharePostView")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    path: "*",
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: "/",
        component: lazy(() => import("src/views/home/HomeView")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
];

export default routes;
