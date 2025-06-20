import React, { useEffect, useState } from "react";
import axios from "axios";

const LandRecord = ({ cropFarmId }) => {
  const [formData, setFormData] = useState({
    area: "",
    location: "",
    soilType: "",
    landType: "",
    landSuitability: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    const fetchLandRecord = async () => {
      try {
        const res = await axios.get(
          `https://cc-crop-backend-gvcthhdydfhjhgb2.eastasia-01.azurewebsites.net/land-records/${cropFarmId}`,
          {}
        );
        if (res.data && res.data.length > 0) {
          const existingRecord = res.data[0];
          setFormData({
            area: existingRecord.area || "",
            location: existingRecord.location || "",
            soilType: existingRecord.soilType || "",
            landType: existingRecord.landType || "",
            landSuitability: existingRecord.landSuitability || "",
            notes: existingRecord.notes || "",
          });
          setIsEditMode(true);
          setRecordId(existingRecord._id);
        }
      } catch (error) {
        console.error("Error fetching land record:", error);
      }
    };

    fetchLandRecord();
  }, [cropFarmId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.area || isNaN(formData.area))
      newErrors.area = "Valid area is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.soilType.trim()) newErrors.soilType = "Soil type is required";
    if (!formData.landType.trim()) newErrors.landType = "Land type is required";

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

      if (isEditMode && recordId) {
        await axios.put(
          `https://cc-crop-backend-gvcthhdydfhjhgb2.eastasia-01.azurewebsites.net/land-records/${recordId}`,
          { ...formData },
          {
          }
        );
        setSuccessMsg("Land Record Updated Successfully!");
      } else {
        await axios.post(
          "https://cc-crop-backend-gvcthhdydfhjhgb2.eastasia-01.azurewebsites.net/land-records",
          { ...formData, cropFarmId },
          {
          }
        );
        setSuccessMsg("Land Record Saved Successfully!");
      }

      setErrors({});
    } catch (err) {
      console.error(err);
      setSuccessMsg("");
      setErrors({ general: "Error saving land record. Please try again." });
      setTimeout(() => setErrors({ general: "" }), 2000); // optional: clears after 2s
    }
  };

  return (
    <div className="w-4/5 mx-auto my-5 p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-md flex flex-col gap-4">
      <h2 className="text-center text-2xl text-green-700">
        {isEditMode ? "Edit Land Record" : "Add Land Record"}
      </h2>
      {successMsg && <p className="text-green-600 text-center">{successMsg}</p>}
      {errors.general && (
        <p className="text-red-600 text-center font-medium text-sm">
          {errors.general}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Area */}
        <div>
          <input
            type="number"
            name="area"
            placeholder="Area (Acres/Kanals)"
            value={formData.area}
            onChange={handleChange}
            className="w-full p-2 text-lg border border-gray-300 rounded-md"
            required
          />
          {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
        </div>

        {/* Location */}
        <div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 text-lg border border-gray-300 rounded-md"
            required
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>

        {/* Soil Type */}
        <div>
          <input
            type="text"
            name="soilType"
            placeholder="Soil Type (e.g., Sandy, Clay)"
            value={formData.soilType}
            onChange={handleChange}
            className="w-full p-2 text-lg border border-gray-300 rounded-md"
            required
          />
          {errors.soilType && (
            <p className="text-red-500 text-sm">{errors.soilType}</p>
          )}
        </div>

        {/* Land Type */}
        <div>
          <select
            name="landType"
            value={formData.landType}
            onChange={handleChange}
            className="w-full p-2 text-lg border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Land Type</option>
            <option value="irrigated">Irrigated</option>
            <option value="rainfed">Rainfed</option>
          </select>
          {errors.landType && (
            <p className="text-red-500 text-sm">{errors.landType}</p>
          )}
        </div>

        {/* Land Suitability */}
        <textarea
          name="landSuitability"
          placeholder="Land Suitability (e.g., Suitable for wheat)"
          value={formData.landSuitability}
          onChange={handleChange}
          className="w-full p-2 text-lg border border-gray-300 rounded-md h-20"
        />

        {/* Notes */}
        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 text-lg border border-gray-300 rounded-md h-20"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="p-3 text-lg text-white bg-green-500 rounded-md hover:bg-green-600 transition"
        >
          {isEditMode ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
};

export default LandRecord;
