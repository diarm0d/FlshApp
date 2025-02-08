import { getFlashById } from "@/lib/api/flashes/queries";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function FlashPage({
  params,
}: {
  params: Promise<{ slug: string; flashId: string }>;
}) {
  const { slug, flashId } = await params;
  const { flash } = await getFlashById(flashId);
  if (flash === null) notFound();

  return (
    <main>
      <div className="max-w-lg sm:max-w-xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="w-lg sm:mw-xl">
            <Image
              alt={flash.title}
              className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
              height={300}
              src={flash.flashImage}
              width={300}
            />
          </div>
        </div>
        <div className="space-y-6 mt-4">
          <div>
            <h1 className="text-3xl font-bold">{flash.title}</h1>
            <p className="text-gray-500 dark:text-gray-400">
              {flash.description}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Artist Information</h2>
            <div className="flex items-center gap-4">
              <Image
                alt="Artist"
                className="rounded-full"
                height={48}
                src={flash.user.image}
                style={{
                  aspectRatio: "48/48",
                  objectFit: "cover",
                }}
                width={48}
              />
              <div>
                <p className="font-medium">{flash.profile.name}</p>
                <p className="text-gray-500 dark:text-gray-400">
                  {flash.profile.description}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-col-1 gap-4">
            <Link href={`${slug}/checkout`}>
              <Button className="w-full" size="lg">
                Book Appointment
              </Button>
            </Link>
            <Button className="w-full bg-secondary" size="lg" variant="outline">
              Request Similar Design
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
