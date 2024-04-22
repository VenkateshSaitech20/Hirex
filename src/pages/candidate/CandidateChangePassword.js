import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Form, Button } from 'react-bootstrap';
import DashboardBanner from 'components/DashboardBanner';
import Alert from 'react-bootstrap/Alert';
import CandidateMenu from 'components/CandidateMenu';
import { useForm } from 'react-hook-form';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from 'components/Loader';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import SeoComponent from 'components/SeoComponent';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const CandidateChangePassword = () => {
    const navigate = useNavigate();
    const { userid, token } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [isLoading, setIsLoading] = useState(false);
    const [msgErr, setMsgErr] = useState();
    const [err, setErr] = useState();
    const { handleSubmit, register, formState: { errors }, watch, reset } = useForm();

    const password = watch('password', '');
    const validateConfirmPassword = (value) => {
        if (value !== password) {
            return "Password must match";
        }
    };

    const updatePassword = async (data) => {
        setMsgErr();
        setIsLoading(true);
        const response = await axios.put(BASE_API_URL + 'candidate-details/change-password/' + userid, data, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            setErr();
            reset();
            toast.success(response.data.message, { theme: 'colored' });
        } else if (response?.data?.result === false) {
            if (response?.data?.message === "Token Expired") {
                clearStorage();
                sessionStorage.setItem("loginErr", LOGIN_ERR);
                setIsLoading(false);
                navigate('/login');
            } else if (response.data.message === "Invalid current password") {
                setMsgErr(response.data.message);
                setIsLoading(false);
            } else {
                setErr(response.data.errors);
                setIsLoading(false);
            }
        }
    }


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
                            <CandidateMenu />
                        </Col>
                        <Col lg={7} xl={8} xxl={9}>
                            <h4 className="mb-30">Change Password</h4>
                            {isLoading && <Loader />}
                            {msgErr && <Alert variant="danger">{msgErr}</Alert>}
                            <Form autoComplete="off" onSubmit={handleSubmit(updatePassword)}>
                                <Row>
                                    <Col md={12} lg={12} xl={8} xxl={6} className="mb-1">
                                        <div className="mb-15">
                                            <Form.Label>Old Password</Form.Label>
                                            <Form.Control type="password"
                                                {...register('currentpassword', {
                                                    required: "Current Password is required"
                                                })}
                                                isInvalid={errors?.password}
                                            ></Form.Control>
                                            {errors?.currentpassword && <span className="text-danger">{errors?.currentpassword && errors.currentpassword.message}</span>}
                                        </div>
                                        <div className="mb-15">
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control type="password"
                                                {...register('password', {
                                                    required: "New Password is required"
                                                })}
                                                isInvalid={errors?.password}
                                            ></Form.Control>
                                            {errors?.password && <span className="text-danger">{errors?.password && errors.password.message}</span>}
                                            {err?.password && <span className="text-danger">{err?.password}</span>}
                                        </div>
                                        <div className="mb-15">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control type="password"
                                                {...register('confirmpassword', {
                                                    required: "Confirm Password is required",
                                                    validate: validateConfirmPassword
                                                })}
                                                isInvalid={errors?.confirmpassword}
                                            ></Form.Control>
                                            {errors?.confirmpassword && <span className="text-danger">{errors?.confirmpassword && errors.confirmpassword.message}</span>}
                                        </div>
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
export default CandidateChangePassword;