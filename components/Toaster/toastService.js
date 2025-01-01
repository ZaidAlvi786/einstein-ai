"use client";
import React, { useEffect } from "react";
import toast, { Toaster, useToasterStore } from "react-hot-toast";


export default function ToastService() {

    const { toasts } = useToasterStore();
    const TOAST_LIMIT = 1;

    // Enforce Limit
    useEffect(() => {
        toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
            .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) removal without animation
    }, [toasts]);

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={true}
                toastOptions={{ style: { background: '#333', color: '#fff' } }}
            />
        </>
    );
}