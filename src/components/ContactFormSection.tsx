"use client";

import { useState } from "react";
import { submitContactEnquiryAction } from "@/actions/enquiryActions";
import SubmissionSuccessModal from "@/components/SubmissionSuccessModal";

interface ContactSectionData {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  successMessage?: string;
  tollFree?: string;
  localNum1?: string;
  localNum2?: string;
  waReservation?: string;
  waVisa?: string;
  email?: string;
  officeHours?: string;
  headOffice?: string;
  branchOffice?: string;
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
    <section className="py-20 bg-[#F1F1ED]">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Contact Details */}
          <div className="contact-info">
            <div className="mb-10">
              <span className="eyebrow">
                {data.eyebrow || "GET IN TOUCH"}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#1e2f2b] font-normal mb-3">
                {data.title || "We're here to help"}
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="">Landlines:</h4>
                  <div className="">
                    {data.tollFree || "+1 800-844-5464"}<br/>
                    {data.localNum1 || "+1 905-624-8555"}<br/>
                    {data.localNum2 || "+1 905-624-8344"}
                  </div>
                </div>
                <div>
                  <h4 className="">Whatsapp:</h4>
                  <div className="">
                    {data.waReservation || "+1 905-624-8344"} - <span className="text-xs font-normal">Reservation</span><br/>
                    {data.waVisa || "+1 647-982-8555"} - <span className="text-xs font-normal">Saudi Visa</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="">Email</h4>
                <div className="">
                  {data.email || "info@kingtravelcan.com"}
                </div>
              </div>

              <div>
                <h4 className="">Office Hours</h4>
                <div className="">
                  {data.officeHours || "Mon-Sat, 9am - 7pm EST"}
                </div>
              </div>

              <div>
                <h4 className="">Head Office</h4>
                <div 
                  className=" leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: data.headOffice || "1325 Eglinton Ave E Ste 218,<br/>Mississauga, ON L4W 4L9, Canada" }}
                />
              </div>

              <div>
                <h4 className="">Branch Office</h4>
                <div 
                  className=" leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: data.branchOffice || "22 Ontario St S,<br/>Milton, ON L9T 2M6, Canada" }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-slate-100 relative">
            {status && (
              <p className="text-center text-emerald-800 font-semibold mb-6 text-sm">{status}</p>
            )}
            <form noValidate className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="field">
                  <label className="block text-[14px] font-[500] text-[var(--ink-soft)] uppercase tracking-widest mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={(e) => { setForm({ ...form, fullName: e.target.value }); if (errors.fullName) setErrors((p) => ({ ...p, fullName: "" })); }}
                    className={`w-full border p-3 rounded-lg outline-none transition-colors text-slate-900 text-sm ${errors.fullName ? "border-red-500 bg-red-50" : "border-slate-200 focus:border-[#DB9E30] bg-white"}`}
                  />
                  {errors.fullName && <span className="text-red-600 text-xs mt-1 block">{errors.fullName}</span>}
                </div>
                <div className="field">
                  <label className="block text-[14px] font-[500] text-[var(--ink-soft)] uppercase tracking-widest mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors((p) => ({ ...p, email: "" })); }}
                    className={`w-full border p-3 rounded-lg outline-none transition-colors text-slate-900 text-sm ${errors.email ? "border-red-500 bg-red-50" : "border-slate-200 focus:border-[#DB9E30] bg-white"}`}
                  />
                  {errors.email && <span className="text-red-600 text-xs mt-1 block">{errors.email}</span>}
                </div>
                <div className="field">
                  <label className="block text-[14px] font-[500] text-[var(--ink-soft)] uppercase tracking-widest mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-lg bg-white outline-none focus:border-[#DB9E30] transition-colors text-slate-900 text-sm"
                  />
                </div>
                <div className="field">
                  <label className="block text-[14px] font-[500] text-[var(--ink-soft)] uppercase tracking-widest mb-2">
                    Select Package
                  </label>
                  <select
                    value={form.packageType}
                    onChange={(e) => setForm({ ...form, packageType: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-lg bg-white outline-none focus:border-[#DB9E30] transition-colors text-slate-900 text-sm appearance-none"
                    style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23333%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%2２%20stroke-linejoin%3D%2２round%２２%3E%3Cpolyline%２ points%３D%２6%２０9%２ 1２%２ 15%２ 18%２ 9%２％３C％２Fpolyline％３E％３C％２Fsvg％３E')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
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
              <div className="field">
                <label className="block text-[14px] font-[500] text-[var(--ink-soft)] uppercase tracking-widest mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-lg bg-white outline-none focus:border-[#DB9E30] transition-colors text-slate-900 text-sm resize-y"
                  style={{ backgroundImage: "linear-gradient(45deg, transparent 50%, #94a3b8 50%, #94a3b8 55%, transparent 55%, transparent 65%, #94a3b8 65%, #94a3b8 70%, transparent 70%, transparent 80%, #94a3b8 80%, #94a3b8 85%, transparent 85%)", backgroundSize: "12px 12px", backgroundRepeat: "no-repeat", backgroundPosition: "bottom 4px right 4px" }}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-[#DB9E30] hover:bg-[#c48d2a] text-[#1e2f2b] font-bold py-4 px-6 rounded-lg shadow-md transition-all duration-300 tracking-wider uppercase text-xs cursor-pointer text-center"
                >
                  Send Enquiry
                </button>
              </div>
            </form>
          </div>
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
