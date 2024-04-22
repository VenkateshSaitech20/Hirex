import { Button, Form } from "react-bootstrap";
import { PropTypes } from "prop-types";

const CandidateLanguageDetails = ({formData,onChange,onAddLanguage,onRemoveLanguage,err,}) => (
  <>
    {formData?.languageKnown?.map((lang, index) => (
      <div key={lang._id || index}>
          <div className="d-flex" >
        <Form.Control
        autoComplete="off"
          type="text"
          placeholder="Enter Language"
          value={lang?.language}
          onChange={(e) => onChange(e, "language", index)}
          className={`form-control mt-3 mb-1 ${
            err?.[`language[${index}]`] ? "is-invalid" : ""
          }`}
        />
        
        <Form.Select
          aria-label="Proficiency"
          value={lang?.proficiencyName ? lang.proficiencyName : "Begineer"}
          onChange={(e) => onChange(e, "proficiencyName", index)}
          className="form-control mt-3 mb-1 mx-3"
        >
          <option value="Begineer">Begineer</option>
          <option value="Proficient">Proficient</option>
          <option value="Expert">Expert</option>
        </Form.Select>

        <Button
          className="btn btn-danger mt-3 mb-1"
          onClick={() => onRemoveLanguage(index)}
        >
          X
        </Button>
      </div>
        <div>
        {err?.[`language[${index}]`] && (
            <span className="text-danger">{err[`language[${index}]`]}</span>
          )}
        </div>
      </div>
    ))}
    <Button
      className="btn btn-select mt-3"
      style={{ color: "var(--hirex-white)" }}
      onClick={onAddLanguage}
    >
      Add Language
    </Button>
  </>
);

CandidateLanguageDetails.propTypes = {
  formData: PropTypes.object,
  onChange: PropTypes.func,
  onAddLanguage: PropTypes.func,
  onRemoveLanguage: PropTypes.func,
  err: PropTypes.object,
};

export default CandidateLanguageDetails;
