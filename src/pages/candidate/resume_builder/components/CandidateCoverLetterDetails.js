import { Form } from "react-bootstrap";
import { PropTypes } from "prop-types";

const CandidateCoverLetterDetails = ({ formData, onChange, err }) => (
  <div>
    <Form.Control
    autoComplete="off"
      as={"textarea"}
      rows={10}
      name="coverLetter"
      placeholder="Enter Cover Letter"
      value={formData?.coverLetter || ""}
      onChange={onChange}
      className={`form-control mt-3 mb-1 ${err?.coverLetter ? "is-invalid" : ""}`}
      />
         {err?.coverLetter && (<span className="text-danger">{err?.coverLetter}</span>)}
  </div>
);

CandidateCoverLetterDetails.propTypes = {
  formData: PropTypes.object,
  onChange: PropTypes.func,
  err: PropTypes.object,
};

export default CandidateCoverLetterDetails;
