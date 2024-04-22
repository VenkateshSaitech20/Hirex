import React from "react";
import PropTypes from "prop-types";
import { Container } from "react-bootstrap";

const ResumeTemplate3 = ({ formData }) => {
  const educationList = formData?.education?.map((edu, index) => (
    <div key={edu._id}>
      <p>
        <span>{edu.degree + ",  "}{edu.specialization + ",  "}</span> {edu.college + ", "}{" "}
        {edu.gradYearFrom ? edu.gradYearFrom + " - " : ""}
        {edu.gradYear.slice(0, 4) + "."}{" "}
      </p>
    </div>
  ));

  const workExperienceList = formData?.workExperience?.map(
    (experience, index) => (
      <div key={experience._id}>
        <h3>{`${experience.companyName} - ${experience.workTitle}`}</h3>
        <p className="work-date">{`${experience.workFrom.slice(0, 7)} - ${experience.workTo.slice(
          0,
          7
        )}`}</p>
        <p>{experience.workDescription}</p>
      </div>
    )
  );

  const skillsList = formData?.keyskills?.map((skill, index) => (
    <li key={skill._id}>{skill.skill}</li>
  ));

  const languagesList = formData?.languageKnown?.map((language, index) => (
    <li key={language._id}>{language.language}</li>
  ));

  const hobbiesList = formData?.aoi
    ? formData.aoi
        .split(",")
        .map((item, index) => <li key={item}>{item.trim()}</li>)
    : null;

  return (
    <>
      <style>
        {`
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            .summary h2, .education h2, .experience h2, .skills h2, .languages h2, .hobbies h2 {
              font-weight:bold;
              font-size:22px;
              margin-bottom:15px;
              color: #3e3d43;
            }
            p, .hobbies li, .skills li {
              margin-top: 6px;
              font-size:16px;
            color: #3e3d43;
            line-height: 28px;
            
          }
            .contact {
              display: flex;
              justify-content: space-between;
              
            }
            .contact .right-border
             {
              border-right: 3px solid #3e3d43;
              margin-left:35px;
              margin-right:35px;
            }
             h1 {
              color: #3e3d43;
              text-align: center;
              font-size:35px
            }
            h3{
              font-weight:bold;
              font-size:18px;
              margin-bottom:8px;
              color: #3e3d43;
            }
            .name p{
              text-align: center;
              font-size:16px;
              color: #3e3d43;
              font-weight:bold;
            }
.summary, .education, .experience, .skills, .languages {
  border-bottom: 2px solid #3e3d43;
  margin-top:20px;
}
.education span{
  font-weight: bold;
}
.education p {
  margin-bottom:5px
}
.education  {
  padding-bottom:16px
}
 ul{
  display: flex;
}
.hobbies li, .skills li, .languages li{
  margin-right:50px;
}
.hobbies{
  margin-top:20px;

}
.summary{
  margin-top: 8px;
}
.work-date {
  margin:0;
}
.experience p{
  margin-top:8px;
}
        `}
      </style>
      <Container className="content-wrapper overflow-auto full">
        <div className="name">
          <h1>{formData.name ? formData.name : "Full Name"}</h1>
          <p>
            {formData?.jobTitle?.title ? formData.jobTitle.title : "Enter Role"}
          </p>
        </div>
        <div className="contact">
          <p >
            {formData.address ? formData.address : "XX, XYZ Street "}
          </p>
          <span className="right-border"></span>
          <p>
            {formData.mobileNo ? formData.mobileNo : "1234567899"}
          </p>
          <span className="right-border"></span>
          <p>{formData.email ? formData.email : "xyz@gmail.com"}</p>
        </div>
        <div className="summary">
          <h2>Profile Summary</h2>
          <p>
            {formData.description ? formData.description : "ADD DESCRIPTION"}
          </p>
        </div>
        <div className="education">
          <h2>Education</h2>
          {educationList}
        </div>
        <div className="experience">
          <h2>Experience</h2>
          {workExperienceList}
        </div>
        <div className="skills">
          <h2>Skills</h2>
          <ul>{skillsList}</ul>
        </div>
        <div className="languages">
          <h2>Language Known</h2>
          <ul>{languagesList}</ul>
        </div>
        <div className="hobbies">
          <h2>Hobbies</h2>
          <ul className="d-flex gap-5">{hobbiesList}</ul>
        </div>
      </Container>
    </>
  );
};
ResumeTemplate3.propTypes = {
  formData: PropTypes.object,
};
export default ResumeTemplate3;
