import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function DateComponent({ fecha, idName, onDateChange, col, title, disabled }) {
  const [date, setDate] = useState("");

  useEffect(() => {
    const creationDate = new Date(fecha);
    const timeZoneOffset = creationDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const adjustedDate = new Date(creationDate.getTime() + timeZoneOffset);
    const creationDateFormatted =
      adjustedDate.getFullYear() +
      "-" +
      ("0" + (adjustedDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + adjustedDate.getDate()).slice(-2);
    setDate(creationDateFormatted);
  }, [fecha]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    onDateChange(new Date(newDate)); // Convert the new date value to a Date object
  };

  return (
    <div className={col}>
      <label htmlFor={idName} className="form-label">
        {title}
      </label>
      <input
        type="date"
        className="form-control"
        id={idName}
        autoComplete="off"
        onChange={handleDateChange}
        value={date}
        disabled={disabled}
      />
    </div>
  );
}

DateComponent.propTypes = {
  fecha: PropTypes.string,
  title: PropTypes.string,
  onDateChange: PropTypes.func,
  col: PropTypes.string,
  idName: PropTypes.string,
  disabled: PropTypes.bool,
};

export default DateComponent;
