import { NextRequest } from "next/server";
import { getUserAuth } from "@/lib/auth/utils";
import { nylas, nylasConfig } from "@/lib/nylas/nylas";
import { db } from "@/lib/db/index";
import { redirect } from "next/navigation";


export async function GET(req: NextRequest) {
  const session = await getUserAuth();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("No code provided", { status: 400 });
  }

  try {
    const response = await nylas.auth.exchangeCodeForToken({
      clientId: nylasConfig.clientId!,
      redirectUri: nylasConfig.redirectUri,
      code,
    });

    const { grantId, email } = response;

    await db.user.update({
      where: {
        id: session.session?.user?.id,
      },
      data: {
        //@ts-expect-error : db prisma err
        grantId: grantId,
        grantEmail: email,
      },
    })
  } catch (error) {
    console.log(error);
  }
  // TO DO: redirect to stripe payment
  redirect("/dashboard");
}