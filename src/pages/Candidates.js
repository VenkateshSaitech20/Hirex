import React, { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import CandidateFilters from 'components/CandidateFilters';
import CandidateCard from 'components/CandidateCard';
import LoaderBlur from 'components/LoaderBlur';
import axios from 'axios';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { imagePath } from 'components/Constants';
import NoDataFound from 'components/NoDataFound';
import PaginationComponent from 'components/PaginationComponent';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

export default function Candidates() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [totalCandidates, setTotalCandidates] = useState();
    const { userid, token, usertype, username } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(() => {
        const storedPage = sessionStorage.getItem("candidatePageNo");
        return storedPage ? parseInt(storedPage) : 1;
    });

    // Get Candidates
    const getCandidates = useCallback(async (page = 1, limit = 12) => {
        setIsLoading(true);
        let data = { page, limit, userid, username, usertype };
        const response = await axios.post(BASE_API_URL + 'candidate-details/all-candidates', data, { headers: { Authorization: `Bearer ${token}` }, });
        if (response?.data?.result === true) {
            setIsLoading(false);
            setCandidates(response.data.candidates);
            setTotalCandidates(response.data.candidates.length);
            setTotalPages(response.data.totalPages);
        } else if (response?.data?.result === false) {
            if (response?.data?.message === 'Token Expired') {
                if (usertype === "employer") {
                    navigate('/employer/login');
                } else {
                    navigate('/login');
                }
                clearStorage();
                navigate('/');
                setIsLoading(false);
            } else {
                clearStorage();
                sessionStorage.setItem('loginErr', LOGIN_ERR);
                setIsLoading(false);
            }
        }
        setIsLoading(false);
    }, [token, clearStorage, navigate, usertype, userid, username]);

    // Filter
    const handleFilterChange = useCallback(async ({ jobtitles, gender, locations, salary, flag }, page = currentPage, limit = 12) => {
        setIsLoading(true);
        if (flag === "filter") {
            setCurrentPage(1);
        }
        const filters = {
            jobtitles: jobtitles,
            gender: gender,
            locations: locations,
            salary: salary,
        };
        let data = {
            filters: filters,
            page: page,
            limit: limit
        };
        setFilteredCandidates(candidates);
        const response = await axios.post(BASE_API_URL + 'candidate-details/filter-candidates/', data, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            setFilteredCandidates(response.data.candidates);
            setTotalPages(response.data.totalPages);
        }
        setIsLoading(false);
    }, [candidates, currentPage, token]);

    const handlePageChange = (newPage) => {
        sessionStorage.setItem("candidatePageNo", newPage);
        const page = sessionStorage.getItem("candidatePageNo");
        setCurrentPage(parseInt(page));
        if (userid && usertype && token) {
            getCandidates(parseInt(page));
        }
    };

    useEffect(() => {
        if (userid && token) {
            getCandidates();
        }
    }, [getCandidates, userid, token]);

    useEffect(() => {
        const storedFilters = JSON.parse(sessionStorage.getItem('candidateFilters')) || { jobtitles: [], gender: [], locations: [], salary: '' };
        handleFilterChange(storedFilters);
    }, [handleFilterChange]);

    return (
        <>
            <section className="banner-section sub-banner-py bg-orange-lightest">
                <Container fluid>
                    <Row className="justify-content-center mb-10">
                        <Col md={12} lg={10} xl={10} xxl={8} className="align-self-center text-center">
                            <h1 className="text-capitalize mb-0">
                                <span className="text-orange">{totalCandidates} +</span> candidates available now.
                            </h1>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={4} xl={3} xxl={2} className="mb-30 mb-lg-0">
                            <CandidateFilters onFilterChange={handleFilterChange} />
                        </Col>
                        <Col lg={8} xl={9} xxl={10} className="position-relative">
                            {isLoading && <LoaderBlur />}
                            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2 row-cols-xxl-3 g-3 mb-20">
                                {filteredCandidates.map((candidate) => (
                                    candidate?.candidateNo && candidate?.country && candidate?.state && candidate?.district && (
                                        <Col key={candidate?.candidateNo}>

                                            <CandidateCard
                                                imageClassName={candidate?.profileImg ? 'company-logo' : 'office-building'}
                                                image={candidate?.profileImg ? candidate?.profileImg : imagePath.human}
                                                name={candidate?.name}
                                                location={`${candidate?.country?.countryName}, ${candidate?.state?.stateName}, ${candidate?.district?.districtName}`}
                                                jobTitle={candidate?.jobTitle?.title}
                                                qualification={candidate?.qualification}
                                                experience={candidate?.experience}
                                                desc={candidate?.description}
                                                salary={candidate?.salary}
                                                rediredTo={candidate?.candidateNo}
                                            />
                                        </Col>
                                    )
                                ))}
                            </Row>
                            {
                                filteredCandidates.length < 1 ? (
                                    <Row>
                                        <Col md={12} className="text-center">
                                            <NoDataFound />
                                        </Col>
                                    </Row>
                                ) : ''
                            }
                            {
                                filteredCandidates.length > 0 ? (
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