import Link from "next/link";

export default function CustomizeHajjPage() {
  return (
    <main className="bg-slate-50 py-12">
      <div className="wrap">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="eyebrow justify-center">Tailored Pilgrimage</div>
          <h1 className="text-4xl font-bold text-slate-900 mt-2 mb-4">
            Customize Your Hajj Package <span className="text-[var(--gold)]">2027</span>
          </h1>
          <p className="text-slate-600">
            Tailor your stay, accommodations, group guides, and travel arrangements according to your personal requirements.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 max-w-3xl mx-auto">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="field">
                <label>Full Name</label>
                <input type="text" placeholder="Full Name" required />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input type="email" placeholder="Email Address" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="field">
                <label>Phone Number</label>
                <input type="text" placeholder="Phone Number" required />
              </div>
              <div className="field">
                <label>Preferred Occupancy</label>
                <select defaultValue="Quad Occupancy">
                  <option>Quad Occupancy</option>
                  <option>Triple Occupancy</option>
                  <option>Double Occupancy</option>
                  <option>Single Occupancy</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Special Requests or Custom Requirements</label>
              <textarea placeholder="Tell us your dates, preferred hotels, or additional services..."></textarea>
            </div>

            <button type="submit" className="btn dark block">
              Submit Custom Hajj Inquiry
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
