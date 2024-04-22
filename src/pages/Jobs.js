import React, { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import SearchJob from 'components/SearchJob';
import JobFilters from 'components/JobFilters';
import JobCard from 'components/JobCard';
import LoaderBlur from 'components/LoaderBlur';
import axios from 'axios';
import { useSessionStorage } from 'context/SessionStorageContext';
import PaginationComponent from 'components/PaginationComponent';
import { imagePath } from 'components/Constants';
import NoDataFound from 'components/NoDataFound';
import SeoComponent from 'components/SeoComponent';
import { useLocation } from 'react-router-dom';
import { formatSalary } from 'utils/formatSalary';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function Jobs() {
    const [isLoading, setIsLoading] = useState(false);
    const { userid, token, usertype } = useSessionStorage();
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const [currentPage, setCurrentPage] = useState(() => {
        const storedPage = sessionStorage.getItem("pageNo");
        return storedPage ? parseInt(storedPage) : 1; 
    });

    // Get Total jobs count
    const getTotalJobsCount = useCallback(async () => {
        const response = await axios.get(BASE_API_URL + 'jobs/total-jobs/counts');
        if (response?.data?.result === true) {
            setTotalJobs(response.data.totalJobs);
        }
    }, [])

    // Get jobs
    const getJobs = useCallback(async (page = currentPage, limit = 12) => {
        setIsLoading(true);
        const storedFilters = JSON.parse(sessionStorage.getItem('appliedFilters')) || { categories: [], types: [], locations: [], minSalary: '', maxSalary: '', searchJob: '', districtID: '', districtName: '' };
        const filters = {
            categories: storedFilters.categories,
            types: storedFilters.types,
            locations: storedFilters.locations,
            minSalary: storedFilters.minSalary,
            maxSalary: storedFilters.maxSalary,
            searchJob: storedFilters.searchJob,
            districtID: storedFilters.districtID,
            districtName: storedFilters.districtName
        };
        let data = {
            candidateNo: userid || null,
            token: token || null,
            usertype: usertype || null,
            filters: filters,
            page: page,
            limit: limit
        };
        const response = await axios.post(BASE_API_URL + 'filter-job/', data);
        if (response?.data?.result === true) {
            setIsLoading(false);
            setFilteredJobs(response.data.jobs);
            setTotalPages(response.data.totalPages);
        }
        setIsLoading(false);
    }, [userid, usertype, currentPage, token]);

    // Filter
    const handleFilterChange = useCallback(async ({ categories, types, locations, minSalary, maxSalary, flag, searchJob, districtID, districtName }, page = currentPage, limit = 12) => {
        setIsLoading(true);
        if (flag === "filter") {
            setCurrentPage(1);
        }
        const filters = {
            categories: categories,
            types: types,
            locations: locations,
            minSalary: minSalary,
            maxSalary: maxSalary,
            searchJob: searchJob,
            districtID: districtID,
            districtName: districtName
        };
        let data = {
            candidateNo: userid || null,
            token: token || null,
            usertype: usertype || null,
            filters: filters,
            page: page,
            limit: limit
        };
        const response = await axios.post(BASE_API_URL + 'filter-job/', data);
        if (response?.data?.result === true) {
            setIsLoading(false);
            setFilteredJobs(response.data.jobs);
            setTotalPages(response.data.totalPages);
        }
        setIsLoading(false);
    }, [userid, usertype, currentPage, token]);

    // Pagination page change
    const handlePageChange = (newPage) => {
        sessionStorage.setItem("pageNo", newPage);
        const page = sessionStorage.getItem("pageNo");
        setCurrentPage(parseInt(page));
        if (userid && usertype && token) {
            getJobs(parseInt(page));
        }
    };

    useEffect(() => {
        if (userid && token) {
            getJobs();
        }
        getTotalJobsCount();
    }, [getJobs, userid, token, getTotalJobsCount]);

    useEffect(() => {
        const storedFilters = JSON.parse(sessionStorage.getItem('appliedFilters')) || { categories: [], types: [], locations: [], minSalary: '', maxSalary: '', searchJob: '', districtID: '', districtName: '' };
        handleFilterChange(storedFilters);
    }, [handleFilterChange]);

    const location = useLocation();
    const currentUrl = location.pathname;
    const lastSegment = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

    return (
        <>
            <SeoComponent slug={lastSegment} />

            <section className="banner-section sub-banner-py bg-orange-lightest">
                <Container fluid>
                    <Row className="justify-content-center mb-30">
                        <Col md={12} lg={10} xl={10} xxl={8} className="align-self-center text-center">
                            <h1 className="text-capitalize">
                                <span className="text-orange">{totalJobs}+</span> jobs available now.
                            </h1>
                            <p className="mb-0">Find Jobs, Employment & Career Opportunities</p>
                            <SearchJob onFilterChange={handleFilterChange} />
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={4} xl={3} xxl={2} className="mb-30 mb-lg-0">
                            <JobFilters onFilterChange={handleFilterChange} />
                        </Col>
                        <Col lg={8} xl={9} xxl={10} className="position-relative">
                            {isLoading && <LoaderBlur />}
                            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2 row-cols-xxl-3 g-3 mb-20">
                                {

                                    filteredJobs?.map((job) => (
                                        <Col key={job.slug}>
                                            <JobCard
                                                jobDetail={job}
                                                imageClassName={job?.companyDetail?.companyLogo ? 'company-logo' : 'office-building'}
                                                image={job?.companyDetail?.companyLogo ? job.companyDetail.companyLogo : imagePath.officeBuilding}
                                                name={job?.companyDetail?.companyName}
                                                location={`${job?.country?.countryName}, ${job?.state?.stateName}, ${job?.district?.districtName}`}
                                                job={job?.jobTitle}
                                                type={job?.jobType.type}
                                                overallRating={job?.overallRating}
                                                applyStatus={job?.applyStatus}
                                                jobApplied={job?.jobApplied}
                                                experience={`${job?.minExperience?.slug ? job?.minExperience?.slug : ''} ${job?.maxExperience?.slug ? '-' + job?.maxExperience?.slug : ''
                                                    }`}
                                                desc={job?.jobDesc}
                                                salary={`${job?.minSalary ? formatSalary(job.minSalary) : ''} ${job?.minSalary && job.maxSalary ? '-' : ''
                                                    } ${job.maxSalary ? formatSalary(job.maxSalary) : ''}`}
                                                rediredTo={job.slug}
                                            />
                                        </Col>
                                    ))
                                }
                            </Row>
                            {
                                filteredJobs.length < 1 ? (
                                    <Row>
                                        <Col md={12} className="text-center">
                                            <NoDataFound />
                                        </Col>
                                    </Row>
                                ) : ''
                            }
                            {
                                filteredJobs.length > 0 ? (
                                    <Row>
                                        <Col md={12}>
                                            <PaginationComponent
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                handlePageChange={handlePageChange}
                                            />
                                        </Col>
                                    </Row>
                                ) : ''
                            }
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
}