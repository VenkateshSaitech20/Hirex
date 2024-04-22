import { useState, useEffect } from "react";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { imagePath } from 'components/Constants';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import Alert from 'react-bootstrap/Alert';
import { useSessionStorage } from 'context/SessionStorageContext';
import axios from "axios";
import Loader from "components/Loader";
import SeoComponent from "components/SeoComponent";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loginErr, setLoginErr] = useState();
    const [sessErr, setSessErr] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { username, setUsername, token, usertype, setToken, userid, setUserid, setProfileimg, setUsertype, setCompanyname, setCompanyid, setRoleid, setUser, setPackageid, setPackageInfo } = useSessionStorage();
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "all"
    });

    useEffect(() => {
        if (!username || !token || !userid || !usertype) {
            setIsLoading(true);
            let userId = localStorage.getItem("userid");
            let userType = localStorage.getItem("usertype");
            if (userId && userType) {
                let user = {
                    userId: userId,
                    userType: userType
                }
                axios.post(BASE_API_URL + 'user-login/finduser/', user).then((response) => {
                    if (response?.data?.result === true) {
                        setIsLoading(false);
                        setUsername(response.data.data.username);
                        setUserid(response.data.data.userid);
                        setToken(response.data.data.token);
                        setUsertype(response.data.data.userType);
                        setProfileimg(response?.data?.profileImg);
                        setCompanyname(response.data.data.companyname);
                        setCompanyid(response.data.data.companyid);
                        setRoleid(response.data.data.roleid);
                        setUser(JSON.stringify(response.data.data.user));
                        setPackageInfo(response?.data?.data?.packageInfo?.packageName);
                        navigate('/');
                    } else {
                        setIsLoading(false);
                        navigate(location.pathname);
                    }
                })
            } else {
                setIsLoading(false);
                navigate(location.pathname);
            }
        } else {
            setIsLoading(false);
            navigate("/");
        };
    }, [navigate, username, token, userid, usertype, setUsername, setToken, setUserid, setProfileimg, setUsertype, setCompanyname, setCompanyid, setRoleid, setUser, setPackageid, setPackageInfo, location.pathname]);

    useEffect(() => {
        let sessLoginErrData = sessionStorage.getItem("loginErr");
        if (sessLoginErrData) {
            setSessErr(sessLoginErrData);
            setTimeout(() => {
                sessionStorage.removeItem("loginErr");
                setSessErr(null);
            }, 5000);
        }
    }, [setSessErr])

    const onLogin = async (data) => {
        setIsLoading(true);
        if (location.pathname === "/employer/login") {
            data.usertype = "employer";
        } else {
            data.usertype = "candidate";
        }
        const response = await axios.post(BASE_API_URL + "user-login", data);
        if (response?.data?.result === true) {
            setIsLoading(false);
            localStorage.setItem("userid", response.data.data.userid);
            localStorage.setItem("usertype", response.data.data.userType);
            localStorage.setItem("username", response.data.data.username);
            setUsername(response.data.data.username);
            setUserid(response.data.data.userid);
            setToken(response.data.data.token);
            setUsertype(response.data.data.userType);
            setProfileimg(response.data.data.profileImg);
            setCompanyname(response.data.data.companyname);
            setCompanyid(response.data.data.companyid);
            setRoleid(response.data.data.roleid);
            setUser(JSON.stringify(response.data.data.user));
            setPackageid(response.data.data.packageid);
            setPackageInfo(JSON.stringify(response?.data?.data?.packageInfo));
            navigate('/');
            setTimeout(() => {
                toast.success("Hi " + response.data.data.username, { theme: "colored" });
            }, 100);
        } else if (response?.data?.result === false) {
            setIsLoading(false);
            setLoginErr(response?.data?.message);
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

            <section className="bg-orange-lightest">
                <Container className="vh-100">
                    <Row className="justify-content-center vertical-center">
                        <Col lg={10}>
                            <Row className="g-0 cardbox">
                                <Col md={6} className="cardbox-left">
                                    <Link to="/"><img className="img-fluid h-35 mb-30 m-b-0" src={imagePath.logo} alt="logo" /></Link>
                                    <img className="img-fluid d-none d-md-block" src={imagePath.login} alt="login" />
                                </Col>
                                <Col md={6} className="cardbox-right">
                                    <div className="vertical-center">
                                        <div className="text-center mb-30">
                                            <h5 className="mb-10">Welcome Back !</h5>
                                            <p className="mb-0">Sign in to continue to HireX.</p>
                                        </div>
                                        {isLoading && <Loader />}
                                        {loginErr && <Alert variant="danger">{loginErr}</Alert>}
                                        {sessErr && <Alert variant="danger">{sessErr}</Alert>}
                                        <Form className="mb-20" autoComplete="off" onSubmit={handleSubmit(onLogin)}>
                                            <Form.Group className="mb-20" controlId="email">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" placeholder="Enter email" {...register("email",
                                                    {
                                                        required: "Email is Required",
                                                        pattern: {
                                                            value: /^\S+@\S+$/,
                                                            message: "Invalid email address"
                                                        }
                                                    })}
                                                    isInvalid={errors?.email}
                                                />
                                                {errors?.email && <span className="text-red-dark">{errors?.email?.message}</span>}
                                            </Form.Group>
                                            <Form.Group className="mb-20" controlId="password">
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
                                                        { showPassword ? <FaEyeSlash/> : <FaEye/>}
                                                    </InputGroup.Text>
                                                </InputGroup>
                                                {errors?.password && <span className="text-red-dark">{errors?.password?.message}</span>}
                                            </Form.Group>
                                            <Button className="bg-hirex-black w-100 text-white border-0 font-bold" type="submit">Login</Button>
                                        </Form>
                                        <div className="d-flex justify-content-start mb-20">
                                            <div>
                                                {/* <Form.Group className="mb-3" controlId="RememberMe">
                                                    <Form.Check type="checkbox" label="Remember me" />
                                                </Form.Group> */}
                                            </div>
                                            <div><Link to="/forgot-password">Forgor Password?</Link></div>
                                        </div>
                                        <p className="text-center mb-2">Don't have account?
                                            <Link to="/signup" className="ms-1 me-1"><u>Candidate Signup</u></Link> |
                                            <Link to="/employer/signup" className="ms-1"><u>Employer Signup</u></Link>
                                        </p>
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
export default Login;