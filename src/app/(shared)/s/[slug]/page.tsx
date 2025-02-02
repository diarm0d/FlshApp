import { getProfileBySlugWithFlashes } from "@/lib/api/profiles/queries";
import { notFound } from "next/navigation";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { Share2Icon } from "lucide-react";
import { Flash } from "@/lib/db/schema/flashes";

export default async function SharedPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { profile, flashes } = await getProfileBySlugWithFlashes(slug);
  if (profile === null) notFound();
  if (profile.public === false) return <main>This page is not public</main>;
  return (
    <main>
      <div className="flex flex-col items-center h-screen">
        <div className="max-w-lg sm:max-w-xl w-full px-4 py-6 rounded-lg shadow-md">
          <div className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full">
            <Share2Icon />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage alt={profile.name} src={profile.image} />
              <AvatarFallback>{profile.name}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {profile.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {profile.description}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 w-full overflow-y-scroll">
              {flashes.map((flash: Flash) => (
                <>
                  <Link href={`/f/${flash.id}`}>
                    <div
                      key={flash.id}
                      className="rounded-lg border text-card-foreground shadow-sm overflow-hidden bg-secondary"
                    >
                      <img
                        alt="Product 1"
                        className="w-full h-48 object-cover"
                        height={400}
                        src={flash.flashImage}
                        style={{
                          aspectRatio: "600/400",
                          objectFit: "cover",
                        }}
                        width={600}
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {flash.title}
                        </h3>
                        <p className="text-gray-200 text-sm">
                          {flash.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
