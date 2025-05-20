import axios from "axios";

async function init() {
  const response = await axios.post(
    "https://api.mercadopago.com/v1/payments",
    {
      transaction_amount: 17,
      description: "Pagamento almoço, marmita grande",
      payment_method_id: "pix",
      payer: {
        email: "kaebenning@hotmail.com",
        first_name: "Kaê",
        last_name: "Leal",
      },
    },
    {
      headers: {
        "X-Idempotency-Key": "0d5020ed-1af6-469c-ae06-c3bec19954bb",

        "Content-Type": "application/json",
        Authorization: `Bearer TEST-4535814799070057-051813-5000e26041c62e383683ae8e48234cee-22025781`,
      },
    }
  );
  console.log("🚀 ~ init ~ response:", response);
}

init();
