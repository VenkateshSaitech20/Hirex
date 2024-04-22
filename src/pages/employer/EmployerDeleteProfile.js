import axios from 'axios';
import DashboardBanner from 'components/DashboardBanner'
import EmployerMenu from 'components/EmployerMenu';
import SeoComponent from 'components/SeoComponent';
import React, { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from 'components/Loader';
import { useClearStorage } from 'utils/useClearStorage';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const EmployerDeleteProfile = () => {
    const { token } = useSessionStorage();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { clearStorage } = useClearStorage();


    const deleteItems = ["Loss of Access to Your Employer Account", "Loss of Access to Your Sub-Employer Accounts", "Loss of Access to Your Posted jobs", "Company reviews", "Payment history", "Other account - related details"]

    const handleDelete = async () => {
        setIsLoading(true)
        const response = await axios.delete(BASE_API_URL + 'employer-details/delete/account/detail', { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            clearStorage()
            setIsLoading(false)
            navigate("/")
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
            {isLoading && <Loader />}
            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={4} xl={4} xxl={3} className="mb-30 mb-lg-0">
                            <EmployerMenu />
                        </Col>
                        <Col lg={8} xl={8} xxl={9} className="mb-30 mb-lg-0">
                            <div className="box-lightorange h-auto mb-30 d-flex  align-align-items-center justify-content-center gap-3">
                                <h5 className="text-black  mb-0 text-center">
                                    Please read this carefully
                                </h5>
                            </div>
                            <p>You're trying to delete your Hirex account. Take a moment to review the implications of deleting your employer account. This may include the loss of access to</p>

                            {deleteItems.map((item, index) => (
                                <li key={index} className='box-checkbox list-unstyled font-regular mt-3'>{item}</li>
                            ))}

                            <Button
                                className="btn btn-main mt-3"
                                onClick={handleDelete}
                            >
                                Delete account
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default EmployerDeleteProfile