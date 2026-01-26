const unifiedLeads = [
  { id: 1, name: 'Rahul Sharma', source: 'Facebook + WhatsApp', status: 'Merged' },
  { id: 2, name: 'Priya Patel', source: 'Website', status: 'Verified' },
  { id: 3, name: 'Amit Kumar', source: '99acres + Housing', status: 'Merged' },
  { id: 4, name: 'Sneha Gupta', source: 'Referral', status: 'Ready' },
]

const statusStyles = {
  Merged: 'bg-purple-100 text-purple-700',
  Verified: 'bg-green-100 text-green-700',
  Ready: 'bg-blue-100 text-blue-700',
}

function Aggregation() {
  return (
    <div className="min-h-screen w-full bg-slate-50 px-6 py-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          CAI-ROS Lead Command Center
        </h1>
        <p className="text-lg text-slate-500">
          Unified view of all incoming leads
        </p>
      </div>

      {/* Stats Row */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-slate-800">23</p>
              <p className="text-sm text-slate-500 mt-1">Total leads today</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-500">4</p>
              <p className="text-sm text-slate-500 mt-1">Duplicates removed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">19</p>
              <p className="text-sm text-slate-500 mt-1">Ready for qualification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead List */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-700">Unified Leads</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {unifiedLeads.map((lead) => (
              <li key={lead.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-slate-800">{lead.name}</p>
                  <p className="text-sm text-slate-500">{lead.source}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[lead.status]}`}
                >
                  {lead.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Aggregation
