import { useState, useEffect } from 'react';

export default function App() {
  const [guideStep, setGuideStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({
    createTicket: false,
    useFilter: false,
    resolveTicket: false,
  });

  const [formData, setFormData] = useState({
    title: '',
    department: 'Information Systems',
    priority: 'Medium'
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('servicedesk_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      { id: 'INC-1042', title: 'Single Sign-On authentication failure on HR portal', priority: 'High', status: 'In Progress', department: 'Information Systems' },
      { id: 'INC-1041', title: 'Provision role-based permissions for CRM onboarding', priority: 'Medium', status: 'Open', department: 'Infrastructure' },
      { id: 'INC-1039', title: 'Deploy software patch to training lab workstations', priority: 'Low', status: 'Resolved', department: 'Technical Support' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('servicedesk_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTicket = {
      id: `INC-${1043 + tickets.length - 3}`,
      title: formData.title,
      department: formData.department,
      priority: formData.priority,
      status: 'Open'
    };

    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
    setGuideStep(3);
    setCompletedTasks(prev => ({ ...prev, createTicket: true }));
    setFormData({ title: '', department: 'Information Systems', priority: 'Medium' });
  };

  const handleDelete = (idToDelete) => {
    setTickets(tickets.filter(ticket => ticket.id !== idToDelete));
  };

  const handleResolve = (idToResolve) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === idToResolve) {
        return { ...ticket, status: 'Resolved' };
      }
      return ticket;
    }));
    setCompletedTasks(prev => ({ ...prev, resolveTicket: true }));
  };

  const handleReopen = (idToReopen) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === idToReopen) {
        return { ...ticket, status: 'In Progress' };
      }
      return ticket;
    }));
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'All' || ticket.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', width: '100%', overflowX: 'hidden' }}>
      
      {/* Top Bar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            IS
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>ServiceDesk Enterprise</h1>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Interactive Digital Adoption Simulator</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Adoption Journey</div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb' }}>
              {guideStep === 3 ? '🎉 Done!' : `Step ${guideStep} of 3`}
            </div>
          </div>
          <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${(guideStep / 3) * 100}%`,
              height: '100%',
              background: guideStep === 3 ? '#16a34a' : '#2563eb',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, padding: '16px 12px 90px', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        {/* Step 3 Banner */}
        {guideStep === 3 && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h3 style={{ fontSize: '14px', color: '#166534', fontWeight: '700', margin: '0 0 4px 0' }}>
                Outstanding! Incident created 🌟
              </h3>
              <p style={{ fontSize: '12px', color: '#15803d', margin: 0 }}>
                You completed the adoption workflow.
              </p>
            </div>
            <button
              onClick={() => setGuideStep(1)}
              style={{
                background: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Restart
            </button>
          </div>
        )}

        {/* Title */}
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' }}>
            Incident Management
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            Track, prioritize, and manage internal IT service requests
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              className={guideStep === 1 ? 'guided-pulse' : ''}
              onClick={() => {
                setIsModalOpen(true);
                if (guideStep === 1) setGuideStep(2);
              }}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>+</span>
              <span>New Incident</span>
            </button>

            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: '1 1 120px',
                padding: '7px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
                background: '#fff'
              }}
            />

            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                setCompletedTasks(prev => ({ ...prev, useFilter: true }));
              }}
              style={{
                padding: '7px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#fff',
                color: '#334155'
              }}
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Med</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Guide Step 1 Banner */}
          {guideStep === 1 && (
            <div
              style={{
                background: '#1e293b',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <span>💡</span>
              <div style={{ fontSize: '12px' }}>
                <b style={{ color: '#60a5fa' }}>Step 1: </b> Click <b>"New Incident"</b> to submit a ticket.
              </div>
            </div>
          )}
        </div>

        {/* Responsive Table Container with Visible Horizontal Scroll */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          width: '100%',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          <table style={{
            width: '100%',
            minWidth: '640px',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '13px'
          }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 12px', fontWeight: '600', width: '80px' }}>ID</th>
                <th style={{ padding: '10px 12px', fontWeight: '600' }}>Summary</th>
                <th style={{ padding: '10px 12px', fontWeight: '600', width: '130px' }}>Department</th>
                <th style={{ padding: '10px 12px', fontWeight: '600', width: '80px' }}>Priority</th>
                <th style={{ padding: '10px 12px', fontWeight: '600', width: '95px' }}>Status</th>
                <th style={{ padding: '10px 12px', fontWeight: '600', width: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket, index) => (
                <tr key={ticket.id} style={{
                  borderBottom: index !== filteredTickets.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <td style={{ padding: '10px 12px', fontWeight: '600', color: '#2563eb', whiteSpace: 'nowrap' }}>
                    {ticket.id}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#0f172a', wordBreak: 'break-word' }}>
                    {ticket.title}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#64748b' }}>
                    {ticket.department}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: ticket.priority === 'High' ? '#fef2f2' : ticket.priority === 'Medium' ? '#fffbeb' : '#f0fdf4',
                      color: ticket.priority === 'High' ? '#b91c1c' : ticket.priority === 'Medium' ? '#b45309' : '#15803d'
                    }}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: ticket.status === 'In Progress' ? '#eff6ff' : ticket.status === 'Open' ? '#f8fafc' : '#f1f5f9',
                      color: ticket.status === 'In Progress' ? '#1d4ed8' : '#475569'
                    }}>
                      {ticket.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {ticket.status !== 'Resolved' ? (
                        <button
                          onClick={() => handleResolve(ticket.id)}
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}
                        >
                          ✓ Resolve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReopen(ticket.id)}
                          style={{
                            background: '#fffbeb',
                            border: '1px solid #fde68a',
                            color: '#b45309',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}
                        >
                          ↺ Reopen
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(ticket.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: '500',
                          padding: '2px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Floating Adoption Widget */}
      <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 40 }}>
        {!isWidgetOpen ? (
          <button
            onClick={() => setIsWidgetOpen(true)}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '12px'
            }}
          >
            <span>💡</span>
            <span>Adoption Assistant</span>
          </button>
        ) : (
          <div style={{
            width: '280px',
            maxWidth: 'calc(100vw - 32px)',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '700' }}>Adoption Assistant</h4>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>ServiceDesk Training</span>
              </div>
              <button
                onClick={() => setIsWidgetOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '14px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '12px' }}>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                  <span>Interactive Objectives</span>
                  <span>{Math.round(((completedTasks.createTicket ? 1 : 0) + (completedTasks.useFilter ? 1 : 0) + (completedTasks.resolveTicket ? 1 : 0)) / 3 * 100)}%</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${((completedTasks.createTicket ? 1 : 0) + (completedTasks.useFilter ? 1 : 0) + (completedTasks.resolveTicket ? 1 : 0)) / 3 * 100}%`,
                    height: '100%',
                    background: '#2563eb',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: completedTasks.createTicket ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${completedTasks.createTicket ? '#bbf7d0' : '#e2e8f0'}`
                }}>
                  <span>{completedTasks.createTicket ? '✅' : '⚪'}</span>
                  <span style={{ fontSize: '11px', fontWeight: '500', color: completedTasks.createTicket ? '#166534' : '#334155' }}>
                    Create first incident
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: completedTasks.useFilter ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${completedTasks.useFilter ? '#bbf7d0' : '#e2e8f0'}`
                }}>
                  <span>{completedTasks.useFilter ? '✅' : '⚪'}</span>
                  <span style={{ fontSize: '11px', fontWeight: '500', color: completedTasks.useFilter ? '#166534' : '#334155' }}>
                    Filter by priority
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: completedTasks.resolveTicket ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${completedTasks.resolveTicket ? '#bbf7d0' : '#e2e8f0'}`
                }}>
                  <span>{completedTasks.resolveTicket ? '✅' : '⚪'}</span>
                  <span style={{ fontSize: '11px', fontWeight: '500', color: completedTasks.resolveTicket ? '#166534' : '#334155' }}>
                    Resolve an incident
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setGuideStep(1);
                  setIsWidgetOpen(false);
                }}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '6px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#2563eb',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Relaunch Guide
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '12px'
          }}
        >
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Create Incident</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>
                  Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Unable to generate report"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Information Systems">Information Systems</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: guideStep === 2 ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                {guideStep === 2 && (
                  <div style={{
                    marginTop: '8px',
                    background: '#1e293b',
                    color: '#ffffff',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    fontSize: '11px',
                    lineHeight: '1.4'
                  }}>
                    <b style={{ color: '#60a5fa' }}>💡 Step 2:</b> Select priority according to SLA and click Submit.
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '7px 12px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#475569',
                    fontWeight: '600',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '7px 16px',
                    background: '#2563eb',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}