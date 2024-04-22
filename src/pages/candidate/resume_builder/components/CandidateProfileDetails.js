import { Form } from "react-bootstrap";
import { PropTypes } from "prop-types";

const CandidateProfileDetails = ({ formData, onChange, err }) => (
 <div>
   <Form.Control
   autoComplete="off"
    as={"textarea"}
    type="address"
    rows={4}
    name="description"
    placeholder="Enter Profile summary"
    value={formData?.description || ""}
    onChange={onChange}
    className={`form-control mt-3 mb-1 ${err?.description ? "is-invalid" : ""}`}
  />
  {err?.description && (<span className="text-danger">{err?.description}</span>)}
 </div>
);

CandidateProfileDetails.propTypes = {
  formData: PropTypes.object,
  onChange: PropTypes.func,
  err: PropTypes.object,
};

export default CandidateProfileDetails;
