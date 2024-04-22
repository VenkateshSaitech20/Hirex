import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

const ConfirmPopup = ({ show, onClose, onConfirm, message  }) => {
  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false} centered>
      <Modal.Body className="p-3 text-center">
        <h5 className="mb-15">{message}</h5>
        <div className="d-flex justify-content-center">
          <Button className="me-1 btn btn-main" onClick={onConfirm}>Yes</Button>
          <Button className="btn btn-cancel" onClick={onClose}>No</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

ConfirmPopup.propTypes = {
  show : PropTypes.bool,
  onClose : PropTypes.func,
  onConfirm : PropTypes.func,
  message : PropTypes.string,
}
export default ConfirmPopup;