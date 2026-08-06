"use client";

import { useState } from "react";
import { submitContactEnquiryAction } from "@/actions/enquiryActions";
import SubmissionSuccessModal from "@/components/SubmissionSuccessModal";

interface ContactSectionData {
  title?: string;
  subtitle?: string;
  successMessage?: string;
}

export default function ContactFormSection({ data }: { data: ContactSectionData }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    packageType: "Select Package",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalRef, setModalRef] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Please fill out this field.";
    if (!form.email.trim()) {
      newErrors.email = "Please fill out this field.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus("Sending...");
    try {
      const res = await submitContactEnquiryAction({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        packageType: form.packageType,
        message: form.message,
      });

      if (res.success) {
        const msg = data.successMessage || res.message || "Thank you! Your message has been received. Our team will contact you shortly.";
        setModalMsg(msg);
        if (res.ticketNumber) setModalRef(res.ticketNumber);
        setModalOpen(true);
        setStatus(null);
        setForm({ fullName: "", email: "", phone: "", packageType: "Select Package", message: "" });
      } else {
        setStatus(res.error || "Submission failed.");
      }
    } catch {
      setStatus("Failed to send message.");
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-[#004B39] mb-3">
            {data.title || "Drop Us A Message"}
          </h2>
          {data.subtitle && (
            <p className="text-slate-500 text-sm">{data.subtitle}</p>
          )}
        </div>

        <div className="bg-[#f5f7f0] rounded-3xl p-8 border border-[#e0e8d8] shadow-sm">
          {status && (
            <p className="text-center text-emerald-800 font-semibold mb-6 text-sm">{status}</p>
          )}
          <form noValidate className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={(e) => { setForm({ ...form, fullName: e.target.value }); if (errors.fullName) setErrors((p) => ({ ...p, fullName: "" })); }}
                  className={`w-full border p-3 rounded-xl bg-slate-50 outline-none transition-colors text-slate-900 text-sm ${errors.fullName ? "border-red-500" : "border-slate-300 focus:border-[#004B39]"}`}
                />
                {errors.fullName && <span className="text-red-600 text-xs mt-1 block">{errors.fullName}</span>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors((p) => ({ ...p, email: "" })); }}
                  className={`w-full border p-3 rounded-xl bg-slate-50 outline-none transition-colors text-slate-900 text-sm ${errors.email ? "border-red-500" : "border-slate-300 focus:border-[#004B39]"}`}
                />
                {errors.email && <span className="text-red-600 text-xs mt-1 block">{errors.email}</span>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+1(___) ___-____"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-slate-300 p-3 rounded-xl bg-slate-50 outline-none focus:border-[#004B39] transition-colors text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Package Type
                </label>
                <select
                  value={form.packageType}
                  onChange={(e) => setForm({ ...form, packageType: e.target.value })}
                  className="w-full border border-slate-300 p-3 rounded-xl bg-slate-50 outline-none focus:border-[#004B39] transition-colors text-slate-900 text-sm"
                >
                  <option>Select Package</option>
                  <option>Umrah Package</option>
                  <option>Hajj Package</option>
                  <option>Flight Only</option>
                  <option>Saudi Visa</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Tell us about your travel plans..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-slate-300 p-3 rounded-xl bg-slate-50 outline-none focus:border-[#004B39] transition-colors text-slate-900 text-sm resize-y"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#004B39] hover:bg-[#DB9E30] text-white hover:text-slate-900 font-extrabold py-3.5 px-10 rounded-xl shadow-md transition-all duration-300 tracking-wider uppercase text-sm cursor-pointer"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      <SubmissionSuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMsg}
        referenceNumber={modalRef}
      />
    </section>
  );
}
