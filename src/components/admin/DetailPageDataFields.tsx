'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface DetailPageData {
  overview: {
    groupTitle: string;
    items: string[];
  }[];
  highlights: { text: string; isCross: boolean }[];
  eligibility: string[];
  importantBooking: string;
  faqs: { question: string; answer: string }[];
}

export const defaultDetailPageData: DetailPageData = {
  overview: [],
  highlights: [],
  eligibility: [],
  importantBooking: '',
  faqs: []
};

export default function DetailPageDataFields({
  data,
  onChange
}: {
  data: DetailPageData;
  onChange: (newData: DetailPageData) => void;
}) {
  const d = data || defaultDetailPageData;

  const update = (field: keyof DetailPageData, val: any) => {
    onChange({ ...d, [field]: val });
  };

  return (
    <div className="col-span-full space-y-8 animate-in fade-in duration-300">
      
      {/* Overview Builder */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
        <h4 className="text-sm font-extrabold text-slate-900 mb-4 uppercase tracking-wide">Package Overview</h4>
        <div className="space-y-4">
          {(d.overview || []).map((group, gIdx) => (
            <div key={gIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
              <button type="button" onClick={() => {
                const newO = [...d.overview];
                newO.splice(gIdx, 1);
                update('overview', newO);
              }} className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-red-50 rounded-md p-1.5">
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="mb-4 pr-10">
                <label className="text-[10px] font-bold text-slate-500 mb-1 block">GROUP TITLE (e.g. DURING STAY AT MADINAH)</label>
                <input
                  type="text"
                  value={group.groupTitle}
                  onChange={e => {
                    const newO = [...d.overview];
                    newO[gIdx].groupTitle = e.target.value;
                    update('overview', newO);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold"
                  placeholder="Group Title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 mb-1 block">TIMELINE ITEMS</label>
                {group.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => {
                        const newO = [...d.overview];
                        newO[gIdx].items[iIdx] = e.target.value;
                        update('overview', newO);
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      placeholder="01 Dhul-Hijjah Check in..."
                    />
                    <button type="button" onClick={() => {
                      const newO = [...d.overview];
                      newO[gIdx].items.splice(iIdx, 1);
                      update('overview', newO);
                    }} className="text-red-400 hover:text-red-600 px-2 shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  const newO = [...d.overview];
                  newO[gIdx].items.push('');
                  update('overview', newO);
                }} className="text-xs font-bold text-[#004B39] flex items-center gap-1 mt-2 hover:underline">
                  <Plus className="w-3 h-3" /> Add Timeline Item
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => {
            update('overview', [...(d.overview || []), { groupTitle: '', items: [''] }]);
          }} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Overview Group
          </button>
        </div>
      </div>

      {/* Highlights & Eligibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <h4 className="text-sm font-extrabold text-slate-900 mb-4 uppercase tracking-wide">Highlights</h4>
          <div className="space-y-2">
            {(d.highlights || []).map((hl, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={hl.text}
                  onChange={e => {
                    const newH = [...d.highlights];
                    newH[i].text = e.target.value;
                    update('highlights', newH);
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs"
                />
                <label className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0 cursor-pointer">
                  <input type="checkbox" checked={hl.isCross} onChange={e => {
                    const newH = [...d.highlights];
                    newH[i].isCross = e.target.checked;
                    update('highlights', newH);
                  }} /> Cross?
                </label>
                <button type="button" onClick={() => {
                  const newH = [...d.highlights];
                  newH.splice(i, 1);
                  update('highlights', newH);
                }} className="text-red-400 hover:text-red-600 px-1 shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => {
              update('highlights', [...(d.highlights || []), { text: '', isCross: false }]);
            }} className="text-xs font-bold text-[#004B39] flex items-center gap-1 mt-2 hover:underline">
              <Plus className="w-3 h-3" /> Add Highlight
            </button>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <h4 className="text-sm font-extrabold text-slate-900 mb-4 uppercase tracking-wide">Eligibility</h4>
          <div className="space-y-2">
            {(d.eligibility || []).map((el, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={el}
                  onChange={e => {
                    const newE = [...d.eligibility];
                    newE[i] = e.target.value;
                    update('eligibility', newE);
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs"
                />
                <button type="button" onClick={() => {
                  const newE = [...d.eligibility];
                  newE.splice(i, 1);
                  update('eligibility', newE);
                }} className="text-red-400 hover:text-red-600 px-2 shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => {
              update('eligibility', [...(d.eligibility || []), '']);
            }} className="text-xs font-bold text-[#004B39] flex items-center gap-1 mt-2 hover:underline">
              <Plus className="w-3 h-3" /> Add Eligibility Requirement
            </button>
          </div>
        </div>
      </div>

      {/* Important Booking */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
        <h4 className="text-sm font-extrabold text-amber-900 mb-2 uppercase tracking-wide">Important Booking Note</h4>
        <div className="bg-white rounded-lg border border-amber-300 overflow-hidden">
          <TiptapEditor
            value={d.importantBooking || ''}
            onChange={(val) => update('importantBooking', val)}
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
        <h4 className="text-sm font-extrabold text-slate-900 mb-4 uppercase tracking-wide">FAQs</h4>
        <div className="space-y-4">
          {(d.faqs || []).map((faq, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative pr-12">
              <button type="button" onClick={() => {
                const newF = [...d.faqs];
                newF.splice(i, 1);
                update('faqs', newF);
              }} className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-red-50 rounded-md p-1.5">
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="mb-2">
                <label className="text-[10px] font-bold text-slate-500 mb-1 block">QUESTION</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={e => {
                    const newF = [...d.faqs];
                    newF[i].question = e.target.value;
                    update('faqs', newF);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 block">ANSWER</label>
                <textarea
                  value={faq.answer}
                  onChange={e => {
                    const newF = [...d.faqs];
                    newF[i].answer = e.target.value;
                    update('faqs', newF);
                  }}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => {
            update('faqs', [...(d.faqs || []), { question: '', answer: '' }]);
          }} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </div>
      </div>
      
    </div>
  );
}
