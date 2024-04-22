import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import { useSessionStorage } from 'context/SessionStorageContext';
import { imagePath } from 'components/Constants';
import { useLocation } from 'react-router-dom';

const DashboardBanner = () => {
    const { username, profileimg, companyname } = useSessionStorage();
    const location = useLocation();
    const url = '/' + location.pathname.split('/')[1] + '/';

    return(
        <section className="banner-section sub-banner-py bg-orange-lightest">
            <Container fluid>
                <Row className="justify-content-center mb-fixed-10">
                    <Col md={12} lg={10} xl={10} xxl={8} className="align-self-center text-center">
                        <img
                            className={`img-fluid mb-2 ${url === '/candidate/' ? 'profile-img' : 'company-profile-img'}`}
                            src={profileimg === null || profileimg === "null" ? imagePath.human : profileimg}
                            alt="Profile"
                        />
                        <h2 className="text-capitalize mb-1">{
                            url === "/candidate/" ? (
                                <span>{username}</span>
                            ) : (
                                <span>{companyname}</span>
                            )
                            }
                        </h2>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
export default DashboardBanner;