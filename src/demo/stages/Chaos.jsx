import { useState, useEffect } from 'react'

const mockLeads = [
  { id: 1, name: 'Rahul Sharma', source: 'Facebook' },
  { id: 2, name: 'Priya Patel', source: 'Website' },
  { id: 3, name: 'Amit Kumar', source: 'WhatsApp' },
  { id: 4, name: 'Sneha Gupta', source: '99acres' },
  { id: 5, name: 'Vikram Singh', source: 'Housing' },
  { id: 6, name: 'Ananya Reddy', source: 'Referral' },
]

const sourceStyles = {
  Facebook: { bg: '#1877F2', text: '#fff' },
  Website: { bg: '#10B981', text: '#fff' },
  WhatsApp: { bg: '#25D366', text: '#fff' },
  '99acres': { bg: '#E53935', text: '#fff' },
  Housing: { bg: '#F97316', text: '#fff' },
  Referral: { bg: '#8B5CF6', text: '#fff' },
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
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.title}>Leads Coming In From Everywhere</h1>
        <p style={styles.subtitle}>Multiple platforms. No control.</p>
      </div>

      {/* Lead Cards */}
      <div style={styles.cardContainer}>
        {visibleLeads.map((lead, index) => (
          <div
            key={lead.id}
            style={{
              ...styles.card,
              opacity: 1,
              transform: 'translateY(0)',
              animation: 'slideIn 0.4s ease-out',
            }}
          >
            <div style={styles.cardContent}>
              <span style={styles.leadName}>{lead.name}</span>
              <span
                style={{
                  ...styles.sourceLabel,
                  backgroundColor: sourceStyles[lead.source].bg,
                  color: sourceStyles[lead.source].text,
                }}
              >
                {lead.source}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '80px',
    paddingBottom: '40px',
    paddingLeft: '24px',
    paddingRight: '24px',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  title: {
    fontSize: '42px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: '400',
    color: '#94a3b8',
    margin: '0',
    letterSpacing: '0.2px',
  },
  cardContainer: {
    width: '100%',
    maxWidth: '520px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px 24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leadName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    letterSpacing: '-0.2px',
  },
  sourceLabel: {
    fontSize: '13px',
    fontWeight: '500',
    padding: '6px 14px',
    borderRadius: '20px',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
}

export default Chaos
