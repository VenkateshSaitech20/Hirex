import { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Form, Button } from 'react-bootstrap';
import DashboardBanner from 'components/DashboardBanner';
import EmployerMenu from 'components/EmployerMenu';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from 'components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import SeoComponent from 'components/SeoComponent';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const EmployerProfile = () => {
    const navigate = useNavigate();
    const { userid, token, setUsername } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({ mode: 'all' });

    // Get Employer
    const getEmployer = useCallback(async () => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL + 'employer-details/' + userid, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            const data = response.data.employer_detail;
            setIsLoading(false);
            for (const key in data) {
                setValue(key, data[key]);
            }
        } else if (response?.data?.result === false) {
            setIsLoading(false);
            clearStorage();
            sessionStorage.setItem("loginErr", LOGIN_ERR);
            navigate('/employer/login');
        }
    }, [userid, token, clearStorage, navigate, setValue]);

    // Use Effect
    useEffect(() => {
        if (userid && token) {
            getEmployer();
        }
    }, [getEmployer, userid, token]);

    const updateData = async (data) => {
        setIsLoading(true);
        delete data.email;
        const response = await axios.put(BASE_API_URL + 'employer-details/' + data.employerNo, data, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            for (const key in data) {
                setValue(key, data[key]);
            }
            setUsername(data.name);
            localStorage.setItem("username", data.name)
            setIsLoading(false);
            setErr();
            toast.success("Details updated successfully", { theme: 'colored' });
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

    const location = useLocation();
    const currentUrl = location.pathname;
    const lastSegment = currentUrl.substring(currentUrl.indexOf('/') + 1);
    const convertedString = lastSegment.replace(/\//g, '-');

    return (
        <>
            <SeoComponent slug={convertedString } />
            <DashboardBanner />

            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={5} xl={4} xxl={3} className="mb-30 mb-lg-0">
                            <EmployerMenu />
                        </Col>
                        <Col md={12} lg={12} xl={8} xxl={6} className="position-relative">
                            <h4 className="mb-20">Basic Information</h4>
                            {isLoading && <Loader />}
                            <Form autoComplete="off" onSubmit={handleSubmit(updateData)}>
                                <Row className="row-cols-1">
                                    <Col className="mb-15">
                                        <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text"
                                            {...register('name', {
                                                required: "Name is required"
                                            })}
                                            isInvalid={errors?.name}
                                        ></Form.Control>
                                        {errors?.name && <span className="text-danger">{errors?.name && errors.name.message}</span>}
                                        {err?.name && <span className="text-danger">{err?.name}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Contact Email <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="email"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^\S+@\S+$/,
                                                    message: "Invalid email address"
                                                },
                                            })}
                                            isInvalid={errors?.email}
                                            readOnly
                                        ></Form.Control>
                                        {errors?.email && <span className="text-danger">{errors?.email && errors.email.message}</span>}
                                        {err?.email && <span className="text-danger">{err?.email}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Designation</Form.Label>
                                        <Form.Control type="text"
                                            {...register('designation')}
                                        ></Form.Control>
                                        {err?.designation && <span className="text-danger">{err?.designation}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Contact No <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text"
                                            {...register("mobileNo", {
                                                required: "Mobile number is Required",
                                                pattern: {
                                                    value: /^\d{10}$/,
                                                    message: "Enter digits only"
                                                },
                                                minLength: {
                                                    value: 10,
                                                    message: "Mobile number must be minimum 10 digits"
                                                },
                                                maxLength: {
                                                    value: 10,
                                                    message: "Mobile number must be 10 digits"
                                                }
                                            })}
                                            isInvalid={errors?.mobileNo}
                                        ></Form.Control>
                                        {errors?.mobileNo && errors.mobileNo.message && <span className="text-danger">{errors.mobileNo.message}</span>}
                                        {err?.mobileNo && <span className="text-danger">{err?.mobileNo}</span>}
                                    </Col>
                                </Row>
                                <Button className="btn btn-main-lg w-auto" type="submit">Submit</Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>
            <ToastContainer />
        </>
    )
}
export default EmployerProfile;