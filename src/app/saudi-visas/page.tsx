import Image from "next/image";
import Link from "next/link";
import { getVisaServicesList } from "@/actions/visaActions";

export const metadata = {
  title: "Saudi Visa Services Canada | King Travel Mississauga",
  description: "Authorized Saudi visa assistance for Canadian citizens & PR holders. Tourist eVisas, Umrah Visas, Family Visit, Business, and Iqama work visas.",
};

export default async function SaudiVisasPublicPage() {
  const visaList = await getVisaServicesList();

  return (
    <main className="wrap reveal py-12">
      <div className="section-head text-center max-w-2xl mx-auto mb-12">
        <span className="eyebrow justify-center">Saudi Embassy Authorized</span>
        <h1 className="text-4xl font-extrabold text-slate-900 mt-2">Saudi Visa Services</h1>
        <p className="text-slate-600 mt-3">
          Fast, reliable Saudi visa processing for Canadian passport holders and permanent residents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visaList.map((visa) => (
          <div key={visa.id} className="visa-card border border-slate-200 rounded-3xl overflow-hidden shadow-lg bg-white flex flex-col">
            <div className="card-image-wrapper relative h-48">
              <Image
                src={visa.imageUrl || "/img/saudi-visa-1.webp"}
                alt={visa.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="card-content p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  ⏱️ {visa.processingTime}
                </span>
                <h3 className="card-title text-xl font-bold text-slate-900 mt-3">{visa.title}</h3>
                <p className="card-description text-sm text-slate-600 mt-2 leading-relaxed">{visa.shortDescription}</p>
              </div>
              <div className="mt-6">
                <Link href="/contact" className="btn block text-center w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition">
                  Request Visa Assistance
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
