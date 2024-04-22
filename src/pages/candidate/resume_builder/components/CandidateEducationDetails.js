import { Button, Form } from "react-bootstrap";
import { PropTypes } from "prop-types";

const CandidateEducationDetails = ({
  formData,
  onChange,
  onAddEducation,
  onRemoveEducation,
  err,
}) => {
  return (
    <div>
      {formData?.education?.map((edu, index) => (
        <div key={edu._id || index}>
          <Form.Control
          autoComplete="off"
            type="text"
            name="college"
            placeholder={`Enter College`}
            value={edu?.college || ""}
            onChange={(e) => onChange(e, "education", index)}
            className={`form-control mt-3 mb-1 ${
              err?.[`college[${index}]`] ? "is-invalid" : ""
            }`}
          />
          {err?.[`college[${index}]`] && (
            <span className="text-danger">{err[`college[${index}]`]}</span>
          )}

          <Form.Control
          autoComplete="off"
            type="text"
            name="degree"
            placeholder={`Enter Degree`}
            value={edu?.degree || ""}
            onChange={(e) => onChange(e, "education", index)}
            className={`form-control mt-3 mb-1 ${
              err?.[`degree[${index}]`] ? "is-invalid" : ""
            }`}
          />
          {err?.[`degree[${index}]`] && (
            <span className="text-danger">{err[`degree[${index}]`]}</span>
          )}

          <Form.Control
            type="text"
            name="specialization"
            placeholder={`Enter Specialization`}
            value={edu?.specialization || ""}
            onChange={(e) => onChange(e, "education", index)}
            className={`form-control mt-3 mb-1 ${
              err?.[`specialization[${index}]`] ? "is-invalid" : ""
            }`}
          />
          {err?.[`specialization[${index}]`] && (
            <span className="text-danger">
              {err[`specialization[${index}]`]}
            </span>
          )}

          <Form.Control
            type="number"
            name="gradYearFrom"
            placeholder={`Enter Started Year`}
            value={edu?.gradYearFrom || ""}
            onChange={(e) => onChange(e, "education", index)}
            className="form-control mt-3 mb-1"
          />
          <Form.Control
            type="number"
            name="gradYear"
            placeholder={`Enter Graduation Year`}
            value={edu?.gradYear || ""}
            onChange={(e) => onChange(e, "education", index)}
            className="form-control mt-3 mb-1"
          />
          <Button
            className="btn btn-danger"
            onClick={() => onRemoveEducation(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        className="btn btn-select mt-3 mb-1"
        style={{ color: "var(--hirex-white)" }}
        onClick={onAddEducation}
      >
        Add Education
      </Button>
    </div>
  );
};

CandidateEducationDetails.propTypes = {
  formData: PropTypes.object,
  onChange: PropTypes.func,
  onAddEducation: PropTypes.func,
  onRemoveEducation: PropTypes.func,
  err: PropTypes.object,
};

export default CandidateEducationDetails;
