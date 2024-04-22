import { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import DashboardBanner from 'components/DashboardBanner';
import EmployerMenu from 'components/EmployerMenu';
import ActionComponent from 'components/ActionComponent';
import BadgeComponent from 'components/BadgeComponent';
import DataTable from 'react-data-table-component';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import Loader from 'components/Loader';
import PaginationComponent from 'components/PaginationComponent';
import { FaEye } from "react-icons/fa";
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
        name: "Job title",
        selector: (row) => row.jobTitle,
        sortable: true
    },
    {
        name: "Job category",
        selector: (row) => row?.jobCategory?.category,
        sortable: true
    },
    {
        name: "Job type",
        selector: (row) => row.jobType.type,
        sortable: true,
    },
    {
        name: "Job Status",
        selector: (row) => row.isJobOpen,
        sortable: true,
        cell: (row) => <BadgeComponent status={row.isJobOpen} type="open-close" />
    },
    {
        name: "Candidates",
        selector: (row) => row.candidateNo,
        sortable: true,
        width: "150px",
        cell: (row) => <Link to={`/employer/manage-candidates/${row.slug}`} className="btn btn-main"><span className="top-n1"><FaEye /></span></Link>
    },
    {
        name: "Actions",
        cell: (row) => (
            <ActionComponent
                slug={row.slug}
                deleteMessage="Are you sure want to delete this job?"
                editUrl="employer/post-new-job"
                deleteUrl={BASE_API_URL + "jobs/"}
                updateData={updateData}
                jwtToken="yes"
            />
        ),
    }
];

let EmployerManageJobsUpdateData;

const updateData = () => {
    EmployerManageJobsUpdateData.getJobs();
}

const EmployerManageJobs = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { userid, token, companyid } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newSearchTerm, setNewSearchTerm] = useState('');

    const getJobs = useCallback(async (page = 1, limit = 10) => {
        if (!newSearchTerm) {
            setIsLoading(true);
        }
        const response = await axios.get(`${BASE_API_URL}jobs/company/search/${companyid}?term=${newSearchTerm}&page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setIsLoading(false);
            const data = response.data.jobs;
            const startingSerialNumber = (page - 1) * limit + 1;
            data.forEach((item, index) => {
                item.serialNumber = startingSerialNumber + index;
            });
            setData(data)
            setTotalPages(response.data.totalPages);
        } else if (response?.data?.result === false) {
            clearStorage();
            sessionStorage.setItem("loginErr", LOGIN_ERR);
            setIsLoading(false);
            navigate('/employer/login');
        }
    }, [clearStorage, navigate, token, companyid, newSearchTerm])

    // Pagination page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (userid && token && companyid) {
            getJobs(newPage);
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
        getJobs();
    };

    useEffect(() => {
        if (userid && companyid && token) {
            getJobs();
        }
    }, [getJobs, companyid, token, userid]);

    EmployerManageJobsUpdateData = { getJobs };


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
                            <h4 className="mb-30">Manage Jobs</h4>
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
export default EmployerManageJobs;