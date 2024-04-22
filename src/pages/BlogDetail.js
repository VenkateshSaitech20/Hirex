import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import LoaderBlur from 'components/LoaderBlur';
import axios from 'axios';
import SeoComponent from 'components/SeoComponent';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function BlogDetail() {
    const [isLoading, setIsLoading] = useState(false);
    const [metaData, setMetaData] = useState({});
    const [blog, setBlog] = useState([]);
    const { slug } = useParams();

    // Get Blogs
    const getBlog = useCallback(async () => {
        setIsLoading(true);
        const response = await axios.get(`${BASE_API_URL}blogs/${slug}`);
        if (response?.data?.result === true) {
            setIsLoading(false);
            setBlog(response.data.blog);
            let meta_data = {
                metaTitle: response?.data?.blog?.title, 
                metaDescription: response?.data?.blog?.shortBlogContent, 
                metaKeywords: response?.data?.blog?.shortBlogContent
            }
            setMetaData(meta_data);
        }
        setIsLoading(false);
    }, [slug]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    useEffect(() => {
        if (slug) {
            getBlog();
        }
    }, [getBlog, slug]);

    return (
        <>
            {metaData && <SeoComponent slug= "detail-page" data={metaData}/>}

            <section className="banner-section sub-banner-py bg-orange-lightest">
                <Container fluid>
                    <Row className="justify-content-center mb-10">
                        <Col md={12} lg={10} xl={10} xxl={8} className="align-self-center text-center">
                            <h1 className="text-capitalize mb-1">{blog?.title}</h1>
                            <p className="mb-0 text-gray-dark">{blog?.userDetail?.name} | {formatDate(blog?.updatedAt)}</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={12} className="position-relative">
                            {isLoading && <LoaderBlur />}
                            <Row className="justify-content-center">
                                <Col md={12} lg={10}>
                                    <div className="text-center">
                                        {blog?.image && <img className="img-fluid rounded-4 mb-3" src={blog?.image} alt="Blog" />}
                                    </div>
                                    <ul className="tags-ul">
                                        {
                                            blog?.tags?.map(tag => (
                                                <li key={tag.id}>{tag.tagName}</li>
                                            ))
                                        }
                                    </ul>
                                    <div dangerouslySetInnerHTML={{ __html: blog?.blogContent }} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
}