import { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import DashboardBanner from 'components/DashboardBanner';
import EmployerMenu from 'components/EmployerMenu';
import DataTable from 'react-data-table-component';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Loader from 'components/Loader';
import { FaEye } from "react-icons/fa";
import PaginationComponent from 'components/PaginationComponent';
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
        name: "Experience",
        selector: (row) => row.experience ? row.experience + ' Years' : '',
        sortable: true,
        // width: "120px"
    },
    {
        name: "Qualification",
        selector: (row) => row.qualification,
        sortable: true,
        // width: "120px"
    },
    {
        name: "Location",
        selector: (row) => row.address,
        sortable: true,
        width: "150px"
    },
    {
        name: "Interested?",
        selector: (row) => row.applyStatus,
        sortable: true,
        cell: (row) => (
            <div>
                <select
                    value={row.applyStatus}
                    onChange={(e) => handleStatusChange(e.target.value, row)}
                    className="form-control"
                >
                    <option value="Pending">Pending</option>
                    <option value="Hold">Hold</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Shortlisted">Shortlisted</option>
                </select>
            </div>
        )
    },
    {
        name: "Profiles",
        selector: (row) => row.candidateNo,
        sortable: true,
        width: "120px",
        cell: (row) => <Link to={`/candidate/${row.candidateNo}`} className="btn btn-main"><span className="top-n1"><FaEye /></span></Link>
    },
];

let EmployerManageCandidatesUpdData;

const handleStatusChange = (value, data) => {
    EmployerManageCandidatesUpdData.updateJobCandidates(value, data);
}

const EmployerManageCandidates = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [data, setData] = useState([]);
    const [responseData, setResponseData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { userid, token, companyid } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newSearchTerm, setNewSearchTerm] = useState('');

    // Get data
    const getAppliedJobCandidates = useCallback(async (page = 1, limit = 10) => {
        if (!newSearchTerm) {
            setIsLoading(true);
        }
        const response = await axios.get(BASE_API_URL + `applied-job/${companyid}/${slug}?term=${newSearchTerm}&page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            const data = response.data.jobs;
            setTotalPages(response.data.totalPages);
            const startingSerialNumber = (page - 1) * limit + 1;
            data.forEach((item, index) => {
                item.serialNumber = startingSerialNumber + index;
            });
            setResponseData(response.data.jobs);
            let orgData = data.map(({ companyDetail, jobDetail, candidateDetail, ...rest }) => ({
                ...rest,
                ...companyDetail,
                ...jobDetail,
                ...candidateDetail, 
            }));
            setData(orgData);
        } else if (response?.data?.result === false) {
            clearStorage();
            sessionStorage.setItem("loginErr", LOGIN_ERR);
            setIsLoading(false);
            navigate('/employer/login');
        }
    }, [clearStorage, navigate, token, companyid, slug, newSearchTerm])

    // Update data
    const updateJobCandidates = async (value, data) => {
        if (!responseData) { return; }
        let updData = { applyStatus: value }
        setIsLoading(true);
        const response = await axios.put(`${BASE_API_URL}applied-job/${data.candidateNo}/${data.jobId}/${data.companyId}`, updData, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            toast.success(response.data.message, { theme: 'colored' });
            setData((prevData) => {
                const updatedData = prevData.map((item) =>
                    item.candidateNo === data.candidateNo &&
                        item.jobId === data.jobId &&
                        item.companyId === data.companyId ? { ...item, applyStatus: value } : item
                );
                setData(updatedData);
                return updatedData;
            });
        } else if (response?.data?.result === false) {
            if (response?.data?.message === "Token Expired") {
                clearStorage();
                sessionStorage.setItem("loginErr", LOGIN_ERR);
                setIsLoading(false);
                navigate('/employer/login');
            } else {
                setIsLoading(false);
            }
        }
    }

    // Pagination page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (userid && token && companyid) {
            getAppliedJobCandidates(newPage);
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
        getAppliedJobCandidates();
    };

    useEffect(() => {
        if (userid && companyid && token && slug) {
            getAppliedJobCandidates();
        }
    }, [getAppliedJobCandidates, companyid, token, userid, slug]);

    EmployerManageCandidatesUpdData = { updateJobCandidates: (value, data) => updateJobCandidates(value, data) };


    const location = useLocation();
    const currentUrl = location.pathname;
    const lastSegment = currentUrl.substring(currentUrl.indexOf('/') + 1);
    const convertedString = lastSegment.replace(/\//g, '-');

    return (
        <>
            {convertedString === "employer-post-new-job" ? (
                <SeoComponent slug={convertedString} />
            ) : (
                <SeoComponent slug="employer-manage-candidates" />
            )}

            <DashboardBanner />
            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={5} xl={4} xxl={3} className="mb-30 mb-lg-0">
                            <EmployerMenu />
                        </Col>
                        <Col lg={7} xl={8} xxl={9} className="custom-datatable position-relative">
                            <h4 className="mb-30">Manage Candidates</h4>
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
                        </Col>
                    </Row>
                </Container>
            </section>
            <ToastContainer />
        </>
    )
}
export default EmployerManageCandidates;