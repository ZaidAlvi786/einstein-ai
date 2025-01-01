// src/App.js

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";

function PaymentModal({ auth, status, setIsPaymentModalOpen }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

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

  useEffect(() => {
    if (status) {
      setIsModalOpen(status);
    }
  }, [status]);

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
          ref={modalRef}
          className="shadow-lg z-20 text-center max-w-[500px]"
        >
          <div className="bg-[#23262b] py-[20px] px-[32px] rounded-[10px] shadow-lg">
            <h3 className="text-left text-[36px] text-[#fff] font-normal leading-normal font-helvetica mt-[14px] mb-[40px]">
              You're Loving Einstein!
            </h3>
            <p className="text-left text-[16px] text-[#fff] font-normal leading-normal font-helvetica mb-[20px]">
              You used all your credits. If you keep using Einstein $5 of
              credits will be added to your account. You can cancel anytime. If
              you don't use these extra credits this month they will be rolled
              into next month!
            </p>
            <button
              onClick={handleUpgragePayment}
              className="bg-[#0a84ff] min-w-[290px] h-[52px] rounded-[50px] text-[16px] text-[#fff] font-bold leading-normal font-helvetica mb-[22px] mt-[22px]"
            >
              Continue
            </button>
            <p className="text-[12px] text-[#fff] font-normal leading-normal font-helvetica mb-[0px] opacity-50">
              *If usage goes over, you will be notified again.
            </p>
          </div>
          <button
            className="bg-none absolute right-[25px] top-[25px]"
            onClick={() => setIsPaymentModalOpen(false)}
          >
            <Image alt="close icon" width={20} height={20} src={"/svg/close.svg"} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;