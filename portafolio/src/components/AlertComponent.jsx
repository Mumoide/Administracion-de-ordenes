import React from "react";
import PropTypes from "prop-types";

const AlertComponent = ({ emptyFieldsMessage, handleCloseEmpty }) => {
  return (
    <div className="alert-container">
      <div
        className={`alert alert-danger col-6 col-md-5 col-lg-4 col-xl-4 d-flex ${
          emptyFieldsMessage ? "" : "fade-out"
        }`}
        role="alert"
      >
        <div className="alert-content flex-grow-1">
          <strong>Por favor, complete todos los campos obligatorios</strong>
        </div>
        <button
          type="button"
          className="alert-close"
          onClick={handleCloseEmpty}
        >
          <span className="alert-close-text" aria-hidden="true">
            &times;
          </span>
        </button>
      </div>
    </div>
  );
};

AlertComponent.propTypes = {
  emptyFieldsMessage: PropTypes.bool,
  handleCloseEmpty: PropTypes.func,
};

export default AlertComponent;
