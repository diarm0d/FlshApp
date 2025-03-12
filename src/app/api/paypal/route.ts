import { NextApiRequest, NextApiResponse } from "next";
import {
  Client,
  Environment,
  LogLevel,
  OrdersController,
  CheckoutPaymentIntent,
} from "@paypal/paypal-server-sdk";

// PayPal Client Configuration
const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  timeout: 300,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: {
      logBody: true,
    },
    logResponse: {
      logHeaders: true,
    },
  },
});

const ordersController = new OrdersController(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { amount } = req.body;

    try {
      const collect = {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: "EUR", // Use 'currencyCode' instead of 'currency_code'
              value: amount.toString(),
            },
          },
        ],
      };

      const { result } = await ordersController.ordersCreate({ body: collect });

      console.log("PayPal Order Created:", result);
      res.json({ orderID: result.id });
    } catch (error: any) {
      console.error("PayPal API Error:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
