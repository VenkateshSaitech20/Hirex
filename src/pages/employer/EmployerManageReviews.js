import { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Modal, Badge } from 'react-bootstrap';
import DashboardBanner from 'components/DashboardBanner';
import EmployerMenu from 'components/EmployerMenu';
import DataTable from 'react-data-table-component';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Loader from 'components/Loader';
import PaginationComponent from 'components/PaginationComponent';
import { Rating } from 'react-simple-star-rating'
import SeoComponent from 'components/SeoComponent';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const columns = [
    {
        name: "S.No",
        selector: (row) => row.serialNumber,
        sortable: true,
        width: "100px"
    },
    {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
        width: "120px"
    },
    {
        name: "Likes",
        selector: (row) => row.likes,
        sortable: true,
        width: "240px"
    },
    {
        name: "Dislikes",
        selector: (row) => row.dislikes,
        sortable: true,
        width: "240px"
    },
    {
        name: "Rating",
        selector: (row) => row.rating,
        sortable: true,
        width: "100px"
    },
    {
        name: "Interested?",
        selector: (row) => row.status,
        sortable: true,
        cell: (row) => (
            <div>
                <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(e.target.value, row)}
                    className="form-control"
                >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                </select>
            </div>
        )
    },
    {
        name: "Review",
        selector: (row) => row.candidateNo,
        sortable: true,
        width: "120px",
        cell: (row) => <Link className="btn btn-main" onClick={() => openReviewModal(row, true)}>Read</Link>
    },
];

let EmployerManageReviewsUpdData;
let EmployerManagerReviewModal;

const handleStatusChange = (value, data) => {
    EmployerManageReviewsUpdData.updateReview(value, data);
}

const openReviewModal = (review, openModal) => {
    EmployerManagerReviewModal.openReviewModal(review, openModal);
}

const EmployerManageReviews = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { userid, token, companyid } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newSearchTerm, setNewSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    // Update data
    const openReviewModal = async (review, openModal) => {
        setSelectedReview(review);
        setShowModal(openModal);
    }

    const getBadgeBgColor = (rating) => {
        if (rating < 2.5) {
            return 'danger';
        } else if (rating <= 3.5) {
            return 'info';
        } else {
            return 'success';
        }
    };

    // Review Modal
    const renderModal = () => {
        if (!selectedReview) {
            return null;
        }

        return (
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg" centered scrollable>
                <Modal.Header className="modal-orange-light" closeButton>
                    <h5 className="mb-0">{selectedReview.name}</h5>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex mb-20 align-items-center">
                        <Rating
                            allowFraction
                            initialValue={selectedReview.rating ?? 0}
                            readonly
                        />
                        <span>
                            {selectedReview.rating &&
                                <Badge className="ms-2" bg={getBadgeBgColor(selectedReview.rating)}>
                                    {selectedReview.rating}
                                </Badge>
                            }
                        </span>
                    </div>
                    {
                        selectedReview.likes && (
                            <>
                                <h6 className="mb-1">Likes:</h6>
                                <p className={selectedReview.dislikes ? "mb-20" : "mb-10"}>{selectedReview.likes}</p>
                            </>
                        )
                    }
                    {
                        selectedReview.dislikes && (
                            <>
                                <h6 className="mb-1">Dislikes:</h6>
                                <p className="mb-10">{selectedReview.dislikes}</p>
                            </>
                        )
                    }
                </Modal.Body>
            </Modal>
        );
    };

    // Get review 
    const getReviews = useCallback(async (page = 1, limit = 10) => {
        if (!newSearchTerm) {
            setIsLoading(true);
        }
        const response = await axios.get(BASE_API_URL + `company-review/${companyid}?term=${newSearchTerm}&page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            const reviews = response.data.reviews;
            setTotalPages(response.data.totalPages);
            const startingSerialNumber = (page - 1) * limit + 1;
            reviews.forEach((item, index) => {
                item.serialNumber = startingSerialNumber + index;
            });
            let orgData = reviews.map(({ companyDetail, candidateDetail, ...rest }) => ({
                ...rest,
                ...companyDetail,
                ...candidateDetail,
            }));
            setData(orgData);
        } else if (response?.data?.result === false) {
            clearStorage();
            sessionStorage.setItem("loginErr", LOGIN_ERR);
            setIsLoading(false);
            navigate('/employer/login');
        }
    }, [clearStorage, navigate, token, companyid, newSearchTerm])

    // Update data
    const updateReview = async (value, data) => {
        let updData = { status: value }
        const response = await axios.put(`${BASE_API_URL}company-review/${data.companyId}/${data.candidateNo}`, updData, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            toast.success(response?.data?.message, { theme: 'colored' });
            setData((prevData) => {
                const updatedData = prevData.map((item) =>
                    item.candidateNo === data.candidateNo &&
                        item.companyId === data.companyId ? { ...item, status: value } : item
                );
                setData(updatedData);
                return updatedData;
            });
        } else if (response?.data?.result === false) {
            if (data?.message === "Token Expired") {
                clearStorage();
                sessionStorage.setItem("loginErr", LOGIN_ERR);
                setIsLoading(false);
                navigate('/login');
            }
        }
    }

    // Pagination page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (userid && token && companyid) {
            getReviews(newPage);
        }
    };

    const handleKeyPress = (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        const isAlphanumeric = /^[a-zA-Z0-9\s]*$/.test(e.key);
        const isAllowedKey = allowedKeys.includes(e.key);
        const isModifierKey = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;
        if (!(isAlphanumeric || isAllowedKey) || isModifierKey) {
            e.preventDefault();
        }
    };

    const handleSearch = async (e) => {
        const inputValue = e.target.value;
        const newSearchTerm = inputValue.toLowerCase();
        setNewSearchTerm(newSearchTerm);
        setCurrentPage(1);
        getReviews();
    };

    useEffect(() => {
        if (userid && companyid && token) {
            getReviews();
        }
    }, [getReviews, companyid, token, userid]);

    EmployerManageReviewsUpdData = { updateReview: (value, data) => updateReview(value, data) };
    EmployerManagerReviewModal = { openReviewModal: (review, openModal) => openReviewModal(review, openModal) };

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
                            <EmployerMenu />
                        </Col>
                        <Col lg={7} xl={8} xxl={9} className="custom-datatable position-relative">
                            <h4 className="mb-30">Manage Reviews</h4>
                            {isLoading && <Loader />}
                            <DataTable
                                columns={columns}
                                data={data}
                                defaultSortFieldId={1}
                                subHeader
                                subHeaderComponent={
                                    <input
                                        className="form-control w-25"
                                        type="text"
                                        placeholder="Search..."
                                        onChange={handleSearch}
                                        onKeyDown={(e) => handleKeyPress(e)}
                                    />
                                }
                            />
                            {data?.length > 0 &&
                                <div className="table-border-top">
                                    <div className="mt-3">
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            handlePageChange={handlePageChange}
                                            flag="table-pagination"
                                        />
                                    </div>
                                </div>
                            }
                        </Col>
                    </Row>
                </Container>
            </section>
            <ToastContainer />
            {renderModal()}
        </>
    )
}
export default EmployerManageReviews;