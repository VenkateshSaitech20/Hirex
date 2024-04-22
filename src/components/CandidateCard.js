import { useState, useCallback } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { currencySymbols } from "./Constants";
import { useSessionStorage } from "context/SessionStorageContext";
import SeoComponent from "./SeoComponent";
import { formatSalary } from "utils/formatSalary";
import Loader  from "components/Loader";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const CandidateCard = (candidate) => {
  const { token } = useSessionStorage();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = useCallback(
    async (candidateNo) => {
      setIsLoading(true)
      const contactViewResponse = await axios.post(
        `${BASE_API_URL}employer-details/get-profile-view-count`,
        {
          candidateNo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsLoading(false)

      if (contactViewResponse.data.profileView === false || contactViewResponse.data.validity === false) {
        sessionStorage.setItem(
          "profileviewalert",
          "Your package has reached the profile view limit. Buy the plan if you want to see more profile views"
        );
        navigate("/employer/pricing-plan");
      } else {
        navigate(`/candidate/${candidate.rediredTo}`);
      }
    },
    [token, candidate.rediredTo, navigate]
  );


  const location = useLocation();
  const currentUrl = location.pathname;
  const lastSegment = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

  return (
    <>
      <SeoComponent slug={lastSegment} />
      {isLoading && <Loader />}
      <Card className="job-card hover-up">
        <Card.Header>
          <div className="job-card-image-left">
            <Row className="g-2">
              <Col xs={2}>
                <img
                  className={`img-fluid candidate-profile-img`}
                  src={candidate.image}
                  alt="Brand"
                />
              </Col>
              <Col xs={9}>
                <div className="right-info">
                  <Link
                    className="name-job"
                    onClick={() => handleButtonClick(candidate.rediredTo)}
                  >
                    {candidate.name}
                  </Link>
                  <span className="location-small">{candidate.location}</span>
                </div>
              </Col>
            </Row>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="job-card-block-info">
            <h6 className="mb-0">
              <Link to={`/candidate/${candidate.rediredTo}`}>
                {candidate.jobTitle}
              </Link>
            </h6>
            <span className="job-card-briefcase mt-1 mb-1">
              {candidate?.qualification}
            </span>
            {candidate && candidate?.experience?.trim() !== "" ? (
              <span className="job-card-experience mt-1 mb-1">
                {candidate.experience} yrs
              </span>
            ) : (
              <span className="job-card-experience mt-1 mb-1">0 yrs</span>
            )}
            <p className="mb-1 limit-desc">{candidate.desc}</p>
          </div>
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col xs={7} className="align-self-center">
              {candidate.salary && (
                <span className="font-bold">
                  {currencySymbols.rupee} {formatSalary(candidate.salary)}{" "}
                </span>
              )}
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};
export default CandidateCard;
