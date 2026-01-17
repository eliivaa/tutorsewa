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
  const secret = process.env.ESEWA_SECRET_KEY!;
  const data = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);

  return hmac.digest("base64");
}
