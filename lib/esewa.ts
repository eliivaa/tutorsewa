import crypto from "crypto";

export function generateEsewaSignature({
  total_amount,
  transaction_uuid,
  product_code,
}: {
  total_amount: number | string;
  transaction_uuid: string;
  product_code: string;
}) {
  const message = `total_amount=${String(total_amount)},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  console.log("SIGN MESSAGE:", message);

  return crypto
    .createHmac("sha256", process.env.ESEWA_SECRET_KEY!.trim())
    .update(message)
    .digest("base64");
}