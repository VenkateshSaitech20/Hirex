import React from 'react';
import Badge from 'react-bootstrap/Badge';
import PropTypes from 'prop-types';

const BadgeComponent = ({ status, type }) => (
  type === "open-close" ? (
    <Badge bg={status === "Y" ? "success" : "danger"}>{status === "Y" ? "Opened" : "Closed"}</Badge>
  ) : (
    <Badge bg={status === "Y" ? "success" : "danger"}>{status === "Y" ? "Yes" : "No"}</Badge>
  )
);

BadgeComponent.propTypes = {
  status: PropTypes.string,
  type: PropTypes.string,
}

export default BadgeComponent;