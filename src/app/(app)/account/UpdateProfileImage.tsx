import { AccountCard, AccountCardFooter, AccountCardBody } from "./AccountCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing/uploadthing";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

function isValidURL(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    console.error(e);
    return false;
  }
}

export default function UpdateProfileImage({ image }: { image: string }) {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string>(image ?? "");

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const form = new FormData(target);
    const { image } = Object.fromEntries(form.entries()) as { image: string };
    if (!isValidURL(image)) {
      toast.error("URL is not valid, please try and upload again.");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/account", {
        method: "PUT",
        body: JSON.stringify({ image }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200)
        toast.success("Successfully updated profile image!");
      router.refresh();
    });
  };

  const handleDeleteImage = () => {
    setProfileImage("");
  };

  return (
    <AccountCard
      params={{
        header: "Your Profile Image",
        description:
          "Please enter the image you want to use with your account.",
      }}
    >
      <form onSubmit={handleSubmit}>
        <AccountCardBody>
          <Input defaultValue={profileImage ?? ""} name="image" type="hidden" />
          {profileImage ? (
            <div className="ml-2 relative size-16">
              <Image
                src={profileImage}
                alt="Flash Image"
                className="size-16 rounded-lg"
                width={64}
                height={64}
              />
              <Button
                onClick={handleDeleteImage}
                variant="destructive"
                size="icon"
                type="button"
                className="absolute -top-3 -right-3 size-6"
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setProfileImage(res[0].url);
                toast.success("Image uploaded successfully");
              }}
              onUploadError={(err) => {
                console.log(err);
                toast.error("Something went wrong");
              }}
              appearance={{
                button:
                  "bg-primary text-sm font-medium !text-primary-foreground hover:bg-primary/90 hover:!text-primary-foreground",
              }}
            />
          )}
        </AccountCardBody>
        <AccountCardFooter description="Confirm your new profile image">
          <Button>Update Image</Button>
        </AccountCardFooter>
      </form>
    </AccountCard>
  );
}
