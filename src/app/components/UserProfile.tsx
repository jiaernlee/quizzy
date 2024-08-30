"use client";

import React from "react";
import { useState, useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
import { DotLoader } from "react-spinners";
import Image from "next/image";
import SignOutBtn from "../components/SignOutBtn";
import { handleSignOut } from "../actions/serverAction";

interface User {
  name: string;
  email: string;
  role: string;
  image: string;
}

const UserProfile = () => {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId") ?? null;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [details, setDetails] = useState<{
    name: string;
    image: string;
  }>({
    name: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [originalImage, setOriginalImage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const res = await fetch(`/api/profile?userId=${userId}`);
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            setDetails({
              name: data.name,
              image: data.image,
            });
            setOriginalImage(data.image);
          } else {
            console.error("Failed to fetch quiz set");
          }
        } catch (e) {
          Swal.fire({
            title: "Try again later!",
            text: "Trouble getting user data X(",
            timer: 5000,
            icon: "error",
          });
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleErrorRedirect = () => {
    redirect("/dashboard");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setEditing(true);
    }
  };

  const saveEditHandler = async () => {
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          alert("Upload ok: " + result.image);
          const imagePath = `/uploads/${result.image}`;
          const updatedDetails = { ...details, image: imagePath };
          setDetails(updatedDetails);

          try {
            const res = await fetch(`/api/profile?userId=${userId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: updatedDetails.name,
                image: updatedDetails.image,
              }),
            });
            const data = await res.json();
            if (data) {
              setDetails({
                name: data.name,
                image: data.image,
              });
            } else {
              console.error("Failed to update profile");
            }
          } catch (e) {
            Swal.fire({
              title: "Try again later!",
              text: "Trouble updating user data X(",
              timer: 5000,
              icon: "error",
            });
            console.error(e);
          } finally {
            setLoading(false);
          }
        } else {
          alert("Upload failed");
        }
      } else {
        try {
          const res = await fetch(`/api/profile?userId=${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: details.name,
            }),
          });
          const data = await res.json();
          if (data) {
            setDetails({
              name: data.name,
              image: details.image,
            });
          } else {
            console.error("Failed to update profile");
          }
        } catch (e) {
          Swal.fire({
            title: "Try again later!",
            text: "Trouble updating user data X(",
            timer: 5000,
            icon: "error",
          });
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setEditing(false);
  };

  const deleteAccountHandler = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        let deletionSuccessful = false;

        try {
          const res = await fetch(`/api/profile?userId=${userId}`, {
            method: "DELETE",
          });

          if (res.ok) {
            const data = await res.json();
            deletionSuccessful = true;
            Swal.fire({
              title: "Deleted!",
              text: "Your account has been deleted.",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "Failed to delete user account",
              timer: 5000,
              icon: "error",
            });

            await handleSignOut();
            redirect("/");
          }
        } catch (e) {
          Swal.fire({
            title: "Try again later!",
            text: "Trouble deleting your account X(",
            timer: 5000,
            icon: "error",
          });
          console.error(e);
        } finally {
          setLoading(false);

          if (deletionSuccessful) {
            await handleSignOut();
            redirect("/");
          }
        }
      }
    });
  };

  const handleCancel = () => {
    setPreview("");
    setImageFile(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[90vh]">
        <DotLoader color="#ff01fb" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-[90vh]">
        <AiOutlineClose className="text-red-500 text-6xl mb-4" />
        <h2 className="dark:text-white text-black text-2xl mb-3">
          Looks like there is a mistake ☹️
        </h2>
        <button
          onClick={handleErrorRedirect}
          className="border border-[#faff00] hover:dark:bg-[#ffd900] bg-[#faff00] dark:bg-transparent px-4 py-2 rounded transition duration-500 hover:scale-105"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[90vh]">
      <div className="max-w-sm p-6 border-[#02a9ea] border bg-[#02a9ea] dark:bg-black rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center mb-4">
          <div
            className="relative w-24 h-24"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={preview || originalImage}
              alt="User Avatar"
              className={`w-full h-full rounded-full border border-[#fffeff] ${
                isHovered ? "opacity-85" : ""
              }`}
              width={100}
              height={100}
            />
            {isHovered && (
              <div className="absolute top-10 flex items-center justify-center gap-1">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full h-full cursor-pointer"
                  onChange={handleImageChange}
                />
                {(preview || originalImage) && (
                  <button
                    type="button"
                    className=" text-xs text-white bg-red-500 p-1 rounded-full hover:bg-red-600"
                    onClick={handleCancel}
                  >
                    <AiOutlineClose />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#fffeff] mb-2 md:flex gap-2 items-center">
            Name:{" "}
            <span className="text-sm font-normal items-center">
              <input
                name="name"
                value={details?.name}
                onChange={(e) => {
                  setDetails({ ...details, [e.target.name]: e.target.value });
                  setEditing(true);
                }}
                className="text-black rounded-lg p-1"
              />
            </span>
          </h2>
          <p className="text-[#fffeff] mb-2">
            <span className="font-bold">Email:</span> {user.email}
          </p>
          <p className="text-[#fffeff] ">
            <span className="font-bold">Role:</span> {user.role}
          </p>
        </div>
        <div className="mt-6 space-y-3 text-center text-white ">
          <button
            disabled={editing === false}
            className={`w-full  font-semibold py-2 px-4 rounded transition duration-300  ${
              editing === false
                ? "bg-gray-500"
                : "border border-[#faff00] hover:dark:bg-[#ffd900] bg-[#faff00] dark:bg-transparent hover:scale-105"
            }`}
            onClick={saveEditHandler}
          >
            Save
          </button>
          <SignOutBtn />
          <button
            className="w-full border border-red-500 hover:dark:bg-red-600 dark:bg-black bg-red-600 font-semibold py-2 px-4 rounded transition duration-300 hover:scale-105"
            onClick={deleteAccountHandler}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
