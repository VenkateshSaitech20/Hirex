import { useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import DashboardBanner from 'components/DashboardBanner';
import EmployerMenu from 'components/EmployerMenu';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Loader from "components/Loader";
import { ToastContainer, toast } from 'react-toastify';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import SeoComponent from "components/SeoComponent";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const EmployerManageUserForm = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "all" });
    const [err, setErr] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const { token, companyid } = useSessionStorage();
    const { clearStorage } = useClearStorage();

    const addUser = async (data) => {
        setIsLoading(true);
        data.companyId = companyid;
        data.tc = true;
        const response = await axios.post(BASE_API_URL + 'employer-details/add-employer', data, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            navigate('/employer/manage-users');
            setTimeout(() => {
                toast.success("Registered Successfullty", { theme: "colored" })
            }, 100);
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
            <SeoComponent slug={convertedString} />

            <DashboardBanner />
            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={5} xl={4} xxl={3} className="mb-30 mb-lg-0">
                            <EmployerMenu />
                        </Col>
                        <Col lg={7} xl={8} xxl={9} className="position-relative">
                            <div className="d-flex justify-content-between mb-30">
                                <h4 className="mb-0">Add User</h4>
                                <Link to="/employer/manage-users" className="btn btn-main">Back</Link>
                            </div>
                            {isLoading && <Loader />}
                            <Form className="mb-0" autoComplete="off" onSubmit={handleSubmit(addUser)}>
                                <Form.Group className="mb-15" controlId="name">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter name" {...register("name", {
                                        required: "Name is Required"
                                    })}
                                        isInvalid={errors?.name}
                                    />
                                    {errors?.name && errors.name.message &&
                                        <span className="text-red-dark">{errors.name.message}</span>
                                    }
                                    {err?.name && <span className="text-red-dark">{err?.name}</span>}
                                </Form.Group>

                                <Form.Group className="mb-15" controlId="mobile">
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control type="text" placeholder="Enter mobile number"
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
                                    />
                                    {errors?.mobileNo && errors.mobileNo.message &&
                                        <span className="text-red-dark">{errors.mobileNo.message}</span>
                                    }
                                    {err?.mobileNo && <span className="text-red-dark">{err?.mobileNo}</span>}
                                </Form.Group>

                                <Form.Group className="mb-15" controlId="email">
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
                                    {err?.email && <span className="text-red-dark">{err?.email}</span>}
                                </Form.Group>

                                <Form.Group className="mb-15" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter Password"
                                        {...register("password", {
                                            required: "Password is Required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be minimum 8 characters"
                                            }
                                        })}
                                        isInvalid={errors?.password}
                                    />
                                    {errors?.password && errors.password.message &&
                                        <span className="text-red-dark">{errors.password.message}</span>
                                    }
                                    {err?.password && <span className="text-red-dark">{err?.password}</span>}
                                </Form.Group>
                                <Button className="btn btn-main me-1" type="submit">Submit</Button>
                                <Link className="btn btn-cancel" to="/employer/manage-users">Cancel</Link>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>
            <ToastContainer />
        </>
    )
}
export default EmployerManageUserForm;