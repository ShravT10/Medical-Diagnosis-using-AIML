import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHistory, updateRecord } from "../api";

export default function EditRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState({
    glucose: "",
    bmi: "",
    age: "",
    prediction: "Non-Diabetic",
  });

  useEffect(() => {
    const fetchRecord = async () => {
      const history = await getHistory();
      const target = history.find((row) => row[0] === parseInt(id));
      if (target) {
        setRecord({
          glucose: target[1],
          bmi: target[2],
          age: target[3],
          prediction: target[4],
        });
      }
    };
    fetchRecord();
  }, [id]);

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateRecord(id, record);
    navigate("/history");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Record</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Glucose:</label>
          <input
            type="number"
            name="glucose"
            value={record.glucose}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>BMI:</label>
          <input
            type="number"
            name="bmi"
            value={record.bmi}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={record.age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Prediction:</label>
          <select
            name="prediction"
            value={record.prediction}
            onChange={handleChange}
          >
            <option value="Non-Diabetic">Non-Diabetic</option>
            <option value="Diabetic">Diabetic</option>
          </select>
        </div>
        <div style={{ marginTop: "20px" }}>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => navigate("/history")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
