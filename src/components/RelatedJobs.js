import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState, useCallback } from 'react';
import Slider from "react-slick";
import Container from 'react-bootstrap/Container';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import PropTypes from 'prop-types';
import axios from 'axios';
import LoaderBlur from 'components/LoaderBlur';
import { imagePath, currencySymbols } from 'components/Constants';
import { FaStar } from "react-icons/fa";
import { formatSalary, getSalaryTypeSuffix } from "utils/formatSalary";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const PrevArrow = ({ onClick }) => (
    <button
        className="custom-arrow custom-prev"
        onClick={onClick}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Space") {
                onClick(e);
            }
        }}
        aria-label="Previous slide"
    >
        <FiChevronLeft />
    </button>
);
  
const NextArrow = ({ onClick }) => (
    <button
        className="custom-arrow custom-next"
        onClick={onClick}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Space") {
                onClick(e);
            }
        }}
        aria-label="Next slide"
    >
        <FiChevronRight />
    </button>
);

const RelatedJobs = ({companySlug, jobSlug}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [jobs, setJobs] = useState([]);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1
                }
            },
            {
                breakpoint: 1200,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                slidesToShow: 1,
                slidesToScroll: 1
                }
            }
        ]
    };

    // Get jobs
    const getRelatedJobs = useCallback(async () => {
        setIsLoading(true);
        const response = await axios.get(`${BASE_API_URL}jobs/related-jobs/${companySlug}/${jobSlug}`);
        if (response?.data?.result === true) {
            setIsLoading(false);
            setJobs(response?.data?.relatedJobs);
        } else if (response?.data?.result === false) {
            setIsLoading(false);
        }
    }, [companySlug, jobSlug]);

    useEffect(() => {
        getRelatedJobs();
    }, [getRelatedJobs]);

    const getExperience = (job) => {
        const minExperience = job?.minExperience?.slug || '';
        const maxExperience = job?.maxExperience?.slug || '';
        let experience = '';
        if (job?.minExperience?.slug && job?.maxExperience?.slug) {
            experience = `${minExperience} - ${maxExperience} Years`;
        } else if((job?.minExperience?.slug || job?.maxExperience?.slug)) {
            experience = `${minExperience || maxExperience} Years`;
        } else {
            experience = "0 Year"
        }
        return experience;
    };

    return(
        jobs?.length > 0 ? (
            <Container fluid className="pb-50">
                <Row>
                    <Col md={12} className="position-relative related-job-slider">
                        {isLoading && <LoaderBlur />}
                        <h4 className="mb-20">Related Jobs</h4>
                        <Slider {...settings} prevArrow={<PrevArrow />} nextArrow={<NextArrow />} className="category-slider">
                            {
                                jobs?.map((job) => (
                                    <div className="m-1 w-auto" key = {job?.slug}>
                                        <Card className="job-card hover-up">
                                            <Card.Header>
                                                <div className="job-card-image-left">
                                                    <Row className="g-2">
                                                        <Col xs={2}>
                                                            <img className={`img-fluid ${job?.companyDetail?.companyLogo ? 'company-logo' : 'office-building'}`} src={job?.companyDetail?.companyLogo ? job?.companyDetail?.companyLogo : imagePath.officeBuilding} alt="Brand" />
                                                        </Col>
                                                        <Col xs={10}>
                                                            <div className="right-info">
                                                                <div className="d-flex justify-content-between">
                                                                    <Link className="name-job trim-single-line" to={`/jobs/${job?.slug}`}>{job?.jobTitle}</Link>
                                                                    { job.overallRating > 0 && 
                                                                        <Link className="name-job ms-2 rating-link" to={`/company-details/${job?.companyDetail?.companySlug}`}>
                                                                            <FaStar className="text-orange"/>
                                                                            <span>{job?.overallRating}</span>
                                                                        </Link>
                                                                    }
                                                                </div>
                                                                <span className="location-small">{job?.country?.countryName}, {job?.state?.stateName}, {job?.district?.districtName}</span>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="job-card-block-info">
                                                    <h6 className="mb-0"><Link to={`/jobs/${job?.slug}`}>{job?.jobTitle}</Link></h6>
                                                    <span className="job-card-briefcase mt-1 mb-1">{job?.jobType.type}</span>
                                                    <span className="job-card-experience mt-1 mb-1">{getExperience(job)}</span>
                                                    <p className="mb-3 limit-desc">{job?.jobDesc}</p>
                                                </div>
                                            </Card.Body>
                                            <Card.Footer>
                                                <Row>
                                                    <Col xs={12} className="align-self-center">
                                                        <p className="mb-1 font-bold">
                                                            { 
                                                                job?.minSalary || job?.maxSalary ? (
                                                                    <span className="font-bold">{currencySymbols.rupee} </span>
                                                                ) : (
                                                                    <span>&nbsp;</span>
                                                                )
                                                            }    
                                                            { job?.minSalary ? formatSalary(job?.minSalary) : '' } 
                                                            { job?.minSalary && job?.maxSalary ? '-' : '' } 
                                                            { job?.maxSalary ? formatSalary(job?.maxSalary) : '' }
                                                            {(job?.minSalary || job?.maxSalary) && (<small className='font-regular mx-1'>{getSalaryTypeSuffix(job?.salaryType?.slug)}</small>)}
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </Card.Footer>
                                        </Card>
                                    </div>
                                ))
                            }
                        </Slider>
                    </Col>
                </Row>
            </Container>
        ) : ''
    )
}

PrevArrow.propTypes = {
    onClick: PropTypes.func,
};

NextArrow.propTypes = {
    onClick: PropTypes.func,
};

RelatedJobs.propTypes = {
    companySlug : PropTypes.string.isRequired,
    jobSlug : PropTypes.string.isRequired,
}

export default RelatedJobs;