import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Container from "react-bootstrap/Container";
import { Row, Col, Ratio } from "react-bootstrap";
import {
  SlLocationPin,
  SlWallet,
  SlGraduation,
  SlLayers,
  SlEnvolope,
  SlPhone,
} from "react-icons/sl";
import {
  FaGraduationCap,
  FaUserTie,
  FaPhoneAlt,
  FaDownload,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSessionStorage } from "context/SessionStorageContext";
import { useClearStorage } from "utils/useClearStorage";
import LoaderBlur from "components/LoaderBlur";
import { imagePath, currencySymbols } from "components/Constants";
import axios from "axios";
import { subscriptionPlan } from "./employer/subscription/subscription";
import SubscriptionAlert from "components/SubscriptionAlert";
import { formatSalary } from "utils/formatSalary";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const CandidateDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [candidate, setCandidate] = useState();
  const { candidateNo } = useParams();
  const { clearStorage } = useClearStorage();
  const { userid, token, companyid, usertype } = useSessionStorage();
  const [contactMatch, setContactMatch] = useState(false);
  const navigate = useNavigate();
  const [accessDetails, setAccessDetails] = useState({});

  const candidateDataRef = useRef();
  let candidateData = candidateDataRef.current;

  // Get job after login
  const getCandidateDetail = useCallback(
    async (candidateNo) => {
      setIsLoading(true);
      const response = await axios.get(
        BASE_API_URL +
          "candidate-details/profile/" +
          candidateNo +
          "/" +
          userid,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response?.data?.result === true) {
        setIsLoading(false);
        setCandidate(response.data.candidate_detail);
        candidateDataRef.current = response.data.candidate_detail;
      } else if (response?.data?.result === false) {
        if (response?.data?.message === "Token Expired") {
          clearStorage();
          sessionStorage.setItem("loginErr", LOGIN_ERR);
          setIsLoading(false);
          navigate("/employer/login");
        } else {
          setIsLoading(false);
        }
      }
    },
    [token, clearStorage, navigate, userid]
  );

  useEffect(() => {
    if (userid && token && candidateNo) {
      setIsLoading(true);
      getCandidateDetail(candidateNo).then(async () => {
        const result = await subscriptionPlan(token, setIsLoading);
        setAccessDetails((prev) => ({ ...prev, ...result }));
      setIsLoading(false);
      });
    }
  }, [token, candidateNo, userid, getCandidateDetail]);

  // Render Education
  const renderEducation = (edu, index) => (
    <React.Fragment key={index}>
      <div className="d-flex mb-15">
        <div className="me-2">
          <h5 className="mb-0 text-orange">
            <FaGraduationCap />
          </h5>
        </div>
        <div>
          <p className="mb-0">
            <span className="font-bold me-2">{edu.degree}</span>
          </p>
          <p className="mb-0">{edu.gradYear ? "Year : " + edu.gradYear : ""}</p>
          <p className="mb-0">
            {edu.specialization ? "Specialization : " + edu.specialization : ""}
          </p>
          <p className="mb-0">{edu.gpa ? "GPA : " + edu.gpa + "%" : ""}</p>
          <p className="mb-0">
            {edu.college ? "College : " + edu.college : ""}
            {edu.college ? "," : ""}
            {edu.university ? "University : " + edu.university : ""}
            {edu.university ? "," : ""}
            {edu.educationState ? edu.educationState : ""}
            {edu.educationState ? "," : ""}
            {edu.educationCountry ? edu.educationCountry : ""}
          </p>
        </div>
      </div>
    </React.Fragment>
  );

  // Render Work and Experience
  const renderWorkExp = (work, index) => (
    <React.Fragment key={index}>
      <div className="d-flex mb-15">
        <div className="me-2">
          <h6 className="mb-0 text-orange">
            <FaUserTie />
          </h6>
        </div>
        <div>
          <p className="mb-0">
            <span className="font-bold me-2">{work.companyName}</span>
          </p>
          <p className="mb-0">
            {work.workTitle ? "Role : " + work.workTitle : ""}
          </p>
          <p className="mb-0">
            {work.workFrom ? "From : " + work.workFrom : ""}
          </p>
          <p className="mb-0">{work.workTo ? "To : " + work.workTo : ""}</p>
          <p className="mb-0">
            {work.workDescription
              ? "Description : " + work.workDescription
              : ""}
          </p>
        </div>
      </div>
    </React.Fragment>
  );

  // find contact match
  const findContactMatch = useCallback(async () => {
    if (candidateData?.candidateNo && token && accessDetails?.profileViews) {
      const candidateNo = candidateData.candidateNo;
      const contactCount = accessDetails.profileViewContactDetails;
      const data = {
        candidateNo,
        contactCount,
      };
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_API_URL}employer-details/get-contact-view-count`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContactMatch(response.data);
      setIsLoading(false);
    }
  }, [token, accessDetails, candidateData]);

  const memoizedMatch = useMemo(() => findContactMatch, [findContactMatch]);

  useEffect(() => {
    memoizedMatch();
  }, [
    userid,
    usertype,
    companyid,
    token,
    candidateNo,
    getCandidateDetail,
    setAccessDetails,
    memoizedMatch,
  ]);

  return (
    <>
      {/* Banner */}
      <section className="banner-section sub-banner-py bg-orange-lightest">
        <Container fluid>
          <Row className="justify-content-center mb-0">
            <Col
              md={12}
              lg={10}
              xl={10}
              xxl={8}
              className="align-self-center text-center"
            >
              <img
                className="img-fluid profile-img mb-2"
                src={
                  candidate?.profileImg
                    ? candidate?.profileImg
                    : imagePath.human
                }
                alt="Profile"
              />
              <h2 className="text-capitalize mb-0">
                <span>{candidate?.name}</span>
              </h2>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Job Detail */}
      <section className="py-50">
        <Container fluid>
          <Row>
            <Col
              lg={5}
              xl={4}
              xxl={3}
              className="mb-30 mb-lg-0 position-relative"
            >
              <div className="h-100">
                <div className="job-company-wrap">
                  {isLoading && <LoaderBlur />}
                  <div className="text-center mb-20">
                    <img
                      className="img-fluid mb-15 profile-img"
                      src={
                        candidate?.profileImg
                          ? candidate?.profileImg
                          : imagePath.human
                      }
                      alt="Profile"
                    />
                    <h6 className="mb-1">{candidate?.name}</h6>
                    {candidate?.jobTitle?.title && (
                      <p className="text-gray-dark font-bold mb-1">
                        {candidate?.jobTitle.title}
                      </p>
                    )}
                    {candidate?.linkedin ||
                    candidate?.twitter ||
                    candidate?.facebook ? (
                      <ul className="social-ul justify-content-center">
                        {candidate?.facebook && (
                          <li>
                            <Link to={candidate?.facebook} target="_blank">
                              <img
                                className="img-fluid"
                                src={imagePath.facebook}
                                alt="Facebook"
                              />
                            </Link>
                          </li>
                        )}
                        {candidate?.twitter && (
                          <li>
                            <Link to={candidate?.twitter} target="_blank">
                              <img
                                className="img-fluid mt-1"
                                src={imagePath.twitter}
                                alt="Twitter"
                              />
                            </Link>
                          </li>
                        )}
                        {candidate?.linkedIn && (
                          <li>
                            <Link to={candidate?.linkedIn} target="_blank">
                              <img
                                className="img-fluid"
                                src={imagePath.linkedin}
                                alt="LinkedIn"
                              />
                            </Link>
                          </li>
                        )}
                      </ul>
                    ) : (
                      ""
                    )}
                  </div>
                  <hr className="mb-20" />
                  <ul className="ul-icon-wrap">
                    {candidate?.qualification && (
                      <li>
                        <div className="icon-left">
                          <SlLayers />
                        </div>
                        <div className="icon-right">
                          <h6 className="mb-1 fs-16">Qualification</h6>
                          <p>{candidate?.qualification}</p>
                        </div>
                      </li>
                    )}
                    {candidate?.salary && (
                      <li>
                        <div className="icon-left">
                          <SlWallet />
                        </div>
                        <div className="icon-right">
                          <h6 className="mb-1 fs-16">Salary</h6>
                          <p>
                            <span className="me-1">
                              {currencySymbols.rupee}
                            </span>
                            {formatSalary(candidate?.salary)}
                          </p>
                        </div>
                      </li>
                    )}
                    {candidate?.experience && (
                      <li>
                        <div className="icon-left">
                          <SlGraduation />
                        </div>
                        <div className="icon-right">
                          <h6 className="mb-1 fs-16">Experience</h6>
                          <p>{candidate?.experience} Years</p>
                        </div>
                      </li>
                    )}
                    {candidate?.country ||
                    candidate?.state ||
                    candidate?.district ? (
                      <li>
                        <div className="icon-left">
                          <SlLocationPin />
                        </div>
                        <div className="icon-right">
                          <h6 className="mb-1 fs-16">Location</h6>
                          <p>
                            {candidate?.district?.districtName},{" "}
                            {candidate?.state?.stateName},{" "}
                            {candidate?.country?.countryName}
                          </p>
                        </div>
                      </li>
                    ) : (
                      ""
                    )}
                    {contactMatch.contactView === true && candidate?.email && (
                      <li>
                        <div className="icon-left mt-1">
                          <SlEnvolope />
                        </div>
                        <div className="icon-right">
                          <p className="font-bold">{candidate?.email}</p>
                        </div>
                      </li>
                    )}
                    {contactMatch.contactView === true &&
                      candidate?.mobileNo && (
                        <li>
                          <div className="icon-left mt-1">
                            <SlPhone />
                          </div>
                          <div className="icon-right">
                            <p className="font-bold">{candidate?.mobileNo}</p>
                          </div>
                        </li>
                      )}
                  </ul>
                  {contactMatch.contactView === true && (
                    <Link
                      className={"btn btn-main py-2 w-100 mt-3"}
                      to={`tel:${candidate?.mobileNo}`}
                    >
                      <FaPhoneAlt className="me-1" />
                      Contact Me
                    </Link>
                  )}
                  {candidate?.resume && contactMatch.contactView === true && (
                    <Link
                      className={"btn btn-main py-2 w-100 mt-3"}
                      to={candidate?.resume}
                      target="_blank"
                    >
                      <FaDownload className="me-1" />
                      Download CV
                    </Link>
                  )}
                </div>
              </div>
            </Col>
            <Col lg={7} xl={8} xxl={9} className="position-relative">
              {isLoading && <LoaderBlur />}

              {/* About Me */}
              {contactMatch.contactView === false && (
              <SubscriptionAlert message={"Your package has reached the contact view limit. Buy the plan if you want to see more contact views"}/>
              )}
              {candidate?.description && (
                <>
                  <h6 className="mb-15">About Me</h6>
                  <p className="mb-0">{candidate?.description}</p>
                  <hr />
                </>
              )}

              {/* Education */}
              {candidate?.education?.length > 0 && (
                <>
                  <h6 className="mb-15">Education</h6>
                  {candidate?.education?.map((edu, index) =>
                    renderEducation(edu, index)
                  )}
                  <hr />
                </>
              )}

              {/* Work and Experience */}
              {candidate?.education?.length > 0 && (
                <>
                  <h6 className="mb-15">Experience</h6>
                  {candidate?.workExperience?.map((work, index) =>
                    renderWorkExp(work, index)
                  )}
                  <hr />
                </>
              )}

              {/* Cover Letter */}
              {candidate?.coverLetter && (
                <>
                  <h6 className="mb-15">Cover Letter</h6>
                  <p className="mb-15"> {candidate.coverLetter} </p>
                  <hr />
                </>
              )}

              {/* Video */}
              {candidate?.videoResume && (
                <>
                  <h6 className="mb-15">Video Resume</h6>
                  <Ratio aspectRatio="16x9">
                    <iframe
                      src={candidate.videoResume}
                      title="Resume video"
                      allowFullScreen
                    ></iframe>
                  </Ratio>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};
export default CandidateDetail;
