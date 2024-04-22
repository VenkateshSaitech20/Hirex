import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Row, Col, Container } from 'react-bootstrap';
import axios from "axios";
import { useLocation } from "react-router-dom";
import SeoComponent from "components/SeoComponent";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function PrivacyPolicy() {
  const [privatePolicy, setPrivatePolicy] = useState("");

  const getPrivacyPolicy = async () => {
    await axios.get(BASE_API_URL + "privacy-policy").then((response) => {
      if (response?.data?.result === true) {
        const sanitizedHtmlContent = DOMPurify.sanitize(response?.data?.data?.privacypolicy);
        setPrivatePolicy(sanitizedHtmlContent);
      }
    })
  }

  useEffect(() => {
    getPrivacyPolicy();
  }, []);

  const location = useLocation();
  const currentUrl = location.pathname;
  const lastSegment = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

  return (
    <>
        <SeoComponent slug={lastSegment}/>

      <section className="banner-section sub-banner-py bg-orange-lightest">
        <Container fluid>
            <Row className="justify-content-center mb-10">
                <Col md={12} lg={10} xl={10} xxl={8} className="align-self-center text-center">
                    <h1 className="text-capitalize mb-0">Privacy Policy</h1>
                </Col>
            </Row>
        </Container>
      </section>

      <section className="py-50">
        <Container fluid>
            <Row>
              <Col md={12}>
                <div dangerouslySetInnerHTML={{ __html: privatePolicy }}/>
              </Col>
            </Row>
        </Container>
      </section>
    </>
  );
}
export default PrivacyPolicy;