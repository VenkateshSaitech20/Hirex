import { useState, useEffect } from "react";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { imagePath } from 'components/Constants';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Loader from "components/Loader";
import { ToastContainer, toast } from 'react-toastify';
import FindDuplicate from 'components/FindDuplicate';
import SeoComponent from "components/SeoComponent";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "all" });
    const [err, setErr] = useState();
    const [companySlugs, setCompanySlugs] = useState();
    const [findDuplicateName, setFindDuplicateName] = useState();
    const [duplicateFound, setDuplicateFound] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSignup = async (data) => {
        if (!duplicateFound) {
            setIsLoading(true);
            let response;
            if (location.pathname === "/employer/signup") {
                response = await axios.post(BASE_API_URL + 'employer-details', data);
            } else {
                response = await axios.post(BASE_API_URL + 'candidate-details', data);
            }
            if (response?.data?.result === true) {
                setIsLoading(false);
                if (location.pathname === "/employer/signup") {
                    navigate('/employer/login');
                } else {
                    navigate('/login');
                }
                setTimeout(() => {
                    toast.success(response?.data?.message, { theme: "colored" })
                }, 100);
            } else if (response?.data?.result === false) {
                setIsLoading(false);
                setErr(response.data.errors);
            }
        }
    }

    useEffect(() => {
        getCompanySlugs();
    }, []);

    const getCompanySlugs = async () => {
        const response = await axios.get(BASE_API_URL + 'companies/slugs');
        if (response?.data) {
            setCompanySlugs(response.data);
        }
    }

    const handlePasswordShowHide = () => {
        setShowPassword(prevState => !prevState);
    }

    const currentUrl = location.pathname;
    const lastSegment = currentUrl.substring(currentUrl.indexOf('/') + 1);
    const convertedString = lastSegment.replace(/\//g, '-');

    return (

        <>
            <SeoComponent slug={convertedString} />

            <style>

            </style>
            <section className="bg-orange-lightest signup-space">
                <Container className="signup-space">
                    <Row className="justify-content-center  signup-vertical-center">
                        <Col lg={10}>
                            <Row className="g-0 cardbox">
                                <Col md={6} className="cardbox-left">
                                    <Link to="/"><img className="img-fluid h-35 mb-30 m-b-0" src={imagePath.logo} alt="logo" /></Link>
                                    <img className="img-fluid d-none d-md-block" src={imagePath.signup} alt="signup" />
                                </Col>
                                <Col md={6} className="cardbox-right">
                                    <div className="vertical-center">
                                        <div className="text-center ">
                                            <h5 className="">Let's Get Started</h5>
                                            <p className="">Sign Up and get access to all the features of HireX.</p>
                                        </div>
                                        {isLoading && <Loader />}
                                        <Form className="" autoComplete="off" onSubmit={handleSubmit(onSignup)}>
                                            {
                                                location.pathname === "/employer/signup" ? (
                                                    <Form.Group className="mb-10" controlId="companyName">
                                                        <Form.Label>Company Name</Form.Label>
                                                        <Form.Control type="text" placeholder="Enter company name" {...register("companyName", {
                                                            required: "Company name is Required",
                                                            onChange: (e) => { setFindDuplicateName(e.target.value) }
                                                        })}
                                                            isInvalid={errors?.companyName}
                                                        />
                                                        {errors?.companyName && <span className="text-red-dark">{errors?.companyName?.message}</span>}
                                                        {err?.companyName && <span className="text-red-dark">{err?.companyName}</span>}
                                                        {err?.companySlug && <span className="text-danger">{err?.companySlug}</span>}
                                                        {findDuplicateName &&
                                                            <FindDuplicate
                                                                searchName={findDuplicateName}
                                                                slugs={companySlugs}
                                                                message="This record already exists"
                                                                setDuplicateFound={setDuplicateFound}
                                                                flag="slug"
                                                            />
                                                        }
                                                    </Form.Group>
                                                ) : ''
                                            }
                                            <Form.Group className="mb-10" controlId="name">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control type="text" placeholder="Enter name" {...register("name", {
                                                    required: "Name is Required"
                                                })}
                                                    isInvalid={errors?.name}
                                                />
                                                {errors?.name && <span className="text-red-dark">{errors?.name?.message}</span>}
                                                {err?.name && <span className="text-red-dark">{err?.name}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-10" controlId="mobile">
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
                                                {errors?.mobileNo && <span className="text-red-dark">{errors?.mobileNo?.message}</span>}
                                                {err?.mobileNo && <span className="text-red-dark">{err?.mobileNo}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-10" controlId="email">
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
                                                {errors?.email && <span className="text-red-dark">{errors?.email?.message}</span>}
                                                {err?.email && <span className="text-red-dark">{err?.email}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-10" controlId="password">
                                                <Form.Label>Password</Form.Label>
                                                <InputGroup>
                                                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Enter Password" {...register("password",
                                                        {
                                                            required: "Password is Required",
                                                            minLength: {
                                                                value: 8,
                                                                message: "Password must be minimum 8 characters"
                                                            }
                                                        })}
                                                        isInvalid={errors?.password} />
                                                    <InputGroup.Text onClick={handlePasswordShowHide}>
                                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </InputGroup.Text>
                                                </InputGroup>
                                                {errors?.password && <span className="text-red-dark">{errors?.password?.message}</span>}
                                                {err?.password && <span className="text-red-dark">{err?.password}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-20" controlId="Terms & Conditions">
                                                <Form.Check type="checkbox" id="termsCheckbox">
                                                    <Form.Check.Input type="checkbox"
                                                        {...register("tc", {
                                                            required: "Agree the terms & conditions"
                                                        })}
                                                        isInvalid={errors?.tc}
                                                    />
                                                    <Form.Check.Label>
                                                        Agree to the <Link to="/terms-conditions"><u>Terms & Conditions</u></Link>
                                                    </Form.Check.Label>
                                                    {err?.tc && <span className="text-red-dark">{err?.tc}</span>}
                                                </Form.Check>
                                            </Form.Group>

                                            <Button className="bg-hirex-black w-100 text-white border-0 font-bold" type="submit">Sign Up</Button>
                                        </Form>
                                        <p className="text-center mb-0">Already have account? <Link to={location.pathname === "/employer/signup" ? '/employer/login' : '/login'} className="font-bold"><u>Login</u></Link></p>
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
export default Signup;