import { NextResponse } from "next/server";
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
    oAuthClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  timeout: 0,
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

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const collect = {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: "EUR",
            value: amount.toString(),
          },
        },
      ],
    };

    const { result } = await ordersController.ordersCreate({ body: collect });

    console.log("PayPal Order Created:", result);
    return NextResponse.json({ orderID: result.id });
  } catch (error: any) {
    console.error("PayPal API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
