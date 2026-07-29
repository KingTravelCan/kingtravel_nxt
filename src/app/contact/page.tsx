"use client";

import { useState } from "react";

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("Sending...");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.website ? `[Website: ${contactForm.website}] ${contactForm.message}` : contactForm.message,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setContactStatus("Thank you! Your message has been sent.");
        setContactForm({
          name: "",
          email: "",
          phone: "",
          website: "",
          message: "",
        });
      } else {
        setContactStatus(data.error || "Submission failed.");
      }
    } catch {
      setContactStatus("Failed to send message.");
    }
  };

  return (
    <main className="bg-[#f2f5f3] min-h-screen">
      {/* ================= HERO ================= */}
      <section className="hero contact">
        <div className="container-full">
          <h1>
            We'd <span>Love</span> To Hear From You
          </h1>
          <p>Have a question or want to work together? Choose the most convenient way to reach us.</p>
        </div>
      </section>

      {/* ================= STATS / INFO CARDS ================= */}
      <div className="container-full reveal py-8 px-4 max-w-7xl mx-auto">
        <div className="stats-bar p-0">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Locations (Spans 2 columns on desktop) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group lg:col-span-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl group-hover:bg-emerald-800 group-hover:text-white transition-all duration-300 flex-shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dark)] mt-5 mb-4">Our Locations</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-center sm:text-left border-t border-slate-50 pt-4">
                {/* Head Office */}
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide mb-1">Head Office</span>
                  <a
                    className="text-sm font-semibold leading-[18px] text-slate-600 hover:text-emerald-800 transition no-underline"
                    href="https://maps.app.goo.gl/1BRUoBxtt4wWw58t6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    1325 Eglinton Ave E Ste 218,<br />Mississauga, ON L4W 4L9, Canada
                  </a>
                </div>

                {/* Branch Office */}
                <div className="flex flex-col items-center sm:items-start border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide mb-1">Branch Office</span>
                  <a
                    className="text-sm font-semibold leading-[18px] text-slate-600 hover:text-emerald-800 transition no-underline"
                    href="https://maps.app.goo.gl/U6B4fci2Jas4sh6S6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    22 Ontario St S,<br />Milton, ON L9T 2M6, Canada
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2: Phone Support */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl group-hover:bg-emerald-800 group-hover:text-white transition-all duration-300">
                <i className="fa-solid fa-phone"></i>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dark)] mt-5 mb-3">24/7 Support</h3>
              <div className="flex flex-col gap-1">
                <a className="text-sm text-slate-700 hover:text-emerald-800 transition font-semibold no-underline" href="tel:+18008445464">
                  +1 800-844-5464
                </a>
                <a className="text-sm text-slate-700 hover:text-emerald-800 transition font-semibold" href="tel:+19056248555">
                  +1 905-624-8555
                </a>
                <a className="text-sm text-slate-700 hover:text-emerald-800 transition font-semibold" href="tel:+19056248344">
                  +1 905-624-8344
                </a>
              </div>
            </div>

            {/* Card 3: Email & Socials */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group justify-between">
              <div className="flex flex-col items-center w-full mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl group-hover:bg-emerald-800 group-hover:text-white transition-all duration-300">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dark)] mt-4 mb-1">Email Us</h3>
                <a href="mailto:info@kingtravelcan.com" className="text-sm text-slate-700 hover:text-emerald-800 transition break-all font-semibold no-underline">
                  info@kingtravelcan.com
                </a>
              </div>

              <div className="w-full border-t border-slate-100 pt-3 flex flex-col items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dark)] mb-2">Follow Us</h3>
                <div className="flex gap-2">
                  <a href="https://www.facebook.com/kingtravelcan" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition duration-200 flex items-center justify-center no-underline">
                    <i className="fa-brands fa-facebook-f text-sm"></i>
                  </a>
                  <a href="https://www.instagram.com/kingtravelcan/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition duration-200 flex items-center justify-center no-underline">
                    <i className="fa-brands fa-instagram text-sm"></i>
                  </a>
                  <a href="https://ca.linkedin.com/company/kingtravelcan" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5] hover:text-white transition duration-200 flex items-center justify-center no-underline">
                    <i className="fa-brands fa-linkedin-in text-sm"></i>
                  </a>
                  <a href="https://www.tiktok.com/@kingtravelcan" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-black/5 text-black hover:bg-black hover:text-white transition duration-200 flex items-center justify-center no-underline">
                    <i className="fa-brands fa-tiktok text-sm"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FORM & GOOGLE MAPS ================= */}
      <section className="w-full max-w-7xl px-4 pb-24 pt-6 m-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column: Form */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100/80 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Drop Us A <span className="text-emerald-800">Message</span>
                </h2>
                <p className="text-slate-400 text-sm mt-2">Fill out the form below and we'll get back to you shortly.</p>
              </div>

              {contactStatus && <p className="text-center text-emerald-800 font-semibold mb-6">{contactStatus}</p>}

              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      placeholder=" "
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="peer w-full border border-slate-300 p-3 rounded bg-transparent outline-none focus:border-emerald-800 transition-colors duration-300 text-slate-900 placeholder-transparent"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-3 top-3 text-slate-400 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:left-0 peer-focus:text-xs peer-focus:text-emerald-800 font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      Name
                    </label>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      placeholder=" "
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="peer w-full border border-slate-300 p-3 rounded bg-transparent outline-none focus:border-emerald-800 transition-colors duration-300 text-slate-900 placeholder-transparent"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-3 top-3 text-slate-400 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:left-0 peer-focus:text-xs peer-focus:text-emerald-800 font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      Email Address
                    </label>
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      placeholder=" "
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="peer w-full border border-slate-300 p-3 rounded bg-transparent outline-none focus:border-emerald-800 transition-colors duration-300 text-slate-900 placeholder-transparent"
                    />
                    <label
                      htmlFor="phone"
                      className="absolute left-3 top-3 text-slate-400 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:left-0 peer-focus:text-xs peer-focus:text-emerald-800 font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      Phone Number
                    </label>
                  </div>

                  {/* Website */}
                  <div className="relative">
                    <input
                      type="url"
                      id="website"
                      placeholder=" "
                      value={contactForm.website}
                      onChange={(e) => setContactForm({ ...contactForm, website: e.target.value })}
                      className="peer w-full border border-slate-300 p-3 rounded bg-transparent outline-none focus:border-emerald-800 transition-colors duration-300 text-slate-900 placeholder-transparent"
                    />
                    <label
                      htmlFor="website"
                      className="absolute left-3 top-3 text-slate-400 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:left-0 peer-focus:text-xs peer-focus:text-emerald-800 font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      Website (Optional)
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div className="relative pt-4">
                  <textarea
                    id="message"
                    rows={4}
                    placeholder=" "
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="peer w-full border border-slate-300 p-3 rounded bg-transparent outline-none focus:border-emerald-800 transition-colors duration-300 text-slate-900 placeholder-transparent resize-none"
                  ></textarea>
                  <label
                    htmlFor="message"
                    className="absolute left-3 top-7 text-slate-400 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-7 peer-focus:top-0 peer-focus:left-0 peer-focus:text-xs peer-focus:text-emerald-800 font-semibold peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    How can we help you?
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="group w-full bg-emerald-800 text-white font-bold py-6 px-8 rounded-xl shadow-md hover:bg-emerald-900 active:scale-[0.99] transition-all duration-200 tracking-wider uppercase text-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Send Message</span>
                    <i className="fa-solid fa-paper-plane text-xs group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Embedded Google Maps */}
          <div className="flex flex-col gap-6 h-full justify-between">
            {/* Head Office Map */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100/80 p-4 flex-1 flex flex-col min-h-[250px]">
              <div className="mb-3 pl-2">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-emerald-800"></i> Head Office
                </h3>
                <p className="text-sm text-slate-400 mt-0.5">1325 Eglinton Ave E Ste 218, Mississauga, ON L4W 4L9, Canada</p>
              </div>
              <iframe
                className="w-full flex-1 rounded-2xl border-0 min-h-[200px]"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2888.1637775952674!2d-79.62528662340336!3d43.63487945347209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b3897316b3bdb%3A0xc6758691a49d5a8e!2sKing%20Travel%20Can%20Ltd%20-%20Mississauga!5e0!3m2!1sen!2sca!4v1710000000000!5m2!1sen!2sca"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Branch Office Map */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100/80 p-4 flex-1 flex flex-col min-h-[250px]">
              <div className="mb-3 pl-2">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-emerald-800"></i> Branch Office
                </h3>
                <p className="text-sm text-slate-400 mt-0.5">22 Ontario St S, Milton, ON L9T 2M6, Canada</p>
              </div>
              <iframe
                className="w-full flex-1 rounded-2xl border-0 min-h-[200px]"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2893.6521568283307!2d-79.87981462340915!3d43.5177187791263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b6fa0d880eae9%3A0xc57548acb421436c!2s22%20Ontario%20St%20S%2C%20Milton%2C%20ON%20L9T%202M6%2C%20Canada!5e0!3m2!1sen!2sca!4v1710000000001!5m2!1sen!2sca"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
