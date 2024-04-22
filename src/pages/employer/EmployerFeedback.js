import { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Button, Form, Modal, Card } from 'react-bootstrap';
import DashboardBanner from 'components/DashboardBanner';
import EmployerMenu from 'components/EmployerMenu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Loader from 'components/Loader';
import { formatDate } from 'utils/formatDate';
import { FaCalendarAlt, FaBolt } from "react-icons/fa";
import SeoComponent from 'components/SeoComponent';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const EmployerFeedback = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const { companyid, token, username, userid, companyname } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [err, setErr] = useState();
    const { register, handleSubmit, formState: { errors }, reset, } = useForm();

    // Open modal popup
    const openModal = () => {
        reset();
        setErr();
        setModalShow(true);
    }

    // Close modal popup
    const closeModal = () => {
        reset();
        setModalShow(false)
    }

    // Save
    const handleSave = (data) => {
        if (!companyname || !companyid || !username || !userid) {
            return;
        }
        data.companyId = companyid;
        data.companyName = companyname;
        data.createdBy = username;
        data.employerNo = userid;
        postData(data);
    }

    // Send data to post api
    const postData = async (data) => {
        setIsLoading(true);
        const response = await axios.post(BASE_API_URL + 'employer-feedback', data, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            const data = response.data.feedbacks;
            setFeedbacks(data);
            toast.success(response.data.message, { theme: 'colored' });
            closeModal();
        } else if (response?.data?.result === false) {
            if (response?.data?.message === "Token Expired") {
                clearStorage();
                sessionStorage.setItem("loginErr", LOGIN_ERR);
                setIsLoading(false);
                navigate('/employer/login');
            } else {
                setIsLoading(false);
                setErr(response.data.errors);
            }
        }
    }

    // Get feedback data
    const getFeedbacks = useCallback(async (companyid) => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL + 'employer-feedback/' + companyid, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            const data = response.data.feedbacks;
            setFeedbacks(data);
        } else if (response?.data?.result === false) {
            clearStorage();
            sessionStorage.setItem("loginErr", LOGIN_ERR);
            setIsLoading(false);
            navigate('/employer/login');
        }
    }, [clearStorage, navigate, token])

    useEffect(() => {
        if (companyid && token) {
            getFeedbacks(companyid);
        }
    }, [companyid, token, getFeedbacks])

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
                        <Col lg={7} xl={8} xxl={9} className="custom-datatable position-relative">
                            <div className="d-flex justify-content-between mb-30">
                                <h4 className="mb-0">Feedbacks</h4>
                                <Link className="btn btn-main" onClick={() => openModal()}>Add Feedback</Link>
                            </div>
                            {isLoading && <Loader />}
                            <Row className="position-relative row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2 row-cols-xxl-1 g-3">
                                {feedbacks.length > 0 ? (
                                    feedbacks.map((fb) => (
                                        <Col key={fb.createdAt}>
                                            <Card className="feedback-card hover-up position-relative">
                                                <Card.Header className="d-flex justify-content-between">
                                                    <p className="mb-0"><FaCalendarAlt className="top-n1 me-2" />{formatDate(fb.createdAt)}</p>
                                                    {
                                                        fb?.status === "Pending" ? (
                                                            <p className="mb-0 text-orange"><FaBolt />{fb.status}</p>
                                                        ) : (
                                                            <p className="mb-0 text-black">Completed</p>
                                                        )
                                                    }
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="job-card-block-info">
                                                        <p className="mb-1">{fb.feedback}</p>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col>
                                        <p>No feedbacks found.</p>
                                    </Col>
                                )
                                }
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Modal show={modalShow} backdrop="static" size="lg" centered scrollable>
                <Modal.Header className="modal-orange-light">
                    <h5 className="mb-0">Add Feedbacks</h5>
                </Modal.Header>
                <Modal.Body className="pb-4">
                    <Form autoComplete='off' onSubmit={handleSubmit(handleSave)}>
                        <Row className="g-2 mb-15">
                            <Col lg={12} className="my-2 mt-3">
                                <Form.Group>
                                    <Form.Control
                                        as="textarea"
                                        rows="5"
                                        placeholder="Write your feedbacks"
                                        {...register('feedback', {
                                            required: "Feedback is required"
                                        })}
                                        isInvalid={errors?.feedback}
                                    />
                                    {errors?.feedback && <span className="text-danger">{errors?.feedback?.message}</span>}
                                    {err?.feedback && <span className="text-danger">{err?.feedback}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex ">
                            <Button className="btn-main me-1" type="submit">Submit</Button>
                            <Button className="btn-cancel" onClick={() => closeModal()}>Cancel</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer />
        </>
    )
}
export default EmployerFeedback;