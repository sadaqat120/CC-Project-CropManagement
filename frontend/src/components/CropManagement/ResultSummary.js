import React, { useState, useEffect } from "react";
import axios from "axios";

const ResultSummary = ({ cropFarmId }) => {
  const [formData, setFormData] = useState({
    totalYield: "",
    yieldGrade: "",
    expectedYield: "",
    unit: "",
    satisfaction: "",
    yieldNotes: "",
    sellRevenue: "",
    revenueNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [recordId, setRecordId] = useState(null);
  const [isHarvested, setIsHarvested] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check harvest status
        const harvestRes = await axios.get(
          `https://cc-crop-backend-gvcthhdydfhjhgb2.eastasia-01.azurewebsites.net/result-summary/check-harvest/${cropFarmId}`,
          { }
        );

        if (!harvestRes.data.isHarvested) {
          setIsHarvested(false);
          setShowModal(true);
        }

        // Fetch result summary (if exists)
        const summaryRes = await axios.get(
          `https://cc-crop-backend-gvcthhdydfhjhgb2.eastasia-01.azurewebsites.net/result-summary/${cropFarmId}`,
          {  }
        );

        if (summaryRes.data && summaryRes.data.length > 0) {
          const existing = summaryRes.data[0];
          setFormData({
            totalYield: existing.totalYield || "",
            yieldGrade: existing.yieldGrade || "",
            expectedYield: existing.expectedYield || "",
            unit: existing.unit || "",
            satisfaction: existing.satisfaction || "",
            yieldNotes: existing.yieldNotes || "",
            sellRevenue: existing.sellRevenue || "",
            revenueNotes: existing.revenueNotes || "",
          });
          setIsEditMode(true);
          setRecordId(existing._id);
        }
      } catch (err) {
        console.error("Error loading result summary:", err);
      }
    };

    fetchData();
  }, [cropFarmId]);

  const validate = () => {
    const newErrors = {};
    const required = [
      "totalYield",
      "yieldGrade",
      "expectedYield",
      "unit",
      "satisfaction",
      "sellRevenue",
    ];
    required.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        cropFarmId,
        ...formData,
        totalYield: Number(formData.totalYield),
        expectedYield: Number(formData.expectedYield),
        sellRevenue: Number(formData.sellRevenue),
      };

      if (isEditMode && recordId) {
        await axios.put(
          `https://cc-crop-backend-gvcthhdydfhjhgb2.eastasia-01.azurewebsites.net/result-summary/${recordId}`,
          payload,
          {
          }
        );
        setSuccessMsg("Result Summary Updated Successfully!");
      } else {
        await axios.post("https://cc-crop-backend-gvcthhdydfhjhgb2.eastasia-01.azurewebsites.net/result-summary", payload, {
        });
        setSuccessMsg("Result Summary Saved Successfully!");
      }
    } catch (err) {
      console.error("Error saving result summary:", err);
      setErrors({ general: "Error saving result summary. Please try again." });
      setTimeout(() => setErrors({ general: "" }), 2000);
    }
  };

  return (
    <div className="relative w-4/5 mx-auto my-5 p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-md">
      <h2 className="text-center text-2xl text-green-700 mb-4">
        {isEditMode ? "Edit Result Summary" : "Create Result Summary"}
      </h2>
      {successMsg && <p className="text-green-600 text-center">{successMsg}</p>}
      {errors.general && (
        <p className="text-red-600 text-center font-medium text-sm">
          {errors.general}
        </p>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md relative w-[90%] max-w-md">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-2 text-red-700">
              Harvest Not Completed
            </h3>
            <p className="text-sm text-gray-700">
              You can only add or edit the result summary once the crop is fully
              harvested. Please check back after the harvest duration has
              passed.
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        disabled={!isHarvested}
      >
        {[ 
          { name: "totalYield", type: "number", label: "Total Yield" },
          { name: "expectedYield", type: "number", label: "Expected Yield" },
          { name: "sellRevenue", type: "number", label: "Sell Revenue" },
        ].map(({ name, type, label }) => (
          <input
            key={name}
            type={type}
            name={name}
            placeholder={label}
            value={formData[name]}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
            readOnly={!isHarvested}
          />
        ))}

        <select
          name="yieldGrade"
          value={formData.yieldGrade}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          disabled={!isHarvested}
          required
        >
          <option value="">Select Yield Grade</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="average">Average</option>
          <option value="poor">Poor</option>
        </select>

        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          disabled={!isHarvested}
          required
        >
          <option value="">Select Unit</option>
          <option value="kg">Kg</option>
          <option value="tons">Tons</option>
        </select>

        <select
          name="satisfaction"
          value={formData.satisfaction}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          disabled={!isHarvested}
          required
        >
          <option value="">Satisfaction (1–5)</option>
          {[1, 2, 3, 4, 5].map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>

        <textarea
          name="yieldNotes"
          placeholder="Yield Notes"
          value={formData.yieldNotes}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          disabled={!isHarvested}
        />

        <textarea
          name="revenueNotes"
          placeholder="Revenue Notes"
          value={formData.revenueNotes}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          disabled={!isHarvested}
        />

        <button
          type="submit"
          disabled={!isHarvested}
          className={`p-3 text-white rounded ${
            isHarvested
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isEditMode ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
};

export default ResultSummary;
