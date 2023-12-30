import YouTube from "@/components/MUI/MuiExamplePulse";
import Facebook from "@/components/MUI/MuiExampleWave";
import { useState } from "react";

const Example: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h3>MUI skeleton</h3>
      <div>
        <input
          className="form-check-input"
          type="checkbox"
          id={`loadingCheckbox`}
          checked={loading}
          onChange={() => setLoading((b) => !b)}
        />
        <label className="form-check-label" htmlFor={`loadingCheckbox`}>
          Loading
        </label>
      </div>
      <YouTube loading={loading} />

      <div>
        <input
          className="form-check-input"
          type="checkbox"
          id={`loadingCheckbox`}
          checked={loading}
          onChange={() => setLoading((b) => !b)}
        />
        <label className="form-check-label" htmlFor={`loadingCheckbox`}>
          Loading
        </label>
      </div>

      <Facebook loading={loading} />
    </div>
  );
};

export default Example;
