"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Trash2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { MarkdownField } from "./MarkdownField";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Basic info" },
  { id: 2, label: "Descriptions" },
  { id: 3, label: "Inclusions" },
  { id: 4, label: "Exclusions" },
  { id: 5, label: "Itinerary" },
  { id: 6, label: "Media & Status" },
];

function validateStep(step: number, form: typeof defaultValues): string | null {
  switch (step) {
    case 1:
      if (!form.titleEn.trim()) return "Title (English) is required";
      if (!form.titleAr.trim()) return "Title (Arabic) is required";
      const pType = form.packageType === "custom" ? form.packageTypeCustom.trim() : form.packageType;
      if (!pType) return "Package type is required (or enter custom text)";
      if (!form.durationDays || form.durationDays < 1)
        return "Duration must be at least 1 day";
      if (form.price === "" || parseFloat(form.price) < 0)
        return "Valid price is required";
      if (!form.currency) return "Currency is required";
      return null;
    case 2:
      if (!form.shortDescriptionEn.trim())
        return "Short description (EN) is required";
      if (!form.shortDescriptionAr.trim())
        return "Short description (AR) is required";
      if (!form.descriptionEn.trim())
        return "Full description (EN) is required";
      if (!form.descriptionAr.trim())
        return "Full description (AR) is required";
      return null;
    case 3: {
      const incEn = form.inclusionsEn.filter(Boolean);
      const incAr = form.inclusionsAr.filter(Boolean);
      if (!incEn.length) return "At least one inclusion (EN) is required";
      if (!incAr.length) return "At least one inclusion (AR) is required";
      return null;
    }
    case 4: {
      const excEn = form.exclusionsEn.filter(Boolean);
      const excAr = form.exclusionsAr.filter(Boolean);
      if (!excEn.length) return "At least one exclusion (EN) is required";
      if (!excAr.length) return "At least one exclusion (AR) is required";
      return null;
    }
    case 5: {
      const valid = form.itinerary.filter(
        (d) => d.day > 0 && d.titleEn.trim() && d.titleAr.trim(),
      );
      if (!valid.length)
        return "At least one itinerary day with all fields is required";
      return null;
    }
    case 6:
      if (!form.imageUrl.trim()) return "Featured image URL is required";
      if (!form.gallery.filter(Boolean).length)
        return "At least one gallery URL is required";
      return null;
    default:
      return null;
  }
}

function validateEditForm(form: typeof defaultValues): string | null {
  for (let s = 1; s <= 6; s++) {
    const err = validateStep(s, form);
    if (err) return err;
  }
  return null;
}

type TourPackageRow = {
  id: string;
  categoryId?: string | null;
  titleEn: string;
  titleAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  shortDescriptionEn: string | null;
  shortDescriptionAr: string | null;
  locationId?: string | null;
  packageType: string;
  durationDays: number;
  price: { toString: () => string };
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

type ItineraryDay = { day: number; titleEn: string; titleAr: string };

const PACKAGE_TYPE_OPTIONS = ["umrah", "hajj", "combined", "custom"] as const;

const defaultValues = {
  categoryId: "" as string | null,
  titleEn: "",
  titleAr: "",
  descriptionEn: "",
  descriptionAr: "",
  shortDescriptionEn: "",
  shortDescriptionAr: "",
  locationId: "" as string | null,
  packageType: "umrah" as string,
  packageTypeCustom: "",
  durationDays: 7,
  price: "",
  currency: "SAR",
  inclusionsEn: [""],
  inclusionsAr: [""],
  exclusionsEn: [""],
  exclusionsAr: [""],
  itinerary: [] as ItineraryDay[],
  imageUrl: "",
  gallery: [""],
  isFeatured: false,
  isActive: true,
};

function ArrayField({
  items,
  onChange,
  label,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholder?: string;
}) {
  const effective = items.length ? items : [""];
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {effective.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const next = [...effective];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                const next = effective.filter((_, j) => j !== i);
                onChange(next.length ? next : [""]);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange([...effective, ""])}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
}

export function TourPackageForm({
  pkg,
  onSuccess,
  onCancel,
}: {
  pkg?: TourPackageRow | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(pkg?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultValues);
  const [categories, setCategories] = useState<{ id: string; nameEn: string; nameAr: string }[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [newCatEn, setNewCatEn] = useState("");
  const [newCatAr, setNewCatAr] = useState("");
  const [createCategoryLoading, setCreateCategoryLoading] = useState(false);
  const [createCategoryError, setCreateCategoryError] = useState("");
  const [locations, setLocations] = useState<{ id: string; nameEn: string; nameAr: string; imageUrl: string | null }[]>([]);
  const [locationOpen, setLocationOpen] = useState(false);
  const [newLocEn, setNewLocEn] = useState("");
  const [newLocAr, setNewLocAr] = useState("");
  const [newLocImageUrl, setNewLocImageUrl] = useState("");
  const [createLocationLoading, setCreateLocationLoading] = useState(false);
  const [createLocationError, setCreateLocationError] = useState("");

  async function handleCreateCategory() {
    if (!newCatEn.trim() || !newCatAr.trim()) return;
    setCreateCategoryError("");
    setCreateCategoryLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nameEn: newCatEn.trim(), nameAr: newCatAr.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.id) {
        setCategories((prev) => [...prev, data]);
        setForm((f) => ({ ...f, categoryId: data.id }));
        setNewCatEn("");
        setNewCatAr("");
        setCreateCategoryError("");
        setCategoryOpen(false);
      } else {
        setCreateCategoryError(data.error || `Request failed (${res.status})`);
      }
    } catch (err) {
      setCreateCategoryError("Network error. Please try again.");
    } finally {
      setCreateCategoryLoading(false);
    }
  }

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.ok ? r.json() : [])
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);
  useEffect(() => {
    fetch("/api/admin/locations")
      .then((r) => r.ok ? r.json() : [])
      .then(setLocations)
      .catch(() => setLocations([]));
  }, []);

  async function handleCreateLocation() {
    if (!newLocEn.trim() || !newLocAr.trim()) return;
    setCreateLocationError("");
    setCreateLocationLoading(true);
    try {
      const res = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nameEn: newLocEn.trim(),
          nameAr: newLocAr.trim(),
          imageUrl: newLocImageUrl.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.id) {
        setLocations((prev) => [...prev, data]);
        setForm((f) => ({ ...f, locationId: data.id }));
        setNewLocEn("");
        setNewLocAr("");
        setNewLocImageUrl("");
        setCreateLocationError("");
        setLocationOpen(false);
      } else {
        setCreateLocationError(data.error || `Request failed (${res.status})`);
      }
    } catch {
      setCreateLocationError("Network error. Please try again.");
    } finally {
      setCreateLocationLoading(false);
    }
  }

  useEffect(() => {
    if (pkg) {
      const it = Array.isArray(pkg.itinerary)
        ? (
            pkg.itinerary as {
              day: number;
              title_en?: string;
              title_ar?: string;
            }[]
          ).map((d) => ({
            day: d.day,
            titleEn: d.title_en ?? "",
            titleAr: d.title_ar ?? "",
          }))
        : [];
      setForm({
        categoryId: pkg.categoryId ?? null,
        titleEn: pkg.titleEn ?? "",
        titleAr: pkg.titleAr ?? "",
        descriptionEn: pkg.descriptionEn ?? "",
        descriptionAr: pkg.descriptionAr ?? "",
        shortDescriptionEn: pkg.shortDescriptionEn ?? "",
        shortDescriptionAr: pkg.shortDescriptionAr ?? "",
        locationId: pkg.locationId ?? null,
        packageType: PACKAGE_TYPE_OPTIONS.includes(pkg.packageType as typeof PACKAGE_TYPE_OPTIONS[number])
          ? pkg.packageType
          : "custom",
        packageTypeCustom: PACKAGE_TYPE_OPTIONS.includes(pkg.packageType as typeof PACKAGE_TYPE_OPTIONS[number])
          ? ""
          : (pkg.packageType ?? ""),
        durationDays: pkg.durationDays ?? 7,
        price:
          typeof pkg.price === "object"
            ? pkg.price.toString()
            : String(pkg.price ?? ""),
        currency: pkg.currency ?? "SAR",
        inclusionsEn: pkg.inclusionsEn?.length ? pkg.inclusionsEn : [""],
        inclusionsAr: pkg.inclusionsAr?.length ? pkg.inclusionsAr : [""],
        exclusionsEn: pkg.exclusionsEn?.length ? pkg.exclusionsEn : [""],
        exclusionsAr: pkg.exclusionsAr?.length ? pkg.exclusionsAr : [""],
        itinerary: it,
        imageUrl: pkg.imageUrl ?? "",
        gallery: pkg.gallery?.length ? pkg.gallery : [""],
        isFeatured: pkg.isFeatured ?? false,
        isActive: pkg.isActive !== false,
      });
    } else {
      setForm(defaultValues);
      setStep(1);
    }
  }, [pkg]);

  const handleNext = () => {
    const err = validateStep(step, form);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, 6));
  };

  const handlePrev = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isEdit) {
      const err = validateEditForm(form);
      if (err) {
        setError(err);
        return;
      }
    } else {
      const err = validateStep(step, form);
      if (err) {
        setError(err);
        return;
      }
      if (step < 6) {
        handleNext();
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        categoryId: form.categoryId?.trim() || null,
        titleEn: form.titleEn.trim(),
        titleAr: form.titleAr.trim(),
        descriptionEn: form.descriptionEn.trim() || null,
        descriptionAr: form.descriptionAr.trim() || null,
        shortDescriptionEn: form.shortDescriptionEn.trim() || null,
        shortDescriptionAr: form.shortDescriptionAr.trim() || null,
        locationId: form.locationId?.trim() || null,
        packageType: form.packageType === "custom"
          ? form.packageTypeCustom.trim() || "custom"
          : form.packageType,
        durationDays: Number(form.durationDays) || 7,
        price: parseFloat(form.price) || 0,
        currency: form.currency,
        inclusionsEn: form.inclusionsEn.filter(Boolean),
        inclusionsAr: form.inclusionsAr.filter(Boolean),
        exclusionsEn: form.exclusionsEn.filter(Boolean),
        exclusionsAr: form.exclusionsAr.filter(Boolean),
        itinerary: form.itinerary
          .filter((d) => d.day > 0)
          .map((d) => ({ day: d.day, titleEn: d.titleEn, titleAr: d.titleAr })),
        imageUrl: form.imageUrl.trim() || null,
        gallery: form.gallery.filter(Boolean),
        isFeatured: form.isFeatured,
        isActive: form.isActive,
      };

      const url = isEdit
        ? `/api/admin/packages/${pkg!.id}`
        : "/api/admin/packages";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }
      router.refresh();
      onSuccess();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Create mode: Stepper
  if (!isEdit) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-medium",
                  step >= s.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted",
                )}
              >
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <span
                className={cn(
                  "ml-2 hidden text-sm sm:inline",
                  step >= s.id ? "font-medium" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className="mx-2 h-px w-4 bg-border sm:w-8" />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="titleEn">Title (English) *</Label>
                <Input
                  id="titleEn"
                  value={form.titleEn}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titleEn: e.target.value }))
                  }
                  required
                  placeholder="e.g. 7 Nights Umrah Package"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleAr">Title (Arabic) *</Label>
                <Input
                  id="titleAr"
                  value={form.titleAr}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titleAr: e.target.value }))
                  }
                  required
                  placeholder="مثال: باقة العمرة 7 ليالٍ"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Popover open={categoryOpen} onOpenChange={(open) => { setCategoryOpen(open); if (!open) setCreateCategoryError(""); }}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start font-normal"
                    >
                      {form.categoryId
                        ? categories.find((c) => c.id === form.categoryId)?.nameEn ?? "Select category"
                        : "Select or create category"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start">
                    <div className="space-y-3">
                      <button
                        type="button"
                        className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                        onClick={() => {
                          setForm((f) => ({ ...f, categoryId: null }));
                          setCategoryOpen(false);
                        }}
                      >
                        No category
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                          onClick={() => {
                            setForm((f) => ({ ...f, categoryId: c.id }));
                            setCategoryOpen(false);
                          }}
                        >
                          {c.nameEn} / {c.nameAr}
                        </button>
                      ))}
                      <div className="border-t pt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Create new</p>
                        {createCategoryError && (
                          <p className="text-xs text-destructive mb-2">{createCategoryError}</p>
                        )}
                        <Input
                          placeholder="Name (EN)"
                          value={newCatEn}
                          onChange={(e) => { setNewCatEn(e.target.value); setCreateCategoryError(""); }}
                          className="mb-2"
                        />
                        <Input
                          placeholder="Name (AR)"
                          value={newCatAr}
                          onChange={(e) => { setNewCatAr(e.target.value); setCreateCategoryError(""); }}
                          className="mb-2"
                          dir="rtl"
                        />
                        <Button
                          type="button"
                          size="sm"
                          disabled={!newCatEn.trim() || !newCatAr.trim() || createCategoryLoading}
                          onClick={handleCreateCategory}
                        >
                          {createCategoryLoading ? "Adding…" : "Add & select"}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Package Type *</Label>
                <Select
                  value={form.packageType}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, packageType: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="umrah">Umrah</SelectItem>
                    <SelectItem value="hajj">Hajj</SelectItem>
                    <SelectItem value="combined">Combined</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {form.packageType === "custom" && (
                  <Input
                    placeholder="Enter custom package type (e.g. Family Umrah)"
                    value={form.packageTypeCustom}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, packageTypeCustom: e.target.value }))
                    }
                    className="mt-2"
                  />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Popover open={locationOpen} onOpenChange={(open) => { setLocationOpen(open); if (!open) setCreateLocationError(""); }}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    {form.locationId
                      ? locations.find((l) => l.id === form.locationId)?.nameEn ?? "Select location"
                      : "Select or create location"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        setForm((f) => ({ ...f, locationId: null }));
                        setLocationOpen(false);
                      }}
                    >
                      No location
                    </button>
                    {locations.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                        onClick={() => {
                          setForm((f) => ({ ...f, locationId: l.id }));
                          setLocationOpen(false);
                        }}
                      >
                        {l.nameEn} / {l.nameAr}
                      </button>
                    ))}
                    <div className="border-t pt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Create new</p>
                      {createLocationError && (
                        <p className="text-xs text-destructive mb-2">{createLocationError}</p>
                      )}
                      <Input
                        placeholder="Name (EN)"
                        value={newLocEn}
                        onChange={(e) => { setNewLocEn(e.target.value); setCreateLocationError(""); }}
                        className="mb-2"
                      />
                      <Input
                        placeholder="Name (AR)"
                        value={newLocAr}
                        onChange={(e) => { setNewLocAr(e.target.value); setCreateLocationError(""); }}
                        className="mb-2"
                        dir="rtl"
                      />
                      <Input
                        placeholder="Image URL (optional)"
                        value={newLocImageUrl}
                        onChange={(e) => setNewLocImageUrl(e.target.value)}
                        className="mb-2"
                      />
                      <Button
                        type="button"
                        size="sm"
                        disabled={!newLocEn.trim() || !newLocAr.trim() || createLocationLoading}
                        onClick={handleCreateLocation}
                      >
                        {createLocationLoading ? "Adding…" : "Add & select"}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="durationDays">Duration (days) *</Label>
                <Input
                  id="durationDays"
                  type="number"
                  min={1}
                  value={form.durationDays}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      durationDays: Number(e.target.value) || 7,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Currency *</Label>
                <Select
                  value={form.currency}
                  onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">SAR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shortDescriptionEn">
                Short Description (EN) *
              </Label>
              <Textarea
                id="shortDescriptionEn"
                value={form.shortDescriptionEn}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shortDescriptionEn: e.target.value }))
                }
                rows={2}
                required
                placeholder="Brief summary for cards"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescriptionAr">
                Short Description (AR) *
              </Label>
              <Textarea
                id="shortDescriptionAr"
                value={form.shortDescriptionAr}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shortDescriptionAr: e.target.value }))
                }
                rows={2}
                dir="rtl"
                required
              />
            </div>
            <MarkdownField
              id="descriptionEn"
              label="Full Description (EN)"
              value={form.descriptionEn}
              onChange={(v) => setForm((f) => ({ ...f, descriptionEn: v }))}
              required
              placeholder="## Heading\n\n**Bold** and *italic* text, [links](url), lists..."
            />
            <MarkdownField
              id="descriptionAr"
              label="Full Description (AR)"
              value={form.descriptionAr}
              onChange={(v) => setForm((f) => ({ ...f, descriptionAr: v }))}
              required
              dir="rtl"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <ArrayField
              items={form.inclusionsEn}
              onChange={(v) => setForm((f) => ({ ...f, inclusionsEn: v }))}
              label="Inclusions (EN) *"
              placeholder="e.g. Accommodation"
            />
            <ArrayField
              items={form.inclusionsAr}
              onChange={(v) => setForm((f) => ({ ...f, inclusionsAr: v }))}
              label="Inclusions (AR) *"
              placeholder="مثال: الإقامة"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <ArrayField
              items={form.exclusionsEn}
              onChange={(v) => setForm((f) => ({ ...f, exclusionsEn: v }))}
              label="Exclusions (EN) *"
              placeholder="e.g. Visa fees"
            />
            <ArrayField
              items={form.exclusionsAr}
              onChange={(v) => setForm((f) => ({ ...f, exclusionsAr: v }))}
              label="Exclusions (AR) *"
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <Label>Day-by-day itinerary *</Label>
            {form.itinerary.map((day, i) => (
              <div
                key={i}
                className="flex flex-wrap gap-2 items-start rounded-lg border p-3"
              >
                <div className="w-20">
                  <Label className="text-xs">Day *</Label>
                  <Input
                    type="number"
                    min={1}
                    value={day.day || ""}
                    onChange={(e) => {
                      const next = [...form.itinerary];
                      next[i] = {
                        ...next[i],
                        day: Number(e.target.value) || 1,
                      };
                      setForm((f) => ({ ...f, itinerary: next }));
                    }}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <Label className="text-xs">Title (EN) *</Label>
                  <Input
                    value={day.titleEn}
                    onChange={(e) => {
                      const next = [...form.itinerary];
                      next[i] = { ...next[i], titleEn: e.target.value };
                      setForm((f) => ({ ...f, itinerary: next }));
                    }}
                    required
                    placeholder="Day title"
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <Label className="text-xs">Title (AR) *</Label>
                  <Input
                    value={day.titleAr}
                    onChange={(e) => {
                      const next = [...form.itinerary];
                      next[i] = { ...next[i], titleAr: e.target.value };
                      setForm((f) => ({ ...f, itinerary: next }));
                    }}
                    dir="rtl"
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="mt-6"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      itinerary: f.itinerary.filter((_, j) => j !== i),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  itinerary: [
                    ...f.itinerary,
                    {
                      day: form.itinerary.length + 1,
                      titleEn: "",
                      titleAr: "",
                    },
                  ],
                }))
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Add day
            </Button>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Featured image URL *</Label>
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                required
                placeholder="https://..."
              />
            </div>
            <ArrayField
              items={form.gallery}
              onChange={(v) => setForm((f) => ({ ...f, gallery: v }))}
              label="Gallery URLs *"
              placeholder="https://..."
            />
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Featured</Label>
                <p className="text-sm text-muted-foreground">
                  Show on homepage
                </p>
              </div>
              <Switch
                checked={form.isFeatured}
                onCheckedChange={(c) =>
                  setForm((f) => ({ ...f, isFeatured: c }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-muted-foreground">
                  Visible to visitors
                </p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(c) => setForm((f) => ({ ...f, isActive: c }))}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={handlePrev}>
              <ChevronLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {step < 6 ? (
            <Button type="button" onClick={handleNext}>
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create package"}
            </Button>
          )}
        </div>
      </form>
    );
  }

  // Edit mode: Tabs
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="descriptions">Descriptions</TabsTrigger>
          <TabsTrigger value="inclusions">In/Exclusions</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="titleEn">Title (English) *</Label>
              <Input
                id="titleEn"
                value={form.titleEn}
                onChange={(e) =>
                  setForm((f) => ({ ...f, titleEn: e.target.value }))
                }
                required
                placeholder="e.g. 7 Nights Umrah Package"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleAr">Title (Arabic) *</Label>
              <Input
                id="titleAr"
                value={form.titleAr}
                onChange={(e) =>
                  setForm((f) => ({ ...f, titleAr: e.target.value }))
                }
                required
                placeholder="مثال: باقة العمرة 7 ليالٍ"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    {form.categoryId
                      ? categories.find((c) => c.id === form.categoryId)?.nameEn ?? "Select category"
                      : "Select or create category"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        setForm((f) => ({ ...f, categoryId: null }));
                        setCategoryOpen(false);
                      }}
                    >
                      No category
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                        onClick={() => {
                          setForm((f) => ({ ...f, categoryId: c.id }));
                          setCategoryOpen(false);
                        }}
                      >
                        {c.nameEn} / {c.nameAr}
                      </button>
                    ))}
                    <div className="border-t pt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Create new</p>
                      {createCategoryError && (
                        <p className="text-xs text-destructive mb-2">{createCategoryError}</p>
                      )}
                      <Input
                        placeholder="Name (EN)"
                        value={newCatEn}
                        onChange={(e) => { setNewCatEn(e.target.value); setCreateCategoryError(""); }}
                        className="mb-2"
                      />
                      <Input
                        placeholder="Name (AR)"
                        value={newCatAr}
                        onChange={(e) => { setNewCatAr(e.target.value); setCreateCategoryError(""); }}
                        className="mb-2"
                        dir="rtl"
                      />
                      <Button
                        type="button"
                        size="sm"
                        disabled={!newCatEn.trim() || !newCatAr.trim() || createCategoryLoading}
                        onClick={handleCreateCategory}
                      >
                        {createCategoryLoading ? "Adding…" : "Add & select"}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="packageType">Package Type</Label>
              <Select
                value={form.packageType}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, packageType: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="umrah">Umrah</SelectItem>
                  <SelectItem value="hajj">Hajj</SelectItem>
                  <SelectItem value="combined">Combined</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {form.packageType === "custom" && (
                <Input
                  placeholder="Enter custom package type (e.g. Family Umrah)"
                  value={form.packageTypeCustom}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, packageTypeCustom: e.target.value }))
                  }
                  className="mt-2"
                />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Popover open={locationOpen} onOpenChange={(open) => { setLocationOpen(open); if (!open) setCreateLocationError(""); }}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  {form.locationId
                    ? locations.find((l) => l.id === form.locationId)?.nameEn ?? "Select location"
                    : "Select or create location"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => {
                      setForm((f) => ({ ...f, locationId: null }));
                      setLocationOpen(false);
                    }}
                  >
                    No location
                  </button>
                  {locations.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        setForm((f) => ({ ...f, locationId: l.id }));
                        setLocationOpen(false);
                      }}
                    >
                      {l.nameEn} / {l.nameAr}
                    </button>
                  ))}
                  <div className="border-t pt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Create new</p>
                    {createLocationError && (
                      <p className="text-xs text-destructive mb-2">{createLocationError}</p>
                    )}
                    <Input
                      placeholder="Name (EN)"
                      value={newLocEn}
                      onChange={(e) => { setNewLocEn(e.target.value); setCreateLocationError(""); }}
                      className="mb-2"
                    />
                    <Input
                      placeholder="Name (AR)"
                      value={newLocAr}
                      onChange={(e) => { setNewLocAr(e.target.value); setCreateLocationError(""); }}
                      className="mb-2"
                      dir="rtl"
                    />
                    <Input
                      placeholder="Image URL (optional)"
                      value={newLocImageUrl}
                      onChange={(e) => setNewLocImageUrl(e.target.value)}
                      className="mb-2"
                    />
                    <Button
                      type="button"
                      size="sm"
                      disabled={!newLocEn.trim() || !newLocAr.trim() || createLocationLoading}
                      onClick={handleCreateLocation}
                    >
                      {createLocationLoading ? "Adding…" : "Add & select"}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="durationDays">Duration (days) *</Label>
              <Input
                id="durationDays"
                type="number"
                min={1}
                value={form.durationDays}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    durationDays: Number(e.target.value) || 7,
                  }))
                }
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={form.currency}
                onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAR">SAR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="descriptions" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="shortDescriptionEn">Short Description (EN)</Label>
            <Textarea
              id="shortDescriptionEn"
              value={form.shortDescriptionEn}
              onChange={(e) =>
                setForm((f) => ({ ...f, shortDescriptionEn: e.target.value }))
              }
              rows={2}
              placeholder="Brief summary for cards"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortDescriptionAr">Short Description (AR)</Label>
            <Textarea
              id="shortDescriptionAr"
              value={form.shortDescriptionAr}
              onChange={(e) =>
                setForm((f) => ({ ...f, shortDescriptionAr: e.target.value }))
              }
              rows={2}
              dir="rtl"
            />
          </div>
          <MarkdownField
            id="edit-descriptionEn"
            label="Full Description (EN)"
            value={form.descriptionEn}
            onChange={(v) => setForm((f) => ({ ...f, descriptionEn: v }))}
            required
          />
          <MarkdownField
            id="edit-descriptionAr"
            label="Full Description (AR)"
            value={form.descriptionAr}
            onChange={(v) => setForm((f) => ({ ...f, descriptionAr: v }))}
            required
            dir="rtl"
          />
        </TabsContent>

        <TabsContent value="inclusions" className="space-y-4 mt-4">
          <ArrayField
            items={form.inclusionsEn}
            onChange={(v) => setForm((f) => ({ ...f, inclusionsEn: v }))}
            label="Inclusions (EN)"
            placeholder="e.g. Accommodation"
          />
          <ArrayField
            items={form.inclusionsAr}
            onChange={(v) => setForm((f) => ({ ...f, inclusionsAr: v }))}
            label="Inclusions (AR)"
            placeholder="مثال: الإقامة"
          />
          <ArrayField
            items={form.exclusionsEn}
            onChange={(v) => setForm((f) => ({ ...f, exclusionsEn: v }))}
            label="Exclusions (EN)"
            placeholder="e.g. Visa fees"
          />
          <ArrayField
            items={form.exclusionsAr}
            onChange={(v) => setForm((f) => ({ ...f, exclusionsAr: v }))}
            label="Exclusions (AR)"
          />
        </TabsContent>

        <TabsContent value="itinerary" className="space-y-4 mt-4">
          <Label>Day-by-day itinerary</Label>
          {form.itinerary.map((day, i) => (
            <div
              key={i}
              className="flex flex-wrap gap-2 items-start rounded-lg border p-3"
            >
              <div className="w-16">
                <Label className="text-xs">Day</Label>
                <Input
                  type="number"
                  min={1}
                  value={day.day || ""}
                  onChange={(e) => {
                    const next = [...form.itinerary];
                    next[i] = { ...next[i], day: Number(e.target.value) || 1 };
                    setForm((f) => ({ ...f, itinerary: next }));
                  }}
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <Label className="text-xs">Title (EN)</Label>
                <Input
                  value={day.titleEn}
                  onChange={(e) => {
                    const next = [...form.itinerary];
                    next[i] = { ...next[i], titleEn: e.target.value };
                    setForm((f) => ({ ...f, itinerary: next }));
                  }}
                  placeholder="Day title"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <Label className="text-xs">Title (AR)</Label>
                <Input
                  value={day.titleAr}
                  onChange={(e) => {
                    const next = [...form.itinerary];
                    next[i] = { ...next[i], titleAr: e.target.value };
                    setForm((f) => ({ ...f, itinerary: next }));
                  }}
                  dir="rtl"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="mt-6"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    itinerary: f.itinerary.filter((_, j) => j !== i),
                  }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setForm((f) => ({
                ...f,
                itinerary: [
                  ...f.itinerary,
                  { day: form.itinerary.length + 1, titleEn: "", titleAr: "" },
                ],
              }))
            }
          >
            <Plus className="h-4 w-4 mr-2" /> Add day
          </Button>
        </TabsContent>

        <TabsContent value="media" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Featured image URL</Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageUrl: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>
          <ArrayField
            items={form.gallery}
            onChange={(v) => setForm((f) => ({ ...f, gallery: v }))}
            label="Gallery URLs"
            placeholder="https://..."
          />
        </TabsContent>

        <TabsContent value="status" className="space-y-4 mt-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Featured</Label>
              <p className="text-sm text-muted-foreground">Show on homepage</p>
            </div>
            <Switch
              checked={form.isFeatured}
              onCheckedChange={(c) => setForm((f) => ({ ...f, isFeatured: c }))}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Active</Label>
              <p className="text-sm text-muted-foreground">
                Visible to visitors
              </p>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(c) => setForm((f) => ({ ...f, isActive: c }))}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Update package" : "Create package"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
