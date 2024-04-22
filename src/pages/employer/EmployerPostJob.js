import { useEffect, useCallback, useState } from "react";
import Container from "react-bootstrap/Container";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import DashboardBanner from "components/DashboardBanner";
import EmployerMenu from "components/EmployerMenu";
import { useSessionStorage } from "context/SessionStorageContext";
import { useClearStorage } from "utils/useClearStorage";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "components/Loader";
import LoaderButton from "components/LoaderButton";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import axios from "axios";
import { currencySymbols } from "components/Constants";
import { subscriptionPlan } from "./subscription/subscription";
import SubscriptionAlert from "components/SubscriptionAlert";
import SeoComponent from "components/SeoComponent";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const workTypes = [
  {
    type: "Yes",
    slug: "yes",
  },
  {
    type: "No",
    slug: "no",
  },
  {
    type: "Temporarily",
    slug: "temporarily",
  },
];

const salaryTypes = [
  {
    type: "Weekly",
    slug: "weeks",
  },
  {
    type: "Monthly",
    slug: "months",
  },
  {
    type: "Yearly",
    slug: "years",
  },
];

const leadTimes = [
  {
    slug: "immediately",
    time: "Immediately",
  },
  {
    slug: "1-week",
    time: "1 Week",
  },
  {
    slug: "4-weeks",
    time: "4 Weeks",
  },
  {
    slug: "4-to-8-weeks",
    time: "4 to 8 Weeks",
  },
];

const experience = [
  { slug: "1", exp: "1 Year" },
  { slug: "2", exp: "2 Years" },
  { slug: "3", exp: "3 Years" },
  { slug: "4", exp: "4 Years" },
  { slug: "5", exp: "5 Years" },
  { slug: "6", exp: "6 Years" },
  { slug: "7", exp: "7 Years" },
  { slug: "8", exp: "8 Years" },
  { slug: "9", exp: "9 Years" },
  { slug: "10", exp: "10 Years" },
  { slug: "11", exp: "11 Years" },
  { slug: "12", exp: "12 Years" },
  { slug: "13", exp: "13 Years" },
  { slug: "14", exp: "14 Years" },
  { slug: "15", exp: "15 Years" },
  { slug: "16", exp: "16 Years" },
  { slug: "17", exp: "17 Years" },
  { slug: "18", exp: "18 Years" },
  { slug: "19", exp: "19 Years" },
  { slug: "20", exp: "20 Years" },
];

const maxExperience = [
  { slug: "2", exp: "2 Years" },
  { slug: "3", exp: "3 Years" },
  { slug: "4", exp: "4 Years" },
  { slug: "5", exp: "5 Years" },
  { slug: "6", exp: "6 Years" },
  { slug: "7", exp: "7 Years" },
  { slug: "8", exp: "8 Years" },
  { slug: "9", exp: "9 Years" },
  { slug: "10", exp: "10 Years" },
  { slug: "11", exp: "11 Years" },
  { slug: "12", exp: "12 Years" },
  { slug: "13", exp: "13 Years" },
  { slug: "14", exp: "14 Years" },
  { slug: "15", exp: "15 Years" },
  { slug: "16", exp: "16 Years" },
  { slug: "17", exp: "17 Years" },
  { slug: "18", exp: "18 Years" },
  { slug: "19", exp: "19 Years" },
  { slug: "20", exp: "20 Years" },
];

const EmployerPostJob = () => {
  const navigate = useNavigate();
  const [jobTypes, setJobTypes] = useState();
  const [jobCategories, setJobCategories] = useState();
  const [companyDetails, setCompanyDetails] = useState();
  const [employerDetails, setEmployerDetails] = useState();
  const [qualifications, setQualifications] = useState();
  const [progLangs, setProgLangs] = useState();
  const [proofs, setProofs] = useState();
  const [countries, setCountries] = useState();
  const [states, setStates] = useState();
  const [selectedState, setSelectedState] = useState(null);
  const [districts, setDistricts] = useState();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [err, setErr] = useState();
  const [slugCountryId, setSlugCountryId] = useState(null);
  const [slugStateId, setSlugStateId] = useState(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isStateButtonLoading, setIsStateButtonLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { jobSlug } = useParams();
  const { userid, token, companyid, companyname } = useSessionStorage();
  const { clearStorage } = useClearStorage();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const [jobCount, setJobCount] = useState();
  const [accessDetails, setAccessDetails] = useState({});
  const [metaData, setMetaData] = useState({})

  // Get Job Types
  const getTypeOfJobs = useCallback(async () => {
    const response = await axios.get(BASE_API_URL + "master-jobtype");
    setJobTypes(response?.data);
  }, []);

  // Get Job Category
  const getJobCategory = useCallback(async () => {
    const response = await axios.get(BASE_API_URL + "master-job-category");
    setJobCategories(response?.data);
  }, []);

  // Get Qualification
  const getQualification = useCallback(async () => {
    const response = await axios.get(BASE_API_URL + "master-qualification");
    setQualifications(response?.data);
  }, []);

  // Get Qualification
  const getProgLangs = useCallback(async () => {
    const response = await axios.get(
      BASE_API_URL + "master-programming-language"
    );
    setProgLangs(response?.data);
  }, []);

  // Get Qualification
  const getProofs = useCallback(async () => {
    const response = await axios.get(BASE_API_URL + "master-proof");
    setProofs(response?.data);
  }, []);

  // Get Countries
  const getCountries = useCallback(() => {
    axios.get(BASE_API_URL + "master-country").then((response) => {
      if (response?.data) {
        setCountries(response.data);
      }
    });
  }, []);

  const getStatesByCountry = useCallback((countryID) => {
    setIsStateButtonLoading(true);
    axios.get(BASE_API_URL + "master-state/by-country/" + countryID).then((response) => {
      if (response?.data) {
        setStates(response.data);
        setIsStateButtonLoading(false);
      }
    });
  }, [])

  const getDistrictsByState = useCallback((stateID) => {
    setIsButtonLoading(true);
    axios.get(BASE_API_URL + "master-district/by-state/" + stateID).then((response) => {
      if (response?.data) {
        setDistricts(response.data);
        setIsButtonLoading(false);
      }
    });
  }, [])

  const handleStates = (selectedCountryId) => {
    setSelectedState(null);
    setValue("state", selectedState);
    setSelectedDistrict(null);
    setValue("district", selectedDistrict);
    setDistricts(selectedDistrict);
    getStatesByCountry(selectedCountryId);
  };

  // Districts populated based on state
  const handleDistricts = (selectedStateId) => {
    setSelectedDistrict(null);
    setValue("district", selectedDistrict);
    getDistrictsByState(selectedStateId);
  };

  // Get company detail
  const getCompanyDetail = useCallback(async () => {
    const response = await axios.get(BASE_API_URL + "companies/" + companyid);
    if (response?.data?.result === true) {
      const data = response.data.companyDetail;
      setCompanyDetails(data);
      let meta_data = {
        metaTitle: response?.data?.companyDetail?.companyName,
        metaDescription: response?.data?.companyDetail?.description,
        metaKeywords: response?.data?.companyDetail?.description
      }
      setMetaData(meta_data);
    }
  }, [companyid]);

  // Get employer detail
  const getEmployerDetail = useCallback(async () => {
    const response = await axios.get(
      BASE_API_URL + "employer-details/" + userid,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response?.data?.result === true) {
      const data = response.data.employer_detail;
      setEmployerDetails(data);
    } else if (response?.data?.result === false) {
      clearStorage();
      sessionStorage.setItem("loginErr", LOGIN_ERR);
      navigate("/employer/login");
    }
  }, [userid, token, clearStorage, navigate]);

  // Generate Slug
  const generateSlug = (jobTitle) => {
    const slug_name = jobTitle?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
    return slug_name.replace(/(^-+|-+$)/g, "");
  };

  // Post company details
  const postCompanyDetails = useCallback((data) => {
    if (companyDetails) {
      data.companyDetail = {
        companyId: companyid,
        companyName: companyDetails.companyName,
        companySlug: companyDetails.companySlug,
        companyLogo: companyDetails.companyLogo || "",
        companyType: companyDetails.companyType,
        companyDesc: companyDetails.description,
      };
    } else {
      return;
    }
  }, [companyDetails, companyid]);

  // Post employer details
  const postEmployerdetails = useCallback((data) => {
    if (employerDetails) {
      data.employerDetail = {
        employerNo: employerDetails.employerNo,
        name: employerDetails.name,
        email: employerDetails.email,
        mobileNo: employerDetails.mobileNo,
      };
    } else {
      return;
    }
  }, [employerDetails]);

    //   get Lastest payment Detail
    const getLastPaymentDetail = useCallback(async () => {
      const response = await axios.post(`${BASE_API_URL}jobs/payment/date`, {
        companyId: companyid,
      });
  
      return response?.data?.data?.createdAt; 
    }, [companyid]);
  
    const findJobCount = useCallback(async () => {
      const lastPaymentCreatedAt = await getLastPaymentDetail();
      setIsLoading(true)
      const response = await axios.get(
        `${BASE_API_URL}jobs/getjobpost/${companyid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsLoading(false)
      if (response?.data?.result === true) {
        const jobPosts = response.data.data;
  
        // Filter job posts array to find elements in between two dates
        const filteredJobPosts = jobPosts.filter((job) => {
          const jobCreatedAt = Date.parse(job.createdAt);
          const lastPaymentDate = Date.parse(lastPaymentCreatedAt);
          return jobCreatedAt > lastPaymentDate;
        });
        setJobCount(filteredJobPosts.length);
      }
    }, [companyid, token, getLastPaymentDetail, setJobCount]);
  
    const getAccessdeatils = useCallback(async (token) => {
      setIsLoading(true)
      const result = await subscriptionPlan(token);
      setAccessDetails((prev) => ({ ...prev, ...result }));
      setIsLoading(false)
    }, []);

  // Post Job
  const postJob = useCallback(async (data) => {
    setIsLoading(true);
    const response = await axios.post(BASE_API_URL + "jobs", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response?.data?.result === true) {
      setIsLoading(false);
      setErr();
      reset();
      setSlugCountryId();
      setSlugStateId();
      const fieldsToReset = [
        "jobType",
        "jobCategory",
        "country",
        "state",
        "district",
        "salaryType",
        "leadTime",
        "fullyRemote",
        "minExperience",
        "maxExperience",
        "education",
        "programmingLanguage",
        "reqDocs",
      ];
      fieldsToReset.forEach((field) => setValue(field, ""));
      toast.success("Job posted successfully", { theme: "colored" });
    } else if (response?.data?.result === false) {
      if (response?.data?.message === "Token Expired") {
        clearStorage();
        sessionStorage.setItem("loginErr", LOGIN_ERR);
        setIsLoading(false);
        navigate("/employer/login");
      } else {
        setIsLoading(false);
        setErr(response.data.errors);
      }
    }
  }, [reset, setValue, token, clearStorage, navigate]);

  // Update Job
  const updateJob = useCallback(async (data) => {
    setIsLoading(true);
    const response = await axios.put(BASE_API_URL + "jobs/" + data._id, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response?.data?.result === true) {
      setIsLoading(false);
      setErr();
      reset();
      setSlugCountryId();
      setSlugStateId();
      const fieldsToReset = [
        "jobType",
        "jobCategory",
        "country",
        "state",
        "district",
        "salaryType",
        "leadTime",
        "fullyRemote",
        "minExperience",
        "maxExperience",
        "education",
        "programmingLanguage",
        "reqDocs",
      ];
      fieldsToReset.forEach((field) => setValue(field, ""));
      navigate("/employer/manage-jobs");
      setTimeout(() => {
        toast.success("Job updated successfully", { theme: "colored" });
      }, 100);
    } else if (response?.data?.result === false) {
      if (response?.data?.message === "Token Expired") {
        clearStorage();
        sessionStorage.setItem("loginErr", LOGIN_ERR);
        setIsLoading(false);
        navigate("/employer/login");
      } else {
        setIsLoading(false);
        setErr(response.data.errors);
      }
    }
  }, [reset, setValue, token, clearStorage, navigate]);

  // Post Job
  const handleSaveJob = useCallback((data) => {
    const slug = generateSlug(data.jobTitle);
    postCompanyDetails(data);
    postEmployerdetails(data);
    if (data.jobType) {
      data.jobType = {
        id: data.jobType.value,
        type: data.jobType.label,
      };
    }
    if (data.jobCategory) {
      data.jobCategory = {
        id: data.jobCategory.value,
        category: data.jobCategory.label,
      };
    }
    if (data.salaryType) {
      data.salaryType = {
        slug: data.salaryType.value,
        type: data.salaryType.label,
      };
    }
    if (data.leadTime) {
      data.leadTime = {
        slug: data.leadTime.value,
        duration: data.leadTime.label,
      };
    }
    if (data.fullyRemote) {
      data.fullyRemote = {
        slug: data.fullyRemote.value,
        type: data.fullyRemote.label,
      };
    }
    if (data.education) {
      data.education = {
        slug: data.education.value,
        qualification: data.education.label,
      };
    }
    if (data.programmingLanguage) {
      data.programmingLanguage = data.programmingLanguage.map((item) => ({
        slug: item.value,
        language: item.label,
      }));
    }
    if (data.reqDocs) {
      data.reqDocs = data.reqDocs.map((item) => ({
        slug: item.value,
        document: item.label,
      }));
    }
    if (data.minExperience) {
      data.minExperience = {
        slug: data.minExperience.value,
        experience: data.minExperience.label,
      };
    }
    if (data.maxExperience) {
      data.maxExperience = {
        slug: data.maxExperience.value,
        experience: data.maxExperience.label,
      };
    }
    data.country = {
      countryId: data.country.value,
      countryName: data.country.label,
    };
    data.state = {
      stateId: data.state.value,
      stateName: data.state.label,
    };
    data.district = {
      districtId: data.district.value,
      districtName: data.district.label,
    };
    let experience;
    if (data?.minExperience?.slug && data?.maxExperience?.slug) {
      experience = `${data?.minExperience?.slug}-to-${data?.maxExperience?.slug}-years`;
    } else if (data?.minExperience?.slug || data?.maxExperience?.slug) {
      experience = `${data?.minExperience?.slug || data?.maxExperience?.slug
        }-years`;
    } else {
      experience = "0-year";
    }

    // Date and Format for slug
    const currentDate = new Date();
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const formattedDate = `${("0" + currentDate.getDate()).slice(-2)}-${months[currentDate.getMonth()]
      }-${currentDate.getFullYear()}`;
    const formattedTime = `${("0" + currentDate.getHours()).slice(-2)}${(
      "0" + currentDate.getMinutes()
    ).slice(-2)}${("0" + currentDate.getSeconds()).slice(-2)}`;
    const milliseconds = currentDate.getMilliseconds();
    data.slug = `${data?.companyDetail?.companySlug}-${slug}-${experience}-${formattedDate}-${formattedTime}${milliseconds}`;
    if (jobSlug) {
      data.updatedUser = employerDetails?.name;
      updateJob(data);
    } else {
      data.createdUser = employerDetails?.name;
      data.updatedUser = employerDetails?.name;
      postJob(data);
    }
  }, [jobSlug, postCompanyDetails, postEmployerdetails, postJob, updateJob, employerDetails]);

  const setValuesFromData = useCallback(
    (data) => {
      for (const key in data) {
        setValue(key, data[key]);
      }
      setValue("country", {
        label: data.country.countryName,
        value: data.country.countryId,
      });
      setValue("state", {
        label: data.state.stateName,
        value: data.state.stateId,
      });
      setValue("district", {
        label: data.district.districtName,
        value: data.district.districtId,
      });
      setValue("jobType", { label: data.jobType.type, value: data.jobType.id });
      setSlugCountryId(data.country.countryId);
      setSlugStateId(data.state.stateId);
      if (data.jobCategory) {
        setValue("jobCategory", {
          label: data.jobCategory.category,
          value: data.jobCategory.id,
        });
      }
      if (data.salaryType) {
        setValue("salaryType", {
          label: data.salaryType.type,
          value: data.salaryType.slug,
        });
      }
      if (data.leadTime) {
        setValue("leadTime", {
          label: data.leadTime.duration,
          value: data.leadTime.slug,
        });
      }
      if (data.fullyRemote) {
        setValue("fullyRemote", {
          label: data.fullyRemote.type,
          value: data.fullyRemote.slug,
        });
      }
      if (data.minExperience) {
        setValue("minExperience", {
          label: data.minExperience.experience,
          value: data.minExperience.slug,
        });
      }
      if (data.maxExperience) {
        setValue("maxExperience", {
          label: data.maxExperience.experience,
          value: data.maxExperience.slug,
        });
      }
      if (data.education) {
        setValue("education", {
          label: data.education.qualification,
          value: data.education.slug,
        });
      }
      if (data.programmingLanguage) {
        const programmingLanguage = data.programmingLanguage.map((item) => ({
          value: item.slug,
          label: item.language,
        }));
        setValue("programmingLanguage", programmingLanguage);
      }
      if (data.reqDocs) {
        const reqDocs = data.reqDocs.map((item) => ({
          value: item.slug,
          label: item.document,
        }));
        setValue("reqDocs", reqDocs);
      }
      setIsLoading(false);
    },
    [setValue]
  );

  // Get job by slug
  const getJobBySlug = useCallback(async () => {
    setIsLoading(true);
    const response = await axios.get(BASE_API_URL + "jobs/" + jobSlug);
    if (response?.data?.result === true) {
      setValuesFromData(response.data.job_detail);
    } else if (response?.data?.result === false) {
      navigate("/");
    }
  }, [jobSlug, setValuesFromData, navigate]);

  // Use Effects
  useEffect(() => {
    if (token) {
      getTypeOfJobs();
      getJobCategory();
      getQualification();
      getProgLangs();
      getProofs();
      getCompanyDetail();
      getEmployerDetail();
      getCountries();
      findJobCount();
      getAccessdeatils(token);
      getLastPaymentDetail();
    }
    if (jobSlug) {
      getJobBySlug();
    }
  }, [
    getTypeOfJobs,
    getJobCategory,
    getQualification,
    getProgLangs,
    getProofs,
    getCompanyDetail,
    getCountries,
    jobSlug,
    getJobBySlug,
    getEmployerDetail,
    token,
    companyname,
    findJobCount,
    getAccessdeatils,
    getLastPaymentDetail,
  ]);

  useEffect(() => {
    if (slugCountryId) {
      getStatesByCountry(slugCountryId);
    }
    if (slugStateId) {
      getDistrictsByState(slugStateId);
    }
  }, [slugCountryId, slugStateId, getStatesByCountry, getDistrictsByState]);

  const location = useLocation();
  const currentUrl = location.pathname;
  const lastSegment = currentUrl.substring(currentUrl.indexOf('/') + 1);
  const convertedString = lastSegment.replace(/\//g, '-');

  return (
    <>
      {convertedString === "employer-post-new-job" ? (
        <SeoComponent slug={convertedString} />
      ) : (
        <SeoComponent slug="detail-page" data={metaData} />
      )}
      <DashboardBanner />
      <section className="py-50">
        <Container fluid>
          <Row>
            <Col lg={5} xl={4} xxl={3} className="mb-30 mb-lg-0">
              <EmployerMenu />
            </Col>

            <Col lg={7} xl={8} xxl={9} className="position-relative">
              {(jobCount >= accessDetails.jobPost) && (
                <SubscriptionAlert message={"Your package has reached the job post limit. Buy the plan if you want to post more jobs"} />
              )}
              {isLoading && <Loader />}
              {(jobCount < accessDetails.jobPost) && (
                <Form autoComplete="off" onSubmit={handleSubmit(handleSaveJob)}>
                  <h4 className="mb-20">
                    {jobSlug ? "Update job" : "Post new job"}
                  </h4>
                  <Row className="row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2">
                    <Col className="mb-15">
                      <Form.Label>
                        Job Title <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        {...register("jobTitle", {
                          required: "Job title is required",
                        })}
                        isInvalid={errors?.jobTitle}
                      ></Form.Control>
                      {errors?.jobTitle && (
                        <span className="text-danger">
                          {" "}
                          {errors?.jobTitle?.message}
                        </span>
                      )}
                      {err?.jobTitle && (
                        <span className="text-danger">{err?.jobTitle}</span>
                      )}
                    </Col>
                    <Col className="mb-15">
                      <Form.Label>
                        Type of job <span className="text-danger">*</span>
                      </Form.Label>
                      <Controller
                        name="jobType"
                        control={control}
                        rules={{ required: "Job type is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={jobTypes?.map((item) => ({
                              value: item._id,
                              label: item.jobTypeName,
                            }))}
                            placeholder="Select"
                          />
                        )}
                      />
                      {errors?.jobType && (
                        <span className="text-danger">
                          {errors?.jobType?.message}
                        </span>
                      )}
                    </Col>
                    <Col className="mb-15">
                      <Form.Label>Job skills</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("jobSkills")}
                      ></Form.Control>
                      {err?.jobSkills && (
                        <span className="text-danger">{err?.jobSkills}</span>
                      )}
                    </Col>
                    <Col className="mb-15">
                      <Form.Label>Job Category</Form.Label>
                      <Controller
                        name="jobCategory"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={jobCategories?.map((item) => ({
                              value: item._id,
                              label: item.categoryName,
                            }))}
                            placeholder="Select"
                          />
                        )}
                      />
                    </Col>
                    <Col className="mb-15">
                      <Form.Label>Salary Type</Form.Label>
                      <Controller
                        name="salaryType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={salaryTypes?.map((item) => ({
                              value: item.slug,
                              label: item.type,
                            }))}
                            placeholder="Select"
                          />
                        )}
                      />
                    </Col>
                    <Col className="mb-15">
                      <Row className="g-2 row-cols-2">
                        <Col>
                          <Form.Label>Min Salary</Form.Label>
                          <InputGroup>
                            <InputGroup.Text id="min-salary">
                              {currencySymbols.rupee}
                            </InputGroup.Text>
                            <Form.Control
                              {...register("minSalary")}
                              aria-describedby="min-salary"
                            />
                          </InputGroup>
                          {err?.minSalary && (
                            <span className="text-danger">
                              {err?.minSalary}
                            </span>
                          )}
                        </Col>
                        <Col>
                          <Form.Label>Max Salary</Form.Label>
                          <InputGroup>
                            <InputGroup.Text id="max-salary">
                              {currencySymbols.rupee}
                            </InputGroup.Text>
                            <Form.Control
                              {...register("maxSalary")}
                              aria-describedby="max-salary"
                            />
                          </InputGroup>
                          {err?.maxSalary && (
                            <span className="text-danger">
                              {err?.maxSalary}
                            </span>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col className="mb-15">
                      <Form.Label>Gender</Form.Label>
                      <div>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Form.Check
                                inline
                                label="Male"
                                type="radio"
                                id="inline-radio-1"
                                checked={field.value === "male"}
                                onChange={() => {
                                  field.onChange("male");
                                  setValue("gender", "male");
                                }}
                              />
                              <Form.Check
                                inline
                                label="Female"
                                type="radio"
                                id="inline-radio-2"
                                checked={field.value === "female"}
                                onChange={() => {
                                  field.onChange("female");
                                  setValue("gender", "female");
                                }}
                              />
                              <Form.Check
                                inline
                                label="NA"
                                type="radio"
                                id="inline-radio-3"
                                checked={field.value === "NA"}
                                onChange={() => {
                                  field.onChange("NA");
                                  setValue("gender", "NA");
                                }}
                              />
                            </>
                          )}
                        />
                      </div>
                    </Col>
                    <Col className="mb-15">
                      <Form.Label>Age Requirement</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("ageRequire")}
                        placeholder="Ex : 25-30"
                      ></Form.Control>
                      {err?.ageRequire && (
                        <span className="text-danger">{err?.ageRequire}</span>
                      )}
                    </Col>
                    <Col className="mb-15">
                      <Form.Label>No of position</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("jobVacancies")}
                        placeholder="Ex : 25"
                      ></Form.Control>
                      {err?.jobVacancies && (
                        <span className="text-danger">{err?.jobVacancies}</span>
                      )}
                    </Col>
                    <Col className="mb-15">
                      <Form.Label>Lead time required for position</Form.Label>
                      <Controller
                        name="leadTime"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={leadTimes?.map((item) => ({
                              value: item.slug,
                              label: item.time,
                            }))}
                            placeholder="Select"
                          />
                        )}
                      />
                    </Col>
                    <Col className="mb-15">
                      <Form.Label>
                        Does this job allow hires to work fully remote
                      </Form.Label>
                      <Controller
                        name="fullyRemote"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={workTypes?.map((item) => ({
                              value: item.slug,
                              label: item.type,
                            }))}
                            placeholder="Select"
                          />
                        )}
                      />
                    </Col>
                    <Col className="mb-15">
                      <Form.Label>
                        Country <span className="text-danger">*</span>
                      </Form.Label>
                      <Controller
                        name="country"
                        control={control}
                        rules={{ required: "Country is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={countries?.map((country) => ({
                              value: country.countryId,
                              label: country.countryName,
                            }))}
                            onChange={(selectedCountry) => {
                              field.onChange(selectedCountry);
                              handleStates(selectedCountry.value);
                            }}
                            placeholder="Select Country"
                          />
                        )}
                      />
                      {errors.country && (
                        <span className="text-danger">
                          {errors?.country && errors.country.message}
                        </span>
                      )}
                      {err?.country && (
                        <span className="text-danger">{err?.country}</span>
                      )}
                    </Col>
                    <Col className="mb-15">
                      <Form.Label className="d-flex align-items-center">
                        <span className="me-1">
                          State <span className="text-danger">*</span>
                        </span>
                        {isStateButtonLoading && <LoaderButton />}
                      </Form.Label>
                      <Controller
                        name="state"
                        control={control}
                        rules={{ required: "State is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={states?.map((state) => ({
                              value: state.stateId,
                              label: state.stateName,
                            }))}
                            onChange={(selectedState) => {
                              field.onChange(selectedState);
                              handleDistricts(selectedState?.value);
                            }}
                            isClearable
                            placeholder="Select State"
                          />
                        )}
                      />
                      {errors.state && (
                        <span className="text-danger">
                          {errors?.state && errors.state.message}
                        </span>
                      )}
                      {err?.state && (
                        <span className="text-danger">{err?.state}</span>
                      )}
                    </Col>
                    <Col className="mb-15">
                      <Form.Label className="d-flex align-items-center">
                        <span className="me-1">
                          District <span className="text-danger">*</span>
                        </span>
                        {isButtonLoading && <LoaderButton />}
                      </Form.Label>
                      <Controller
                        name="district"
                        control={control}
                        rules={{ required: "District is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={districts?.map((district) => ({
                              value: district.districtId,
                              label: district.districtName,
                            }))}
                            isClearable
                            placeholder="Select District"
                          />
                        )}
                      />
                      {errors.district && (
                        <span className="text-danger">
                          {errors?.district && errors.district.message}
                        </span>
                      )}
                      {err?.district && (
                        <span className="text-danger">{err?.district}</span>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12} className="mb-15">
                      <Form.Label>
                        Job Description <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        {...register("jobDesc", {
                          required: "Job description is required",
                          maxLength: {
                            value: accessDetails.jobDescription,
                            message: `This Package contains only ${accessDetails.jobDescription} characters`,
                          },
                        })}
                        isInvalid={errors?.jobDesc}
                      ></Form.Control>
                      {errors?.jobDesc && (
                        <span className="text-danger">
                          {" "}
                          {errors?.jobDesc?.message}
                        </span>
                      )}
                      {err?.jobDesc && (
                        <span className="text-danger">{err?.jobDesc}</span>
                      )}
                    </Col>
                    <Col md={12} className="mb-15">
                      <Form.Label>
                        Job location/address{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        {...register("address", {
                          required: "Job location is required",
                        })}
                      ></Form.Control>
                      {errors?.address && (
                        <span className="text-danger">
                          {" "}
                          {errors?.address?.message}
                        </span>
                      )}
                      {err?.address && (
                        <span className="text-danger">{err?.address}</span>
                      )}
                    </Col>
                    <Col md={12} className="mb-30">
                      <Form.Label>Job Status</Form.Label>
                      <Controller
                        name="isJobOpen"
                        control={control}
                        defaultValue="Y"
                        render={({ field }) => (
                          <Form.Select {...field}>
                            <option value="Y" defaultChecked>
                              Opened
                            </option>
                            <option value="N">Closed</option>
                          </Form.Select>
                        )}
                      />
                    </Col>
                  </Row>
                  <Row className="g-3">
                    <Col md={12}>
                      <h4 className="mb-10">Other information</h4>
                    </Col>
                    <Col md={12}>
                      <div className="card-graybox">
                        <Row>
                          <Col md={12}>
                            <h6 className="mb-10">Experience</h6>
                          </Col>
                          <Col xl={6} className="mb-15">
                            <Form.Label>Minimum of</Form.Label>
                            <Controller
                              name="minExperience"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={experience?.map((item) => ({
                                    value: item.slug,
                                    label: item.exp,
                                  }))}
                                  placeholder="Select"
                                />
                              )}
                            />
                          </Col>
                          <Col xl={6} className="mb-15">
                            <Form.Label>Maximum of</Form.Label>
                            <Controller
                              name="maxExperience"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={maxExperience?.map((item) => ({
                                    value: item.slug,
                                    label: item.exp,
                                  }))}
                                  placeholder="Select"
                                />
                              )}
                            />
                          </Col>
                          <Col md={12} className="mb-0">
                            <Controller
                              name="expPreReq"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <Form.Check
                                    inline
                                    label="Preferred"
                                    type="radio"
                                    id="preferred"
                                    checked={field.value === "preferred"}
                                    onChange={() => {
                                      field.onChange("preferred");
                                      setValue("expPreReq", "preferred");
                                    }}
                                  />
                                  <Form.Check
                                    inline
                                    label="Required"
                                    type="radio"
                                    id="required"
                                    checked={field.value === "required"}
                                    onChange={() => {
                                      field.onChange("required");
                                      setValue("expPreReq", "required");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col xl={6}>
                      <div className="card-graybox">
                        <h6 className="mb-10">Education</h6>
                        <Form.Label>Minimum level of education</Form.Label>
                        <div className="mb-15">
                          <Controller
                            name="education"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={qualifications?.map((item) => ({
                                  value: item.slug,
                                  label: item.qualName,
                                }))}
                                placeholder="Select"
                              />
                            )}
                          />
                        </div>
                        <Controller
                          name="eduPreReq"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Form.Check
                                inline
                                label="Preferred"
                                type="radio"
                                id="eduPreferred"
                                checked={field.value === "preferred"}
                                onChange={() => {
                                  field.onChange("preferred");
                                  setValue("eduPreReq", "preferred");
                                }}
                              />
                              <Form.Check
                                inline
                                label="Required"
                                type="radio"
                                id="eduRequired"
                                checked={field.value === "required"}
                                onChange={() => {
                                  field.onChange("required");
                                  setValue("eduPreReq", "required");
                                }}
                              />
                            </>
                          )}
                        />
                      </div>
                    </Col>
                    <Col xl={6}>
                      <div className="card-graybox">
                        <h6 className="mb-10">Programming Languages</h6>
                        <Form.Label>
                          This job requires experience in the following
                          programming language(s):
                        </Form.Label>
                        <div className="mb-15">
                          <Controller
                            name="programmingLanguage"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isMulti
                                closeMenuOnSelect={false}
                                options={progLangs?.map((item) => ({
                                  value: item.slug,
                                  label: item.langName,
                                }))}
                                placeholder="Select"
                              />
                            )}
                          />
                        </div>
                        <Controller
                          name="proglangPreReq"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Form.Check
                                inline
                                label="Preferred"
                                type="radio"
                                id="plPreferred"
                                checked={field.value === "preferred"}
                                onChange={() => {
                                  field.onChange("preferred");
                                  setValue("proglangPreReq", "preferred");
                                }}
                              />
                              <Form.Check
                                inline
                                label="Required"
                                type="radio"
                                id="plRequired"
                                checked={field.value === "required"}
                                onChange={() => {
                                  field.onChange("required");
                                  setValue("proglangPreReq", "required");
                                }}
                              />
                            </>
                          )}
                        />
                      </div>
                    </Col>
                    <Col xl={6}>
                      <div className="card-graybox">
                        <h6 className="mb-10">Documents</h6>
                        <Form.Label>Required document(s):</Form.Label>
                        <div className="mb-15">
                          <Controller
                            name="reqDocs"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isMulti
                                closeMenuOnSelect={false}
                                options={proofs?.map((item) => ({
                                  value: item.slug,
                                  label: item.proofName,
                                }))}
                                placeholder="Select"
                              />
                            )}
                          />
                        </div>
                        <Controller
                          name="reqDocsPreReq"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Form.Check
                                inline
                                label="Preferred"
                                type="radio"
                                id="rdPreferred"
                                checked={field.value === "preferred"}
                                onChange={() => {
                                  field.onChange("preferred");
                                  setValue("reqDocsPreReq", "preferred");
                                }}
                              />
                              <Form.Check
                                inline
                                label="Required"
                                type="radio"
                                id="rdRequired"
                                checked={field.value === "required"}
                                onChange={() => {
                                  field.onChange("required");
                                  setValue("reqDocsPreReq", "required");
                                }}
                              />
                            </>
                          )}
                        />
                      </div>
                    </Col>
                    <Col xl={6}>
                      <div className="card-graybox">
                        <h6 className="mb-10">Driving Licence</h6>
                        <Form.Label>Valid licence or certification</Form.Label>
                        <div className="mb-15">
                          <Form.Control
                            type="text"
                            {...register("licence")}
                          ></Form.Control>
                          {err?.licence && (
                            <span className="text-danger">{err?.licence}</span>
                          )}
                        </div>
                        <Controller
                          name="licPreReq"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Form.Check
                                inline
                                label="Preferred"
                                type="radio"
                                id="licPreferred"
                                checked={field.value === "preferred"}
                                onChange={() => {
                                  field.onChange("preferred");
                                  setValue("licPreReq", "preferred");
                                }}
                              />
                              <Form.Check
                                inline
                                label="Required"
                                type="radio"
                                id="licRequired"
                                checked={field.value === "required"}
                                onChange={() => {
                                  field.onChange("required");
                                  setValue("licPreReq", "required");
                                }}
                              />
                            </>
                          )}
                        />
                      </div>
                    </Col>
                    <Col md={12} className="mb-20">
                      <div className="card-graybox">
                        <h6 className="mb-10">Create Custom Question</h6>
                        <Form.Label>
                          Write your own question to ask applicants for this
                          job. Do not ask questions that are discriminatory,
                          illegal, or otherwise violate the Hirex Site Rules:
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          {...register("custQus")}
                        ></Form.Control>
                        {err?.custQus && (
                          <span className="text-danger">{err?.custQus}</span>
                        )}
                      </div>
                    </Col>
                  </Row>
                  {jobCount < accessDetails.jobPost && (
                    <Button className="btn btn-main-lg w-auto" type="submit">{jobSlug ? 'Update' : 'Submit'}</Button>
                  )}
                </Form>
              )}
            </Col>
          </Row>
        </Container>
      </section>
      <ToastContainer />
    </>
  );
};
export default EmployerPostJob;
