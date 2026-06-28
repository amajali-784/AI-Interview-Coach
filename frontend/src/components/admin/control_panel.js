import React, { useState, useEffect } from "react";
import "./control_panel.css"; // Import CSS for styling

const ControlPanel = () => {
  const [timer, setTimer] = useState(10); // 10-second timer

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 0) {
      window.open(
        "https://dashboard.tawk.to/#/dashboard/675068742480f5b4f5a7c141",
        "_blank"
      );
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [timer]);

  return (
    <div className="control-panel-container">
      <div className="panel-content">
        <h1>Customer Care Dashboard</h1>
        <p>
          You will be redirected to the Tawk.to Customer Care Dashboard in{" "}
          <span className="timer">{timer}</span> seconds.
        </p>
        <p>If the redirection doesn’t work, click the button below:</p>
        <button
          className="open-dashboard-btn"
          onClick={() =>
            window.open(
              "https://dashboard.tawk.to/#/dashboard/675068742480f5b4f5a7c141",
              "_blank"
            )
          }
        >
          Open Dashboard Now
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
