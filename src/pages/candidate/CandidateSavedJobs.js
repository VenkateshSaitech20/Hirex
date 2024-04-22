import { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Row, Col, Card, Button } from 'react-bootstrap';
import LoaderBlur from 'components/LoaderBlur';
import DashboardBanner from 'components/DashboardBanner';
import CandidateMenu from 'components/CandidateMenu';
import axios from 'axios';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { imagePath, currencySymbols } from 'components/Constants';
import { ToastContainer, toast } from 'react-toastify';
import { FaRegTrashAlt, FaStar } from "react-icons/fa";
import PaginationComponent from 'components/PaginationComponent';
import NoDataFound from 'components/NoDataFound';
import SeoComponent from 'components/SeoComponent';
import { formatSalary, getSalaryTypeSuffix } from 'utils/formatSalary';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

export default function CandidateSavedJobs() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const { userid, token, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Get jobs after login
    const getAppliedJobs = useCallback(async (page = 1, limit = 9) => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL + 'saved-job/get-saved-jobs/' + userid + '/' + usertype + `?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            setJobs(response.data.jobs);
            setTotalPages(response.data.totalPages);
        } else if (response?.data?.result === false) {
            if (response?.data?.message === "Token Expired") {
                clearStorage();
                sessionStorage.setItem("loginErr", LOGIN_ERR);
                setIsLoading(false);
                navigate('/login');
            } else {
                setIsLoading(false);
            }
        }
    }, [userid, token, clearStorage, navigate, usertype])

    // Experience
    const getExperience = (job) => {
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

    // Removed saved job
    const removedSavedJob = async (jobId, candidateNo) => {
        if (token) {
            setIsLoading(true);
            const response = await axios.post(`${BASE_API_URL}saved-job/delete/${candidateNo}/${jobId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            if (response?.data?.result === true) {
                setIsLoading(false);
                toast.success(response.data.message, { theme: 'colored' });
                setCurrentPage(1);
                getAppliedJobs();
            } else if (response?.data?.result === false) {
                if (response?.data?.message === "Token Expired") {
                    clearStorage();
                    sessionStorage.setItem("loginErr", LOGIN_ERR);
                    setIsLoading(false);
                    navigate('/login');
                } else {
                    setIsLoading(false);
                }
            }
        } else {
            sessionStorage.setItem("loginErr", LOGIN_ERR);
            navigate('/login');
        }
    }

    // Pagination page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (userid && token) {
            getAppliedJobs(newPage);
        }
    };

    useEffect(() => {
        if (userid && token) {
            getAppliedJobs();
        }
    }, [userid, getAppliedJobs, token])

    const location = useLocation();
    const currentUrl = location.pathname;
    const lastSegment = currentUrl.substring(currentUrl.indexOf('/') + 1);
    const convertedString = lastSegment.replace(/\//g, '-');

    return (
        <>
            <SeoComponent slug={convertedString} />

            {/* Banner */}
            <DashboardBanner />

            {/* Jobs */}
            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={5} xl={4} xxl={3} className="mb-30 mb-lg-0">
                            <CandidateMenu />
                        </Col>
                        <Col lg={7} xl={8} xxl={9} className="position-relative">
                            {isLoading && <LoaderBlur />}
                            <h4 className="mb-30">Saved Jobs</h4>
                            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2 row-cols-xxl-3 g-3 mb-20">
                                {
                                    jobs.length > 0 ? (
                                        jobs.map((job) => (
                                            <Col key={job.jobDetail.slug}>
                                                <Card className="job-card hover-up">
                                                    <Card.Header>
                                                        <div className="job-card-image-left">
                                                            <Row className="g-2">
                                                                <Col xs={2}>
                                                                    <img
                                                                        className={`img-fluid ${job.companyDetail.companyLogo ? "company-logo" : "office-building"}`}
                                                                        src={job.companyDetail.companyLogo ? job.companyDetail.companyLogo : imagePath.officeBuilding}
                                                                        alt="Brand"
                                                                    />
                                                                </Col>
                                                                <Col xs={9}>
                                                                    <div className="right-info">
                                                                        {/* <Link className="name-job" to={`/jobs/${job.jobDetail.slug}`}>{job.companyDetail.companyName}</Link> */}
                                                                        <div className="d-flex">
                                                                            <Link className="name-job" to={`/jobs/${job.jobDetail.slug}`}>{job.companyDetail.companyName}</Link>
                                                                            {job.overallRating > 0 &&
                                                                                <Link className="name-job ms-2 rating-link" to={`/company-details/${job.companyDetail.companySlug}`}>
                                                                                    <FaStar className="text-orange" />
                                                                                    <span>{job.overallRating}</span>
                                                                                </Link>
                                                                            }
                                                                        </div>
                                                                        <span className="location-small">{job.jobDetail.country.countryName}, {job.jobDetail.state.stateName}, {job.jobDetail.district.districtName}</span>
                                                                    </div>
                                                                </Col>
                                                                <Col xs={1}>
                                                                    <div className="d-flex ms-auto">
                                                                        <Button className="bg-transparent p-0 border-0 text-danger" onClick={() => removedSavedJob(job.jobDetail.jobId, job.candidateDetail.candidateNo)}><FaRegTrashAlt /></Button>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <div className="job-card-block-info">
                                                            <h6 className="mb-0">
                                                                <Link to={`/jobs/${job.jobDetail.slug}`}>{job.jobDetail.jobTitle}</Link>
                                                            </h6>
                                                            <span className="job-card-briefcase mt-1 mb-1">{job.jobDetail.jobType.type}</span>
                                                            <span className="job-card-experience mt-1 mb-1">{getExperience(job.jobDetail)}</span>
                                                            <p className="mb-3 limit-desc">{job.jobDetail.jobDesc}</p>
                                                        </div>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <Row>
                                                            <Col xs={12} className="align-self-center">
                                                                <span className="font-bold">
                                                                    {
                                                                        job.jobDetail.minSalary || job.jobDetail.maxSalary ? (
                                                                            <span>{currencySymbols.rupee} </span>
                                                                        ) : (
                                                                            <span>&nbsp;</span>
                                                                        )
                                                                    }
                                                                    {job.jobDetail.minSalary ? formatSalary(job.jobDetail.minSalary) : ''}
                                                                    {job.jobDetail.minSalary && job.jobDetail.maxSalary ? ' - ' : ''}
                                                                    {job.jobDetail.maxSalary ? formatSalary(job.jobDetail.maxSalary) : ''}
                                                                    {(job?.jobDetail?.minSalary || job?.jobDetail?.maxSalary) && (<small className='font-regular mx-1'>{getSalaryTypeSuffix(job?.jobDetail?.salaryType?.slug)}</small>)}
                                                                </span>
                                                            </Col>
                                                        </Row>
                                                    </Card.Footer>
                                                </Card>
                                            </Col>
                                        ))
                                    ) : ''
                                }
                            </Row>
                            {jobs.length < 1 ? (
                                <Row>
                                    <Col md={12} className="text-center">
                                        <NoDataFound />
                                    </Col>
                                </Row>
                            ) : ''}
                            {jobs.length > 0 ? (
                                <Row>
                                    <Col md={12}>
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            handlePageChange={handlePageChange}
                                        />
                                    </Col>
                                </Row>
                            ) : ''}
                        </Col>
                    </Row>
                </Container>
            </section>
            <ToastContainer />
        </>
    )
}