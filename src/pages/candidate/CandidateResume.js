import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import DashboardBanner from 'components/DashboardBanner';
import CandidateMenu from 'components/CandidateMenu';
import CandidateKeySkills from './components/CandidateKeySkills';
import CandidateEducation from './components/CandidateEducation';
import CandidateWorkExperience from './components/CandidateWorkExperience';
import CandidateAOI from './components/CandidateAOI';
import CandidatePreferredLocation from './components/CandidatePreferredLocation';
import CandidateLanguageKnown from './components/CandidateLanguageKnown';
import CandidateCoverLetterVideo from './components/CandidateCoverLetterVideo';
import CandidateUploadResume from './components/CandidateUploadResume';
import { useLocation } from 'react-router-dom';
import SeoComponent from 'components/SeoComponent';

const CandidateResume = () => {

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
                            <CandidateMenu />
                        </Col>
                        <Col lg={7} xl={8} xxl={9}>
                            <h4 className="mb-30">Resume</h4>
                            <div className="mb-30"><CandidateCoverLetterVideo /></div>
                            <div className="mb-30"><CandidateKeySkills /></div>
                            <div className="mb-30"><CandidateEducation /></div>
                            <div className="mb-30"><CandidateWorkExperience /></div>
                            <div className="mb-30"><CandidatePreferredLocation /></div>
                            <div className="mb-30"><CandidateLanguageKnown /></div>
                            <div className="mb-30"><CandidateAOI /></div>
                            <div className="mb-0"><CandidateUploadResume /></div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}
export default CandidateResume;