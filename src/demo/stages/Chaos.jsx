import { useState, useEffect } from 'react'

const mockLeads = [
  { id: 1, name: 'Rahul Sharma', source: 'Facebook' },
  { id: 2, name: 'Priya Patel', source: 'Website' },
  { id: 3, name: 'Amit Kumar', source: 'WhatsApp' },
  { id: 4, name: 'Sneha Gupta', source: '99acres' },
  { id: 5, name: 'Vikram Singh', source: 'Housing' },
  { id: 6, name: 'Ananya Reddy', source: 'Referral' },
]

const sourceColors = {
  Facebook: 'bg-blue-600',
  Website: 'bg-green-600',
  WhatsApp: 'bg-emerald-500',
  '99acres': 'bg-red-500',
  Housing: 'bg-orange-500',
  Referral: 'bg-purple-500',
}

function Chaos() {
  const [visibleLeads, setVisibleLeads] = useState([])

  useEffect(() => {
    if (visibleLeads.length < mockLeads.length) {
      const timer = setTimeout(() => {
        setVisibleLeads((prev) => [...prev, mockLeads[prev.length]])
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [visibleLeads])

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">
        Leads Coming In From Everywhere
      </h1>

      <div className="w-full max-w-md space-y-3">
        {visibleLeads.map((lead) => (
          <div
            key={lead.id}
            className="bg-gray-800 rounded-lg p-4 flex items-center justify-between shadow-lg animate-pulse-once"
          >
            <span className="text-white font-medium">{lead.name}</span>
            <span
              className={`${sourceColors[lead.source]} text-white text-sm px-3 py-1 rounded-full`}
            >
              {lead.source}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Chaos
