"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TourPackageForm } from "./TourPackageForm";
import { ArrowLeft, Loader2 } from "lucide-react";

type TourPackageRow = {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  shortDescriptionEn: string | null;
  shortDescriptionAr: string | null;
  packageType: string;
  durationDays: number;
  price: { toString: () => string } | number;
  currency: string;
  inclusionsEn: string[];
  inclusionsAr: string[];
  exclusionsEn: string[];
  exclusionsAr: string[];
  itinerary: unknown;
  imageUrl: string | null;
  gallery: string[];
  isFeatured: boolean;
  isActive: boolean;
};

export function TourPackageFormPage({
  mode,
  packageId,
}: {
  mode: "create" | "edit";
  packageId?: string;
}) {
  const router = useRouter();
  const [pkg, setPkg] = useState<TourPackageRow | null | undefined>(undefined);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode === "edit" && packageId) {
      setLoading(true);
      fetch(`/api/admin/packages/${packageId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          setPkg(data);
        })
        .catch(() => setPkg(null))
        .finally(() => setLoading(false));
    } else {
      setPkg(null);
    }
  }, [mode, packageId]);

  function handleSuccess() {
    router.push("/admin/packages");
    router.refresh();
  }

  function handleCancel() {
    router.back();
  }

  if (mode === "edit" && loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (mode === "edit" && !loading && !pkg) {
    return (
      <div className="space-y-6">
        <Link href="/admin/packages">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to packages
          </Button>
        </Link>
        <p className="text-muted-foreground">Package not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/packages">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to packages
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">
          {mode === "create" ? "Create package" : "Edit package"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {mode === "create"
            ? "Fill in the details for your new tour package."
            : "Update the package details below."}
        </p>
      </div>

      <div className="rounded-lg border bg-background p-6">
        <TourPackageForm
          pkg={mode === "edit" ? (pkg ?? null) : null}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
