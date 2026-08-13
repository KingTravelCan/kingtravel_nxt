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
    packageType: "",
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

    if (!form.packageType || form.packageType === "Select Package") newErrors.packageType = "Please select a package.";
    if (!form.message.trim()) newErrors.message = "Please fill out this field.";

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
        setForm({ fullName: "", email: "", phone: "", packageType: "", message: "" });
      } else {
        setStatus(res.error || "Submission failed.");
      }
    } catch {
      setStatus("Failed to send message.");
    }
  };

  return (
    <section className="py-20 bg-gray">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Contact Details */}
          <div className="contact-info">
            <div className="mb-10">
              <span className="eyebrow">
                {data.eyebrow || "GET IN TOUCH"}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-ink font-normal mb-3">
                {data.title || "We're here to help"}
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="">Landlines:</h4>
                  <div className="">
                    {data.tollFree || "+1 800-844-5464"}<br />
                    {data.localNum1 || "+1 905-624-8555"}<br />
                    {data.localNum2 || "+1 905-624-8344"}
                  </div>
                </div>
                <div>
                  <h4 className="">Whatsapp:</h4>
                  <div className="">
                    {data.waReservation || "+1 905-624-8344"} - <span className="text-xs font-normal">Reservation</span><br />
                    {data.waVisa || "+1 647-982-8555"} - <span className="text-xs font-normal">Saudi Visa</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="">Email</h4>
                <div className="">
                  {data.email || "saudivisa@kingtravelcan.com"}
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
                  dangerouslySetInnerHTML={{ __html: data.headOffice || "1325 Eglinton Ave E Suite Number 218,<br/>Mississauga, ON L4W 4L9, Canada" }}
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
            <form noValidate className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    placeholder=" "
                    value={form.fullName}
                    onChange={(e) => {
                      setForm({ ...form, fullName: e.target.value });
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                    }}
                    className={`peer w-full border border-primary/30 p-3 rounded-md bg-transparent outline-none transition-colors duration-300 text-slate-900 placeholder-transparent ${errors.fullName ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"}`}
                  />
                  <label
                    htmlFor="fullName"
                    className={`absolute left-3 top-3 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:left-0 peer-focus:text-xs font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs ${errors.fullName ? "text-red-600 peer-focus:text-red-600" : "text-slate-400 peer-focus:text-emerald-800"}`}
                  >
                    Full Name *
                  </label>
                  {errors.fullName && <span className="text-red-600 text-xs font-semibold mt-1 block">{errors.fullName}</span>}
                </div>

                <div className="relative">
                  <input
                    type="email"
                    id="emailAddress"
                    placeholder=" "
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`peer w-full border border-primary/30 p-3 rounded-md bg-transparent outline-none transition-colors duration-300 text-slate-900 placeholder-transparent ${errors.email ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"}`}
                  />
                  <label
                    htmlFor="emailAddress"
                    className={`absolute left-3 top-3 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:left-0 peer-focus:text-xs font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs ${errors.email ? "text-red-600 peer-focus:text-red-600" : "text-slate-400 peer-focus:text-emerald-800"}`}
                  >
                    Email Address *
                  </label>
                  {errors.email && <span className="text-red-600 text-xs font-semibold mt-1 block">{errors.email}</span>}
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    id="phoneNumber"
                    placeholder=" "
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="peer w-full border border-primary/30 p-3 rounded-md bg-transparent outline-none transition-colors duration-300 text-[#111111] placeholder-transparent"
                  />
                  <label
                    htmlFor="phoneNumber"
                    className="absolute left-3 top-3 text-slate-400 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:left-0 peer-focus:text-xs peer-focus:text-emerald-800 font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Phone Number
                  </label>
                </div>

                <div className="relative">
                  <select
                    id="packageType"
                    value={form.packageType}
                    onChange={(e) => {
                      setForm({ ...form, packageType: e.target.value });
                      if (errors.packageType) setErrors((prev) => ({ ...prev, packageType: "" }));
                    }}
                    className={`peer w-full border border-primary/30 p-3 rounded-md bg-transparent outline-none transition-colors duration-300 appearance-none ${form.packageType === "" ? "text-slate-400" : "text-slate-900"} ${errors.packageType ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"}`}
                    style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23333%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                  >
                    <option value="" disabled hidden>Select Package *</option>
                    <option value="Hajj/Umrah Packages">Hajj/Umrah Packages</option>
                    <option value="Umrah Package">Umrah Package</option>
                    <option value="Hajj Package">Hajj Package</option>
                    <option value="Flight Only">Flight Only</option>
                    <option value="Saudi Visa">Saudi Visa</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.packageType && <span className="text-red-600 text-xs font-semibold mt-1 block">{errors.packageType}</span>}
                </div>
              </div>

              <div className="relative mt-2">
                <textarea
                  id="message"
                  rows={4}
                  placeholder=" "
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value });
                    if (errors.message) {
                      setErrors((prev) => ({ ...prev, message: "" }));
                    }
                  }}
                  className={`peer w-full border border-primary/30 p-3 rounded-md bg-transparent outline-none transition-colors duration-300 text-slate-900 placeholder-transparent resize-none ${errors.message ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-300 focus:border-emerald-800"}`}
                />
                <label
                  htmlFor="message"
                  className={`absolute left-3 top-3 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:left-0 peer-focus:text-xs font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs ${errors.message ? "text-red-600 peer-focus:text-red-600" : "text-slate-400 peer-focus:text-emerald-800"}`}
                >
                  Message *
                </label>
                {errors.message && <span className="text-red-600 text-xs font-semibold mt-1 block">{errors.message}</span>}
              </div>

              <div>
                <button
                  type="submit"
                  className="group w-full bg-gold hover:bg-gold-lt text-ink font-bold py-4 px-8 rounded-md shadow-md hover:shadow-md active:scale-[0.99] transition-all duration-200 tracking-wider uppercase text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>SEND ENQUIRY</span>
                  <i className="fa-solid fa-paper-plane text-xs group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"></i>
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
