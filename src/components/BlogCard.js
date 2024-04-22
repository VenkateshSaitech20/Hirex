import { Badge, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import LoaderButton from 'components/LoaderButton';
import { useState } from "react";
import ConfirmPopup from "./ConfirmPopup";
import { ToastContainer, toast } from 'react-toastify';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const BlogCard = ({ id, image, title, content, userName, postedDate, redirectTo, slug, fetchBlogs, status }) => {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteBlogId, setDeleteBlogId] = useState();
    const { token, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [isButtonLoading, setIsButtonLoading] = useState(false);

    const handleDeleteBlog = async (id) => {
        setDeleteBlogId(id);
        setShowConfirm(true);
    }

    const handleConfirmDelete = async (deleteBlogId) => {
        setIsButtonLoading(true);
        let data = {
            id: deleteBlogId
        }
        const response = await axios.post(`${BASE_API_URL}blogs/delete-blog`,data,{headers:{Authorization:`Bearer ${token}`}});
        if (response?.data?.result === true) {
            setShowConfirm(false);
            setIsButtonLoading(false);
            setTimeout(()=>{
                toast.success(response?.data?.message, { theme: 'colored' });
            }, 100);
            fetchBlogs();
        } else if (response?.data?.result === false) {
            setShowConfirm(false);
            if (response?.data?.message === 'Token Expired') {
                setIsButtonLoading(false);
                if (usertype === "employer") {
                    navigate('/employer/login');
                } else {
                    navigate('/login');
                }
                sessionStorage.setItem("loginErr", LOGIN_ERR);
                clearStorage();
            } else {
                setIsButtonLoading(false);
            }
        }
    }
    
    const handleCloseConfirm = () => {
        setShowConfirm(false);
    }

    const handleEditBlog = (editSlug) => {
        navigate('/blog/edit/'+editSlug);
    }

    return (
        <>
            <Card className="blog-card">
                <Card.Img variant="top" src={image} />
                <Card.Body>
                    {
                        slug && slug === "My Blog" && (
                            <div className="d-flex justify-content-between flex-wrap mb-2 action-icons-div">
                                {status === "Approved" ? (
                                    <Badge bg="success" className="mb-0 fs-12 lh-15 font-regular pe-none">{status}</Badge>
                                ) : (
                                    <Badge bg="success" className="mb-0 fs-12 lh-15 font-regular" onClick={() => handleEditBlog(redirectTo)}>Edit</Badge>
                                )}
                                <Badge bg="danger" className="mb-0 fs-12 lh-15 font-regular d-flex" onClick={() => handleDeleteBlog(id)}>{isButtonLoading && <span className="me-1"><LoaderButton /></span>}Delete</Badge>
                            </div>
                        )
                    }
                    <Link to={`/blog/${redirectTo}`}><h6 className="limit-desc-1 mb-2">{title}</h6></Link>
                    <p className="limit-desc-3 mb-2">{content}</p>
                    <div className="d-flex justify-content-between flex-wrap">
                        <p className="mb-0 text-gray fs-14">{userName}</p>
                        <p className="mb-0 text-gray fs-14">{postedDate}</p>
                    </div>
                </Card.Body>
            </Card>

            <ConfirmPopup
                show={showConfirm}
                onClose={handleCloseConfirm}
                onConfirm={() => handleConfirmDelete(deleteBlogId)}
                message="Are you sure you want to delete this blog?"
            />

            <ToastContainer/>
        </>
    )
}

BlogCard.propTypes = {
    id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    userName: PropTypes.string,
    redirectTo: PropTypes.any,
    postedDate: PropTypes.string,
    slug: PropTypes.string,
    status: PropTypes.string,
    fetchBlogs: PropTypes.func
}

export default BlogCard;