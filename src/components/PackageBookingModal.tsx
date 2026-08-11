"use client";

import { useState } from "react";
import { Calendar, TicketPercent, X } from "lucide-react";
import { submitPackageBookingEnquiryAction } from "@/actions/enquiryActions";

export default function PackageBookingModal({
  isOpen,
  onClose,
  pkg,
}: {
  isOpen: boolean;
  onClose: () => void;
  pkg: any;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+1 ");
  const [email, setEmail] = useState("");
  const [adults, setAdults] = useState("1");
  const [childrenCount, setChildrenCount] = useState("0");
  const [infantsCount, setInfantsCount] = useState("0");
  const [selectedDate, setSelectedDate] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalRef, setModalRef] = useState("");

  if (!isOpen) return null;

  let cd = pkg?.cardData || {};
  if (typeof cd === "string") {
    try {
      cd = JSON.parse(cd);
    } catch (e) {
      cd = {};
    }
  }

  const price = pkg?.startingPrice
    ? Number(pkg.startingPrice).toLocaleString("en-CA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    : "12,995";
  const currencyCode = cd.currencyCode || "CAD";
  const badgeTag = cd.badgeTag || "Package";

  const todayDateStr = new Date().toISOString().split("T")[0];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: boolean } = {};
    if (!fullName.trim()) newErrors.fullName = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setBookingStatus("Submitting booking to database...");
    try {
      const res = await submitPackageBookingEnquiryAction({
        packageId: pkg?.id ? parseInt(pkg.id, 10) || undefined : undefined,
        packageName: pkg?.title || "Umrah Package",
        fullName,
        phone,
        email,
        adults: parseInt(adults, 10),
        children: parseInt(childrenCount, 10),
        infants: parseInt(infantsCount, 10),
        startDate: selectedDate,
        totalPrice: pkg?.price || "7,499",
      });

      if (res.success) {
        const msg = res.message || "Thank you! Your package booking request has been received. Our team will contact you shortly.";
        setModalMsg(msg);
        if (res.bookingNumber) setModalRef(res.bookingNumber);
        setModalOpen(true);
        setBookingStatus(null);
        setFullName("");
        setEmail("");
        setSelectedDate("");
      } else {
        setBookingStatus(res.error || "Submission failed.");
      }
    } catch {
      setBookingStatus("Failed to submit booking.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white top-6 max-h-[90vh] overflow-y-auto rounded-2xl w-full max-w-[420px] shadow-2xl relative flex flex-col my-auto shrink-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-7 h-7 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 md:p-6 overflow-y-auto scrollbar-hide">
          <div className="text-center mb-5 px-6 md:px-8 pt-6">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-1.5 leading-tight">Book {pkg?.title || "Umrah Package"}</h3>
            <p className="text-slate-500 text-xs">Please fill out the form below to initiate your booking inquiry.</p>
          </div>

          <form onSubmit={handleBookingSubmit} noValidate className="space-y-3">
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
                        const [year, month, day] = selectedDate.split("-");
                        return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "2-digit", year: "numeric" }
                        );
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
                <span className="text-[10px] font-bold text-red-600 mt-1 block">
                  Please select a valid start date.
                </span>
              )}
            </div>

            {/* Total Calculation Display */}
            <div className="pt-2 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Estimated Total</span>
              <span className="text-xl font-black text-slate-900 font-serif">
                {currencyCode} {price}
              </span>
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              className="w-full bg-[#DB9E30] hover:bg-[#004B39] text-white hover:text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <TicketPercent className="w-4 h-4" />
              <span>Book {badgeTag}</span>
            </button>

            <p className="text-[10px] text-slate-600 text-center leading-normal pt-1">
              *Hajj & Umrah Packages are subject to seat availability. Visa processing is included. Comprehensive medical
              insurance and Ahram Kit provided upon arrival.
            </p>
          </form>
        </div>
      </div>

      {/* Success Modal Overlay inside Modal */}
      {modalOpen && (
        <div className="absolute inset-0 z-[60] bg-white rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Booking Received!</h3>
          <p className="text-slate-600 mb-6">{modalMsg}</p>
          {modalRef && (
            <div className="bg-slate-50 p-4 rounded-xl mb-6 w-full">
              <span className="text-xs font-bold text-slate-400 block mb-1">Reference Number</span>
              <span className="text-lg font-mono font-black text-slate-900">{modalRef}</span>
            </div>
          )}
          <button
            onClick={() => {
              setModalOpen(false);
              onClose();
            }}
            className="bg-[#004B39] text-white font-bold py-3 px-8 rounded-xl w-full"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
