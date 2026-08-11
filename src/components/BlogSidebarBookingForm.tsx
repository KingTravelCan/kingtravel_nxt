"use client";

import { useState } from "react";
import { TicketPercent, Calendar } from "lucide-react";
import { submitPackageBookingEnquiryAction } from "@/actions/enquiryActions";
import SubmissionSuccessModal from "@/components/SubmissionSuccessModal";

export default function BlogSidebarBookingForm({ blogTitle }: { blogTitle?: string }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [adults, setAdults] = useState("1");
  const [childrenCount, setChildrenCount] = useState("0");
  const [infantsCount, setInfantsCount] = useState("0");
  const [selectedDate, setSelectedDate] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalRef, setModalRef] = useState("");

  const [errors, setErrors] = useState({
    fullName: false,
    phone: false,
    email: false,
    selectedDate: false,
  });

  const todayDateStr = new Date().toISOString().split("T")[0];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus("");

    // Validate
    const newErrors = {
      fullName: !fullName.trim(),
      phone: !phone.trim(),
      email: !email.trim(),
      selectedDate: !selectedDate.trim(),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((isErr) => isErr)) {
      setBookingStatus("Please fill out all required fields correctly.");
      return;
    }

    setBookingStatus("Submitting your inquiry...");

    const res = await submitPackageBookingEnquiryAction({
      packageName: `Blog Enquiry: ${blogTitle || 'General'}`,
      fullName,
      phone,
      email,
      adults: parseInt(adults, 10),
      children: parseInt(childrenCount, 10),
      infants: parseInt(infantsCount, 10),
      startDate: selectedDate,
      totalPrice: "",
    });

    if (res.success) {
      setBookingStatus("");
      setFullName("");
      setPhone("");
      setEmail("");
      setAdults("1");
      setChildrenCount("0");
      setInfantsCount("0");
      setSelectedDate("");

      setModalMsg(res.message || "Your inquiry has been submitted.");
      setModalRef(res.bookingNumber || "");
      setModalOpen(true);
    } else {
      setBookingStatus(res.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
      <span className="text-xl font-extrabold mb-4">Plan Your Journey</span>

      <form onSubmit={handleBookingSubmit} noValidate className="space-y-4">
        {bookingStatus && (
          <p className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center">
            {bookingStatus}
          </p>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: false }));
            }}
            className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none transition-all ${errors.fullName
              ? "border-red-500 bg-red-50/50 text-red-900 focus:ring-2 focus:ring-red-500"
              : "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-[#004B39]"
              }`}
          />
          {errors.fullName && (
            <span className="text-[10px] font-bold text-red-600 mt-1 block">Please fill out this field.</span>
          )}
        </div>

        {/* Phone Number & Email Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Mobile #"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
              }}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none transition-all ${errors.phone
                ? "border-red-500 bg-red-50/50 text-red-900 focus:ring-2 focus:ring-red-500"
                : "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-[#004B39]"
                }`}
            />
            {errors.phone && (
              <span className="text-[10px] font-bold text-red-600 mt-1 block">Please fill out this field.</span>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: false }));
              }}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none transition-all ${errors.email
                ? "border-red-500 bg-red-50/50 text-red-900 focus:ring-2 focus:ring-red-500"
                : "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-[#004B39]"
                }`}
            />
            {errors.email && (
              <span className="text-[10px] font-bold text-red-600 mt-1 block">Please fill out this field.</span>
            )}
          </div>
        </div>

        {/* Adults, Children, Infants Dropdowns */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 text-center">
              Adults
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-[#004B39] focus:outline-none cursor-pointer text-center"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6+">6+</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 text-center">
              Children
            </label>
            <select
              value={childrenCount}
              onChange={(e) => setChildrenCount(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-[#004B39] focus:outline-none cursor-pointer text-center"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4+">4+</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 text-center">
              Infants
            </label>
            <select
              value={infantsCount}
              onChange={(e) => setInfantsCount(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-[#004B39] focus:outline-none cursor-pointer text-center"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4+">4+</option>
            </select>
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Select Start Date
          </label>
          <div className="relative">
            <div
              className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all flex items-center justify-between ${errors.selectedDate
                ? "border-red-500 bg-red-50/50 text-red-900"
                : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
            >
              <span className={selectedDate ? "text-slate-900" : "text-slate-400"}>
                {selectedDate
                  ? (() => {
                    const [year, month, day] = selectedDate.split('-');
                    return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
                  })()
                  : "e.g. March 25, 2025"}
              </span>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="date"
              min={todayDateStr}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                if (errors.selectedDate) setErrors((prev) => ({ ...prev, selectedDate: false }));
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          {errors.selectedDate && (
            <span className="text-[10px] font-bold text-red-600 mt-1 block">Please select a valid start date.</span>
          )}
        </div>

        {/* Submit CTA Button */}
        <button
          type="submit"
          className="w-full bg-gold hover:bg-primary text-black hover:text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group cursor-pointer mt-4"
        >
          <TicketPercent className="w-4 h-4" />
          <span>Submit Inquiry</span>
        </button>

        <p className="text-[10px] text-slate-600 text-center leading-normal pt-1">
          *Subject to availability. Visa processing is included in our packages.
        </p>
      </form>

      <SubmissionSuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMsg}
        referenceNumber={modalRef}
      />
    </div>
  );
}
