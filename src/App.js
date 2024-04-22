import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "components/Header";
import Home from "pages/Home";
import Jobs from "pages/Jobs";
import Candidates from "pages/Candidates";
import Footer from "components/Footer";
import JobDetail from "pages/JobDetail";
import CompanyDetail from "pages/CompanyDetail";
import Login from "pages/Login";
import Signup from "pages/Signup";
import ResetPassword from "pages/ResetPassword";
import CandidateDashboard from "pages/candidate/CandidateDashboard";
import CandidateProfile from "pages/candidate/CandidateProfile";
import CandidateChangePassword from "pages/candidate/CandidateChangePassword";
import CandidateResume from "pages/candidate/CandidateResume";
import CandidateAppliedJobs from "pages/candidate/CandidateAppliedJobs";
import CandidateSavedJobs from "pages/candidate/CandidateSavedJobs";
import CandidateDetail from "pages/CandidateDetail";
import EmployerDashboard from "pages/employer/EmployerDashboard";
import EmployerProfile from "pages/employer/EmployerProfile";
import EmployerChangePassword from "pages/employer/EmployerChangePassword";
import EmployerPostJob from "./pages/employer/EmployerPostJob";
import EmployerManageJobs from "pages/employer/EmployerManageJobs";
import EmployerManageUsers from "pages/employer/EmployerManageUsers";
import EmployerManageUserForm from "pages/employer/EmployerManageUserForm";
import EmployerCompanyProfile from "pages/employer/EmployerCompanyProfile";
import EmployerFeedback from "pages/employer/EmployerFeedback";
import EmployerManageCandidates from 'pages/employer/EmployerManageCandidates';
import EmployerManageReviews from "pages/employer/EmployerManageReviews";
import { useSessionStorage } from 'context/SessionStorageContext';
import PrivacyPolicy from "pages/policies/PrivacyPolicy";
import TermsConditions from "pages/policies/TermsConditions";
import Disclaimer from "pages/policies/Disclaimer";
import Aboutus from "pages/aboutus/Aboutus";
import NewPasswordSetUp from "pages/NewPasswordSetUp";
import ResumeBuild from "pages/candidate/resume_builder/ResumeBuild";
import { SubscriptionPlan } from "pages/employer/subscription/SubscriptionPlan";
import Blogs from "pages/Blogs";
import BlogDetail from "pages/BlogDetail";
import MyBlogs from "pages/MyBlogs";
import { HelmetProvider } from 'react-helmet-async';
import EmployerDeleteProfile from "pages/employer/EmployerDeleteProfile";

const HideHeader = () => {
  const location = useLocation();
  return !["/login", "/employer/login", "/signup", "/forgot-password", "/reset-password/", "/employer/signup"].some(path => location.pathname.startsWith(path))? <Header/> : null;
};

const HideFooter = () => {
  const location = useLocation();
  return !["/login", "/employer/login", "/signup", "/forgot-password", "/reset-password/", "/employer/signup"].some(path => location.pathname.startsWith(path))? <Footer/> : null;
};

function App() {
  const { roleid, usertype } = useSessionStorage();
  return (
      // <BrowserRouter basename="/hirex">
      <BrowserRouter>
        <HideHeader/>
          <HelmetProvider>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/employer/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/employer/signup" element={<Signup/>} />
          <Route path="/forgot-password" element={<ResetPassword/>} />
          <Route path="/reset-password/:encemail" element={<NewPasswordSetUp/>} /> 
          <Route path="/jobs" element={<Jobs/>} />
          <Route path="/jobs/:slug" element={<JobDetail/>} />
          <Route path="/company-details/:slug" element={<CompanyDetail/>} />
          <Route path="/blogs" element={<Blogs/>} />
          <Route path="/my-blogs" element={<MyBlogs/>} />
          <Route path="/blog/:slug" element={<BlogDetail/>} />
          <Route path="/blog/edit/:slug" element={<Blogs/>} />
          {/*policies*/}
          <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
          <Route path="/terms-conditions" element={<TermsConditions/>} />
          <Route path="/disclaimer" element={<Disclaimer/>} />
          {/*aboutus*/}
          <Route path="/about-us" element={<Aboutus/>} />
          {/* Employer */}
          {
            usertype === "employer" ? (
              <>
                <Route path="/candidates" element={<Candidates/>} />
                <Route path="/employer/dashboard" element={<EmployerDashboard/>} />
                <Route path="/employer/company-profile" element={<EmployerCompanyProfile/>} />
                <Route path="/employer/profile" element={<EmployerProfile/>} />
                <Route path="/employer/change-password" element={<EmployerChangePassword/>} />
                <Route path="/employer/post-new-job" element={<EmployerPostJob/>} />
                <Route path="/employer/post-new-job/:jobSlug" element={<EmployerPostJob/>} />
                <Route path="/employer/manage-jobs" element={<EmployerManageJobs/>} />
                <Route path="/employer/manage-reviews" element={<EmployerManageReviews/>} />
                <Route path="/employer/manage-candidates/:slug" element={<EmployerManageCandidates/>} />
                <Route path="/employer/support" element={<EmployerFeedback/>} />
                <Route path="/candidate/:candidateNo" element={<CandidateDetail/>} />
                <Route path="/employer/pricing-plan" element={<SubscriptionPlan/>} /> 
              </>
            ) : (
              <Route path="/" element={<Home/>} />
            )
          }
          {/* Candidate */}
          {
            usertype === "candidate" ? (
              <>
                <Route path="/candidate/dashboard" element={<CandidateDashboard/>} />
                <Route path="/candidate/profile" element={<CandidateProfile/>} />
                <Route path="/candidate/change-password" element={<CandidateChangePassword/>} />
                <Route path="/candidate/resume" element={<CandidateResume/>} />
                <Route path="/candidate/applied-jobs" element={<CandidateAppliedJobs/>} />
                <Route path="/candidate/saved-jobs" element={<CandidateSavedJobs/>} />
                <Route path="/candidate/resume-builder" element={<ResumeBuild/>} />
              </>
            ) : (
              <Route path="/" element={<Home/>} />
            )
          }          
          {
            roleid === "1" ? (
              <>
                <Route path="/employer/manage-users" element={<EmployerManageUsers/>} />
                <Route path="/employer/add-user" element={<EmployerManageUserForm/>} />
                <Route path="/employer/edit-user" element={<EmployerManageUserForm/>} />
                <Route path="/employer/delete-profile" element={<EmployerDeleteProfile/>} />
              </>
            ) : (
              <Route path="/" element={<Home/>} />
            )
          }
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
          </HelmetProvider>
        <HideFooter/>
      </BrowserRouter>
  );
}
export default App;