import SignIn from "@/components/auth/SignIn";
import { getUserAuth } from "@/lib/auth/utils";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { WeeklyCalendar } from "@/components/dashboard/WeeklyDashboard";

import {
  getBookingsThisMonth,
  getLatestBookings,
} from "@/lib/api/bookings/queries";
import { getProfileById } from "@/lib/api/profiles/queries";


const data = [
  { name: "Jan", total: 6000 },
  { name: "Feb", total: 4000 },
  { name: "Mar", total: 2000 },
  { name: "Apr", total: 2000 },
  { name: "May", total: 1000 },
  { name: "Jun", total: 1500 },
  { name: "Jul", total: 4500 },
  { name: "Aug", total: 1700 },
  { name: "Sep", total: 2700 },
  { name: "Oct", total: 1800 },
  { name: "Nov", total: 4500 },
  { name: "Dec", total: 4800 },
];

const recentSales = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+€50.00",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+€50.00",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+€50.00",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    amount: "+€50.00",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+€50.00",
  },
];

export default async function Home() {
  const { session } = await getUserAuth();
  if (!session) return <SignIn />;
  const profileId = session.user.profiles?.[0]?.id || ''


  const { profile } = await getProfileById(profileId);
  const { bookings } = await getBookingsThisMonth();
  const { bookings: recentBookings } = await getLatestBookings();

  const depositAmt = profile?.depositAmount ?? 50;

  return (
    <main className="space-y-4">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Bookings</CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bookings.length}</div>
              {/* <p className="text-xs text-muted-foreground">
                +12% from last month
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Deposits</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                +€{bookings.length * depositAmt}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                +12% from last month
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                Estimated Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ≃€{bookings.length * 300}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                +12% from last month
              </p> */}
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                Page Views
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+17500</div>
              <p className="text-xs text-muted-foreground">
                +30.1% from last month
              </p>
            </CardContent>
          </Card> */}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {/* <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Bar dataKey="total" fill="#000000" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer> */}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <p className="text-sm text-muted-foreground">
                You made {bookings.length} bookings this month.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {recentBookings.map((sale, index) => (
                  <div key={index} className="flex items-center">
                    {/* <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={sale.flash.flashImage}
                        alt={sale.name}
                      />
                      <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
                    </Avatar> */}
                    <div className="relative h-9 w-9 rounded-md overflow-hidden">
                      <Image
                        src={sale.flash.flashImage}
                        alt={sale.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {sale.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sale.email}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+€{depositAmt}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {session ? (
        <pre className="bg-secondary p-4 rounded-sm shadow-sm text-secondary-foreground break-all whitespace-break-spaces">
          {JSON.stringify(session, null, 2)}
        </pre>
      ) : null}
      <SignIn />
    </main>
  );
}
