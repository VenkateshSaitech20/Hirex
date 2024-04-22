import React, { useCallback, useEffect, useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import DashboardBanner from "./../../../components/DashboardBanner";
import { useSessionStorage } from "context/SessionStorageContext";
import { buySubscription } from "./subscription";
import axios from "axios";
import EmployerMenu from "components/EmployerMenu";
import SeoComponent from "components/SeoComponent";
import { useLocation } from "react-router-dom";
import Loader from "components/Loader";

export const SubscriptionPlan = () => {
  const { token } = useSessionStorage();
  const [packageDetail, setPackageDetail] = useState([]);
  const [employerDetail, setEmployerDetail] = useState({})
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

  // Get master-package Details
  const fetchData = useCallback(async () => {
    const result = await axios.get(`${BASE_API_URL}master-package-detail`);
    setPackageDetail(result.data.data);
  }, [BASE_API_URL]);

  const priceAlert = useCallback(async () => {
    const getAlertMessage = sessionStorage.getItem("profileviewalert");
    if (getAlertMessage) {
      setMessage(getAlertMessage);
      setTimeout(() => {
        setMessage("");
        sessionStorage.removeItem("profileviewalert");
      }, 5000);
    }
  }, []);

  const getEmployerDetail = useCallback(async () => {
    setIsLoading(true)
    const response = await axios.get(`${BASE_API_URL}employer-details/get-employer`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEmployerDetail(response?.data?.employer_detail)
    setIsLoading(false)
  }, [setEmployerDetail, token, BASE_API_URL]);

  useEffect(() => {
    fetchData();
    getEmployerDetail()
    priceAlert();
  }, [fetchData, priceAlert, getEmployerDetail]);

  const location = useLocation();
  const currentUrl = location.pathname;
  const lastSegment = currentUrl.substring(currentUrl.indexOf('/') + 1);
  const convertedString = lastSegment.replace(/\//g, '-');

  const expireDate = new Date(employerDetail.expireOn);
  const formattedExpireDate = `${expireDate.getDate()}/${expireDate.getMonth() + 1}/${expireDate.getFullYear()}`;

  return (
    <>
      <SeoComponent slug={convertedString} />
      <DashboardBanner />
      {isLoading && <Loader />}
      <section className="py-50 ">
        <Container fluid>
          <Row>
            <Col lg={3} xl={4} xxl={3} className="mb-30 mb-lg-0">
              <EmployerMenu />
            </Col>
            <Col lg={9} xl={8} xxl={9}>
              <Row>
                {message && (
                  <div className="box-lightorange h-auto mb-30 d-flex  align-align-items-center justify-content-center gap-3">
                    <h5 className="text-black mb-0 text-center">{message}</h5>
                  </div>
                )}
                {packageDetail?.map((item) => (
                  <Col key={item._id} md={6} xl={4} className="price-table">
                    <div className="price-card">
                      <div className="text-center mb-1">
                        <p className="font-bold package-tag">{item.packageName}</p>
                      </div>
                      <div className="price">
                        <h1>&#x20B9;</h1>{" "}
                        <h1 className="font-bold pb-3 mb-2" key={item._id}>
                          {item.amount ?? ""}
                        </h1>
                        <span>{item.validity}/days</span>
                      </div>
                      <ul>
                        {item?.packagedetails?.map((detail) => {
                          const displayValue =
                            { Y: "Yes", N: "No" }[detail.value] || detail.value;
                          return (
                            <li
                              key={detail.slug}
                              className="box-checkbox font-regular list-unstyled mt-3"
                            >
                              <span>{detail.featureName}:</span> {displayValue}
                            </li>
                          );
                        })}
                      </ul>
                      <Button
                        onClick={() =>
                          buySubscription(item.packageId, token, item.amount)
                        }
                        className="btn btn-main-lg my-4 hover-up"
                      >
                        {employerDetail.packageId === item.packageId ? "Renew" : "Buy Now"}
                      </Button>
                      {employerDetail.packageId === item.packageId && (<p className="text-center text-danger">{`Validity expires on ${formattedExpireDate}`}</p>)}
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SubscriptionPlan;
