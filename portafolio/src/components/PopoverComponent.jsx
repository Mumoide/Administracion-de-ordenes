import { useRef, useEffect } from "react";
import Popover from "bootstrap/js/dist/popover";

function PopoverComponent() {
  const popoverRef = useRef();

  useEffect(() => {
    new Popover(popoverRef.current, {
      content: "Debe terminar la etapa actual para crear una nueva.",
      trigger: "hover",
      placement: "top",
      customClass: "my-custom-popover",
    });
  }, []);

  return (
    <div className="justify-content-center align-items-center" ref={popoverRef}>
      <button className="btn btn-success w-100 h-100 disabled">Cambiar</button>
    </div>
  );
}

export default PopoverComponent;
