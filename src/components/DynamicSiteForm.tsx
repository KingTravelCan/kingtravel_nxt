"use client";

import React, { useState, useEffect } from "react";
import {
  submitFlightInquiry,
  submitQuoteEnquiryAction,
  submitPackageBookingEnquiryAction,
  submitContactEnquiryAction,
  submitVisaEnquiryAction,
} from "@/actions/enquiryActions";
import { getFormsSettings } from "@/actions/pageActions";
import { getAllPackages } from "@/actions/packageActions";
import { CheckCircle, AlertTriangle } from "lucide-react";
import GlassNotificationModal from "@/components/ui/GlassNotificationModal";

interface DynamicSiteFormProps {
  formKey: string;
  bgColor?: string;
  maxWidth?: string;
  eyebrow?: string;
  title?: string | null;
  description?: string | null;
  forceNoPadding?: boolean;
}

// ── Dropdown options keyed by field label (case-insensitive partial match) ──
function getSelectOptions(label: string): string[] {
  const l = label.toLowerCase();
  if (l.includes("trip type")) return ["One-Way", "Round Trip"];
  if (l.includes("passenger")) return ["1", "2", "3", "4", "5", "6+"];
  if (l.includes("class")) return ["Economy", "Business", "First Class"];
  if (l.includes("adults")) return ["1", "2", "3", "4", "5", "6+"];
  if (l.includes("children")) return ["0", "1", "2", "3", "4", "5"];
  if (l.includes("infants")) return ["0", "1", "2", "3"];
  if (l.includes("package")) return ["Umrah Package", "Hajj Package", "Saudi Visa", "Flight Booking", "Other"];
  if (l.includes("passport")) return ["Regular", "Diplomatic", "Service"];
  return [];
}

// ── Format date value from native date input (yyyy-mm-dd) to readable (March 10, 2005) ──
function formatDateReadable(value: string): string {
  if (!value) return "";
  try {
    return new Date(value + "T00:00:00").toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export default function DynamicSiteForm({
  formKey,
  bgColor = "transparent",
  maxWidth = "1280px",
  eyebrow,
  title,
  description,
  forceNoPadding,
}: DynamicSiteFormProps) {
  const [mounted, setMounted] = useState(false);
  const [fieldsList, setFieldsList] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formConfig, setFormConfig] = useState<any>({});
  const [status, setStatus] = useState<{ type: "success" | "error" | null; msg: string }>({
    type: null,
    msg: "",
  });
  const [allPackages, setAllPackages] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchPkgs = async () => {
      try {
        const pkgs = await getAllPackages();
        setAllPackages(pkgs || []);
      } catch (err) {
        console.error("Failed to fetch packages", err);
      }
    };
    fetchPkgs();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getFormsSettings();
        if (settings) {
          // Extract fields list
          if (settings.formFieldsState && settings.formFieldsState[formKey]) {
            setFieldsList(settings.formFieldsState[formKey]);
            const initialData: Record<string, string> = {};
            settings.formFieldsState[formKey].forEach((f: any) => {
              initialData[f.id] = "";
            });
            setFormData(initialData);
          } else if (settings[formKey]) {
            setFieldsList(settings[formKey]);
            const initialData: Record<string, string> = {};
            settings[formKey].forEach((f: any) => {
              initialData[f.id] = "";
            });
            setFormData(initialData);
          }

          // Extract form configuration (title, subtitle, success message)
          if (settings.formsData && settings.formsData[formKey]) {
            setFormConfig(settings.formsData[formKey]);
          }
        }
      } catch (err) {
        console.error("Failed to load form settings", err);
      }
    };
    fetchSettings();
  }, [formKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    // Phone fields: strip non-numeric chars except + - ( ) space
    if (type === "tel") {
      const cleaned = value.replace(/[^0-9+\-() ]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, msg: "" });

    try {
      const getVal = (possibleKeys: string[], defaultVal = "") => {
        for (const k of possibleKeys) {
          if (formData[k]) return formData[k];
        }
        const match = fieldsList.find((f: any) =>
          possibleKeys.some((pk) =>
            f.label?.toLowerCase().includes(pk.toLowerCase())
          )
        );
        if (match && formData[match.id]) {
          return formData[match.id];
        }
        return defaultVal;
      };

      const parseNumberSafe = (val: string, fallback: number) => {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? fallback : parsed;
      };

      const fullName = getVal(["1", "passenger_name", "full_name", "fullName", "name"]);
      const email = getVal(["2", "email", "email_address"]);
      const phone = getVal(["3", "phone", "contact_phone", "mobile"]);
      const packageType = getVal(["package_type", "packageType", "trip_type"]);
      const message = getVal(["11", "message", "special_request", "details"]);
      const ticketNumber = "TKT-" + Date.now();
      const website = getVal(["website", "url"]);

      let res: { success: boolean; error?: string; message?: string } = {
        success: false,
        error: "Unknown form action.",
      };

      if (formKey === "flightInquiry") {
        res = await submitFlightInquiry({
          fullName,
          email,
          phone,
          originCity: getVal(["4", "departure_city", "originCity", "origin", "departure city"]),
          destinationCity: getVal(["5", "destination_city", "destinationCity", "destination"]),
          departureDate: formatDateReadable(getVal(["6", "travel_dates", "departureDate", "start_date", "departure date", "travel date"])),
          returnDate: formatDateReadable(getVal(["7", "return_date", "returnDate", "return date"])),
          tripType: getVal(["8", "trip_type", "tripType", "trip type"], "Round Trip"),
          passengers: parseNumberSafe(getVal(["9", "passengers", "number_of_passengers", "number of passengers"], "1"), 1),
          flightClass: getVal(["10", "class", "flightClass", "flight class"], "Economy"),
          message,
        });
      } else if (formKey === "quoteForm") {
        res = await submitQuoteEnquiryAction({
          fullName,
          phone,
          email,
          packageType,
          numberOfPilgrims: parseNumberSafe(getVal(["adults", "passengers"], "1"), 1),
        });
      } else if (formKey === "packageDetailForm" || formKey === "packageInquiry") {
        res = await submitPackageBookingEnquiryAction({
          fullName,
          email,
          phone,
          packageName: packageType || "General Package Inquiry",
          message,
          adults: parseNumberSafe(getVal(["adults", "passengers"], "1"), 1),
          children: parseNumberSafe(getVal(["children"], "0"), 0),
          infants: parseNumberSafe(getVal(["infants"], "0"), 0),
          startDate: getVal(["departureDate", "travel_date", "start_date"]),
        });
      } else if (formKey === "visaConsultation") {
        res = await submitVisaEnquiryAction({
          fullName,
          email,
          phone,
          travelersCount: parseNumberSafe(getVal(["travelersCount", "passengers", "adults"], "1"), 1),
          nationality: getVal(["nationality"], "Canadian"),
          message,
        });
      } else if (formKey === "contact" || formKey === "dropUsMessage") {
        res = await submitContactEnquiryAction({
          fullName,
          email,
          phone,
          website,
          packageType,
          message,
        });
      }

      if (res.success) {
        setStatus({
          type: "success",
          msg:
            formConfig?.successMessage ||
            res.message ||
            "Your request has been submitted successfully!",
        });
        // Reset form
        const initialData: Record<string, string> = {};
        fieldsList.forEach((f: any) => {
          initialData[f.id] = "";
        });
        setFormData(initialData);
      } else {
        setStatus({ type: "error", msg: res.error || "Failed to submit request." });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Return null on server and first client paint so SSR HTML always matches.
  // The useEffect will trigger a re-render with the actual content once mounted.
  if (!mounted) {
    return null;
  }

  if (fieldsList.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-[#004B39] rounded-full animate-spin mb-3" />
        <p className="text-sm">Loading form...</p>
      </div>
    );
  }

  const finalBgColor = bgColor === "transparent" || !bgColor ? "transparent" : bgColor;
  const finalMaxWidth = maxWidth || "1280px";

  const displayTitle = title || formConfig?.title || "Enquiry Form";
  const displayDesc = description || formConfig?.subtitle || "Please fill in your details below.";

  // Separate message/richtext field out for full-width rendering below grid
  const mainFields = fieldsList.filter((f) => f.type !== "richtext" && f.type !== "textarea");
  const richFields = fieldsList.filter((f) => f.type === "richtext" || f.type === "textarea");

  return (
    <div style={{ backgroundColor: finalBgColor }} className="w-full !bg-white">
      <div style={{ maxWidth: finalMaxWidth }} className={`mx-auto px-4 ${forceNoPadding ? "py-8" : "py-10"}`}>
        <div className="text-center mb-10">
          {eyebrow && (
            <div className="text-[#004B39] font-bold text-sm tracking-widest uppercase mb-3">
              {eyebrow}
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#004B39] mb-4 uppercase">
            {displayTitle}
          </h2>
          <p className="text-slate-700 font-sans text-sm max-w-2xl mx-auto uppercase tracking-wider">
            {displayDesc}
          </p>
        </div>

        <GlassNotificationModal
          isOpen={status.type !== null}
          onClose={() => setStatus({ type: null, msg: "" })}
          type={status.type || "info"}
          title={status.type === "success" ? "Success!" : "Error"}
          message={status.msg}
          confirmText="Close"
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main 2-col grid (excludes richtext/textarea) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainFields.map((field) => {
              const isDate = field.type === "date";
              const isTel = field.type === "tel";
              const isSelect = field.type === "select";
              const isEmail = field.type === "email";
              // Full width for the name field (id "1" or label includes "name")
              const isFullWidth =
                field.id === "1" ||
                field.label?.toLowerCase().includes("full name");

              const selectOptions = isSelect ? getSelectOptions(field.label || "") : [];

              return (
                <div key={field.id} className={isFullWidth ? "md:col-span-2" : ""}>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === "bubble_tabs_journey" ? (
                    <div className="flex bg-slate-100 p-1 rounded-full gap-1 w-full">
                      {["Hajj", "Umrah"].map(tab => {
                        const isSelected = formData[field.id]?.toLowerCase() === tab.toLowerCase();
                        return (
                          <label key={tab} className={`flex-1 text-center py-2.5 rounded-full text-sm font-bold cursor-pointer transition-all ${isSelected ? "bg-[#004B39] text-white shadow-md" : "text-slate-600 hover:text-slate-800 hover:bg-slate-200"}`}>
                            <input type="radio" name={field.id} value={tab.toLowerCase()} onChange={handleChange} className="hidden" required={field.required && !formData[field.id]} />
                            {tab}
                          </label>
                        );
                      })}
                    </div>
                  ) : field.type.startsWith("dropdown_") || isSelect ? (
                    <select
                      name={field.id}
                      required={field.required}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                      className="w-full border border-line p-3 pr-10 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat cursor-pointer focus:border-emerald-800"
                    >
                      <option value="">Select {field.label}</option>

                      {field.type === "dropdown_packages" && allPackages.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}

                      {field.type === "dropdown_tab_package" && allPackages
                        .filter(p => {
                          const journeyField = mainFields.find(f => f.type === "bubble_tabs_journey");
                          const activeTab = journeyField ? formData[journeyField.id] : null;
                          if (!activeTab) return true;
                          return p.type?.toLowerCase() === activeTab.toLowerCase();
                        })
                        .map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))
                      }

                      {field.type === "dropdown_numbers_1_6" && ["1", "2", "3", "4", "5", "6+"].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}

                      {field.type === "dropdown_flight_type" && ["One-Way", "Round Trip"].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}

                      {field.type === "dropdown_flight_class" && ["Economy", "Business", "First Class"].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}

                      {isSelect && selectOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}

                      {isSelect && selectOptions.length === 0 && (
                        <>
                          <option value="Option 1">Option 1</option>
                          <option value="Option 2">Option 2</option>
                          <option value="Option 3">Option 3</option>
                        </>
                      )}
                    </select>
                  ) : isDate ? (
                    <input
                      type="date"
                      name={field.id}
                      required={field.required}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                      className="w-full border border-line p-3 pr-3 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium focus:border-emerald-800"
                    />
                  ) : isTel ? (
                    <input
                      type="tel"
                      name={field.id}
                      required={field.required}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder || "e.g. +1 234 567 890"}
                      inputMode="tel"
                      autoComplete="tel"
                      className="w-full border border-line p-3 pr-3 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium focus:border-emerald-800"
                    />
                  ) : (
                    <input
                      type={isEmail ? "email" : "text"}
                      name={field.id}
                      required={field.required}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder || ""}
                      className="w-full border border-line p-3 pr-3 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium focus:border-emerald-800"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Message / textarea fields — always full width, below grid */}
          {richFields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <textarea
                name={field.id}
                required={field.required}
                value={formData[field.id] || ""}
                onChange={handleChange}
                placeholder={field.placeholder || ""}
                rows={4}
                className="w-full border border-line p-3 pr-3 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium resize-none focus:border-emerald-800"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#004B39] hover:bg-[#003829] text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting
              ? "Submitting Request..."
              : formConfig?.buttonText || "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
