import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSessionStorage } from "context/SessionStorageContext";
import DashboardBanner from "components/DashboardBanner";
import { Link, useLocation } from "react-router-dom";
import ResumeTemplate1 from "pages/candidate/resume_builder/resume_templates/ResumeTemplate1";
import ResumeTemplate2 from "pages/candidate/resume_builder/resume_templates/ResumeTemplate2";
import ResumeTemplate3 from "pages/candidate/resume_builder/resume_templates/ResumeTemplate3";
import ResumeTemplate4 from "pages/candidate/resume_builder/resume_templates/ResumeTemplate4";
import { imagePath } from "components/Constants";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import TemplateButton from "pages/candidate/resume_builder/resume_templates/TemplateButton";
import CandidatePersonalDetails from "./components/CandidatePersonalDetails";
import CandidateProfileDetails from "./components/CandidateProfileDetails";
import CandidateSkillDetails from "./components/CandidateSkillDetails";
import CandidateEducationDetails from "./components/CandidateEducationDetails";
import CandidateExperienceDetails from "./components/CandidateExperienceDetails";
import CandidateLanguageDetails from "./components/CandidateLanguageDetails";
// import CandidateCoverLetterDetails from "./components/CandidateCoverLetterDetails";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Loader from "components/Loader";
import SeoComponent from "components/SeoComponent";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const ResumeBuild = () => {
  const { userid, token, usertype, setUsername } = useSessionStorage();

  const [formData, setFormData] = useState({});
  const [templeteId, setTempleteId] = useState("1");
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [isLoading, setIsLoading] = useState(false);

  const [err, setErr] = useState();

  const templateComponents = {
    template1: ResumeTemplate1,
    template2: ResumeTemplate2,
    template3: ResumeTemplate3,
    template4: ResumeTemplate4,
  };

  // Get Data from DB
  const getDbData = useCallback(async () => {
    const response = await axios.get(
      BASE_API_URL + "candidate-details/" + userid + "/" + usertype,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response?.data) {
      setFormData(response?.data?.candidate_detail);
    }
  }, [userid, token, usertype]);

  useEffect(() => {
    if (userid && token) {
      getDbData();
    }
  }, [userid, token, getDbData, usertype]);

  // handle change for Single Field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle change for multifield Fields
  const handleChange = (e, field, index) => {
    const { value } = e.target;

    if (field === "keyskills") {
      const generateSlug = (value) => {
        const slug_name = value?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
        return slug_name.replace(/(^-+|-+$)/g, "");
      };
      const updatedSkills = [...formData.keyskills];
      updatedSkills[index] = { skill: value, slug: generateSlug(value) };

      setFormData((prevFormData) => ({
        ...prevFormData,
        keyskills: updatedSkills,
      }));
    } else if (field === "education") {
      const updatedEducation = [...formData.education];
      updatedEducation[index][e.target.name] = e.target.value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        education: updatedEducation,
      }));
    } else if (field === "workExperience") {
      const updatedWorkExperience = [...formData.workExperience];
      updatedWorkExperience[index][e.target.name] = value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        workExperience: updatedWorkExperience,
      }));
    } else if (field === "year of passing") {
      const updatedYear = [...formData.education];
      updatedYear[index] = { ...updatedYear[index], gradYear: value };

      setFormData((prevFormData) => ({
        ...prevFormData,
        education: updatedYear,
      }));
    } else if (field === "dob") {
      setFormData({
        ...formData,
        dob: {
          $date: new Date(value).toISOString(),
        },
      });
    } else if (field === "title") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        jobTitle: {
          ...prevFormData.jobTitle,
          title: value,
        },
      }));
    } else if (field === "language") {
      const updatedLanguage = [...formData.languageKnown];
      updatedLanguage[index] = { ...updatedLanguage[index], language: value };
      setFormData((prevFormData) => ({
        ...prevFormData,
        languageKnown: updatedLanguage,
      }));
    } else if (field === "proficiencyName") {
      const updatedLanguage = [...formData.languageKnown];
      updatedLanguage[index] = {
        ...updatedLanguage[index],
        proficiencyName: value,
      };
      setFormData((prevFormData) => ({
        ...prevFormData,
        languageKnown: updatedLanguage,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value,
      }));
    }
  };

  // Skill Field
  const handleAddSkill = () => {
    setErr({});
    const skillErrors = {};
    let areSkillsFilled = true;

    formData.keyskills.forEach((skill, index) => {
      if (skill.skill === "") {
        skillErrors[`keyskills[${index}]`] = "Skill is Required";
        areSkillsFilled = false;
      }
    });

    // Check if skills are not filled
    if (!areSkillsFilled) {
      setErr((prevErr) => ({ ...prevErr, ...skillErrors }));
      return;
    }

    setFormData({
      ...formData,
      keyskills: [...formData.keyskills, { slug: "", skill: "" }],
    });
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...formData.keyskills];
    updatedSkills.splice(index, 1);
    setFormData({
      ...formData,
      keyskills: updatedSkills,
    });
  };

  // Education Field
  const handleAddEducation = () => {
    setErr({});
    const educationErrors = {};
    let isEducationFilled = true;

    formData.education.forEach((edu, index) => {
      if (edu.college === "") {
        educationErrors[`college[${index}]`] = "College is Required";
        isEducationFilled = false;
      }
      if (edu.degree === "") {
        educationErrors[`degree[${index}]`] = "Degree is Required";
        isEducationFilled = false;
      }
      if (edu.specialization === "") {
        educationErrors[`specialization[${index}]`] =
          "Specialization is Required";
        isEducationFilled = false;
      }
    });

    // Check if education is not filled
    if (!isEducationFilled) {
      setErr((prevErr) => ({ ...prevErr, ...educationErrors }));
      return;
    }

    // If no errors, proceed to add a new education entry
    setErr((prevErr) => ({ ...prevErr, education: "" }));

    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: "",
          specialization: "",
          gradYearFrom: "",
          gradYear: "",
          gpa: "",
          college: "",
          university: "",
          educationState: "",
          educationCountry: "",
        },
      ],
    });
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  // Experience Field
  const handleAddWorkExperience = () => {
    setErr({});
    const experienceErrors = {};
    let isExperienceFilled = true;

    formData.workExperience.forEach((exp, index) => {
      if (exp.workTitle === "") {
        experienceErrors[`workTitle[${index}]`] = "Role is Required";
        isExperienceFilled = false;
      }
      if (exp.companyName === "") {
        experienceErrors[`companyName[${index}]`] = "Company Name is Required";
        isExperienceFilled = false;
      }
      if (exp.workFrom === "") {
        experienceErrors[`workFrom[${index}]`] = "Date is Required";
        isExperienceFilled = false;
      }
    });
    if (isExperienceFilled) {
      setFormData({
        ...formData,
        workExperience: [
          ...formData.workExperience,
          {
            companyName: "",
            workTitle: "",
            workFrom: "",
            workTo: "",
            workDescription: "",
          },
        ],
      });
    } else {
      return setErr(experienceErrors);
    }
  };

  const handleRemoveWorkExperience = (index) => {
    const updatedWorkExperience = [...formData.workExperience];
    updatedWorkExperience.splice(index, 1);
    setFormData({ ...formData, workExperience: updatedWorkExperience });
  };

  // Language Field
  const handleAddLanguage = () => {
    setErr({});
    const languageErrors = {};
    let areLanguagesFilled = true;

    formData.languageKnown.forEach((lang, index) => {
      if (lang.language === "") {
        languageErrors[`language[${index}]`] = "Language is Required";
        areLanguagesFilled = false;
      }
    });

    if (!areLanguagesFilled) {
      setErr((prevErr) => ({ ...prevErr, ...languageErrors }));
    } else {
      setFormData({
        ...formData,
        languageKnown: [...formData.languageKnown, { language: "" }],
      });
    }
  };

  const handleRemoveLanguage = (index) => {
    const updatedLanguage = [...formData.languageKnown];
    updatedLanguage.splice(index, 1);
    setFormData({ ...formData, languageKnown: updatedLanguage });
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        BASE_API_URL + "resume-download/" + templeteId,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "json",
        }
      );
      setIsLoading(false);

      if (response?.data && response?.data?.fileLink) {
        window.open(response.data.fileLink, "_blank");
      } else {
        console.error("No fileLink found in the response:", response);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const updateProfile = async () => {
    setErr({});
    let response;

    try {
      // Check job title
      let isRoleFilled = true;
      if (formData.jobTitle.title === "") {
        setErr({ title: "Role is Required" });
        isRoleFilled = false;
      }
      // Check education fields
      const educationErrors = {};
      let isEducationFilled = true;

      formData.education.forEach((edu, index) => {
        if (edu.college === "") {
          educationErrors[`college[${index}]`] = "College is Required";
          isEducationFilled = false;
        }
        if (edu.degree === "") {
          educationErrors[`degree[${index}]`] = "Degree is Required";
          isEducationFilled = false;
        }
        if (edu.specialization === "") {
          educationErrors[`specialization[${index}]`] =
            "Specialization is Required";
          isEducationFilled = false;
        }
      });

      // Check if education is not filled
      if (!isEducationFilled) {
        setErr((prevErr) => ({ ...prevErr, ...educationErrors }));
      }

      // Check work experience fields
      const workExperienceErrors = {};
      let isWorkExperienceFilled = true;

      formData.workExperience.forEach((experience, index) => {
        if (experience.companyName === "") {
          workExperienceErrors[`companyName[${index}]`] =
            "Company Name is Required";
          isWorkExperienceFilled = false;
        }
        if (experience.workTitle === "") {
          workExperienceErrors[`workTitle[${index}]`] = "Role is Required";
          isWorkExperienceFilled = false;
        }
        if (experience.workFrom === "") {
          workExperienceErrors[`workFrom[${index}]`] = "Date is Required";
          isWorkExperienceFilled = false;
        }
      });

      // Check if work experience is not filled
      if (!isWorkExperienceFilled) {
        setErr((prevErr) => ({ ...prevErr, ...workExperienceErrors }));
      }

      // Check skill fields
      const skillErrors = {};
      let areSkillsFilled = true;

      formData.keyskills.forEach((skill, index) => {
        if (skill.skill === "") {
          skillErrors[`keyskills[${index}]`] = "Skill is Required";
          areSkillsFilled = false;
        }
      });

      // Check if skills are not filled
      if (!areSkillsFilled) {
        setErr((prevErr) => ({ ...prevErr, ...skillErrors }));
      }

      // Check language fields
      const languageErrors = {};
      let areLanguagesFilled = true;

      formData.languageKnown.forEach((lang, index) => {
        if (lang.language === "") {
          languageErrors[`language[${index}]`] = "Language is Required";
          areLanguagesFilled = false;
        }
      });

      // Check if languages are not filled
      if (!areLanguagesFilled) {
        setErr((prevErr) => ({ ...prevErr, ...languageErrors }));
      }

      //  Excecute only All the fields are Filled
      if (
        isRoleFilled &&
        isEducationFilled &&
        isWorkExperienceFilled &&
        areSkillsFilled &&
        areLanguagesFilled &&
        Object.keys(educationErrors).length === 0 &&
        Object.keys(workExperienceErrors).length === 0 &&
        Object.keys(skillErrors).length === 0 &&
        Object.keys(languageErrors).length === 0
      ) {
        response = await axios.put(
          BASE_API_URL + "candidate-details/" + userid,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response?.data?.result) {
          toast.success("Profile updated successfully", { theme: "colored" });
          localStorage.setItem("username",formData.name)
          setUsername(formData.name);
        } else {
          setErr(response.data.errors);
        }
      }
    } catch (error) {
      console.error("Error during profile update:", error);
    }
  };

  const location = useLocation();
  const currentUrl = location.pathname;
  const lastSegment = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

  return (
    <>
      <SeoComponent slug={lastSegment} />

      <DashboardBanner />
      <ToastContainer />
      <Container fluid>
        <Row className="justify-content-between py-50">
          {/* Templete Image 1 */}
          <Col sm={6} md={3}>
            <Image
              src={imagePath.resumeOne}
              alt="resume-image-one"
              className="hover-up img-fluid p-0 mt-3"
              onClick={() => {
                setSelectedTemplate("template1");
                setTempleteId("1");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedTemplate("template1");
                  setTempleteId("1");
                }
              }}
            />
          </Col>

          {/* Templete Image 2 */}
          <Col sm={6} md={3}>
            <Image
              src={imagePath.resumeTwo}
              alt="resume-tmage-two"
              className="hover-up img-fluid p-0 mt-3"
              onClick={() => {
                setSelectedTemplate("template2");
                setTempleteId("2");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedTemplate("template2");
                  setTempleteId("2");
                }
              }}
            />
          </Col>
          {/* Templete Image 3 */}
          <Col sm={6} md={3}>
            <Image
              src={imagePath.resumeThree}
              alt="resume-image-three"
              className="hover-up img-fluid p-0 mt-3"
              onClick={() => {
                setSelectedTemplate("template3");
                setTempleteId("3");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedTemplate("template3");
                  setTempleteId("3");
                }
              }}
            />
          </Col>
          {/* Templete Image 4 */}
          <Col sm={6} md={3}>
            <Image
              src={imagePath.resumeFour}
              alt="resume-image-four"
              className="hover-up img-fluid p-0 mt-3"
              onClick={() => {
                setSelectedTemplate("template4");
                setTempleteId("4");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedTemplate("template4");
                  setTempleteId("4");
                }
              }}
            />
          </Col>
        </Row>
      </Container>
      <Container fluid>
        <Row>
          <Col md={12} xl={6}>
            <div className="resume-build-nav-tab ">
              <Tabs
                defaultActiveKey="personal"
                id="justify-tab-example"
                justify
                varient="pills"
              >
                <Tab eventKey="personal" title="Personal">
                  <CandidatePersonalDetails
                    formData={formData}
                    onChange={handleInputChange}
                    onhandleChange={handleChange}
                    err={err}
                  />
                </Tab>
                <Tab eventKey="profile" title="Profile">
                  <CandidateProfileDetails
                    formData={formData}
                    onChange={handleInputChange}
                    err={err}
                  />
                </Tab>
                <Tab eventKey="skill" title="Skill">
                  <CandidateSkillDetails
                    formData={formData}
                    onChange={handleChange}
                    onAddSkill={handleAddSkill}
                    onRemoveSkill={handleRemoveSkill}
                    err={err}
                  />
                </Tab>

                <Tab eventKey="education" title="Education">
                  <CandidateEducationDetails
                    formData={formData}
                    onChange={handleChange}
                    onAddEducation={handleAddEducation}
                    onRemoveEducation={handleRemoveEducation}
                    err={err}
                  />
                </Tab>

                <Tab eventKey="experience" title="Experience">
                  <CandidateExperienceDetails
                    formData={formData}
                    onChange={handleChange}
                    onAdd={handleAddWorkExperience}
                    onRemove={handleRemoveWorkExperience}
                    err={err}
                  />
                </Tab>

                <Tab eventKey="language" title="Language">
                  <CandidateLanguageDetails
                    formData={formData}
                    onChange={handleChange}
                    onAddLanguage={handleAddLanguage}
                    onRemoveLanguage={handleRemoveLanguage}
                    err={err}
                  />
                </Tab>

                {/* <Tab eventKey="cover" title="Cover Letter">
                  <CandidateCoverLetterDetails
                    formData={formData}
                    onChange={handleInputChange}
                    err={err}
                  />
                </Tab> */}
              </Tabs>
            </div>

            <div className="d-flex flex-wrap justify-content-md-between gap-2 mb-4">
              <Button className="btn btn-main mt-3" onClick={updateProfile}>
                Update Profile
              </Button>

              <div className="d-flex mt-3 ">
                <Link to="/candidate/dashboard" className="btn btn-main ">
                  Back to Dashboard
                </Link>
                <Button className="btn btn-main mx-2" onClick={handleDownload}>
                  Download PDF
                </Button>
                {isLoading && <Loader />}
              </div>
            </div>

          </Col>

          <Col >
            {/* Preview div */}
            {templateComponents[selectedTemplate] &&
              React.createElement(templateComponents[selectedTemplate], {
                formData,
              })}
            <TemplateButton
              templateKey="template1"
              setSelectedTemplate={setSelectedTemplate}
              setTempleteId={setTempleteId}
            />
            <TemplateButton
              templateKey="template3"
              setSelectedTemplate={setSelectedTemplate}
              setTempleteId={setTempleteId}
            />
            <TemplateButton
              templateKey="template2"
              setSelectedTemplate={setSelectedTemplate}
              setTempleteId={setTempleteId}
            />
            <TemplateButton
              templateKey="template4"
              setSelectedTemplate={setSelectedTemplate}
              setTempleteId={setTempleteId}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ResumeBuild;
