import { Button, Form } from "react-bootstrap";
import { PropTypes } from 'prop-types';

const CandidateSkillDetails = ({ formData, onChange, onAddSkill, onRemoveSkill, err }) => {
  return (
    <>
      {formData?.keyskills?.map((skill, index) => {
        const skillPlaceholder = `Enter Skill ${index + 1}`;
        const skillKey = `keyskills[${index}]`;
        return (
          <div key={skill._id || index}>
            <div className="d-flex align-items-center mt-3 mb-1">
              <Form.Control
              autoComplete="off"
                type="text"
                placeholder={skillPlaceholder}
                value={skill?.skill}
                onChange={(e) => onChange(e, "keyskills", index)}
                className={`form-control ${err?.[skillKey] ? "is-invalid" : ""}`}
              />
              <Button
                className="btn btn-danger ms-2"
                onClick={() => onRemoveSkill(index)}
              >
                X
              </Button>
            </div>
            {err?.[skillKey] && (
              <div className="text-danger ms-2">{err[skillKey]}</div>
            )}
          </div>
        );
      })}
      <Button className="btn btn-select mt-3" onClick={onAddSkill}>
        Add Skill
      </Button>
    </>
  );
};

CandidateSkillDetails.propTypes = {
  formData: PropTypes.object,
  onChange: PropTypes.func,
  onAddSkill: PropTypes.func,
  onRemoveSkill: PropTypes.func,
  err: PropTypes.object,
};

export default CandidateSkillDetails;
