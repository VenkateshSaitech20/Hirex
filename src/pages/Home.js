import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import { FiChevronRight, FiChevronLeft, FiArrowRight } from "react-icons/fi";
import Card from 'react-bootstrap/Card';
import CategoryCard from "components/CategoryCard";
import { Link } from "react-router-dom";
import SearchJob from "components/SearchJob";
import { imagePath } from 'components/Constants';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import { useSessionStorage } from 'context/SessionStorageContext';
import LoaderBlur from 'components/LoaderBlur';
import axios from "axios";
import SeoComponent from '../components/SeoComponent';


const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const PrevArrow = (props) => (
    <div className="custom-arrow custom-prev"
        onClick={props.onClick}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Space') {
                props.onClick(e);
            }
        }}>
        <FiChevronLeft />
    </div>
);

const NextArrow = (props) => (
    <div className="custom-arrow custom-next"
        onClick={props.onClick}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Space') {
                props.onClick(e);
            }
        }}
    >
        <FiChevronRight />
    </div>
);

export default function Home() {
    const { userid } = useSessionStorage();
    const [topCategories, setTopCategories] = useState();
    const [homeData, setHomeData] = useState();
    const [featureCompanies, setFeatureCompanies] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [totalJobs, setTotalJobs] = useState(0);
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
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

    const companiessettings = {
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 850,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    // Top Categories
    const getTopCategories = useCallback(async () => {
        const response = await axios.get(BASE_API_URL + 'master-job-category/top-categories/count');
        if (response?.data) {
            setTopCategories(response?.data);
        }
    }, [])

    // Get Home Content
    const getHomeData = useCallback(async () => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL + 'home');
        if (response?.data?.result === true) {
            setIsLoading(false);
            setHomeData(response?.data?.homeData);
        } else {
            setIsLoading(false);
        }
    }, [])

    // Get Home Content
    const getFeatureCompany = useCallback(async () => {
        const response = await axios.get(BASE_API_URL + 'feature-companies');
        if (response?.data?.result === true) {
            setFeatureCompanies(response?.data?.featureCompanies);
        }
    }, [])

    // Get Total job count
    const getTotalJobsCount = useCallback(async () => {
        const response = await axios.get(BASE_API_URL + 'jobs/total-jobs/counts');
        if (response?.data?.result === true) {
            setTotalJobs(response.data.totalJobs);
        }
    }, [])


    useEffect(() => {
        getTopCategories();
        getHomeData();
        getTotalJobsCount();
        getFeatureCompany();
    }, [getTopCategories, getHomeData, getTotalJobsCount, getFeatureCompany]);

    return (
        <>
            <SeoComponent slug={"home"} />
            {/* Banner */}
            <section className={`banner-section banner-py position-relative ${userid ? 'bg-orange-lightest banner-alt-pb' : ''}`}>
                {isLoading && <LoaderBlur />}
                <Container fluid>
                    <Row className="justify-content-center mb-30">
                        <Col md={12} lg={10} xl={10} xxl={8} className="align-self-center text-center">
                            <h4>{homeData?.subTitle}</h4>
                            <h1 className="text-capitalize">{homeData?.mainTitleTextOne} <span className="text-orange">{totalJobs}+</span> {homeData?.mainTitleTextTwo}</h1>
                            <p className="mb-0">{homeData?.bannerDesc}</p>
                            <SearchJob />
                        </Col>
                    </Row>
                    {!userid || userid === null || userid === "null" ? (
                        <Row className="mb-30">
                            <Col xl={6} className="mb-30 mb-xl-0">
                                <Card className="card-box hover-up">
                                    <Card.Body className="p-0">
                                        <Row>
                                            <Col md={4} lg={3} className="align-self-center">
                                                <img className="img-fluid mb-3 mb-md-0" src={imagePath.lookingJob} alt="looking job" />
                                            </Col>
                                            <Col md={8} lg={9} className="align-self-center">
                                                <h4 className="mb-2">{homeData?.leftCardTitle}</h4>
                                                <p className="mb-2">{homeData?.leftCardDesc}</p>
                                                <Link to="/login" className="text-orange font-bold">Apply Now <FiArrowRight /></Link>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={6}>
                                <Card className="card-box hover-up">
                                    <Card.Body className="p-0">
                                        <Row className="">
                                            <Col md={4} lg={3} className="align-self-center">
                                                <img className="img-fluid mb-3 mb-md-0" src={imagePath.recruiter} alt="Recruiting" />
                                            </Col>
                                            <Col md={8} lg={9} className="align-self-center">
                                                <h4 className="mb-2">{homeData?.rightCardTitle}</h4>
                                                <p className="mb-2">{homeData?.rightCardDesc}</p>
                                                <Link to="/employer/login" className="text-orange font-bold">Apply Now <FiArrowRight /></Link>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ) : ''}
                    {topCategories?.length > 0 ? (
                        <Row>
                            <Col md={12}>
                                <Slider {...settings} prevArrow={<PrevArrow />} nextArrow={<NextArrow />} className="category-slider">
                                    {
                                        topCategories?.map((topCategory) => (
                                            <CategoryCard key={topCategory._id} categoryID={topCategory._id} name={topCategory.categoryName} vacancy={topCategory.count} />
                                        ))
                                    }
                                </Slider>
                            </Col>
                        </Row>
                    ) : ''
                    }
                </Container>
            </section>

            {/* Easiest Way to use */}
            <section className="pt-50">
                <Container fluid>
                    <Row>
                        <Col lg={6} className="align-self-center mb-30 mb-lg-0">
                            <img className="img-fluid" src={imagePath.jobSearch} alt="Job Search" />
                        </Col>
                        <Col lg={6} className="align-self-center">
                            <h3 className="mb-30">{homeData?.secTwoMainTitle}</h3>
                            <Link to={userid ? "candidate/profile" : "signup"}>
                                <div className="box-checkbox mb-30">
                                    <h5>{homeData?.secTwoTitleOne}</h5>
                                    <p className="mb-0">{homeData?.secTwoDescOne}</p>
                                </div>
                            </Link>
                            <Link to={userid ? "/candidate/resume-builder" : "/signup"}>
                                <div className="box-checkbox mb-30">
                                    <h5>{homeData?.secTwoTitleTwo}</h5>
                                    <p className="mb-0">{homeData?.secTwoDescTwo}</p>
                                </div>
                            </Link>
                            <Link to="/jobs">
                                <div className="box-checkbox mb-30">
                                    <h5>{homeData?.secTwoTitleThree}</h5>
                                    <p className="mb-0">{homeData?.secTwoDescThree}</p>
                                </div>
                            </Link>
                            <Link to="/jobs">
                                <div className="box-checkbox mb-0">
                                    <h5>{homeData?.secTwoTitleFour}</h5>
                                    <p className="mb-0">{homeData?.secTwoDescFour}</p>
                                </div>
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Feature Companies */}
            <section className="py-50">
                <Container fluid>
                    <Row className="box-border">
                        <Col lg={4} xl={3} className="align-self-center">
                            <h3 className="mb-30 mb-lg-0">Feature Companies</h3>
                        </Col>
                        <Col lg={8} xl={9} className="align-self-center">
                            {featureCompanies?.length > 0 ? (
                                <Slider {...companiessettings} className="category-slider">
                                    {
                                        featureCompanies?.map((company) => (
                                            <img className="img-fluid h-35 w-auto" src={company.image} alt="Company" key={company.sequenceOrder} />
                                        ))
                                    }
                                </Slider>
                            ) : ''
                            }
                        </Col>
                    </Row>
                </Container>
            </section>

            <ToastContainer />
        </>
    )
}

PrevArrow.propTypes = {
    onClick: PropTypes.func,
};

Home.propTypes = {
    data: PropTypes.shape({
        metaTitle: PropTypes.string,
        metaKeywords: PropTypes.string,
        metaDescription: PropTypes.string,
    })
};

NextArrow.propTypes = {
    onClick: PropTypes.func,
};