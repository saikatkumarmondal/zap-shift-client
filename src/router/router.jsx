import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Coverage from "../pages/Coverage/Coverage";
import SendParcel from "../pages/SendParcel/SendParcel";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcel from "../pages/Dashboard/MyParcel";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import Track from "../pages/Dashboard/Track/Track";
import BeARider from "../pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";
import ApprovedRiders from "../pages/Dashboard/ApprovedRider/ApprovedRider";
import MakeAdmin from "../pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoute from "../routes/AdminRoute";
import AssignRider from "../pages/Dashboard/AssignRider/AssignRider";
import RiderRoute from "../routes/RiderRoute";
import PendingDeliveries from "../pages/Dashboard/PendingDeliveries/PendingDeliveries";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      {
        path: "coverage",
        loader: () => fetch("./serviceCenter.json"),
        Component: Coverage,
      },
      {
        path: "forbidden",
        Component: Forbidden,
      },
      {
        path: "beARider",
        loader: () => fetch("/serviceCenter.json"),
        element: (
          <PrivateRoute>
            <BeARider></BeARider>
          </PrivateRoute>
        ),
      },
      {
        path: "sendParcel",
        loader: () => fetch("./serviceCenter.json"),
        element: (
          <PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout></DashboardLayout>
          </PrivateRoute>
        ),
        children: [
          {
            path: "myParcels",
            Component: MyParcel,
          },
          {
            path: "payment/:parcelId",
            Component: Payment,
          },
          {
            path: "paymentHistory",
            Component: PaymentHistory,
          },
          {
            path: "track",
            Component: Track,
          },
          //rider routes
          {
            path: "pending-deliveries",
            element: (
              <RiderRoute>
                <PendingDeliveries></PendingDeliveries>
              </RiderRoute>
            ),
          },
          //admin only routes
          {
            path: "pending-riders",
            element: (
              <AdminRoute>
                <PendingRiders></PendingRiders>
              </AdminRoute>
            ),
          },
          {
            path: "approved-riders",
            element: (
              <AdminRoute>
                <ApprovedRiders></ApprovedRiders>
              </AdminRoute>
            ),
          },
          {
            path: "makeAdmin",
            element: (
              <AdminRoute>
                <MakeAdmin></MakeAdmin>
              </AdminRoute>
            ),
          },
          {
            path: "assign-rider",
            element: (
              <AdminRoute>
                <AssignRider></AssignRider>
              </AdminRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
]);
