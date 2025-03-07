import { getFlashById } from "@/lib/api/flashes/queries";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import ShareButton from "@/components/profiles/ShareButton";

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
        <div className="mb-6">
          <div className="relative w-full aspect-auto bg-white rounded-lg overflow-hidden flex items-center justify-center">
            <div className="relative w-full h-[280px] sm:h-[400px] max-h-[70vh]">
              <Image
                alt={flash.title}
                className="object-contain"
                src={flash.flashImage || "/placeholder.svg"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 640px, 800px"
                priority
              />
            </div>
          </div>
        </div>
        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{flash.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {flash.description}
              </p>
            </div>
            <ShareButton />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Artist Information</h2>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  alt={flash.user.name || "artist profile"}
                  src={flash.user.image ?? undefined}
                />
                <AvatarFallback>
                  {flash.user.name || "artist profile"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{flash.profile.name}</p>
                <p className="text-gray-500 dark:text-gray-400">
                  {flash.profile.description}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-col-1 gap-4">
            <Link href={`${flashId}/booking`}>
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
