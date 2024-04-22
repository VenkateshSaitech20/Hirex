import { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Button } from 'react-bootstrap';
import { SlLocationPin, SlWallet, SlGraduation, SlClock, SlPeople } from "react-icons/sl";
import LoaderButton from 'components/LoaderButton';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RelatedJobs from 'components/RelatedJobs';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import LoaderBlur from 'components/LoaderBlur';
import { ToastContainer, toast } from 'react-toastify';
import { imagePath, currencySymbols } from 'components/Constants';
import { FaCheck, FaStar } from "react-icons/fa";
import axios from 'axios';
import SeoComponent from 'components/SeoComponent';
import { formatSalary, getSalaryTypeSuffix } from 'utils/formatSalary';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const JobDetail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [job, setJob] = useState();
    const [metaData, setMetaData] = useState({});
    const { slug } = useParams();
    const navigate = useNavigate();
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [jobApplied, setJobApplied] = useState(false);
    const [jobAppliedStatus, setJobAppliedStatus] = useState(false);
    const { token, user, userid, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();

    // Get job detail
    const getJobDetail = useCallback(async () => {
        setIsLoading(true);
        let data = { token: token }
        const response = await axios.post(BASE_API_URL + 'jobs/get-job/' + slug, data);
        if (response?.data?.result === true) {
            setIsLoading(false);
            setJob(response.data.jobDetail);
            let meta_data = {
                metaTitle: response?.data?.jobDetail?.companyDetail?.companyName,
                metaDescription: response?.data?.jobDetail?.jobDesc,
                metaKeywords: response?.data?.jobDetail?.jobDesc
            }
            setMetaData(meta_data);
        }
    }, [token, slug])

    const getExperience = () => {
        const minExperience = job?.minExperience?.slug || '';
        const maxExperience = job?.maxExperience?.slug || '';
        let experience = '';
        if (job?.minExperience?.slug && job?.maxExperience?.slug) {
            experience = `${minExperience} - ${maxExperience} Years`;
        } else if ((job?.minExperience?.slug || job?.maxExperience?.slug)) {
            experience = `${minExperience || maxExperience} Years`;
        } else {
            experience = "0 Year"
        }
        return experience;
    };

    const applyJob = () => {
        if (!user || !usertype) {
            sessionStorage.setItem("loginErr", LOGIN_ERR);
            navigate('/login');
            return;
        }
        let candidateDetail = JSON.parse(user);
        candidateDetail.candidateNo = userid;
        candidateDetail.usertype = usertype;
        let data;
        if (job) {
            let companyDetail = {
                companyId: job?.companyDetail.companyId,
                companyName: job?.companyDetail.companyName,
                companySlug: job?.companyDetail.companySlug,
                companyLogo: job?.companyDetail.companyLogo,
                companyDesc: job?.companyDetail.companyDesc
            }
            let jobDetail = {
                jobId: job?._id,
                slug: job?.slug,
                jobTitle: job?.jobTitle,
                jobDesc: job?.jobDesc,
                jobType: job?.jobType,
                jobCategory: job?.jobCategory,
                education: job?.education,
                minExperience: job?.minExperience,
                maxExperience: job?.maxExperience,
                minSalary: job?.minSalary,
                maxSalary: job?.maxSalary,
                address: job?.address,
                country: job?.country,
                state: job?.state,
                district: job?.district,
            }
            data = {
                companyDetail: companyDetail,
                candidateDetail: candidateDetail,
                jobDetail: jobDetail,
                applyStatus: "Pending"
            }
        }
        postApplyJob(data);
    }

    const postApplyJob = async (data) => {
        if (token) {
            const response = await axios.post(BASE_API_URL + 'applied-job/', data, { headers: { Authorization: `Bearer ${token}` } });
            if (response?.data?.result === true) {
                setIsButtonLoading(false);
                setJobApplied(true);
                setJobAppliedStatus(true);
                toast.success(response.data.message, { theme: 'colored' });
            } else if (response?.data?.result === false) {
                if (response?.data?.message === "Token Expired") {
                    clearStorage();
                    sessionStorage.setItem("loginErr", LOGIN_ERR);
                    setIsButtonLoading(false);
                    navigate('/login');
                } else {
                    setIsButtonLoading(false);
                }
            }
        } else {
            sessionStorage.setItem("loginErr", LOGIN_ERR);
            navigate('/login');
        }
    }

    const renderJobRequirement = () => (
        <>
            {
                job?.jobSkills || job?.programmingLanguage.length > 0 || job?.education ? (
                    <>
                        <hr />
                        <h6 className="mb-10">Job Requirement</h6>
                    </>
                ) : ''
            }
            {job?.jobSkills && (
                <div className="box-checkbox mb-10">
                    <p className="mb-0"><span className="font-bold">Skills : </span>{job?.jobSkills}</p>
                </div>
            )}
            {job?.programmingLanguage.length > 0 && (
                <div className="box-checkbox mb-10">
                    <p className="mb-0"><span className="font-bold">Programming Languages : </span>
                        {job?.programmingLanguage.map((lang, index) => (
                            <span key={lang.slug}>
                                {index > 0 && ', '}
                                {lang.language}
                            </span>
                        ))}
                    </p>
                </div>
            )}
            {job?.education && (
                <div className="box-checkbox mb-10">
                    <p className="mb-0"><span className="font-bold">Qualification : </span>{job?.education?.qualification}</p>
                </div>
            )}
        </>
    )

    const renderForYourInformation = () => (
        <>
            {
                job?.leadTime || job?.ageRequire || job?.fullyRemote ? (
                    <>
                        <hr />
                        <h6 className="mb-10">For your information</h6>
                    </>
                ) : ''
            }
            {job?.leadTime && (
                <div className="box-checkbox mb-10">
                    <p className="mb-0"><span className="font-bold">Lead time required for position : </span>{job?.leadTime?.duration}</p>
                </div>
            )}
            {job?.ageRequire && (
                <div className="box-checkbox mb-10">
                    <p className="mb-0"><span className="font-bold">Age reqirement : </span>{job?.ageRequire}</p>
                </div>
            )}
            {job?.fullyRemote && (
                <div className="box-checkbox mb-10">
                    <p className="mb-0"><span className="font-bold">Does this job allow hires to work fully remote : </span>{job?.fullyRemote?.type}</p>
                </div>
            )}
        </>
    )

    const renderContactInformation = () => (
        <>
            {job?.employerDetail?.name || job?.employerDetail?.email || job?.employerDetail?.mobileNo ? (
                <>
                    <hr />
                    <h6 className="mb-10">Contact Information</h6>
                </>
            ) : ''}

            {job?.employerDetail?.name && (
                <div className="box-checkbox mb-10">
                    <p className="mb-0"><span className="font-bold">Posted by : </span>{job?.employerDetail?.name}</p>
                </div>
            )}

            {job?.employerDetail?.email && (
                <div className="box-checkbox mb-10">
                    <p className="mb-0"><span className="font-bold">Email id : </span>{job?.employerDetail?.email}</p>
                </div>
            )}

            {job?.employerDetail?.mobileNo && (
                <div className="box-checkbox mb-10">
                    <p className="mb-0"><span className="font-bold">Contact Number : </span>{job?.employerDetail?.mobileNo}</p>
                </div>
            )}
        </>
    )

    const renderAppliedBtn = () => {
        let buttonContent;

        if (job?.isDeleted === "Y" || job?.isJobOpen === "N") {
            buttonContent = <Button className="btn btn-main pe-none d-flex mt-4">Job Closed</Button>;
        } else if (job?.jobApplied === "yes" || jobApplied) {
            buttonContent = (
                <div className="d-flex mt-4">
                    <Button
                        className={`btn pe-none me-1 mb-1 ${(() => {
                            let statusClass = '';
                            if (job?.applyStatus === 'Pending') {
                                statusClass = 'btn-main';
                            } else if (job?.applyStatus === 'Shortlisted') {
                                statusClass = 'btn-green';
                            } else if (job?.applyStatus === 'Rejected') {
                                statusClass = 'btn-red';
                            } else if (job?.applyStatus === 'Hold') {
                                statusClass = 'btn-blue';
                            } else if (jobAppliedStatus) {
                                statusClass = 'btn-main';
                            }
                            return statusClass;
                        })()}`}
                    >
                        {jobAppliedStatus ? 'Pending' : job?.applyStatus}
                    </Button>
                    <Button className="btn btn-black pe-none mb-1">
                        <FaCheck className="top-n1" /> Applied
                    </Button>
                </div>
            );
        } else {
            buttonContent = (
                <Button onClick={applyJob} className="btn btn-main d-flex mt-4">
                    {isButtonLoading && <span className="me-1"><LoaderButton /></span>}Apply now
                </Button>
            );
        }

        return buttonContent;
    };


    useEffect(() => {
        if (slug) {
            getJobDetail();
        }
    }, [getJobDetail, slug])


    return (
        <>
            {metaData && <SeoComponent slug="detail-page" data={metaData} />}

            {/* Banner */}
            <section className="banner-section sub-banner-py bg-orange-lightest">
                <Container fluid>
                    <Row className="justify-content-center mb-fixed-10">
                        <Col md={12} lg={10} xl={10} xxl={8} className="align-self-center text-center">
                            <img className="img-fluid company-profile-img mb-2" src={job?.companyDetail?.companyLogo ? job?.companyDetail?.companyLogo : imagePath.officeBuilding} alt="Brand" />
                            <h2 className="text-capitalize mb-1">
                                <span>{job?.companyDetail?.companyName}</span>
                            </h2>
                            <p className="mb-0">{job?.jobTitle}</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Job Detail */}
            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={5} xl={4} xxl={3} className="mb-30 mb-lg-0 position-relative">
                            <div className="h-100">
                                <div className="job-company-wrap">
                                    {isLoading && <LoaderBlur />}
                                    <div className="text-center mb-20">
                                        <img className="img-fluid mb-15 company-profile-img" src={job?.companyDetail?.companyLogo ? job?.companyDetail?.companyLogo : imagePath.officeBuilding} alt="Brand" />
                                        <h6 className="mb-0 d-flex justify-content-center">
                                            {job?.companyDetail?.companyName}
                                            {job?.overallRating > 0 &&
                                                <span className="ms-2 rating-link">
                                                    <FaStar className="text-orange" />
                                                    <span>{job?.overallRating}</span>
                                                </span>
                                            }
                                        </h6>
                                    </div>
                                    <ul className="ul-icon-wrap">
                                        <li>
                                            <div className="icon-left"><SlLocationPin /></div>
                                            <div className="icon-right">
                                                <h6 className="mb-1 fs-16">Address</h6>
                                                <p>{job?.address}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="icon-left"><SlWallet /></div>
                                            <div className="icon-right">
                                                <h6 className="mb-1 fs-16">Salary</h6>
                                                <p>
                                                    {
                                                        job?.minSalary || job?.maxSalary ? (
                                                            <span>{currencySymbols.rupee} </span>
                                                        ) : '-'
                                                    }
                                                    {job?.minSalary ? formatSalary(job?.minSalary) : ''}
                                                    {job?.minSalary && job?.maxSalary ? ' - ' : ''}
                                                    {job?.maxSalary ? formatSalary(job?.maxSalary) : ''}
                                                    {(job?.minSalary || job?.maxSalary) && <small className='font-regular mx-1'>{getSalaryTypeSuffix(job?.salaryType?.slug)}</small>}
                                                </p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="icon-left"><SlGraduation /></div>
                                            <div className="icon-right">
                                                <h6 className="mb-1 fs-16">Experience</h6>
                                                <p>{getExperience()}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="icon-left"><SlClock /></div>
                                            <div className="icon-right">
                                                <h6 className="mb-1 fs-16">Type</h6>
                                                <p>{job?.jobType?.type}</p>
                                            </div>
                                        </li>
                                        {job?.jobVacancies && (
                                            <li>
                                                <div className="icon-left"><SlPeople /></div>
                                                <div className="icon-right">
                                                    <h6 className="mb-1 fs-16">Openings</h6>
                                                    <p>{job?.jobVacancies}</p>
                                                </div>
                                            </li>
                                        )}
                                        {
                                            usertype !== "employer" &&
                                            <li><Link to={`/company-details/${job?.companyDetail?.companySlug}`} className="btn btn-main py-2 w-100">Write Review</Link></li>
                                        }
                                    </ul>
                                </div>
                            </div>
                        </Col>
                        <Col lg={7} xl={8} xxl={9} className="position-relative">
                            {isLoading && <LoaderBlur />}
                            <h4 className="mb-30">{job?.jobTitle}</h4>
                            <h6 className="mb-10">About {job?.companyDetail?.companyName}</h6>
                            <p className="mb-0">{job?.companyDetail?.companyDesc}</p>
                            <hr />
                            <h6 className="mb-10">Job Description</h6>
                            <p className="mb-0">{job?.jobDesc}</p>
                            {renderJobRequirement()}
                            {renderForYourInformation()}
                            {renderContactInformation()}
                            {(usertype === "candidate" || !usertype) && renderAppliedBtn()}
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Related Jobs */}
            {job?.companyDetail?.companySlug && job?.slug && (
                <section>
                    <RelatedJobs companySlug={job?.companyDetail?.companySlug} jobSlug={job?.slug} />
                </section>
            )
            }
            <ToastContainer />
        </>
    )
}
export default JobDetail;