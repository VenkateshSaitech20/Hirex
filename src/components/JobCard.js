import { useEffect, useState } from 'react';
import { Col, Row, Card, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import LoaderButton from 'components/LoaderButton';
import { currencySymbols } from './Constants';
import { ToastContainer, toast } from 'react-toastify';
import { FaCheck, FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { getSalaryTypeSuffix } from 'utils/formatSalary';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const JobCard = (job) => {
    const navigate = useNavigate();
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [jobApplied, setJobApplied] = useState(false);
    const [jobAppliedStatus, setJobAppliedStatus] = useState(false);
    const { token, user, userid, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [isChecked, setIsChecked] = useState(true);
    const location = useLocation();

    const jobData = () => {
        let candidateDetail = JSON.parse(user);
        candidateDetail.candidateNo = userid;
        candidateDetail.usertype = usertype;
        let companyDetail = {
            companyId: job.jobDetail.companyDetail.companyId,
            companyName: job.jobDetail.companyDetail.companyName,
            companySlug: job.jobDetail.companyDetail.companySlug,
            companyLogo: job.jobDetail.companyDetail.companyLogo,
            companyDesc: job.jobDetail.companyDetail.companyDesc
        }
        let jobDetail = {
            jobId: job.jobDetail._id,
            slug: job.jobDetail.slug,
            jobTitle: job.jobDetail.jobTitle,
            jobDesc: job.jobDetail.jobDesc,
            jobType: job.jobDetail.jobType,
            jobCategory: job.jobDetail.jobCategory,
            education: job.jobDetail.education,
            minExperience: job.jobDetail.minExperience,
            maxExperience: job.jobDetail.maxExperience,
            minSalary: job.jobDetail.minSalary,
            maxSalary: job.jobDetail.maxSalary,
            address: job.jobDetail.address,
            country: job.jobDetail.country,
            state: job.jobDetail.state,
            district: job.jobDetail.district,
            salaryType: job.jobDetail.salaryType
        }
        return {
            companyDetail: companyDetail,
            candidateDetail: candidateDetail,
            jobDetail: jobDetail,
            applyStatus: "Pending"
        }
    }

    const applyJob = async () => {
        if (usertype !== "candidate") {
            clearStorage();
            sessionStorage.setItem("loginErr", LOGIN_ERR);
            navigate('/login');
            return;
        }
        const data = jobData();
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

    const handleSaveJob = () => {
        if (!user) {
            sessionStorage.setItem("loginErr", LOGIN_ERR);
            navigate('/login');
            return;
        }
        setIsChecked(!isChecked);
        const data = jobData();
        if (isChecked === true) {
            savedJob(data);
        } else {
            unSavedJob(data.candidateDetail.candidateNo, data.jobDetail.jobId);
        }
    };

    const savedJob = async (data) => {
        if (token) {
            const response = await axios.post(BASE_API_URL + 'saved-job/', data, { headers: { Authorization: `Bearer ${token}` } });
            if (response?.data?.result === true) {
                setIsButtonLoading(false);
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

    const unSavedJob = async (candidateNo, jobId) => {
        if (token) {
            const response = await axios.post(`${BASE_API_URL}saved-job/delete/${candidateNo}/${jobId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            if (response?.data?.result === true) {
                setIsButtonLoading(false);
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

    useEffect(() => {
        if (job?.jobDetail?.savedJob === "yes") {
            setIsChecked(false);
        } else if (job?.jobDetail?.savedJob === "no") {
            setIsChecked(true);
        }
    }, [job?.jobDetail?.savedJob]);

    
    const currentUrl = location.pathname;
    const lastSegment = currentUrl.substring(currentUrl.indexOf('/') + 1);
    const convertedString = lastSegment.replace(/\//g, '-');
        
    return (
        <>
            <Card className="job-card hover-up">
                <Card.Header>
                    <div className="job-card-image-left">
                        <Row className="g-2">
                            <Col xs={2}><img className={`img-fluid ${job.imageClassName}`} src={job.image} alt="Brand" /></Col>
                            <Col xs={9}>
                                <div className="right-info">
                                    <div className="d-flex">
                                        <Link className="name-job" to={`/jobs/${job.rediredTo}`}>{job.name}</Link>
                                        {job.overallRating > 0 &&
                                            <Link className="name-job ms-2 rating-link" to={`/company-details/${job.jobDetail.companyDetail.companySlug}`}>
                                                <FaStar className="text-orange" />
                                                <span>{job.overallRating}</span>
                                            </Link>
                                        }
                                    </div>
                                    <span className="location-small">{job.location}</span>
                                </div>
                            </Col>
                            <Col xs={1}>
                                <div className="d-flex ms-auto">
                                    {
                                        job?.jobDetail?.slug && location.pathname !== "/candidate/applied-jobs" && location.pathname !== "/candidate/saved-jobs" && location.pathname !== "/candidate/dashboard" && usertype !== "employer" && (
                                            <>
                                                <input type="checkbox" checked={isChecked} onChange={handleSaveJob} id={`savedJobCheckBox_${job.jobDetail?.slug}`} style={{ display: 'none' }} />
                                                <label htmlFor={`savedJobCheckBox_${job.jobDetail?.slug}`}>
                                                    {isChecked === true ? <FaRegHeart className="text-orange" /> : <FaHeart className="text-orange" />}
                                                </label>
                                            </>
                                        )
                                    }
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="job-card-block-info">
                        <h6 className="mb-0"><Link to={`/jobs/${job.rediredTo}`}>{job.job}</Link></h6>
                        <span className="job-card-briefcase mt-1 mb-1">{job.type}</span>
                        {job && job.experience.trim() !== '' && (
                            <span className="job-card-experience mt-1 mb-1">{job.experience} yrs</span>
                        )}
                        <p className="mb-1 mb-sm-3 mb-md-1 mb-lg-3 limit-desc">{job.desc}</p>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <div className="g-2 d-flex justify-content-between flex-wrap">
                        <div className="align-self-center mb-1 mb-sm-0 mb-md-1 mb-lg-0">
                            {job.salary.trim() !== "" && (<span className="font-bold">{currencySymbols.rupee} {job.salary} { job.salary &&(<small className='font-regular'>{convertedString==="candidate-applied-jobs" || convertedString==="candidate-dashboard"? getSalaryTypeSuffix(job?.jobDetail?.jobDetail?.salaryType?.slug) : getSalaryTypeSuffix(job?.jobDetail?.salaryType?.slug)}</small>)}
                            </span>)}
                        </div>
                        <div className="text-sm-end text-md-start text-lg-end">
                            {
                                usertype !== "employer" && (
                                    job?.jobApplied === "yes" || jobApplied ? (
                                        <div>
                                            {(job.applyStatus || jobAppliedStatus) &&
                                                <Button className={`btn pe-none ms-auto me-1 mb-1 ${(() => {
                                                    let statusClass = '';
                                                    if (job.applyStatus === 'Pending') {
                                                        statusClass = 'btn-main';
                                                    } else if (job.applyStatus === 'Shortlisted') {
                                                        statusClass = 'btn-green';
                                                    } else if (job.applyStatus === 'Rejected') {
                                                        statusClass = 'btn-red';
                                                    } else if (job.applyStatus === 'Hold') {
                                                        statusClass = 'btn-blue';
                                                    } else if (jobAppliedStatus) {
                                                        statusClass = 'btn-main';
                                                    }
                                                    return statusClass;
                                                })()}`}
                                                >
                                                    {jobAppliedStatus ? 'Pending' : job.applyStatus}
                                                </Button>
                                            }
                                            {
                                                location.pathname === "/jobs" && location.pathname !== "/candidate/applied-jobs" && location.pathname !== "/candidate/dashboard" &&
                                                <Button className="btn btn-black pe-none ms-auto mb-1"><FaCheck className="top-n1" /> Applied</Button>
                                            }
                                        </div>
                                    ) :
                                        (
                                            <Button onClick={applyJob} className="btn btn-main d-flex ms-auto">{isButtonLoading && <span className="me-1"><LoaderButton /></span>}Apply now</Button>
                                        )
                                )
                            }
                        </div>
                    </div>
                </Card.Footer>
            </Card>
            <ToastContainer />
        </>
    )
}
export default JobCard;