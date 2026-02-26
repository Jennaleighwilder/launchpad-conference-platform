'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ROIPage() {
  const [attendees, setAttendees] = useState(500);
  const [eventsPerYear, setEventsPerYear] = useState(4);
  const [hourlyCost, setHourlyCost] = useState(75);

  const traditionalHours = attendees * 0.5 + eventsPerYear * 120;
  const launchpadHours = eventsPerYear * 2;
  const hoursSaved = traditionalHours - launchpadHours;
  const costSaved = Math.round(hoursSaved * hourlyCost);
  const traditionalCost = Math.round(traditionalHours * hourlyCost);
  const launchpadCost = Math.round(launchpadHours * hourlyCost);

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>ROI Calculator</h1>
        <p className="mb-12" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
          See how much Launchpad saves you in time and cost.
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Attendees per event</label>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                <span>50</span>
                <span className="font-mono" style={{ color: 'var(--color-accent)' }}>{attendees}</span>
                <span>2000</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Events per year</label>
              <input
                type="range"
                min="1"
                max="12"
                value={eventsPerYear}
                onChange={(e) => setEventsPerYear(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                <span>1</span>
                <span className="font-mono" style={{ color: 'var(--color-accent)' }}>{eventsPerYear}</span>
                <span>12</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Your hourly cost ($)</label>
              <input
                type="range"
                min="25"
                max="200"
                step="5"
                value={hourlyCost}
                onChange={(e) => setHourlyCost(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                <span>$25</span>
                <span className="font-mono" style={{ color: 'var(--color-accent)' }}>${hourlyCost}</span>
                <span>$200</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-2xl text-center" style={{ background: 'rgba(79,255,223,0.1)', border: '1px solid rgba(79,255,223,0.3)' }}>
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}>
                ${costSaved.toLocaleString()}
              </div>
              <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Estimated annual savings</div>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th className="px-6 py-3 text-left font-medium"></th>
                    <th className="px-6 py-3 text-left font-medium">Traditional</th>
                    <th className="px-6 py-3 text-left font-medium" style={{ color: 'var(--color-accent)' }}>Launchpad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <td className="px-6 py-3" style={{ color: 'var(--color-text-muted)' }}>Planning hours/year</td>
                    <td className="px-6 py-3">{Math.round(traditionalHours)}</td>
                    <td className="px-6 py-3" style={{ color: 'var(--color-accent)' }}>{Math.round(launchpadHours)}</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <td className="px-6 py-3" style={{ color: 'var(--color-text-muted)' }}>Labor cost/year</td>
                    <td className="px-6 py-3">${traditionalCost.toLocaleString()}</td>
                    <td className="px-6 py-3" style={{ color: 'var(--color-accent)' }}>${launchpadCost.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <td className="px-6 py-3" style={{ color: 'var(--color-text-muted)' }}>Time to first draft</td>
                    <td className="px-6 py-3">2-4 weeks</td>
                    <td className="px-6 py-3" style={{ color: 'var(--color-accent)' }}>60 seconds</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Link href="/create" className="block p-4 rounded-xl text-center font-semibold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
              Start saving time →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
