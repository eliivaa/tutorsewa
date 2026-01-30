// import crypto from "crypto";

// export function generateEsewaSignature({
//   amount,
//   total_amount,
//   transaction_uuid,
//   product_code,
// }: {
//   amount: number;
//   total_amount: number;
//   transaction_uuid: string;
//   product_code: string;
// }) {
//   const message = `amount=${amount},total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

//   return crypto
//     .createHmac("sha256", process.env.ESEWA_SECRET_KEY!)
//     .update(message)
//     .digest("base64");
// }


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
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  return crypto
    .createHmac("sha256", process.env.ESEWA_SECRET_KEY!)
    .update(message)
    .digest("base64");
}
