import { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";
import DashboardBanner from "components/DashboardBanner";
import EmployerMenu from "components/EmployerMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useSessionStorage } from "context/SessionStorageContext";
import { useClearStorage } from "utils/useClearStorage";
import ActionComponent from "components/ActionComponent";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import Loader from "components/Loader";
import { subscriptionPlan } from "./subscription/subscription";
import SubscriptionAlert from "components/SubscriptionAlert";
import SeoComponent from "components/SeoComponent";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const columns = [
  {
    name: "S.No",
    selector: (row) => row.serialNumber,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Mobile Number",
    selector: (row) => row.mobileNo,
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row) => (
      <ActionComponent
        slug={row.employerNo}
        deleteMessage="Are you sure want to delete this employer?"
        editUrl=""
        deleteUrl={BASE_API_URL + "employer-details/delete-employer/"}
        updateData={updateData}
        jwtToken="yes"
      />
    ),
  },
];

let EmployersUpdateData;

const updateData = () => {
  EmployersUpdateData.getEmployers();
};

const EmployerManageUsers = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userid, token, companyid, usertype } = useSessionStorage();
  const { clearStorage } = useClearStorage();
  const [userCount, setUserCount] = useState("0");
  const [accessDetails, setAccessDetails] = useState({});

  const getEmployers = useCallback(async () => {
    setIsLoading(true);
    const response = await axios.get(
      BASE_API_URL + "employer-details/get-employers/" + companyid,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response?.data?.result === true) {
      setIsLoading(false);
      const data = response.data.employers;
      data.forEach((item, index) => {
        item.serialNumber = index + 1;
      });
      setData(data);
    } else if (response?.data?.result === false) {
      clearStorage();
      sessionStorage.setItem("loginErr", LOGIN_ERR);
      setIsLoading(false);
      navigate("/employer/login");
    }
  }, [clearStorage, navigate, token, companyid]);

  //   Get latest paymet detail
  const getLastPaymentDetail = useCallback(async () => {
    const response = await axios.post(`${BASE_API_URL}jobs/payment/date`, {
      companyId: companyid,
    });
    return response?.data?.data?.createdAt;
  }, [companyid]);

  const getAllSubUser = useCallback(async () => {
    const lastPaymentDate = await getLastPaymentDetail();

    const response = await axios.get(
      `${BASE_API_URL}employer-details/get-subuser-count/${companyid}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response?.data?.result === true) {
      const allSubUsers = response.data.employers;

      const subUsersAfterLastPayment = allSubUsers.filter((user) => {
        const userCreatedAt = Date.parse(user.createdAt);
        const lastPaymentDateTimestamp = Date.parse(lastPaymentDate);
        return userCreatedAt > lastPaymentDateTimestamp;
      });
      setUserCount(subUsersAfterLastPayment.length);
    }
  }, [companyid, token, getLastPaymentDetail]);

  const getAccessdeatils = useCallback(async (token) => {
    const result = await subscriptionPlan(token);
    setAccessDetails((prev) => ({ ...prev, ...result }));
  }, []);

  useEffect(() => {
    if (companyid && token) {
      getEmployers();
      getAllSubUser();
      getAccessdeatils(token);
    }
  }, [
    getEmployers,
    getAllSubUser,
    token,
    companyid,
    userid,
    usertype,
    getAccessdeatils,
  ]);
  EmployersUpdateData = { getEmployers };

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
            <Col
              lg={7}
              xl={8}
              xxl={9}
              className="custom-datatable position-relative"
            >
              {userCount >= accessDetails.subUser && (
                <SubscriptionAlert message={sessionStorage.getItem("packageid") === "1" ? "You cannot add a user in free trail" : "Your package has reached the add user limit. Buy the plan if you want to add more user"} />
              )}
              <div className="d-flex justify-content-between mb-30">
                <h4 className="mb-0">Manage Users</h4>
                {userCount < accessDetails.subUser && (
                  <Link to={"/employer/add-user"} className={"btn btn-main"}>
                    Add User
                  </Link>
                )}
              </div>
              {isLoading && <Loader />}
              <DataTable
                columns={columns}
                data={data}
                defaultSortFieldId={1}
                pagination
              />
            </Col>
          </Row>
        </Container>
      </section>
      <ToastContainer />
    </>
  );
};
export default EmployerManageUsers;
