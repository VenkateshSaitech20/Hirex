import { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Row, Col } from 'react-bootstrap';
import JobCard from 'components/JobCard';
import LoaderBlur from 'components/LoaderBlur';
import DashboardBanner from 'components/DashboardBanner';
import CandidateMenu from 'components/CandidateMenu';
import axios from 'axios';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { imagePath } from 'components/Constants';
import PaginationComponent from 'components/PaginationComponent';
import NoDataFound from 'components/NoDataFound';
import SeoComponent from 'components/SeoComponent';
import { formatSalary } from 'utils/formatSalary';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

export default function CandidateDashboard() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [jobsCount, setJobsCount] = useState([]);
    const { userid, token, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Get jobs after login
    const getAppliedJobs = useCallback(async (page = 1, limit = 9) => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL + 'applied-job/my-jobs/' + userid + '/' + usertype + `?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            setJobs(response.data.jobs);
            setJobsCount(response.data.counts);
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
                            <h4 className="mb-30">Recent Applied Jobs</h4>
                            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2 row-cols-xxl-4 g-2 mb-30 count-box">
                                <Col>
                                    <Link className="box-lightblue hover-up">
                                        <span>Total Applications</span>
                                        <span>{jobsCount?.total}</span>
                                    </Link>
                                </Col>
                                <Col>
                                    <Link className="box-lightgreen hover-up">
                                        <span>Shortlisted Applications</span>
                                        <span>{jobsCount?.shortlisted}</span>
                                    </Link>
                                </Col>
                                <Col>
                                    <Link className="box-lightred hover-up">
                                        <span>Rejected Applications</span>
                                        <span>{jobsCount?.rejected}</span>
                                    </Link>
                                </Col>
                                <Col>
                                    <Link className="box-lightorange hover-up">
                                        <span>Hold Applications</span>
                                        <span>{jobsCount?.hold}</span>
                                    </Link>
                                </Col>
                            </Row>
                            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2 row-cols-xxl-3 g-3 mb-20">
                                {
                                    jobs.length > 0 ? (
                                        jobs.map((job) => (
                                            <Col key={job?.jobDetail?.slug}>
                                                <JobCard
                                                    jobDetail={job}
                                                    imageClassName={job?.companyDetail?.companyLogo ? "company-logo" : "office-building"}
                                                    image={job?.companyDetail?.companyLogo ? job?.companyDetail?.companyLogo : imagePath.officeBuilding}
                                                    name={job?.companyDetail?.companyName}
                                                    location={`${job?.jobDetail?.country?.countryName}, ${job?.jobDetail?.state?.stateName}, ${job?.jobDetail?.district?.districtName}`}
                                                    job={job?.jobDetail?.jobTitle}
                                                    type={job?.jobDetail?.jobType.type}
                                                    overallRating={job?.overallRating}
                                                    jobApplied="yes"
                                                    applyStatus={job.applyStatus}
                                                    experience={`${job?.jobDetail?.minExperience?.slug ? job?.jobDetail?.minExperience?.slug : ''} ${job?.jobDetail?.maxExperience?.slug ? '-' + job?.jobDetail?.maxExperience?.slug : ''}`}
                                                    desc={job?.jobDetail?.jobDesc}
                                                    salary={`${job?.jobDetail?.minSalary ? formatSalary(job?.jobDetail?.minSalary) : ''} ${job?.jobDetail?.minSalary && job?.jobDetail?.maxSalary ? '-' : ''} ${job?.jobDetail?.maxSalary ? formatSalary(job?.jobDetail?.maxSalary) : ''}`}
                                                    rediredTo={job?.jobDetail?.slug}
                                                />
                                            </Col>
                                        ))
                                    ) : ''
                                }
                            </Row>
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
                            {jobs.length < 1 ? (
                                <Row>
                                    <Col md={12} className="text-center">
                                        <NoDataFound />
                                    </Col>
                                </Row>
                            ) : ''}
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}