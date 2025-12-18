import React, { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
} from "@/features/api/purchaseApi";

const BuyCourseButton = ({ courseId, courseTitle, coursePrice }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const handlePurchase = async () => {
    try {
      setIsProcessing(true);

      // Create Razorpay order
      const orderResponse = await createRazorpayOrder({ courseId }).unwrap();

      if (!orderResponse.success) {
        toast.error("Failed to create order");
        setIsProcessing(false);
        return;
      }

      // Handle free courses
      if (orderResponse.free) {
        toast.success("Enrolled in free course successfully!");
        window.location.href = `/course-progress/${courseId}`;
        return;
      }

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: orderResponse.keyId,
          amount: orderResponse.order.amount,
          currency: orderResponse.order.currency,
          name: "Learning Management System",
          description: courseTitle || "Course Purchase",
          order_id: orderResponse.order.id,
          handler: async function (response) {
            try {
              // Verify payment on backend
              const verifyResponse = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: courseId,
              }).unwrap();

              if (verifyResponse.success) {
                toast.success("Course purchased successfully!");
                // Redirect to course progress page
                window.location.href = `/course-progress/${courseId}`;
              } else {
                toast.error("Payment verification failed");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error("Payment verification failed");
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: "",
            email: "",
            contact: "",
          },
          theme: {
            color: "#6366f1",
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              toast.info("Payment cancelled");
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };

      script.onerror = () => {
        toast.error("Failed to load payment gateway");
        setIsProcessing(false);
      };
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error(error?.data?.message || "Failed to initiate purchase");
      setIsProcessing(false);
    }
  };

  return (
    <Button
      disabled={isProcessing}
      onClick={handlePurchase}
      className="w-full bg-[#1a1d29] hover:bg-[#2a2d39] text-white font-semibold py-6 text-base"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : coursePrice === 0 || !coursePrice ? (
        "Enroll for Free"
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;