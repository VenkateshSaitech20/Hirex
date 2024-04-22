import { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Card } from 'react-bootstrap';
import DashboardBanner from 'components/DashboardBanner';
import EmployerMenu from 'components/EmployerMenu';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import LoaderBlur from 'components/LoaderBlur';
import { formatDate } from 'utils/formatDate';
import { FaRegClock, FaGem } from "react-icons/fa";
import { currencySymbols } from 'components/Constants';
import PaginationComponent from 'components/PaginationComponent';
import SeoComponent from 'components/SeoComponent';
import { formatSalary, getSalaryTypeSuffix } from 'utils/formatSalary';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { userid, token, companyid, packageInfo } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [packageData, setPackageData] = useState("");

    const getJobs = useCallback(async (page = 1, limit = 12) => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL + 'jobs/company/' + companyid + `?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            setJobs(response.data.jobs);
            setTotalPages(response.data.totalPages);
        } else if (response?.data?.result === false) {
            clearStorage();
            sessionStorage.setItem("loginErr", LOGIN_ERR);
            setIsLoading(false);
            navigate('/employer/login');
        }
    }, [clearStorage, navigate, token, companyid])

    useEffect(() => {
        if (userid && token && companyid) {
            getJobs();
        }
        if (packageInfo) {
            setPackageData(JSON.parse(packageInfo));
        }
    }, [getJobs, token, userid, companyid, packageInfo]);

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

    // Pagination page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (userid && token) {
            getJobs(newPage);
        }
    };

    const location = useLocation();
    const currentUrl = location.pathname;
    const lastSegment = currentUrl.substring(currentUrl.indexOf('/') + 1);
    const convertedString = lastSegment.replace(/\//g, '-');

    return (
        <>
            <SeoComponent slug={convertedString} />
            <DashboardBanner />
            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={5} xl={4} xxl={3} className="mb-30 mb-lg-0">
                            <EmployerMenu />
                        </Col>
                        <Col lg={7} xl={8} xxl={9} className="position-relative">
                            {isLoading && <LoaderBlur />}
                            {packageData?.packageName &&
                                <div className="box-lightgreen h-auto mb-30">
                                    <h5 className="mb-0 text-center"><FaGem className="top-n1 me-1" /> {packageData?.packageName}</h5>
                                </div>
                            }
                            <h4 className="mb-30">Recent job list</h4>
                            <Row className="position-relative row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2 row-cols-xxl-3 g-3">
                                {jobs.length > 0 ? (
                                    jobs.map((job) => (
                                        <Col key={job.slug}>
                                            <Card className="job-card hover-up position-relative">
                                                <Card.Header>
                                                    <div className="job-card-image-left pb-0">
                                                        <Row className="g-2">
                                                            <Col xs={12}>
                                                                <div className="right-info">
                                                                    <Link className="name-job mb-1" to={`/jobs/${job.slug}`}>{job.jobTitle}</Link>
                                                                    <span className="location-small">{job.country.countryName}, {job.state.stateName}, {job.district.districtName}</span>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="job-card-block-info">
                                                        <span className="job-card-briefcase mt-1 mb-1">{job.jobType.type}</span>
                                                        <span className="job-card-experience mt-1 mb-1">{getExperience(job)}</span>
                                                        <p className="mb-1 limit-desc">{job.jobDesc}</p>
                                                    </div>
                                                </Card.Body>
                                                <Card.Footer>
                                                    <div className='g-2 d-flex justify-content-between flex-wrap'>
                                                        <div className="align-self-center mb-1 mb-sm-0 mb-md-1 mb-lg-0 me-2">
                                                            <p className="mb-1 font-bold">
                                                                {
                                                                    job?.minSalary || job?.maxSalary ? (
                                                                        <span>{currencySymbols.rupee} </span>
                                                                    ) : (
                                                                        <span>&nbsp;</span>
                                                                    )
                                                                }
                                                                {job?.minSalary ? formatSalary(job?.minSalary) : ''}
                                                                {job?.minSalary && job?.maxSalary ? ' - ' : ''}
                                                                {job?.maxSalary ? formatSalary(job?.maxSalary) : ''}
                                                                {(job?.minSalary || job?.maxSalary) &&  <small className='font-regular mx-1'>{getSalaryTypeSuffix(job?.salaryType?.slug)}</small>}
                                                            </p>
                                                        </div>
                                                        <div className="text-sm-end text-md-start text-lg-end">
                                                            <div className="job-card-block-info p-0">
                                                                <span className="mt-1 mb-1 text-gray fs-14"><FaRegClock className="top-n1" /> {job.createdAt && formatDate(job.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card.Footer>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col className="position-relative">
                                        {isLoading && <LoaderBlur />}
                                        <p>No jobs found.</p>
                                    </Col>
                                )}
                            </Row>
                            {jobs.length > 0 ? (
                                <Row className="mt-3" md={12}>
                                    <Col>
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
        </>
    )
}
export default EmployerDashboard;