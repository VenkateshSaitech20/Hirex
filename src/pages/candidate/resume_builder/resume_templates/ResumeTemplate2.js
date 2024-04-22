import React from "react";
import PropTypes from "prop-types";
import { Col, Container, Image, Row } from "react-bootstrap";
import { imagePath } from "components/Constants";

function ResumeTemplate2({ formData }) {
  function formatDate(dateString) {
    if (!dateString) return "XX-XX-XXXX";

    const dateObject = new Date(dateString);

    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();

    return `${day}-${month}-${year}`;
  }
  return (
    <div>
      <style>
        {`
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.full {
  width: 100%;
  height: 100%;
  margin: 0px;
  height: calc(100vh - 50px);
  overflow-x: auto;
}
.left-content{
  flex: 1;
  padding:20px;
  background-color: #fcae4f;
  padding:20px;
  width: 200px;
}
.right-content{
  padding:20px;
  flex: 2;
  background-color: #ffff;
  width: 300px;
}
h1 {
  color: #3e3d43;
  font-size: 35px;
}
h6{
  font-family: Lato-Bold;
  font-size: 16px;
  color: #3e3d43;
  margin-top: 16px;
  color: #3e3d43;
  margin-bottom:5px;
}
p, .language li, .skills li{
  margin: 5px;
  color:#3e3d43;
  font-size:16px;
  line-height:28px;
  font-size:16px;
}
h4{
  font-size: 22px;
}
.language ul {
padding-left:18px;
}
.resume-build{
  display: flex;
  flex-wrap: nowrap
}
        `}
      </style>

      <Container className="content-wrapper overflow-auto">
        <Row className="resume-build">
          <Col className="left-content">
            <div style={{ width: "100%", margin: " 0 auto" }} className="image">
              <Image
                src={formData.profileImg || imagePath.human}
                alt="gfg-logo"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginBottom: "20px",
                  objectFit: "cover",
                }}
              />
            </div>
            <div>
              <h4>Contact</h4>
              <div className="d-flex align-items-center mx-1">
                <img
                  src={imagePath?.email}
                  alt="email icon"
                  style={{
                    height: "16px",
                    marginRight: "5px",
                    marginTop: "7px",
                  }}
                />
                <p className="text-center mb-0">
                  <span>
                    {formData?.email ? formData.email : "XYX@gmail.com"}
                  </span>
                </p>
              </div>
              <div className="d-flex align-items-center mx-1">
                <img
                  src={imagePath.mobile}
                  alt="mobile icon"
                  style={{
                    height: "16px",
                    marginRight: "5px",
                    marginTop: "7px",
                  }}
                />
                <p className="text-center mb-0">
                  <span>
                    {formData?.mobileNo ? formData.mobileNo : "1234567899"}
                  </span>
                </p>
              </div>
              <div className="d-flex  mx-1">
                <img
                  src={imagePath.date}
                  alt="date icon"
                  style={{
                    height: "15px",
                    marginRight: "5px",
                    marginTop: "12px",
                  }}
                />
                <p className=" mb-0">
                  <span>
                    {formData?.dob ? formatDate(formData.dob) : "XX-XX-XXXX"}
                  </span>
                </p>
              </div>
              <div className="d-flex mx-1">
                <img
                  src={imagePath.location}
                  alt="location icon"
                  style={{
                    height: "16px",
                    marginRight: "5px",
                    marginTop: "12px",
                  }}
                />
                <p className=" mb-0">
                  <span>
                    {formData?.address ? formData.address : "Your Location"}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-3 skills">
              <h4>Skills</h4>
              <ul className="px-3">
                {formData?.keyskills?.map((skill, index) => (
                  <li key={skill._id || index}>{skill.skill}</li>
                ))}
              </ul>
            </div>
            <div className="mb-3">
              <h4>Education</h4>
              {formData?.education?.map((edu, index) => (
                <div key={edu._id}>
                  <p>
                    {" "}
                    <span className="font-bold">
                      {edu.degree + ",  "}
                      {edu.specialization + ",  "}
                    </span>{" "}
                    {edu.college + ", "}{" "}
                    {edu.gradYearFrom ? edu.gradYearFrom + " - " : ""}
                    {edu.gradYear.slice(0, 4) + "."}{" "}
                  </p>
                </div>
              ))}
            </div>
            <div className="language">
              <h4>Language Known</h4>
              <ul>
                {formData?.languageKnown?.map((lang, index) => (
                  <li key={lang._id || index}>{lang.language}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Area Of Interest</h4>
              <p>{formData?.aoi}</p>
            </div>
          </Col>
          <Col className="right-content">
            <div className="name">
              <h1>{formData?.name ? formData?.name : "YOUR NAME"}</h1>
            </div>
            <div>
              <p className="mt-3 mb-3 font-bold">
                {formData?.jobTitle?.title
                  ? formData.jobTitle.title
                  : "ENTER ROLE"}
              </p>
            </div>
            <div>
              <h4>Summary</h4>
              <p>
                {formData?.description
                  ? formData.description
                  : "YOUR DESCRIPTION"}
              </p>
            </div>
            <div className="mt-3">
              <h4>Experience</h4>
              {formData?.workExperience?.map((exp, index) => (
                <div key={exp._id}>
                  <h6>{`${exp.companyName} - ${exp.workTitle}`}</h6>
                  <p>{`${exp.workFrom.slice(0, 7)} - ${exp.workTo.slice(
                    0,
                    7
                  )}`}</p>
                  <p>{exp.workDescription}</p>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
ResumeTemplate2.propTypes = {
  formData: PropTypes.object,
};
export default ResumeTemplate2;
