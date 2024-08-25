import React, { useState, useEffect } from "react";
import { Organization } from "../OrganizationDashboard";
import { AiFillCloseCircle } from "react-icons/ai";

interface EditOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization?: Organization; // Make organization optional
  onSave: (name: string, description: string) => void;
}

const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({
  isOpen,
  onClose,
  organization,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (organization) {
      setName(organization.name);
      setDescription(organization.description);
    }
  }, [organization]);

  const handleSave = () => {
    onSave(name, description);
  };

  if (!isOpen || !organization) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-black">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Organization</h2>
          <button className="text-[#F44336] text-3xl" onClick={onClose}>
            <AiFillCloseCircle />
          </button>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Organization Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
          />
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded me-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrganizationModal;
