"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { leadStatusSchema, type LeadStatus } from "@cardo/shared";
import { apiFetch } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_OPTIONS = leadStatusSchema.options;

export function LeadStatusCell({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const router = useRouter();
  const [value, setValue] = useState<LeadStatus>(status);
  const [isPending, startTransition] = useTransition();

  async function handleChange(next: string) {
    const previous = value;
    setValue(next as LeadStatus);

    const res = await apiFetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });

    if (!res.ok) {
      setValue(previous);
      toast.error("Couldn't update status. " + res.error.message);
      return;
    }

    toast.success("Status updated");
    startTransition(() => router.refresh());
  }

  return (
    <Select value={value} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            {option[0].toUpperCase() + option.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
