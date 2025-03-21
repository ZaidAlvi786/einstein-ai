// src/App.js
"use client"

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
function UpgradePaymentModal({ auth, status, setIsUpgradePaymentModalOpen }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (status) {
      setIsModalOpen(status);
    }
  }, [status]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleUpgragePayment = () => {
    if (auth.user && auth.user.email) {
      axios
        .post("/api/stripe", {
          email: auth.user.email,
          plan: auth.user.plan,
        })
        .then((res) => {
          window.location.href = res.data.url;
        })
        .catch((err) => {
          console.log(err);
        toast.error((err?.message ??  err?.data?.message) || "Something went wrong!")

        });
    } else {
      router.push("/register");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="absolute inset-0 bg-[#090909] opacity-1"></div>
        <div
          // ref={modalRef}
          className="shadow-lg z-20 text-center max-w-[500px]"
        >
          <div className="bg-[#23262b] py-[20px] px-[32px] rounded-[10px] shadow-lg">
            <h4 className="text-left text-[20px] text-[#fff] font-normal leading-normal font-helvetica mt-[8px] mb-[30px]">
              Upgrade plan
            </h4>

            <h3 className=" text-[36px] text-[#fff] font-normal leading-normal font-helvetica mb-[12px]">
              $25 per month.
            </h3>

            <h3 className="text-[36px] text-[#fff] font-normal leading-normal font-helvetica mb-[20px]">
              Every Top Al Model.
            </h3>

            <button
              className="bg-[#0a84ff] min-w-[290px] h-[52px] rounded-[50px] text-[18px] tracking-wider text-[#fff] font-bold leading-normal font-helvetica mb-[22px] mt-[22px]"
              onClick={handleUpgragePayment}
            >
              Upgrade account
            </button>

            <p className="text-[12px] text-[#fff] font-normal leading-normal font-helvetica mb-[0px] opacity-50">
              *If usage goes over, you will begin paying on a usage basis.
              (Don't worry, you will be alerted when you are getting close to
              this.)
            </p>
          </div>
          <button
            className="bg-none absolute right-[25px] top-[25px]"
            onClick={() => setIsUpgradePaymentModalOpen(false)}
          >
            <Image alt="close icon" width={20} height={20} src={"/svg/close.svg"} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpgradePaymentModal;
