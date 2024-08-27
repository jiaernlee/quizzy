"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChooseRole() {
  const [initialChoice, setInitialChoice] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [organizations, setOrganizations] = useState<
    { id: string; name: string }[]
  >([]);
  const [regOrg, setRegOrg] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });
  const [showOrgForm, setShowOrgForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const res = await fetch("/api/get-organizations");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setOrganizations(data);
      } catch (e) {
        console.error(e);
      }
    }

    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (role === "student") {
      setShowOrgForm(false);
    }
  }, [role]);

  const handleInitialChoice = (choice: string) => {
    if (choice === "no") {
      setRole("normal");
    }
    setInitialChoice(choice);
  };

  const handleRoleSelection = async () => {
    if (!role) return;

    try {
      let orgId: string | null = null;

      if (role === "organization" && showOrgForm) {
        const orgRes = await fetch("/api/save-organization", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(regOrg),
        });

        if (!orgRes.ok) {
          throw new Error("Failed to save organization");
        }

        const orgData = await orgRes.json();
        orgId = orgData.id;
      } else if (role === "student" || role === "organization") {
        orgId = organization;
      }

      const rolePayload =
        role === "normal" ? { role } : { role, organizationId: orgId };

      const res = await fetch("/api/save-user-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rolePayload),
      });

      if (res.ok) {
        setTimeout(() => router.push("/dashboard"), 300);
      } else {
        console.error("Failed to save role", res);
        alert("Failed to save your role. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto flex h-[90vh] items-center justify-center">
      {!initialChoice && (
        <div className="card p-4 mb-4">
          <h1 className="text-2xl font-bold mb-4">
            Are you under an organization?
          </h1>
          <button
            onClick={() => handleInitialChoice("yes")}
            className="me-3 bg-green-500 text-white px-3 py-1"
          >
            Yes
          </button>
          <button
            onClick={() => handleInitialChoice("no")}
            className="bg-red-500 text-white px-3 py-1"
          >
            No
          </button>
        </div>
      )}

      {initialChoice === "yes" && (
        <div className="card p-4 mb-4 relative">
          <h1 className="text-2xl font-bold mb-4">Select Your Role</h1>
          <select
            onChange={(e) => setRole(e.target.value)}
            value={role}
            className="text-black w-full p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="organization">Organization</option>
            <option value="student">Student</option>
          </select>

          {role === "student" || (role === "organization" && !showOrgForm) ? (
            <div className="mt-4">
              <label className="block text-lg mb-2 dark:text-white">
                Choose Your Organization
              </label>
              <select
                onChange={(e) => setOrganization(e.target.value)}
                value={organization}
                className="w-full p-2 border text-black border-gray-300 rounded"
              >
                <option value="">Select</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id} className="text-black">
                    {org.name}
                  </option>
                ))}
              </select>
              {role === "organization" && (
                <button
                  onClick={() => setShowOrgForm(true)}
                  className="dark:text-white text-sm mt-2"
                >
                  Register one
                </button>
              )}
            </div>
          ) : null}

          {role === "organization" && showOrgForm && (
            <div className="mt-4">
              <label>Org Name:</label>
              <input
                type="text"
                className="w-full p-1 border text-black border-gray-300 rounded"
                name="name"
                onChange={(e) =>
                  setRegOrg((prev) => ({ ...prev, name: e.target.value }))
                }
                value={regOrg.name}
              />
              <br />
              <label>Description:</label>
              <input
                type="text"
                className="w-full p-1 border text-black border-gray-300 rounded"
                name="description"
                onChange={(e) =>
                  setRegOrg((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                value={regOrg.description}
              />
            </div>
          )}

          <button
            onClick={() => {
              setInitialChoice(null);
              setShowOrgForm(false);
            }}
            className="text-black dark:text-white absolute bottom-2 left-2 text-xl"
          >
            ⬅
          </button>
          <button
            onClick={handleRoleSelection}
            className="mt-4 bg-[#02a9ea] px-3 py-1"
          >
            Submit
          </button>
        </div>
      )}

      {initialChoice === "no" && role === "normal" && (
        <div className="card mb-4 grid justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">Thank you!</h1>
          <button
            onClick={handleRoleSelection}
            className="mt-4 bg-[#02a9ea] px-3 py-1"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
