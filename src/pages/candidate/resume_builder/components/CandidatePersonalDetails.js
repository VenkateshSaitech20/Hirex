import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

const CandidatePersonalDetails = ({formData,onChange,onhandleChange,err}) => {
  return (
    <Form autoComplete="off">
      <div className="ml-5">
        {/* Name */}
        <Form.Control
          placeholder="Enter Name"
          name="name"
          value={formData.name || ""}
          onChange={onChange}
          className={`form-control my-3 ${err?.name ? "is-invalid" : ""}`}
        />
        {err?.name && <span className="text-danger">{err?.name}</span>}

        {/* Role */}
        <Form.Control
          placeholder="Enter Role"
          name="title"
          value={formData?.jobTitle?.title || ""}
          onChange={(e) => onhandleChange(e, "title")}
          className={`form-control mt-3 mb-1 ${err?.title ? "is-invalid" : ""}`}
        />
        {err?.title && <span className="text-danger">{err?.title}</span>}

        {/* Mobile Number */}
        <Form.Control
          placeholder="Enter Mobile number"
          type="text"
          name="mobileNo"
          onChange={(e) => onChange(e, "mobileNo")}
          value={formData?.mobileNo || ""}
          className={`form-control mt-3 mb-1 ${err?.mobileNo ? "is-invalid" : ""}`}
        />
           {err?.mobileNo && (<span className="text-danger">{err?.mobileNo}</span>)}

        {/* Date of Birth */}
        <Form.Control
          placeholder="Enter Date Of Birth"
          type="date"
          name="dob"
          value={
            formData?.dob
              ? new Date(formData.dob).toISOString().slice(0, 10)
              : ""
          }
          onChange={(e) => onChange(e, "dob")}
          className={`form-control mt-3 mb-1 ${err?.dob ? "is-invalid" : ""}`}
        />
        {err?.dob && <span className="text-danger">{err?.dob}</span>}

        {/* Address */}
        <Form.Control
          placeholder="Enter Address"
          name="address"
          value={formData?.address || ""}
          onChange={onChange}
          className={`form-control mt-3 mb-1 ${err?.address ? "is-invalid" : ""}`}
        />
        {err?.address && <span className="text-danger">{err?.address}</span>}

        {/* Area of Interest */}
        <Form.Control
          placeholder="Enter Area of Interest"
          name="aoi"
          value={formData?.aoi || ""}
          onChange={onChange}
          className={`form-control mt-3 mb-1 ${err?.aoi ? "is-invalid" : ""}`}
        />
        {err?.aoi && <span className="text-danger">{err?.aoi}</span>}
      </div>
    </Form>
  );
};

CandidatePersonalDetails.propTypes = {
  formData: PropTypes.object,
  onChange: PropTypes.func,
  onhandleChange: PropTypes.func,
  err: PropTypes.object,
};

export default CandidatePersonalDetails;
