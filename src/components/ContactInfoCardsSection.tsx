export default function ContactInfoCardsSection({ data }: { data?: any }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 relative z-20 -mt-20 md:-mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Locations */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100/80 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl mb-4">
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#004B39] mb-4">
            {data?.card1Title || "OUR LOCATIONS"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-center sm:text-left border-t border-slate-100 pt-4 mt-auto">
            {/* Head Office */}
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] font-extrabold text-[#004B39] uppercase tracking-wide mb-1">HEAD OFFICE</span>
              <a
                className="text-xs font-medium leading-relaxed text-slate-600 hover:text-emerald-800 transition no-underline"
                href="https://maps.app.goo.gl/1BRUoBxtt4wWw58t6"
                target="_blank"
                rel="noopener noreferrer"
              >
                {data?.headAddress || "1325 Eglinton Ave E Ste 218, Mississauga, ON L4W 4L9, Canada"}
              </a>
            </div>

            {/* Branch Office */}
            <div className="flex flex-col items-center sm:items-start border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-[10px] font-extrabold text-[#004B39] uppercase tracking-wide mb-1">BRANCH OFFICE</span>
              <a
                className="text-xs font-medium leading-relaxed text-slate-600 hover:text-emerald-800 transition no-underline"
                href="https://maps.app.goo.gl/U6B4fci2Jas4sh6S6"
                target="_blank"
                rel="noopener noreferrer"
              >
                {data?.branchAddress || "22 Ontario St S, Milton, ON L9T 2M6, Canada"}
              </a>
            </div>
          </div>
        </div>

        {/* Card 2: Phone Support */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100/80 flex flex-col items-center text-center justify-between">
          <div className="flex flex-col items-center w-full">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl mb-4">
              <i className="fa-solid fa-phone"></i>
            </div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#004B39] mb-4">
              {data?.card2Title || "24/7 SUPPORT"}
            </h3>
            <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4 w-full">
              <a className="text-sm text-slate-700 hover:text-emerald-800 transition font-semibold no-underline" href={`tel:${(data?.phone1 || "+18008445464").replace(/\s+/g, '')}`}>
                {data?.phone1 || "+1 800-844-5464"}
              </a>
              <a className="text-sm text-slate-700 hover:text-emerald-800 transition font-semibold" href={`tel:${(data?.phone2 || "+19056248555").replace(/\s+/g, '')}`}>
                {data?.phone2 || "+1 905-624-8555"}
              </a>
              <a className="text-sm text-slate-700 hover:text-emerald-800 transition font-semibold" href={`tel:${(data?.phone3 || "+19056248344").replace(/\s+/g, '')}`}>
                {data?.phone3 || "+1 905-624-8344"}
              </a>
            </div>
          </div>
        </div>

        {/* Card 3: Email & Socials */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100/80 flex flex-col items-center text-center justify-between">
          <div className="flex flex-col items-center w-full mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl mb-4">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#004B39] mb-2">
              {data?.card3Title || "EMAIL US"}
            </h3>
            <a href={`mailto:${data?.email || "info@kingtravelcan.com"}`} className="text-sm text-slate-700 hover:text-emerald-800 transition break-all font-semibold no-underline">
              {data?.email || "info@kingtravelcan.com"}
            </a>
          </div>

          <div className="w-full border-t border-slate-100 pt-3 flex flex-col items-center">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#004B39] mb-2.5">FOLLOW US</h4>
            <div className="flex gap-2">
              <a href={data?.facebookUrl || "https://www.facebook.com/kingtravelcan"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition duration-200 flex items-center justify-center no-underline">
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </a>
              <a href={data?.instagramUrl || "https://www.instagram.com/kingtravelcan/"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition duration-200 flex items-center justify-center no-underline">
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
              <a href={data?.linkedinUrl || "https://ca.linkedin.com/company/kingtravelcan"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5] hover:text-white transition duration-200 flex items-center justify-center no-underline">
                <i className="fa-brands fa-linkedin-in text-sm"></i>
              </a>
              <a href={data?.tiktokUrl || "https://www.tiktok.com/@kingtravelcan"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-black/5 text-black hover:bg-black hover:text-white transition duration-200 flex items-center justify-center no-underline">
                <i className="fa-brands fa-tiktok text-sm"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
