import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
export const createOrder = async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Verify Payment Signature
export const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  console.log("Received Payment Details:", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex")
    .trim();
  const razorpaySignatureTrimmed = razorpay_signature.trim();
  console.log("Expected Signature:", expectedSignature);

  if (expectedSignature === razorpaySignatureTrimmed) {
    console.log("Signature Matched");
    res.json({ message: "Payment verified successfully" });
  } else {
    console.error("Signature Mismatch", {
      expected: expectedSignature,
      received: razorpay_signature,
    });
    res.status(400).json({ message: "Invalid payment signature" });
  }
};
