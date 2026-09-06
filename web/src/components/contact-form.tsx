"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  createLeadSchema,
  currentChannelSchema,
  industrySchema,
  monthlyAdBudgetSchema,
  type CreateLeadInput,
} from "@cardo/shared";
import { apiFetch } from "@/lib/api";
import { CONTACT_EMAIL } from "@/lib/constants";
import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const INDUSTRY_OPTIONS = industrySchema.options;
const BUDGET_OPTIONS = monthlyAdBudgetSchema.options;
const CHANNEL_OPTIONS = currentChannelSchema.options;

export function ContactForm() {
  const t = useTranslations("contactPage");
  const tIndustries = useTranslations("industries");
  const locale = useLocale() as AppLocale;
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      businessName: "",
      phone: "",
      industry: undefined,
      monthlyAdBudget: undefined,
      currentChannels: [],
      message: "",
      source: "contact_form",
      locale,
    },
  });

  function translateFieldError(message: string): string {
    const knownCodes = [
      "invalid_email",
      "name_too_short",
      "business_name_too_short",
      "phone_too_short",
      "select_at_least_one",
    ];
    if (knownCodes.includes(message)) {
      return t(`errors.${message}` as never);
    }
    return t("errors.required");
  }

  async function onSubmit(values: CreateLeadInput) {
    setFormError(null);
    const res = await apiFetch<{ id: string }>("/api/leads", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (res.ok) {
      setSubmitted(true);
      form.reset();
      return;
    }

    if (res.error.fields && res.error.fields.length > 0) {
      for (const field of res.error.fields) {
        form.setError(field.path as keyof CreateLeadInput, {
          message: translateFieldError(field.message),
        });
      }
      return;
    }

    setFormError(t("errors.generic", { email: CONTACT_EMAIL }));
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-3 rounded-lg border border-success bg-success/10 p-10 text-center duration-500"
      >
        <CheckCircle2 className="h-10 w-10 animate-in zoom-in spin-in-6 text-success duration-700" />
        <p className="text-h3">{t("success.title")}</p>
        <p className="text-body text-muted-foreground">{t("success.description")}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.name.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("form.name.placeholder")} autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.email.label")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("form.email.placeholder")}
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.businessName.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.businessName.placeholder")}
                    autoComplete="organization"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.phone.label")}</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={t("form.phone.placeholder")}
                    autoComplete="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.industry.label")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("form.industry.placeholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INDUSTRY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {tIndustries(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="monthlyAdBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.monthlyAdBudget.label")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("form.monthlyAdBudget.placeholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BUDGET_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(`budgets.${option}` as never)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="currentChannels"
          render={() => (
            <FormItem>
              <FormLabel>{t("form.currentChannels.label")}</FormLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                {CHANNEL_OPTIONS.map((option) => (
                  <FormField
                    key={option}
                    control={form.control}
                    name="currentChannels"
                    render={({ field }) => {
                      const checked = field.value?.includes(option);
                      return (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(isChecked) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  isChecked
                                    ? [...current, option]
                                    : current.filter((value) => value !== option),
                                );
                              }}
                              id={`channel-${option}`}
                            />
                          </FormControl>
                          <FormLabel htmlFor={`channel-${option}`} className="cursor-pointer font-normal">
                            {t(`channels.${option}` as never)}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.message.label")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("form.message.placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formError && (
          <p role="alert" className="text-small font-medium text-destructive">
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
          {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {form.formState.isSubmitting ? t("form.submitting") : t("form.submit")}
        </Button>
      </form>
    </Form>
  );
}
