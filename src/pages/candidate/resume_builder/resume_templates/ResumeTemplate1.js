import React from "react";
import PropTypes from "prop-types";
import { Col, Container, Row } from "react-bootstrap";
import { imagePath } from "components/Constants";

const ResumeTemplate1 = ({ formData }) => {
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
  color: #3e3d43;
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
  flex: 2;
  min-width: 0;
}
.right-content{
  flex: 1;
  min-width: 0;
  border-left:1px solid #e0e6f7;
}
.image img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
h1 {
  color: #3e3d43;
  font-size:35px
}
.name p {
  font-size:16px;
    color: #3e3d43;
    font-weight:bold;
}
.summary,
.experience,
.project,
.education,
.languages,
.hobbies,  {
  margin-top: 20px;
}
h3 {
  font-size: 16px;
    margin-top:15px;
    margin-bottom:0px;
    font-family: Lato-Regular;
    font-weight: bold;
}
.summary h2,
.experience h2,
.project h2,
.education h2,
.contact h2,
.skills h2,
.languages h2,
.hobbies h2 {
  font-weight:bold;
  font-size:22px;
  margin-bottom:8px;
  color: #3e3d43;
  border-bottom: 2px solid #333;
  padding-bottom: 5px;
}
p, .skills li, .languages li {
      margin-top: 6px;
      font-size:16px;
    color: #3e3d43;
    line-height: 28px;
    
  }
ul {
  list-style: none;
  padding-left: 20px;
  margin: 0;
}
.contact{
  padding-left: 15px;
  margin:0;
}
.skills,
.languages,
.hobbies {
  padding-left: 15px;
  padding-top:15px
}
.summary p {
  margin-top: 8px;
  line-height:28px;
}
.education p {
  margin-bottom:5px
}
.education span {
  font-weight: bold;
}
.experience{
  margin-top: 16px;
}
.experience .work-date{
  margin:5px 0px;
}
.contact .date{
  flex-wrap: nowrap;
}
.data {
  display: flex;
  align-items: center;
  margin-top:5px;
  flex-wrap: nowrap;
}
.data p{
  margin-bottom: 0px;
  white-space: nowrap;
}
.address{
  display: flex;
  margin-bottom:0px;
}
.hobbies p{
  margin:0px;
  margin-top:12px;
  padding:0;
}
.languages ul{
  margin-top:12px;
  margin:0px;
  padding:0;
}
.skills ul {
  margin-top:12px;
  padding:0
}

`}
      </style>
      <Container className="content-wrapper overflow-auto">
        <Row className="main-resume">
          <Col className="left-content">
            <div className="d-flex flex-wrap gap-3">
              <div className="image">
                <img
                  src={formData?.profileImg || imagePath.human}
                  alt="profile"
                />
              </div>
              <div className="name">
                <h1>{formData?.name ? formData.name : "Full Name"}</h1>
                <p>
                  {formData?.jobTitle?.title
                    ? formData.jobTitle.title
                    : "Enter Role"}
                </p>
              </div>
            </div>

            <div className="summary mt-3">
              <h2>Summary</h2>
              <p>
                {formData?.description
                  ? formData.description
                  : "ADD DESCRIPTION"}
              </p>
            </div>

            <div className="education">
              <h2>Education</h2>
              {formData?.education?.map((edu, index) => (
                <div key={edu._id || index}>
                  <p>
                    <span>
                      {edu.degree + ",  "}
                      {edu.specialization + ",  "}
                    </span>
                    {edu.college + ", "}
                    {edu.gradYearFrom ? edu.gradYearFrom + " - " : ""}
                    {edu.gradYear.slice(0, 4) + "."}
                  </p>
                </div>
              ))}
            </div>

            <div className="experience">
              <h2>Experience</h2>
              {formData?.workExperience?.map((experience, index) => (
                <div key={experience._id || index}>
                  <h3>
                    {experience.companyName} - {experience.workTitle}
                  </h3>
                  <p className="work-date">
                    {experience.workFrom.slice(0, 7)} -{" "}
                    {experience.workTo.slice(0, 7)}
                  </p>
                  <p className="work-desc">{experience.workDescription}</p>
                </div>
              ))}
            </div>
          </Col>

          <Col className="right-content">
            <div className="contact">
              <h2>Contact</h2>
              <div className="data">
                <img
                  src={imagePath.email}
                  alt="email icon"
                  style={{
                    height: "16px",
                    marginRight: "8px",
                    marginTop: "7px",
                  }}
                />
                <p>
                  <span>
                    {formData?.email ? formData.email : "XYX@gmail.com"}
                  </span>
                </p>
              </div>
              <div className="data">
                <img
                  src={imagePath.mobile}
                  alt="mobile icon"
                  style={{
                    height: "16px",
                    marginRight: "8px",
                    marginTop: "7px",
                  }}
                />
                <p>
                  <span>
                    {formData?.mobileNo ? formData.mobileNo : "1234567899"}
                  </span>
                </p>
              </div>
              <div className="data date">
                <img
                  src={imagePath.date}
                  alt="date icon"
                  style={{
                    height: "16px",
                    marginRight: "10px",
                    marginTop: "7px",
                  }}
                />
                <p>
                  <span>
                    {formData?.dob ? formatDate(formData.dob) : "XX-XX-XXXX"}
                  </span>
                </p>
              </div>
              <div className="address">
                <img
                  src={imagePath.location}
                  alt="location icon"
                  style={{
                    height: "16px",
                    marginRight: "10px",
                    marginTop: "13px",
                  }}
                />
                <p>
                  <span>
                    {formData?.address ? formData.address : "YOUR ADDRESS"}
                  </span>
                </p>
              </div>
            </div>

            <div className="skills">
              <h2>Skills</h2>
              <ul>
                {formData?.keyskills?.map((skill, index) => (
                  <li key={skill._id || index}>{skill.skill}</li>
                ))}
              </ul>
            </div>

            <div className="languages">
              <h2>language Known</h2>
              <ul>
                {formData?.languageKnown?.map((language, index) => (
                  <li key={language._id || index}>{language.language}</li>
                ))}
              </ul>
            </div>

            <div className="hobbies">
              <h2>Hobbies</h2>
              <p>{formData?.aoi}</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

ResumeTemplate1.propTypes = {
  formData: PropTypes.object,
};
export default ResumeTemplate1;
