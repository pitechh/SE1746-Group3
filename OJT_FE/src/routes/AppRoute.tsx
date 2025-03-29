import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedLayouts from "../layouts/defautlLayout/DefaultLayout";
import HomeStudent from "../pages/public/Home";
import StudentLayout from "../layouts/defautlLayout/StudentLayout";
import Companies from "../pages/public/Companies";
import JobOpportunities from "../pages/protected/student/JobOpportunities";
import DefaultLayout from "../layouts/defautlLayout/DefaultLayout";
import InternshipProposals from "../pages/protected/student/InternshipProposals";
import ApplyList from "../pages/protected/student/ApplyList";
import Profile from "../pages/protected/student/Profile";
import CompanyDetail from "../pages/protected/student/CompanyDetail";
import InternshipList from "../pages/protected/internship/InternshipList";
import AuthLayouts from "../layouts/authLayout/AuthLayouts";
import LoginPage from "../pages/auth/login/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import { Role } from "../types/StatusEnum";
import { ForbiddenError } from "../pages/exception/403-forbidden";
import ErrorLayout from "../layouts/errorLayout/ErrorLayout";
import CompanyList from "../pages/protected/company/CompanyList";
import InternshipDetail from "../pages/protected/student/InternshipDetail";
import ProposalCreate from "../pages/protected/student/ProposalCreate";
import WelcomeManager from "../pages/protected/WelcomeManager";
import StudentAppliedList from "../pages/protected/manager-student/StudentAppliedList";
import AccountList from "../pages/protected/account/AccountList";
import AccountDetail from "../pages/protected/account/AccountDetail";
import CompanyDetails from "../pages/protected/company/CompanyDetails";
import InternshipDetails from "../pages/protected/internship/InternshipDetails";
import ProposalList from "../pages/protected/manager-student/ProposalList";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      {/* <Route element={<AuthLayouts />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/google-callback" element={<GoogleCallbackPage />} />
        </Route> */}

      {/* Protected Routes */}
      <Route element={<StudentLayout />}>
        <Route path="/" element={<HomeStudent />} />

        <Route path="/company/list" element={<Companies />} />

        <Route
          path="/company/detail/:id"
          element={
            <ProtectedRoute allowedRoles={[Role.STUDENT]}>
              <CompanyDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/internship/list"
          element={
            <ProtectedRoute allowedRoles={[Role.STUDENT]}>
              <JobOpportunities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/internship/detail/:id"
          element={
            <ProtectedRoute allowedRoles={[Role.STUDENT]}>
              <InternshipDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/InternshipProposals"
          element={
            <ProtectedRoute allowedRoles={[Role.STUDENT]}>
              <InternshipProposals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/InternshipProposals/create"
          element={
            <ProtectedRoute allowedRoles={[Role.STUDENT]}>
              <ProposalCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applyList"
          element={
            <ProtectedRoute allowedRoles={[Role.STUDENT]}>
              <ApplyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={[Role.STUDENT]}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<AuthLayouts />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedLayouts />}>
        <Route
          path="/manager/welcome"
          element={
            <ProtectedRoute allowedRoles={[Role.ADMIN, Role.HR_STAFF, Role.STAFF]}>
              <WelcomeManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/account/list"
          element={
            <ProtectedRoute allowedRoles={[Role.ADMIN]}>
              <AccountList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/account/create"
          element={
            <ProtectedRoute allowedRoles={[Role.ADMIN]}>
              <AccountDetail />
            </ProtectedRoute>
          }
        />
        //#region internship
        <Route
          path="/manager/internship/list"
          element={
            <ProtectedRoute allowedRoles={[ Role.HR_STAFF]}>
              <InternshipList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/internship/:mode/:internshipId"
          element={
            <ProtectedRoute allowedRoles={[ Role.HR_STAFF]}>
              <InternshipDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/internship/:mode"
          element={
            <ProtectedRoute allowedRoles={[ Role.HR_STAFF]}>
              <InternshipDetails />
            </ProtectedRoute>
          }
        />
        #endregion //#region Companies
        <Route
          path="/manager/company/list"
          element={
            <ProtectedRoute allowedRoles={[ Role.STAFF]}>
              <CompanyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/company/:mode/:companyId"
          element={
            <ProtectedRoute allowedRoles={[Role.STAFF]}>
              <CompanyDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/company/:mode/"
          element={
            <ProtectedRoute allowedRoles={[ Role.STAFF]}>
              <CompanyDetails />
            </ProtectedRoute>
          }
        />
        //#endregion
        <Route
          path="/manager/student-applied/company/:companyId"
          element={
            <ProtectedRoute allowedRoles={[Role.HR_STAFF]}>
              <StudentAppliedList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/proposal/list"
          element={
            <ProtectedRoute allowedRoles={[Role.STAFF]}>
              <ProposalList />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<ErrorLayout />}>
        <Route path="/403-forbidden" element={<ForbiddenError />} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
