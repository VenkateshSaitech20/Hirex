import { Button, Form } from "react-bootstrap";
import { PropTypes } from 'prop-types';

const CandidateExperienceDetails = ({ formData, onChange, onAdd, onRemove, err }) => (
    <>
      {formData?.workExperience?.map((experience, index) => {
        return (
          <div key={experience._id || index}>
            <Form.Control
            autoComplete="off"
              type="text"
              name="companyName"
              placeholder={`Enter Company Name`}
              value={experience?.companyName}
              onChange={(e) => onChange(e, "workExperience", index)}
              className={`form-control mt-3 mb-1 ${
                err?.[`companyName[${index}]`] ? "is-invalid" : ""
              }`}
            />
            {err?.[`companyName[${index}]`] && (
              <span className="text-danger">{err[`companyName[${index}]`]}</span>
            )}
            <Form.Control
            autoComplete="off"
              type="text"
              name="workTitle"
              placeholder={`Enter Work Title `}
              value={experience?.workTitle}
              onChange={(e) => onChange(e, "workExperience", index)}
              className={`form-control mt-3 mb-1 ${
                err?.[`workTitle[${index}]`] ? "is-invalid" : ""
              }`}
            />
            {err?.[`workTitle[${index}]`] && (
              <span className="text-danger">{err[`workTitle[${index}]`]}</span>
            )}
            <Form.Control
            autoComplete="off"
              type="date"
              name="workFrom"
              placeholder={`Enter Start Date`}
              value={experience?.workFrom}
              onChange={(e) => onChange(e, "workExperience", index)}
              className={`form-control mt-3 mb-1 ${
                err?.[`workFrom[${index}]`] ? "is-invalid" : ""
              }`}
            />
            {err?.[`workFrom[${index}]`] && (
              <span className="text-danger">{err[`workFrom[${index}]`]}</span>
            )}
            <Form.Control
            autoComplete="off"
              type="date"
              name="workTo"
              placeholder={`Enter End Date`}
              value={experience?.workTo}
              onChange={(e) => onChange(e, "workExperience", index)}
              className="form-control mt-3 mb-1"
            />
            <Form.Control
            autoComplete="off"
              type="text"
              name="workDescription"
              placeholder={`Enter Work Description `}
              value={experience?.workDescription}
              onChange={(e) => onChange(e, "workExperience", index)}
              className="form-control mt-3 mb-1"
            />
            <Button
              className="btn btn-danger mt-3 mb-1"
              onClick={() => onRemove(index)}
            >
              Remove
            </Button>
          </div>
        );
      })}
      <Button
        className="btn btn-select mt-3 mb-1"
        onClick={onAdd}
      >
        Add Work Experience
      </Button>
    </>
  );

  CandidateExperienceDetails.propTypes = {
    formData: PropTypes.object,
    onChange: PropTypes.func,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    err: PropTypes.object,
  };

  export default CandidateExperienceDetails;