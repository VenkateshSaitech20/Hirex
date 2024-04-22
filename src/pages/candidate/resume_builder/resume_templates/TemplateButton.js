import React from "react";
import PropTypes from "prop-types";
import { Button, Col } from "react-bootstrap";

const TemplateButton = ({
  templateKey,
  setSelectedTemplate,
  setTempleteId,
}) => (
  <Col sm={6} md={3}>
    <Button
      className="btn btn-link p-0 mt-3"
      onClick={() => {
        setSelectedTemplate(templateKey);
        setTempleteId(templateKey);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSelectedTemplate(templateKey);
          setTempleteId(templateKey);
        }
      }}
    ></Button>
  </Col>
);

TemplateButton.propTypes = {
  templateKey: PropTypes.string,
  setSelectedTemplate: PropTypes.func,
  setTempleteId: PropTypes.func,
};

export default TemplateButton;
