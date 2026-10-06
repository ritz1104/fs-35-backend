import { useState } from "react";
import { Crown } from "lucide-react";
import {
  createNitroOrder,
  verifyNitroPayment,
} from "../../services/payment.service";


function NitroButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");


  const handlePayment = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      if (!window.Razorpay) {
        throw new Error("Razorpay checkout is unavailable");
      }

      const response = await createNitroOrder();
      const order = response.data;

      const option = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Vynq",
        description: "Vynq Nitro - 30 Days",
        order_id: order.orderId,
        handler: async (paymentResponse) => {
          try {
            await verifyNitroPayment(paymentResponse);
            setMessage("Nitro activated for 30 days.");
          } catch (error) {
            setMessage(
              error.response?.data?.message || "Unable to verify payment."
            );
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
      }

      const razorpay = new window.Razorpay(option);
      razorpay.on("payment.failed", () => {
        setMessage("Payment was not completed. Please try again.");
        setIsLoading(false);
      });
      razorpay.open();
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || "Unable to start payment."
      );
      setIsLoading(false);
    }
  };


  return (
    <>
      <button
        className="channel-item nitro-button"
        type="button"
        onClick={handlePayment}
        disabled={isLoading}
      >
        <Crown size={16} />
        <span>{isLoading ? "Opening checkout..." : "Get Nitro"}</span>
      </button>
      {message && <small className="payment-message">{message}</small>}
    </>
  );
}

export default NitroButton;
