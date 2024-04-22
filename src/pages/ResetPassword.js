import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { imagePath } from 'components/Constants';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Loader from "components/Loader";
import SeoComponent from "components/SeoComponent";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const ResetPassword = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "all"
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        await axios.post(BASE_API_URL + "verify/send-email", data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored" });
                }, 100);
                if (response.data.data.type === "user") {
                    navigate("/login");
                }
                else {
                    setIsLoading(false);
                    navigate("/employer/login");
                }
            } else if (response?.data?.result === false) {
                toast.error(response.data.message, { theme: 'colored' });
                setIsLoading(false);
            }
        })
    }


    const location = useLocation();
    const currentUrl = location.pathname;
    const lastSegment = currentUrl.substring(currentUrl.indexOf('/') + 1);
    const convertedString = lastSegment.replace(/\//g, '-');

    return (
        <>
            <SeoComponent slug={convertedString} />
            <section className="bg-orange-lightest">
                <Container className="vh-100">
                    <Row className="justify-content-center vertical-center">
                        <Col lg={10}>
                            <Row className="g-0 cardbox">
                                <Col md={6} className="cardbox-left">
                                    <Link to="/"><img className="img-fluid h-35 mb-30 m-b-0" src={imagePath.logo} alt="logo" /></Link>
                                    <img className="img-fluid d-none d-md-block" src={imagePath.resetpw} alt="Reset Password" />
                                </Col>
                                <Col md={6} className="cardbox-right">
                                    <div className="vertical-center">
                                        <div className="text-center mb-30">
                                            <h5 className="mb-0">Reset Password Verification</h5>
                                        </div>
                                        {isLoading && <Loader />}
                                        <p className="mb-30 instruction-box font-bold">Enter your Email and instructions will be sent to you!</p>
                                        <Form className="mb-30" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                                            <Form.Group className="mb-20" controlId="email">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" placeholder="Enter email"
                                                    {...register("email", {
                                                        required: "Email is Required",
                                                        pattern: {
                                                            value: /^\S+@\S+$/,
                                                            message: "Invalid email address"
                                                        }
                                                    })}
                                                    isInvalid={errors?.email}
                                                />
                                                {errors?.email && errors.email.message &&
                                                    <span className="text-red-dark">{errors.email.message}</span>
                                                }
                                            </Form.Group>

                                            <Button className="bg-hirex-black w-100 text-white border-0 font-bold" type="submit">Send Request</Button>
                                        </Form>
                                        <p className="text-center mb-0">Remembered It? <Link to="/login" className="font-bold"><u>Go to Login</u></Link></p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <ToastContainer />
            </section>
        </>
    )
}
export default ResetPassword;