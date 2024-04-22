import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { imagePath } from "components/Constants";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import axios from "axios";
import Loader from "components/Loader";
import SeoComponent from "components/SeoComponent";
//import { useParams } from "react-router-dom/dist/umd/react-router-dom.development";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function NewPasswordSetUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: "all",
  });
  const { encemail } = useParams();
  const password = watch("password", ""); // Get the value of the 'password' field
  // const confirmPass = watch("confirmpass", "");

  const onLogin = async (data) => {
    setIsLoading(true);
    data.encemail = encemail;
    axios.put(BASE_API_URL + `verify/change-password`, data).then((response) => {
      if (response?.data?.result === true) {
        setIsLoading(false);
        setTimeout(() => {
          toast.success(response.data.message, { theme: "colored" });
        }, 100);
        if (response.data.data.type === "user") {
          setIsLoading(false);
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
    });
  };

  return (
    <>
      <SeoComponent slug={"reset-password"} />

      <section className="bg-orange-lightest">
        <Container className="vh-100">
          <Row className="justify-content-center vertical-center">
            <Col lg={10}>
              <Row className="g-0 cardbox">
                <Col md={6} className="cardbox-left">
                  <Link to="/">
                    <img
                      className="img-fluid h-35 mb-30 m-b-0"
                      src={imagePath.logo}
                      alt="logo"
                    />
                  </Link>
                  <img
                    className="img-fluid d-none d-md-block"
                    src={imagePath.login}
                    alt="login"
                  />
                </Col>
                <Col md={6} className="cardbox-right">
                  <div className="vertical-center">
                    <div className="text-center mb-30">
                      <h5 className="mb-10">Welcome Back !</h5>
                      <p className="mb-0">Reset Your Password.</p>
                    </div>
                    {isLoading && <Loader />}

                    <Form
                      className="mb-30"
                      autoComplete="off"
                      onSubmit={handleSubmit(onLogin)}
                    >
                      <Form.Group className="mb-20" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter Password"
                          {...register("password", {
                            required: "Password is Required",
                            minLength: {
                              value: 8,
                              message: "Password must be minimum 8 characters",
                            },
                            validate: (value) => {
                              //const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
                              const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/;
                              return (
                                regex.test(value) ||
                                "Password must contain atleast one uppercase,symbol and number"
                              );
                            },
                          })}
                          isInvalid={errors?.password}
                        />
                        {errors?.password && errors.password.message && (
                          <span className="text-red-dark">
                            {errors.password.message}
                          </span>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-20" controlId="confirmpass">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Confirm Password"
                          {...register("confirmpass", {
                            required: "Confirm Password is Required",
                            minLength: {
                              value: 8,
                              message: "Password must be minimum 8 characters",
                            },
                            validate: (value) =>
                              value === password || "Passwords do not match",
                          })}
                          isInvalid={errors?.confirmpass}
                        />
                        {errors?.confirmpass && (
                          <span className="text-red-dark">
                            {errors.confirmpass.message}
                          </span>
                        )}
                      </Form.Group>

                      <div className="d-flex justify-content-start mb-20">
                        <div>{/* Additional form elements, if needed */}</div>
                      </div>
                      <Button
                        className="bg-hirex-black w-100 text-white border-0 font-bold"
                        type="submit"
                      >
                        Submit
                      </Button>
                    </Form>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </section>
    </>
  );
}

export default NewPasswordSetUp;