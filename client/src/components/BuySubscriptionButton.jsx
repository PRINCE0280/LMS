import React, { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  useCreateSubscriptionOrderMutation,
  useVerifySubscriptionPaymentMutation,
} from "@/features/api/subscriptionApi";

const BuySubscriptionButton = ({ subscriptionType, amount, title }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [createSubscriptionOrder] = useCreateSubscriptionOrderMutation();
  const [verifySubscriptionPayment] = useVerifySubscriptionPaymentMutation();

  const handlePurchase = async () => {
    try {
      setIsProcessing(true);

      // Create subscription order
      const orderResponse = await createSubscriptionOrder({
        subscriptionType,
        amount,
      }).unwrap();

      if (!orderResponse.success) {
        toast.error("Failed to create subscription order");
        setIsProcessing(false);
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
          description: title || "Subscription Purchase",
          order_id: orderResponse.order.id,
          handler: async function (response) {
            try {
              // Verify payment on backend
              const verifyResponse = await verifySubscriptionPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                subscriptionId: orderResponse.subscriptionId,
              }).unwrap();

              if (verifyResponse.success) {
                toast.success("Subscription activated successfully!");
                // Redirect based on subscription type
                if (subscriptionType === 'generative-ai') {
                  window.location.href = "/generate-ai";
                } else if (subscriptionType === 'it-certifications') {
                  window.location.href = "/it-certifications";
                } else if (subscriptionType === 'data-science') {
                  window.location.href = "/data-science";
                } else {
                  window.location.href = "/my-learning";
                }
              } else {
                toast.error("Payment verification failed");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error(
                error?.data?.message || "Payment verification failed"
              );
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
      onClick={handlePurchase}
      disabled={isProcessing}
      className="w-full"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Subscribe Now"
      )}
    </Button>
  );
};

export default BuySubscriptionButton;
