/**
 * v0 by Vercel.
 * @see https://v0.dev/t/PmwTvNfrVgf
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from "next/image";
import Link from "next/link";
import ClaimProfileButton from "../components/signup/ClaimProfileButton";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F2EE] dark:bg-inherit">
      <header className="container px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <CalendarHeartIcon className="h-6 w-6" />
          <span className="sr-only">Flsh App</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/sign-in"
          >
            Sign In
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full h-[90vh] md:h-screen py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-[1fr_400px] gap-12 xl:grid-cols-[1fr_600px]">
              {/* <div className="bg-neutral-100 dark:bg-neutral-800 mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square" /> */}
              <div className="order-2 md:order-1 flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Tattooing made easy <br />
                    with your online flashbook
                  </h1>
                  <p className="max-w-[600px] text-neutral-500 md:text-xl dark:text-neutral-400">
                    Ditch the admin and get back to creating. Your Flsh App
                    profile lets you manage bookings, deposits, and available
                    flashes all in one place.
                  </p>
                </div>
                <ClaimProfileButton />
                {/* <div className="flex flex-col gap-2 min-[400px]:flex-row"> */}
                {/* <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-8 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 dark:focus-visible:ring-neutral-300"
                    href="#"
                  >
                    Get Started
                  </Link>
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:focus-visible:ring-neutral-300"
                    href="#"
                  >
                    Contact Sales
                  </Link> */}
                {/* </div> */}
              </div>
              <div className="order-1 md:order-2 relative aspect-video w-full h-max">
                <div className="absolute top-0 -left-2 lg:top-0 lg:-left-4 size-40 lg:size-72 bg-[#D22B2B] rounded-full light:mix-blend-multiply filter blur-3xl opacity-90 animate-blob ease-in-out" />
                <div className="absolute top-0 -right-2 lg:top-0 lg:-right-2 size-40 lg:size-72 bg-[#F9A602] rounded-full light:mix-blend-multiply filter blur-3xl opacity-90 animate-blob animation-delay-2 ease-in-out" />
                <div className="absolute  -bottom-10 left-12 lg:-bottom-24 lg:left-32 size-40 lg:size-72 bg-[#00b3ff] rounded-full light:mix-blend-multiply filter blur-3xl opacity-90 animate-blob animation-delay-4 ease-in-out" />
                <Image
                  src="/hero-graphic.png"
                  alt="hero img"
                  fill
                  objectFit="cover"
                  sizes="100vw"
                  style={{ objectPosition: "top" }}
                />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-neutral-100 px-3 py-1 text-sm dark:bg-neutral-800">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  💥 More Bookings, Less Hassle.
                </h2>
                <p className="max-w-[900px] text-neutral-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-neutral-400">
                  Get booked fast without the back-and-forth. Clients can check
                  your availability, pay deposits, and lock in their
                  appointments with ease.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="relative aspect-video w-full h-max">
                <div className="mx-auto z-100 aspect-video overflow-hidden bg-neutral-300 dark:bg-neutral-800 rounded-xl object-cover object-center sm:w-full lg:order-last" />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">🤝 Stay Connected</h3>
                      <p className="text-neutral-500 dark:text-neutral-400">
                        Chat with clients, manage bookings, and keep everything
                        in one place—no more DMs getting lost.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        ⚡ Set It and Forget It
                      </h3>
                      <p className="text-neutral-500 dark:text-neutral-400">
                        Automate your workflow with continuous integration.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        🚀 Take Control of Your Business
                      </h3>
                      <p className="text-neutral-500 dark:text-neutral-400">
                        Run your schedule, manage clients, and keep everything
                        under control
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Sign Up for Updates
                </h2>
                <p className="max-w-[600px] text-neutral-500 md:text-xl dark:text-neutral-400">
                  Stay updated with the latest product news and updates.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2">
                  <ClaimProfileButton />
                  {/* <input
                    className="max-w-lg flex-1 px-4 py-2 border-border border rounded-md "
                    placeholder="Enter your email"
                    type="email"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 dark:focus-visible:ring-neutral-300"
                  >
                    Sign Up
                  </button> */}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          © 2025 Flsh App. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function CalendarHeartIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-calendar-heart"
    >
      <path d="M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z" />
    </svg>
  );
}
