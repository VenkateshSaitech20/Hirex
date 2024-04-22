import React, { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import LoaderBlur from 'components/LoaderBlur';
import axios from 'axios';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import NoDataFound from 'components/NoDataFound';
import PaginationComponent from 'components/PaginationComponent';
import BlogCard from 'components/BlogCard';
import { ToastContainer } from 'react-toastify';
import SeoComponent from 'components/SeoComponent';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

export default function MyBlogs() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { userid, token, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [myBlogs, setMyBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Get Blogs
    const getMyBlogs = useCallback(async (page = 1, limit = 12) => {
        setIsLoading(true);
        const response = await axios.get(`${BASE_API_URL}blogs/my-blogs?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            setMyBlogs(response.data.blogs);
            setTotalPages(response.data.totalPages);
        } else if (response?.data?.result === false) {
            if (response?.data?.message === 'Token Expired') {
                setIsLoading(false);
                if (usertype === "employer") {
                    navigate('/employer/login');
                } else {
                    navigate('/login');
                }
                sessionStorage.setItem("loginErr", LOGIN_ERR);
                clearStorage();
            } else {
                setIsLoading(false);
            }
        }
    }, [token, usertype, clearStorage, navigate]);

    // Pagination page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (userid && usertype && token) {
            getMyBlogs(newPage);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    // Fetch blogs again after deleting
    const fetchBlogs = async () => {
        await getMyBlogs(currentPage);
    };

    useEffect(() => {
        getMyBlogs();
    }, [getMyBlogs]);

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
                            <h1 className="text-capitalize mb-0">My Blogs</h1>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={12} className="position-relative">
                            {isLoading && <LoaderBlur />}
                            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-4 g-3 mb-20">
                                {myBlogs.length > 0 ? (
                                    myBlogs?.map(blog => (
                                        <Col key={blog?._id}>
                                            <BlogCard
                                                id = {blog?._id}
                                                image={blog?.image}
                                                title={blog?.title}
                                                redirectTo={blog?.slug}
                                                content={blog?.shortBlogContent}
                                                userName={blog?.userDetail?.name}
                                                postedDate={formatDate(blog?.updatedAt)}
                                                slug = "My Blog"
                                                fetchBlogs={fetchBlogs}
                                                status = {blog?.status}
                                            />
                                        </Col>
                                    ))
                                ) : ''}
                            </Row>
                            {
                                myBlogs.length < 1 ? (
                                    <Row>
                                        <Col md={12} className="text-center">
                                            <NoDataFound />
                                        </Col>
                                    </Row>
                                ) : ''
                            }
                            {
                                myBlogs.length > 0 ? (
                                    <Row>
                                        <Col md={12}>
                                            <PaginationComponent
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                handlePageChange={handlePageChange}
                                            />
                                        </Col>
                                    </Row>
                                ) : ''
                            }
                        </Col>
                    </Row>
                </Container>
            </section>

            <ToastContainer />
        </>
    );
}