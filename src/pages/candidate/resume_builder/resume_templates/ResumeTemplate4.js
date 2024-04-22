import React from "react";
import PropTypes from "prop-types";
import { Col, Image } from "react-bootstrap";
import { imagePath } from "components/Constants";

function ResumeTemplate4({ formData }) {
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
      <div>
        <style>
          {`
body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: rgb(253, 254, 255);
  }
  .main-resume {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding:0px;
  display:flex;

  }
  .left-content {
  flex: 2;
  width: 300px;
  background-color: #fff3e6;
  padding:20px;
  }
  .right-content {
    background-color: #ffcc99;
    flex: 1;
    width: 200px;
    padding: 20px;
  }
  .name h1{
    font-size: 35px;
  }
  .summary h2, .education h2, .experience h2, .skills h2, .language h2, .hobbies h2, .contact h2 {
    font-weight:bold;
    font-size:22px;
    color: #3e3d43;
    margin-bottom:15px;
  }
  p, .skills li, .language li {
      margin-top: 6px;
      font-size:16px;
    color: #3e3d43;
    line-height: 28px;
    
  }
  li{
    margin:0
  }
  .contact p{
    font-size:16px;
    color: #3e3d43;
    margin-bottom:6px;
  }
  .experience p, .cover p{
    line-height:25px;
  }
  .experience h3 {
    font-size: 18px;
    margin-top:15px;
    margin-bottom:0px;
  }
  .experience .work-date {
    margin-bottom:8px;
    font-size: 16px;

  }
 .skills ul, .language ul{
    padding-left:20px
  }
  .skills {
    margin-bottom:10px;
  }
  .title p{
    font-size:16px;
    margin: 16px 5px;
    color: #3e3d43;
    font-weight:bold;
  }
   .data {
    display: flex;
    align-items: center;
    margin-top:5px
  }
  .data p{
    text-align: center;
    margin-bottom: 0px;
  }
  .address{
    display: flex;
    margin-bottom:16px;
  }
  .education span{
    font-weight: bold;
  }
  .education p {
    margin-bottom:5px
  }
  .education h4{
    font-size:22px;
    margin-top:20px
  }
  `}
        </style>
      </div>
        <div className="main-resume overflow-auto">
          <Col className="left-content">
            <div className="name">
              <h1>{formData?.name ? formData.name : "YOUR NAME"}</h1>
            </div>
            <div className="title">
              <p>
                {formData?.jobTitle?.title
                  ? formData.jobTitle.title
                  : "ENTER ROLE"}
              </p>
            </div>

            <div className="summary">
              <h2>Summary</h2>
              <p>
                {formData?.description
                  ? formData.description
                  : "YOUR DESCRIPTION"}
              </p>
            </div>
            <div className="experience">
              <h2>Experience</h2>

              {formData?.workExperience?.map((exp, index) => (
                <div key={exp._id || index}>
                  <h3>{`${exp.companyName} - ${exp.workTitle}`}</h3>
                  <p className="work-date">{`${exp.workFrom.slice(
                    0,
                    7
                  )} - ${exp.workTo.slice(0, 7)}`}</p>
                  <p>{exp.workDescription}</p>
                </div>
              ))}
            </div>
          </Col>

          <Col className="right-content">
            <div style={{ width: "100%", margin: " 0 auto" }} className="image">
              <Image
                src={formData?.profileImg || imagePath.human}
                alt="gfg-logo"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginBottom: "15px",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="contact">
              <h2>Contact</h2>
              <div className="data">
                <img
                  src={imagePath.email}
                  alt="email icon"
                  style={{
                    height: "16px",
                    marginRight: "5px",
                    marginTop: "7px",
                  }}
                />
                <p className="overflow-hidden">
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
                    marginRight: "5px",
                    marginTop: "7px",
                  }}
                />
                <p>
                  <span>
                    {formData?.mobileNo ? formData.mobileNo : "1234567899"}
                  </span>
                </p>
              </div>
              <div className="data">
                <img
                  src={imagePath.date}
                  alt="date icon"
                  style={{
                    height: "16px",
                    marginRight: "5px",
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
                    marginRight: "5px",
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
                  <li key={skill._id || index}> {skill.skill} </li>
                ))}
              </ul>
            </div>
            <div className="education mb-3">
              <h4>Education</h4>
              {formData?.education?.map((edu, index) => (
                <div key={edu._id || index}>
                  <p>
                    {" "}
                    <span>
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
              <h2>Language Known</h2>
              <ul>
                {formData?.languageKnown?.map((lang, index) => (
                  <li key={lang._id || index}>{lang.language}</li>
                ))}
              </ul>
            </div>
            <div className="hobbies">
              <h2>Area Of Interest</h2>
              <p>{formData?.aoi}</p>
            </div>
          </Col>
        </div>
      </div>
  );
}
ResumeTemplate4.propTypes = {
  formData: PropTypes.object,
};
export default ResumeTemplate4;
