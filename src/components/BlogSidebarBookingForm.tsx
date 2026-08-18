"use client";

import { useEffect, useState } from "react";
import { TicketPercent, Calendar } from "lucide-react";
import { submitPackageBookingEnquiryAction } from "@/actions/enquiryActions";
import { getPackagesByType } from "@/actions/packageActions";
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

  const [packageType, setPackageType] = useState<"hajj" | "umrah">("umrah");
  const [availablePackages, setAvailablePackages] = useState<any[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [packagesLoading, setPackagesLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalRef, setModalRef] = useState("");

  const [errors, setErrors] = useState({
    fullName: false,
    phone: false,
    email: false,
    selectedPackage: false,
    selectedDate: false,
  });

  useEffect(() => {
    let cancelled = false;

    setPackagesLoading(true);
    setSelectedPackageId("");

    getPackagesByType(packageType)
      .then((rows) => {
        if (cancelled) return;

        // Only packages that are currently available can be selected.
        const available = (rows || []).filter(
          (pkg: any) => pkg.status === "available"
        );

        setAvailablePackages(available);
      })
      .catch(() => {
        if (!cancelled) setAvailablePackages([]);
      })
      .finally(() => {
        if (!cancelled) setPackagesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [packageType]);

  const todayDateStr = new Date().toISOString().split("T")[0];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus("");

    // Validate
    const newErrors = {
      fullName: !fullName.trim(),
      phone: !phone.trim(),
      email: !email.trim(),
      selectedPackage: !selectedPackageId,
      selectedDate: !selectedDate.trim(),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((isErr) => isErr)) {
      setBookingStatus("Please fill out all required fields correctly.");
      return;
    }

    setBookingStatus("Submitting your inquiry...");

    const selectedPackage = availablePackages.find(
      (pkg: any) => String(pkg.id) === selectedPackageId
    );

    const res = await submitPackageBookingEnquiryAction({
      packageId: Number(selectedPackageId),
      packageName:
        selectedPackage?.title ||
        `${packageType === "hajj" ? "Hajj" : "Umrah"} Package`,
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
      setSelectedPackageId("");
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
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: false }));
            }}
            className={`w-full border border-line p-3 pr-3 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium appearance-none bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat ${errors.fullName ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "focus:border-emerald-800"
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
              placeholder="Phone Number"
              maxLength={11}
              value={phone}
              onChange={(e) => {
                let val = e.target.value;
                const startsWithPlus = val.startsWith("+");
                const digits = val.replace(/[^0-9]/g, "");
                val = (startsWithPlus ? "+" : "") + digits;
                if (val.length > 11) val = val.slice(0, 11);
                setPhone(val);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
              }}
              className={`w-full border border-line p-3 pr-3 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium appearance-none bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat ${errors.fullName ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "focus:border-emerald-800"
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
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: false }));
              }}
              className={`w-full border border-line p-3 pr-3 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium appearance-none bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat ${errors.fullName ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "focus:border-emerald-800"
                }`}
            />
            {errors.email && (
              <span className="text-[10px] font-bold text-red-600 mt-1 block">Please fill out this field.</span>
            )}
          </div>
        </div>

        {/* Hajj / Umrah Package Selection */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Journey Type
            </label>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setPackageType("hajj");
                  setSelectedPackageId("");
                  if (errors.selectedPackage) {
                    setErrors((prev) => ({ ...prev, selectedPackage: false }));
                  }
                }}
                className={`py-2.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${packageType === "hajj"
                  ? "bg-[#004B39] text-white shadow-sm"
                  : "bg-transparent text-slate-500 hover:text-slate-800"
                  }`}
              >
                Hajj
              </button>

              <button
                type="button"
                onClick={() => {
                  setPackageType("umrah");
                  setSelectedPackageId("");
                  if (errors.selectedPackage) {
                    setErrors((prev) => ({ ...prev, selectedPackage: false }));
                  }
                }}
                className={`py-2.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${packageType === "umrah"
                  ? "bg-[#004B39] text-white shadow-sm"
                  : "bg-transparent text-slate-500 hover:text-slate-800"
                  }`}
              >
                Umrah
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select {packageType === "hajj" ? "Hajj" : "Umrah"} Package
            </label>

            <select
              value={selectedPackageId}
              disabled={packagesLoading}
              suppressHydrationWarning
              onChange={(e) => {
                setSelectedPackageId(e.target.value);
                if (errors.selectedPackage) {
                  setErrors((prev) => ({ ...prev, selectedPackage: false }));
                }
              }}
              className={`cursor-pointer w-full border border-line p-2 pr-3 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat ${errors.fullName ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "focus:border-emerald-800"
                }`}
            >
              <option value="">
                {packagesLoading
                  ? "Loading packages..."
                  : availablePackages.length === 0
                    ? `No available ${packageType === "hajj" ? "Hajj" : "Umrah"} packages`
                    : `Select a ${packageType === "hajj" ? "Hajj" : "Umrah"} package`}
              </option>

              {availablePackages.map((pkg: any) => (
                <option key={pkg.id} value={String(pkg.id)}>
                  {pkg.title}
                </option>
              ))}
            </select>

            {errors.selectedPackage && (
              <span className="text-[10px] font-bold text-red-600 mt-1 block">
                Please select a package.
              </span>
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
              className={`cursor-pointer w-full border border-line p-3 pr-3 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat ${errors.fullName ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "focus:border-emerald-800"
                }`}
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
              className={`cursor-pointer w-full border border-line p-3 pr-3 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat ${errors.fullName ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "focus:border-emerald-800"
                }`}
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
              className={`cursor-pointer w-full border border-line p-3 pr-3 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat ${errors.fullName ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "focus:border-emerald-800"
                }`}
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
              className={`cursor-pointer w-full border border-line p-3 pr-3 rounded-sm bg-slate-50 outline-none focus:border-gold transition-colors text-[#111111] text-sm font-medium appearance-none bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat flex items-center justify-between ${errors.selectedDate ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "focus:border-emerald-800"
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
          className="w-full bg-gold hover:bg-primary text-black hover:text-white font-semibold py-3.5 px-4 rounded-md text-sm transition-all duration-300 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group cursor-pointer mt-4"
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