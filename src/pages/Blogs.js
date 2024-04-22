import React, { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import LoaderBlur from 'components/LoaderBlur';
import axios from 'axios';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import NoDataFound from 'components/NoDataFound';
import PaginationComponent from 'components/PaginationComponent';
import ReactQuill from "react-quill";
import { modules, formats } from 'utils/reactQuillData'
import { useForm, Controller } from 'react-hook-form';
import { validateImage } from 'utils/imageUtils';
import Select from "react-select";
import Loader from 'components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import BlogCard from 'components/BlogCard';
import SeoComponent from 'components/SeoComponent';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

export default function Blogs() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isBlogLoader, setIsBlogLoader] = useState(false);
    const { userid, token, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [blogs, setBlogs] = useState([]);
    const [blog, setBlog] = useState([]);
    const [blogTags, setBlogTags] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { register, control, handleSubmit, formState: { errors }, reset, setValue } = useForm({ mode: 'all' });
    const [imageValidationErr, setImageValidationErr] = useState();
    const [isValidImg, setIsValidImg] = useState(false);
    const [err, setErr] = useState();
    const [metaData, setMetaData] = useState({});

    // Get blog tags
    const getBlogTags = useCallback(async () => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'master-blogtag').then((response) => {
            if (response?.data) {
                setBlogTags(response.data);
                setIsLoading(false);
            }
        })
    }, [])

    // Get Blogs
    const getBlogs = useCallback(async (page = 1, limit = 12) => {
        setIsLoading(true);
        const response = await axios.get(`${BASE_API_URL}blogs?page=${page}&limit=${limit}`);
        if (response?.data?.result === true) {
            setIsLoading(false);
            setBlogs(response.data.blogs);
            setTotalPages(response.data.totalPages);
        }
        setIsLoading(false);
    }, []);

    // Get Blog
    const getBlog = useCallback(async () => {
        setIsLoading(true);
        const response = await axios.get(`${BASE_API_URL}blogs/${slug}`);
        if (response?.data?.result === true) {
            setIsLoading(false);
            const data = response.data.blog;
            setBlog(data);
            let meta_data = {
                metaTitle: response.data.blog?.title, 
                metaDescription: response?.data?.blog?.shortBlogContent, 
                metaKeywords: response?.data?.blog?.shortBlogContent
            }
            setMetaData(meta_data);
            setIsLoading(false);
            for (const key in data) {
                setValue(key, data[key]);
            }
            const tagsData = data?.tags?.map(tag => ({
                value: tag.id,
                label: tag.tagName,
            }))
            setValue('tags', tagsData);
        }
        setIsLoading(false);
    }, [slug, setValue]);

    // Pagination page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (userid && usertype && token) {
            getBlogs(newPage);
        }
    };

    // Image change and show error
    const handleImageChange = async (e) => {
        setIsLoading(true);
        setIsValidImg(false);
        let image = e.target.files[0];
        setImageValidationErr();
        if (!validateImage(image, setImageValidationErr)) {
            setIsLoading(false);
            setIsValidImg(true);
        } else {
            setIsLoading(false);
            setIsValidImg(false);
        }
    }

    // Append fields to FormData
    const appendFieldsToFormData = (formData, data) => {
        for (const key in data) {
            formData.append(key, data[key]);
        }
    };

    // Post Blog
    const handleBlogPost = (data) => {
        if (isValidImg) {
            return;
        }
        let tags;
        if (data.tags) {
            tags = data.tags.map((item) => ({
                id: item.value,
                tagName: item.label,
            }));
        }
        delete data.tags
        const formData = new FormData();
        appendFieldsToFormData(formData, data);
        formData.append('tags', JSON.stringify(tags));
        if (slug) {
            handleUpdateBlog(formData, data._id);
        } else {
            handleSaveBlog(formData);
        }
    }

    const handleSaveBlog = async (formData) => {
        setIsBlogLoader(true);
        const response = await axios.post(BASE_API_URL + "blogs", formData, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsBlogLoader(false);
            setErr();
            setTimeout(()=>{
                toast.success(response?.data?.message, { theme: 'colored' });
            },100)
            reset();
            setValue("tags", "");
            navigate('/my-blogs');
        } else if (response?.data?.result === false) {
            if (response?.data?.message === "Token Expired") {
                clearStorage();
                sessionStorage.setItem("loginErr", LOGIN_ERR);
                setIsBlogLoader(false);
                navigate('/login');
            } else {
                setIsBlogLoader(false);
                setErr(response.data.errors);
            }
        }
    }

    const handleUpdateBlog = async (formData, id) => {
        setIsBlogLoader(true);
        const response = await axios.put(BASE_API_URL + "blogs/" + id, formData, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsBlogLoader(false);
            setErr();
            setTimeout(()=>{
                toast.success(response?.data?.message, { theme: 'colored' });
            },100)
            reset();
            setValue("tags", "");
            navigate('/my-blogs');
        } else if (response?.data?.result === false) {
            if (response?.data?.message === "Token Expired") {
                clearStorage();
                sessionStorage.setItem("loginErr", LOGIN_ERR);
                setIsBlogLoader(false);
                navigate('/login');
            } else {
                setIsBlogLoader(false);
                setErr(response.data.errors);
            }
        }
    }

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    useEffect(() => {
        getBlogTags()
        getBlogs();
        if (slug) {
            getBlog();
        }
    }, [getBlogs, getBlogTags, slug, getBlog]);

    const location = useLocation();
    const currentUrl = location.pathname;
    const lastSegment = currentUrl.substring(currentUrl.indexOf('/') + 1);
    const convertedString = lastSegment.replace(/\//g, '-');

    return ( 
        <>
            {convertedString === "blogs" ? (
                <SeoComponent slug={convertedString} />
            ) : (
                <SeoComponent slug="detail-page" data={metaData} />
            )}

            <section className="banner-section sub-banner-py bg-orange-lightest">
                <Container fluid>
                    <Row className="justify-content-center mb-10">
                        <Col md={12} lg={10} xl={10} xxl={8} className="align-self-center text-center">
                            {
                                blog?.status === "Approved" ? (
                                    <h1 className="text-capitalize mb-0">Admin approved your blog.</h1>
                                ) : (
                                    <h1 className="text-capitalize mb-0">{slug ? 'Edit Blog' : 'Blogs'}</h1>
                                )
                            }
                        </Col>
                    </Row>
                </Container>
            </section>

            {
                !slug && (
                    <section className="py-50">
                        <Container fluid>
                            <Row>
                                <Col lg={12} className="position-relative">
                                    {isLoading && <LoaderBlur />}
                                    <Row className="row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-4 g-3 mb-20">
                                        {blogs.length > 0 ? (
                                            blogs?.map(blog => (
                                                <Col key={blog?._id}>
                                                    <BlogCard
                                                        id={blog?._id}
                                                        image={blog?.image}
                                                        title={blog?.title}
                                                        redirectTo={blog?.slug}
                                                        content={blog?.shortBlogContent}
                                                        userName={blog?.userDetail?.name}
                                                        postedDate={formatDate(blog?.updatedAt)}
                                                        status = {blog?.status}
                                                    />
                                                </Col>
                                            ))
                                        ) : ''}
                                    </Row>
                                    {
                                        blogs.length < 1 ? (
                                            <Row>
                                                <Col md={12} className="text-center">
                                                    <NoDataFound />
                                                </Col>
                                            </Row>
                                        ) : ''
                                    }
                                    {
                                        blogs.length > 0 ? (
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
                )
            }

            {
                userid && token && usertype && (
                    <section className={`pb-50 position-relative ${slug ? 'pt-50' : ''}`}>
                        {isBlogLoader && <Loader />}
                        <Container fluid>
                            <Row>
                                <Col lg={12}>
                                    {!slug && <h5 className="mb-30">Write Blog</h5>}
                                    <Form autoComplete="off" onSubmit={handleSubmit(handleBlogPost)}>
                                        {slug && <Form.Control type="hidden" {...register('_id')} />}
                                        <Row>
                                            <Col lg={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Title</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter blog title"
                                                        {...register('title', {
                                                            required: "Title is required"
                                                        })}
                                                        isInvalid={errors?.title}
                                                    />
                                                    {errors?.title && <span className="text-danger">{errors.title.message}</span>}
                                                    {err?.title && <span className="text-danger">{err.title}</span>}
                                                    {err?.slug && <span className="text-danger">{err.slug}</span>}
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Tags</Form.Label>
                                                    <Controller
                                                        name="tags"
                                                        control={control}
                                                        rules={{ required: "Tag is required" }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                isMulti
                                                                closeMenuOnSelect={false}
                                                                options={blogTags?.map((item) => ({
                                                                    value: item._id,
                                                                    label: item.tagName,
                                                                }))}
                                                                placeholder="Select"
                                                            />
                                                        )}
                                                    />
                                                    {errors?.tags && <span className="text-danger">{errors.tags.message}</span>}
                                                    {err?.tags && <span className="text-danger">{err.tags}</span>}
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Short Blog Content</Form.Label>
                                                    <Form.Control as="textarea" rows={3} placeholder="Enter short blog content"
                                                        {...register('shortBlogContent', {
                                                            required: "Short Blog Content is required"
                                                        })}
                                                        isInvalid={errors?.title}
                                                    />
                                                    {errors?.shortBlogContent && <span className="text-danger">{errors.shortBlogContent.message}</span>}
                                                    {err?.shortBlogContent && <span className="text-danger">{err.shortBlogContent}</span>}
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6}>
                                                {slug && (
                                                    blog?.image && <img className="img-h-50" src={blog?.image} alt="Blog" />
                                                )}
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Blog Image</Form.Label>
                                                    <Controller
                                                        name="image"
                                                        control={control}
                                                        rules={{ required: 'Image is required' }}
                                                        render={({ field }) => (
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                onChange={(e) => {
                                                                    field.onChange(e.target.files[0]);
                                                                    handleImageChange(e);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    <small className="text-danger">Image size : 1000 * 500</small><br />
                                                    {imageValidationErr && <p className="text-danger mb-0">{imageValidationErr}</p>}
                                                    {errors?.image &&
                                                        <span className="text-danger">{errors.image.message}</span>
                                                    }
                                                    {err?.image &&
                                                        <span className="text-danger">{err?.image}</span>
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col lg={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Blog Content</Form.Label>
                                                    <Controller
                                                        name="blogContent"
                                                        control={control}
                                                        defaultValue=""
                                                        rules={{ required: "Blog content is required" }}
                                                        render={({ field }) => (
                                                            <ReactQuill
                                                                theme="snow"
                                                                modules={modules}
                                                                formats={formats}
                                                                placeholder="Write your blog here...."
                                                                onChange={(value) => field.onChange(value)}
                                                                value={field.value}
                                                                className="react-quill-h-400"
                                                            />
                                                        )}
                                                    />
                                                    {errors?.blogContent && <span className="text-danger">{errors.blogContent.message}</span>}
                                                    {err?.blogContent && <span className="text-danger">{err.blogContent}</span>}
                                                </Form.Group>
                                                {
                                                    blog?.status !== "Approved" && <Button type="submit" className="btn-main">{slug ? 'Update' : 'Submit'}</Button>
                                                }
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                )
            }

            <ToastContainer />
        </>
    );
}