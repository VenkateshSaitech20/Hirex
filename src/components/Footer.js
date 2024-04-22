import React, { useState, useEffect, useCallback } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";
import { BiLogoFacebook, BiLogoTwitter, BiLogoInstagramAlt, BiLogoLinkedin } from "react-icons/bi";
import { Link } from "react-router-dom";
import { imagePath } from 'components/Constants';
import TruncatedAboutus from "pages/aboutus/TruncatedAboutus";
import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const Footer = () => {
    const [contactInfo, setContactInfo] = useState();
    const [ downloadAppDesc, setDownloadAppDesc ] = useState();

    // Get Contact Detail
    const getContactDetail = useCallback(async () => {
        const response = await axios.get(`${BASE_API_URL}contact-details`);
        if (response?.data) {
            setContactInfo(response?.data);
        }
    }, []);

    // Get Footer Content
    const getFooterData = useCallback(async () => {
        const response = await axios.get(BASE_API_URL+'home');
        if (response?.data?.result === true) {
            setDownloadAppDesc(response?.data?.homeData?.downloadAppDesc);
        }
    },[])

    useEffect(()=>{
        getContactDetail();
        getFooterData();
    },[getContactDetail, getFooterData]);

    return (
        <footer>
            <Container fluid>
                <Row>
                    <Col md={6} xl={4} className="mb-3 mb-xl-0">
                        <img className="img-fluid h-35 mb-2" src={imagePath.logo} alt="logo" />
                        <p className="mb-3"><TruncatedAboutus /></p>
                        <Link to="/about-us" className="text-orange font-bold">Read More <FiArrowRight /></Link>
                    </Col>
                    <Col md={6} xl={2} className="mb-3 mb-lg-0">
                        <h5 className="mb-2">Policies</h5>
                        <ul>
                            <li><Link to="/privacy-policy" className="">Privacy Policy</Link></li>
                            <li><Link to="/terms-conditions" className="">Terms & Conditions</Link></li>
                            <li><Link to="/disclaimer" className="">Disclaimer</Link></li>
                            {/* <li><Link to="/" className="">Careers</Link></li> */}
                        </ul>
                    </Col>
                    <Col md={6} xl={3} className="mb-3 mb-lg-0">
                        <h5 className="mb-2">Contact & Social</h5>
                        <p className="mb-1">{contactInfo?.description}</p>
                        <p className="mb-1">Email : <Link to={`mailto:${contactInfo?.email}`}>{contactInfo?.email}</Link></p>
                        <p className="mb-2">Address : <Link to={`tel:${contactInfo?.address}`}>{contactInfo?.address}</Link></p>
                        <ul className="social-links">
                            <li><Link to={contactInfo?.facebook || "/"} target={contactInfo?.facebook ? "_blank" : ""}><BiLogoFacebook /></Link></li>
                            <li><Link to={contactInfo?.twitter || "/"} target={contactInfo?.twitter ? "_blank" : ""}><BiLogoTwitter /></Link></li>
                            <li><Link to={contactInfo?.linkedin || "/"} target={contactInfo?.linkedin ? "_blank" : ""}><BiLogoLinkedin /></Link></li>
                            <li><Link to={contactInfo?.instagram || "/"} target={contactInfo?.instagram ? "_blank" : ""}><BiLogoInstagramAlt /></Link></li>
                        </ul>
                    </Col>
                    <Col md={6} xl={3}>
                        <h5 className="mb-2">Download App</h5>
                        <p className="mb-3">{downloadAppDesc}</p>
                        <Link to="/"><img className="img-fluid h-35" src={imagePath.android} alt="Application" /></Link>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
export default Footer;