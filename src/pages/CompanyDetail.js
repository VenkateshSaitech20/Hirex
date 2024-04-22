import { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { SlLocationPin, SlLayers, SlPeople } from "react-icons/sl";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import LoaderBlur from 'components/LoaderBlur';
import { ToastContainer, toast } from 'react-toastify';
import {imagePath} from 'components/Constants';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Rating } from 'react-simple-star-rating'
import LoaderButton from 'components/LoaderButton';
import ReviewComponent from 'components/ReviewComponent';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const CompanyDetail = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [company, setCompany] = useState();
    const { slug } = useParams();
    const { token, userid, user, usertype } = useSessionStorage();
    const [rating, setRating] = useState();
    const [review, setReview] = useState();
    const [totalJobs, setTotalJobs] = useState();
    const [overAllRating, setOverAllRating] = useState();
    const [ratingCounts, setRatingCounts] = useState();
    const [companyId, setCompanyId] = useState();
    const [ratingErr, setRatingErr] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { clearStorage } = useClearStorage();
    const [err, setErr] = useState();
    const [showReview, setShowReview] = useState(false);
    const { register, handleSubmit, setValue } = useForm({
        mode: "all"
    });

    // Token expired error
    const tokenExpired = useCallback((data) => {
        if(data?.message === "Token Expired"){
            clearStorage();
            sessionStorage.setItem("loginErr",LOGIN_ERR);
            setIsLoading(false);
            navigate('/login');
        } else{
            setIsLoading(false);
            setErr(data?.errors);
        }
    },[clearStorage,navigate]);

    // Get Review by companyId and userId
    const getReview = useCallback(async(companyId,candidateNo) => {
        const response = await axios.get(`${BASE_API_URL}company-review/find-one/${companyId}/${candidateNo}`,{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true) {
            setIsLoading(false);
            if(response?.data?.review){
                setIsEdit(true);
            } else {
                setIsEdit(false);
            }
            setReview(response?.data?.review);
            setRating(response?.data?.review?.rating);
            setValue('likes',response?.data?.review?.likes);
            setValue('dislikes',response?.data?.review?.dislikes);
        } else if(response?.data?.result === false) {
            setIsLoading(false);
            setIsEdit(false);
            tokenExpired(response?.data);
            
        }  
    },[token,setValue,tokenExpired])

    // Get totaljobs by companyId
    const getTotalJobs = useCallback(async(companyId) => {
        const response = await axios.get(`${BASE_API_URL}jobs/company/job-counts/${companyId}`);
        if(response?.data?.result === true) {
            setTotalJobs(response?.data?.totalJobs);
        } 
    },[]);

    // Get overall rating by companyId
    const getOverallRating = useCallback(async(companyId) => {
        const response = await axios.get(`${BASE_API_URL}companies/${companyId}`);
        if(response?.data?.result === true) {
            setOverAllRating(response?.data?.companyDetail?.overallRating);
        } 
    },[]);

    // Get review count by companyId
    const getReviewCount = useCallback(async(companyId) => {
        const response = await axios.get(`${BASE_API_URL}company-review/count/${companyId}`);
        if(response?.data?.result === true) {
            setRatingCounts(response?.data?.ratingCounts);
        } 
    },[]);

    // Get company detail
    const getCompanyDetail = useCallback(async () => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL+'companies/find-by-slug/'+slug);
        if(response?.data?.result === true) {
            setIsLoading(false);
            setCompany(response.data.companyDetail);
            if(userid){
                getReview(response.data.companyDetail._id,userid);
            }
            setCompanyId(response.data.companyDetail._id);
            getTotalJobs(response.data.companyDetail._id);
            getOverallRating(response.data.companyDetail._id);
            getReviewCount(response.data.companyDetail._id);
        }
    },[slug,userid,getReview,getTotalJobs,getOverallRating,getReviewCount])

    // Rating value
    const handleRating = (rate) => {
        const formattedRating = parseFloat(rate).toFixed(1);
        setRatingErr(false);
        setRating(formattedRating)
    }

    // Candidate detail
    const candidateDetail = () => {
        if(user){
            let candidate = JSON.parse(user);
            return {
                candidateNo : candidate.candidateNo,
                name : candidate.name,
                email : candidate.email
            }
        } else {
            return;
        }
    }

    // Company detail
    const companyDetail = () => {
        if(company){
            return {
                companyId : company._id,
                companyName : company.companyName,
                companySlug : company.companySlug
            }
        } else {
            return;
        }
    }

    // Submit Review
    const submitReview = async(data) => {
        setErr();
        if(!rating){
            setRatingErr(true);
            return;
        }
        setRatingErr(false);
        data.rating = rating;
        data.usertype = usertype;
        data.candidateDetail = candidateDetail();
        data.companyDetail = companyDetail();
        if(token && review?.status !== "Approved"){
            if(!isEdit){
                postReview(data);
            } else {
                updateReview(data);
            }
        }
    }

    // Post Review
    const postReview = async(data) => {
        setIsButtonLoading(true);
        const response = await axios.post(`${BASE_API_URL}company-review`,data,{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true){
            setIsButtonLoading(false);
            setRating(response?.data?.review?.rating);
            setValue('likes',response?.data?.review?.likes);
            setValue('dislikes',response?.data?.review?.dislikes);
            setIsEdit(true);
            toast.success(response?.data?.message,{theme:'colored'});
        } else if(response?.data?.result === false) {
            setIsButtonLoading(false);
            tokenExpired(response?.data);
        }
    }

    // Update Review
    const updateReview = async(data) => {
        setIsButtonLoading(true);
        const response = await axios.put(`${BASE_API_URL}company-review/${data.companyDetail.companyId}/${data.candidateDetail.candidateNo}`,data,{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true){
            setIsButtonLoading(false);
            setRating(response?.data?.review?.rating);
            setValue('likes',response?.data?.review?.likes);
            setValue('dislikes',response?.data?.review?.dislikes);
            toast.success(response?.data?.message,{theme:'colored'});
        } else if(response?.data?.result === false) {
            setIsButtonLoading(false);
            tokenExpired(response?.data);
        }
    }

    // Get badge background color based on rating
    const getBadgeBgColor = () => {
        if (rating < 2.5) {
            return 'danger';
        } else if (rating <= 3.5) {
            return 'info';
        } else {
            return 'success';
        }
    };

    // Toggle Review
    const toggleReview = () => {
        setShowReview(!showReview);
    };

    useEffect(() => {
        if(slug){
            getCompanyDetail();
        }
    },[getCompanyDetail, slug])

    return(
        <>
            {/* Banner */}
            <section className="banner-section sub-banner-py bg-orange-lightest">
                <Container fluid>
                    <Row className="justify-content-center mb-fixed-10">
                        <Col md={12} lg={10} xl={10} xxl={8} className="align-self-center text-center">
                            <img className="img-fluid company-profile-img mb-2" src={company?.companyLogo ? company?.companyLogo : imagePath.officeBuilding} alt="Brand" />
                            <h2 className="text-capitalize mb-0"><span>{company?.companyName}</span></h2>
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
                                    {isLoading && <LoaderBlur/>}
                                    <div className="text-center mb-20">
                                        <img className="img-fluid mb-15 company-profile-img" src={company?.companyLogo ? company?.companyLogo : imagePath.officeBuilding} alt="Brand" />
                                        <h6 className="mb-0">{company?.companyName}</h6>
                                        { 
                                            company?.linkedin || company?.twitter || company?.facebook ? (
                                                <ul className="social-ul justify-content-center mt-2">
                                                    {
                                                        company?.facebook && (
                                                            <li>
                                                                <Link to={company?.facebook} target="_blank">
                                                                    <img className="img-fluid" src={imagePath.facebook} alt="Facebook" />
                                                                </Link>
                                                            </li>
                                                        )
                                                    }
                                                    {
                                                        company?.twitter && (
                                                            <li>
                                                                <Link to={company?.twitter} target="_blank">
                                                                    <img className="img-fluid mt-1" src={imagePath.twitter} alt="Twitter" />
                                                                </Link>
                                                            </li>
                                                        )
                                                    }
                                                    {
                                                        company?.linkedIn && (
                                                            <li>
                                                                <Link to={company?.linkedIn} target="_blank">
                                                                    <img className="img-fluid" src={imagePath.linkedin} alt="LinkedIn" />
                                                                </Link>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            ) : ''
                                        }
                                    </div>
                                    <hr className="mb-20" />
                                    <ul className="ul-icon-wrap">
                                        { company?.address &&(
                                            <li>
                                                <div className="icon-left"><SlLocationPin/></div>
                                                <div className="icon-right">
                                                    <h6 className="mb-1 fs-16">Address</h6>
                                                    <p>{company?.address}</p>
                                                </div>
                                            </li>
                                        )}
                                        <li>
                                            <div className="icon-left"><SlLayers/></div>
                                            <div className="icon-right">
                                                <h6 className="mb-1 fs-16">Company Type</h6>
                                                <p>{company?.companyType?.type}</p>
                                            </div>
                                        </li>
                                        {company?.empCount && (
                                            <li>
                                                <div className="icon-left"><SlPeople/></div>
                                                <div className="icon-right">
                                                    <h6 className="mb-1 fs-16">No of employees</h6>
                                                    <p>{company?.empCount}</p>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </Col>
                        <Col lg={7} xl={8} xxl={9} className="position-relative">
                            {isLoading && <LoaderBlur/>}
                            <h4 className="mb-20">About {company?.companyName}</h4>
                            <p className="mb-30">{company?.description}</p>
                            <Row className="g-2 mb-30">
                                <Col md={4} xxl={2}>
                                    <div className="box-lightorange text-center">
                                        <div className="vertical-center">
                                            <p className="mb-1 font-bold">Total Jobs</p>
                                            <h3 className="text-orange mb-0">{totalJobs}</h3>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={8} xxl={10}>
                                    <Row className="row-cols-2 row-cols-md-3 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-6 g-2">
                                        <Col>
                                            <div className="box-lightblue text-center">
                                                <p className="mb-1 font-bold">Overall Rating</p>
                                                <h3 className="text-orange mb-0">{overAllRating ?? 0}</h3>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="box-lightdarkgreen text-center">
                                                <p className="mb-1 font-bold">Five stars</p>
                                                <h3 className="mb-0">{ratingCounts?.fiveStars}</h3>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="box-lightgreen text-center">
                                                <p className="mb-1 font-bold">Four stars</p>
                                                <h3 className="mb-0">{ratingCounts?.fourStars}</h3>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="box-lightyellow text-center">
                                                <p className="mb-1 font-bold">Three stars</p>
                                                <h3 className="mb-0">{ratingCounts?.threeStars}</h3>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="box-lightorange text-center">
                                                <p className="mb-1 font-bold">Two stars</p>
                                                <h3 className="mb-0">{ratingCounts?.twoStars}</h3>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="box-lightred text-center">
                                                <p className="mb-1 font-bold">One stars</p>
                                                <h3 className="mb-0">{ratingCounts?.oneStars}</h3>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Button className="btn btn-main mb-30" onClick={toggleReview}>
                                {showReview ? 'Hide reviews' : 'View all reviews'}
                            </Button>
                            {showReview && <ReviewComponent companyId={companyId} />}

                            { 
                                usertype === "candidate" && (
                                    <>
                                        <h4 className="mb-20">{review?.status === "Approved" ? "Admin approved your review" : "Write a review"}</h4>
                                        <Form onSubmit={handleSubmit(submitReview)}>
                                            <div className="mb-3">
                                                <Rating
                                                    allowFraction
                                                    onClick={handleRating}
                                                    initialValue={rating ?? 0}
                                                    readonly={review?.status === "Approved"}
                                                />
                                                { rating && 
                                                    <Badge className="ms-2" bg={getBadgeBgColor()}>
                                                        {rating}
                                                    </Badge>
                                                }
                                                {ratingErr && <div className="text-danger ms-2">Rating required</div> }
                                            </div>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Likes</Form.Label>
                                                <Form.Control 
                                                    as="textarea" 
                                                    rows="3" 
                                                    {...register('likes')} 
                                                    disabled={review?.status === "Approved"}
                                                />
                                                {err?.likes && <span className="text-danger">{err?.likes}</span>}
                                            </Form.Group>
                                            <Form.Group className={review?.status === "Approved" ? "mb-0" : "mb-3"}>
                                                <Form.Label>Dislikes</Form.Label>
                                                <Form.Control 
                                                    as="textarea" 
                                                    rows="3" 
                                                    {...register('dislikes')} 
                                                    disabled={review?.status === "Approved"}
                                                />
                                                {err?.dislikes && <span className="text-danger">{err?.dislikes}</span>}
                                            </Form.Group>
                                            {
                                                review?.status !== "Approved" ? (
                                                    <Button type="submit" className="btn btn-main d-flex">
                                                        { isButtonLoading && <span className="me-1"><LoaderButton /></span> }
                                                        {isEdit ? 'Update' : 'Submit'} Review
                                                    </Button>
                                                ) : ''
                                            }
                                        </Form>
                                    </>
                                ) 
                            }
                        </Col>
                    </Row>
                </Container>
            </section>

            <ToastContainer/>
        </>
    )
}
export default CompanyDetail;