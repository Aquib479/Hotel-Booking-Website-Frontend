import { useState } from "react";
import { CreditCard, Lock, ShieldCheck, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CARD_NETWORK_BADGES,
  PAYMENT_METHODS,
  UPI_APP_HINTS,
  UPI_HANDLE_SUGGESTIONS,
} from "../constants";
import type { PaymentMethod } from "../types";
import {
  useCardPaymentForm,
  useUpiPaymentForm,
} from "../hooks/usePaymentForms";
import { PaymentCardPreview } from "./PaymentCardPreview";

interface DirectPaymentMethodsProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  payAmountLabel: string;
  onSubmitPayment: (method: PaymentMethod) => void;
  isSubmitting: boolean;
  disabled: boolean;
  disabledReason?: string;
  showSubmitButton?: boolean;
  cardForm: ReturnType<typeof useCardPaymentForm>;
  upiForm: ReturnType<typeof useUpiPaymentForm>;
}

function NetworkBadges() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {CARD_NETWORK_BADGES.map((badge) => (
        <span
          key={badge}
          className="rounded-md border border-border bg-white px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600 shadow-xs"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}

function UpiHints() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {UPI_APP_HINTS.map((app) => (
        <span
          key={app.id}
          className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
        >
          {app.label}
        </span>
      ))}
    </div>
  );
}

export function DirectPaymentMethods({
  selectedMethod,
  onSelectMethod,
  payAmountLabel,
  onSubmitPayment,
  isSubmitting,
  disabled,
  disabledReason,
  showSubmitButton = true,
  cardForm,
  upiForm,
}: DirectPaymentMethodsProps) {
  const [pulseKey, setPulseKey] = useState(0);

  const handleSelect = (method: PaymentMethod) => {
    onSelectMethod(method);
    setPulseKey((k) => k + 1);
  };

  const handlePay = () => {
    if (!selectedMethod || disabled || isSubmitting) return;
    if (selectedMethod === "card" && !cardForm.validateForm()) return;
    if (selectedMethod === "upi" && !upiForm.validateForm()) return;
    onSubmitPayment(selectedMethod);
  };

  const cardFlipped = cardForm.focusedField === "cvv";

  return (
    <SectionCard
      title="Payment method"
      description="All payment data is encrypted and secure"
      action={
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand">
          <ShieldCheck className="size-3.5" aria-hidden />
          Secured checkout
        </span>
      }
    >
      <div
        key={pulseKey}
        className="mb-4 animate-in fade-in slide-in-from-top-1 rounded-xl border border-emerald-200/80 bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-800 duration-300"
      >
        RestHalf accepts card and UPI for this booking
      </div>

      <RadioGroup
        value={selectedMethod ?? undefined}
        onValueChange={(v) => handleSelect(v as PaymentMethod)}
        className="gap-3"
      >
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          const isCard = method.id === "card";

          return (
            <div
              key={method.id}
              className={cn(
                "overflow-hidden rounded-2xl border transition-all duration-300",
                isSelected
                  ? "border-brand bg-brand/[0.03] shadow-md ring-2 ring-brand/20"
                  : "border-border bg-card hover:border-brand/35"
              )}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(method.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(method.id);
                  }
                }}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left"
              >
                <RadioGroupItem value={method.id} aria-label={method.label} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {isCard ? (
                      <CreditCard className="size-4 text-brand" aria-hidden />
                    ) : (
                      <Smartphone className="size-4 text-brand" aria-hidden />
                    )}
                    <span className="text-sm font-semibold text-foreground">{method.label}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{method.description}</p>
                </div>
                <div className="hidden sm:block">{isCard ? <NetworkBadges /> : <UpiHints />}</div>
              </div>

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  isSelected ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  {isCard && isSelected ? (
                    <div className="space-y-4 border-t border-border/70 px-4 pb-4 pt-3">
                      <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-800">
                        Last step — you&apos;re almost done
                      </div>

                      <div className="grid gap-5 lg:grid-cols-[1fr_minmax(220px,280px)] lg:items-start">
                        <div className="space-y-3">
                          <FormField
                            label="Card holder name"
                            htmlFor="card-holder"
                            error={
                              cardForm.touched.holderName
                                ? cardForm.errors.holderName
                                : undefined
                            }
                          >
                            <Input
                              id="card-holder"
                              autoComplete="cc-name"
                              placeholder="Name on card"
                              value={cardForm.values.holderName}
                              onChange={(e) =>
                                cardForm.handleChange("holderName", e.target.value)
                              }
                              onFocus={() => cardForm.handleFocus("holderName")}
                              onBlur={() => cardForm.handleBlur("holderName")}
                              aria-invalid={
                                !!(cardForm.touched.holderName && cardForm.errors.holderName)
                              }
                              className={cn(
                                cardForm.touched.holderName &&
                                  !cardForm.errors.holderName &&
                                  "border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                              )}
                            />
                          </FormField>

                          <FormField
                            label="Card number"
                            htmlFor="card-number"
                            error={
                              cardForm.touched.cardNumber
                                ? cardForm.errors.cardNumber
                                : undefined
                            }
                          >
                            <div className="relative">
                              <CreditCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="card-number"
                                inputMode="numeric"
                                autoComplete="cc-number"
                                placeholder="•••• •••• •••• ••••"
                                value={cardForm.values.cardNumber}
                                onChange={(e) =>
                                  cardForm.handleChange("cardNumber", e.target.value)
                                }
                                onFocus={() => cardForm.handleFocus("cardNumber")}
                                onBlur={() => cardForm.handleBlur("cardNumber")}
                                aria-invalid={
                                  !!(
                                    cardForm.touched.cardNumber && cardForm.errors.cardNumber
                                  )
                                }
                                className={cn(
                                  "px-10",
                                  cardForm.touched.cardNumber &&
                                    !cardForm.errors.cardNumber &&
                                    "border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                                )}
                              />
                              <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </FormField>

                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              label="Expiry"
                              htmlFor="card-expiry"
                              error={
                                cardForm.touched.expiry ? cardForm.errors.expiry : undefined
                              }
                            >
                              <Input
                                id="card-expiry"
                                inputMode="numeric"
                                autoComplete="cc-exp"
                                placeholder="MM/YY"
                                value={cardForm.values.expiry}
                                onChange={(e) =>
                                  cardForm.handleChange("expiry", e.target.value)
                                }
                                onFocus={() => cardForm.handleFocus("expiry")}
                                onBlur={() => cardForm.handleBlur("expiry")}
                                aria-invalid={
                                  !!(cardForm.touched.expiry && cardForm.errors.expiry)
                                }
                                className={cn(
                                  cardForm.touched.expiry &&
                                    !cardForm.errors.expiry &&
                                    "border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                                )}
                              />
                            </FormField>

                            <FormField
                              label="CVV"
                              htmlFor="card-cvv"
                              error={cardForm.touched.cvv ? cardForm.errors.cvv : undefined}
                            >
                              <Input
                                id="card-cvv"
                                inputMode="numeric"
                                autoComplete="cc-csc"
                                placeholder="CVC"
                                value={cardForm.values.cvv}
                                onChange={(e) => cardForm.handleChange("cvv", e.target.value)}
                                onFocus={() => cardForm.handleFocus("cvv")}
                                onBlur={() => cardForm.handleBlur("cvv")}
                                aria-invalid={!!(cardForm.touched.cvv && cardForm.errors.cvv)}
                                className={cn(
                                  cardForm.touched.cvv &&
                                    !cardForm.errors.cvv &&
                                    "border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                                )}
                              />
                            </FormField>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                          <PaymentCardPreview
                            values={cardForm.values}
                            flipped={cardFlipped}
                            className="w-full"
                          />
                          <p className="flex items-center gap-1.5 text-center text-[11px] text-emerald-700">
                            <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
                            Card details are encrypted end-to-end
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {!isCard && isSelected ? (
                    <div className="space-y-4 border-t border-border/70 px-4 pb-4 pt-3">
                      <div className="rounded-lg bg-sky-50 px-3 py-2 text-center text-sm font-medium text-sky-800">
                        Pay in one tap from your favourite UPI app
                      </div>

                      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
                        <div className="space-y-3">
                          <FormField
                            label="UPI ID"
                            htmlFor="upi-vpa"
                            error={upiForm.touched.vpa ? upiForm.errors.vpa : undefined}
                          >
                            <Input
                              id="upi-vpa"
                              autoComplete="off"
                              placeholder="yourname@oksbi"
                              value={upiForm.values.vpa}
                              onChange={(e) => upiForm.handleChange("vpa", e.target.value)}
                              onBlur={() => upiForm.handleBlur("vpa")}
                              aria-invalid={!!(upiForm.touched.vpa && upiForm.errors.vpa)}
                              className={cn(
                                upiForm.touched.vpa &&
                                  !upiForm.errors.vpa &&
                                  "border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                              )}
                            />
                          </FormField>

                          <div>
                            <p className="mb-2 text-xs text-muted-foreground">Quick handles</p>
                            <div className="flex flex-wrap gap-2">
                              {UPI_HANDLE_SUGGESTIONS.map((handle) => (
                                <button
                                  key={handle}
                                  type="button"
                                  onClick={() => upiForm.appendHandle(handle)}
                                  className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground transition hover:border-brand hover:bg-brand/5 hover:text-brand"
                                >
                                  {handle}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mx-auto flex size-[132px] flex-col items-center justify-center rounded-2xl border border-dashed border-brand/30 bg-[radial-gradient(circle_at_top,#ede9fe,transparent_70%)] p-3 text-center">
                          <div className="grid size-14 grid-cols-3 gap-0.5 rounded-md bg-slate-900 p-1.5 shadow-lg">
                            {Array.from({ length: 9 }).map((_, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "rounded-[1px] bg-white",
                                  [1, 3, 5, 7].includes(i) && "opacity-30"
                                )}
                              />
                            ))}
                          </div>
                          <p className="mt-2 text-[10px] font-medium text-muted-foreground">
                            Scan in your UPI app
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </RadioGroup>

      {showSubmitButton ? (
        <Button
          type="button"
          variant="brand"
          size="lg"
          onClick={handlePay}
          disabled={disabled || !selectedMethod || isSubmitting}
          title={disabled ? disabledReason : undefined}
          className="mt-4 hidden h-12 w-full lg:flex"
        >
          {isSubmitting ? "Processing…" : `Pay ${payAmountLabel} now`}
        </Button>
      ) : null}
    </SectionCard>
  );
}

export function usePaymentMethodSelection() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>("card");
  const cardForm = useCardPaymentForm();
  const upiForm = useUpiPaymentForm();

  const isPaymentDetailsValid =
    selectedMethod === "card"
      ? cardForm.isValid
      : selectedMethod === "upi"
        ? upiForm.isValid
        : false;

  const validatePaymentDetails = () => {
    if (selectedMethod === "card") return cardForm.validateForm();
    if (selectedMethod === "upi") return upiForm.validateForm();
    return false;
  };

  return {
    selectedMethod,
    setSelectedMethod,
    cardForm,
    upiForm,
    isPaymentDetailsValid,
    validatePaymentDetails,
  };
}
