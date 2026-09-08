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

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    department: 'Information Systems',
    priority: 'Medium'
  });

  // System tickets data
  // System tickets data with localStorage support
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('servicedesk_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // במקרה של שגיאה בקריאה, נשתמש בברירת המחדל
      }
    }
    return [
      { id: 'INC-1042', title: 'Single Sign-On authentication failure on HR portal', priority: 'High', status: 'In Progress', department: 'Information Systems' },
      { id: 'INC-1041', title: 'Provision role-based permissions for CRM onboarding', priority: 'Medium', status: 'Open', department: 'Infrastructure' },
      { id: 'INC-1039', title: 'Deploy software patch to training lab workstations', priority: 'Low', status: 'Resolved', department: 'Technical Support' },
    ];
  });

  // Save tickets to localStorage whenever the tickets array changes
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
    setGuideStep(3); // Move to completion step
    setCompletedTasks(prev => ({ ...prev, createTicket: true }));
    setFormData({ title: '', department: 'Information Systems', priority: 'Medium' });
  };

  // Delete ticket by ID
  const handleDelete = (idToDelete) => {
    setTickets(tickets.filter(ticket => ticket.id !== idToDelete));
  };

  // Toggle ticket status to Resolved
  const handleResolve = (idToResolve) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === idToResolve) {
        return { ...ticket, status: 'Resolved' };
      }
      return ticket;
    }));
    setCompletedTasks(prev => ({ ...prev, resolveTicket: true }));
  };

  // Reopen ticket back to In Progress
  const handleReopen = (idToReopen) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === idToReopen) {
        return { ...ticket, status: 'In Progress' };
      }
      return ticket;
    }));
  };

  // Calculate system metrics dynamically
  const totalTickets = tickets.length;
  const highPriorityCount = tickets.filter(t => t.priority === 'High').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  // Filter tickets by search term and priority
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'All' || ticket.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Top Navigation Bar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
          }}>
            IS
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>ServiceDesk Enterprise</h1>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Interactive Digital Adoption Simulator</span>
          </div>
        </div>

        {/* Adoption Progress Tracker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Adoption Journey</div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>
              {guideStep === 3 ? '🎉 Mission Completed!' : `Step ${guideStep} of 3`}
            </div>
          </div>
          <div style={{ width: '80px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${(guideStep / 3) * 100}%`,
              height: '100%',
              background: guideStep === 3 ? '#16a34a' : '#2563eb',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

        {/* Step 3 Success Celebration Banner */}
        {guideStep === 3 && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: '16px', color: '#166534', fontWeight: '700', marginBottom: '4px' }}>
                Outstanding! Incident successfully created 🌟
              </h3>
              <p style={{ fontSize: '13px', color: '#15803d', margin: 0 }}>
                You have completed the guided workflow. The new incident has been added to the enterprise log.
              </p>
            </div>
            <button
              onClick={() => setGuideStep(1)}
              style={{
                background: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Restart Simulation
            </button>
          </div>
        )}

        {/* Header & Trigger Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          position: 'relative'
        }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>Incident Management</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
              Track, prioritize, and manage internal IT service requests
            </p>
          </div>

          <div style={{ position: 'relative' }}>
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
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: guideStep === 1 ? '0 0 0 4px rgba(37, 99, 235, 0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>+</span>
              <span>New Incident</span>
            </button>

            {/* Step 1 Interactive Tooltip */}
            {guideStep === 1 && (
              <div
                className="animate-pop"
                style={{
                  position: 'absolute',
                  top: '52px',
                  right: '0',
                  width: '280px',
                  background: '#1e293b',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                  zIndex: 20
                }}>
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '28px',
                  width: '12px',
                  height: '12px',
                  background: '#1e293b',
                  transform: 'rotate(45deg)'
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span>💡</span>
                  <span style={{ fontWeight: '700', fontSize: '13px', color: '#60a5fa' }}>Step 1: Create Ticket</span>
                </div>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
                  To submit an issue or request support, click <b>"New Incident"</b>.
                </p>
              </div>

            )}
          </div>
          {/* Search & Filter Toolbar */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Search by ID or summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                background: '#ffffff',
                outline: 'none'
              }}
            />
            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                setCompletedTasks(prev => ({ ...prev, useFilter: true }));
              }}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                background: '#ffffff',
                color: '#334155'
              }}
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Incidents Data Table */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '14px 20px', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '14px 20px', fontWeight: '600' }}>Summary</th>
                <th style={{ padding: '14px 20px', fontWeight: '600' }}>Department</th>
                <th style={{ padding: '14px 20px', fontWeight: '600' }}>Priority</th>
                <th style={{ padding: '14px 20px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '14px 20px', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket, index) => (
                <tr key={ticket.id} style={{
                  borderBottom: index !== tickets.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <td style={{ padding: '14px 20px', fontWeight: '600', color: '#2563eb' }}>{ticket.id}</td>
                  <td style={{ padding: '14px 20px', color: '#0f172a' }}>{ticket.title}</td>
                  <td style={{ padding: '14px 20px', color: '#64748b' }}>{ticket.department}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: ticket.priority === 'High' ? '#fef2f2' : ticket.priority === 'Medium' ? '#fffbeb' : '#f0fdf4',
                      color: ticket.priority === 'High' ? '#b91c1c' : ticket.priority === 'Medium' ? '#b45309' : '#15803d'
                    }}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: ticket.status === 'In Progress' ? '#eff6ff' : ticket.status === 'Open' ? '#f8fafc' : '#f1f5f9',
                      color: ticket.status === 'In Progress' ? '#1d4ed8' : '#475569'
                    }}>
                      {ticket.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {ticket.status !== 'Resolved' ? (
                      <button
                        onClick={() => handleResolve(ticket.id)}
                        style={{
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          color: '#1d4ed8',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
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
                          padding: '3px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
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
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {/* Floating Digital Adoption Widget */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 40 }}>
        {!isWidgetOpen ? (
          /* כפתור הפתיחה הצף */
          <button
            onClick={() => setIsWidgetOpen(true)}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '24px',
              padding: '12px 20px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            <span>💡</span>
            <span>Adoption Assistant</span>
          </button>
        ) : (
          /* הפאנל שנפתח */
          <div style={{
            width: '320px',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {/* כותרת הפאנל */}
            <div style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Adoption Assistant</h4>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>ServiceDesk Self-Paced Training</span>
              </div>
              <button
                onClick={() => setIsWidgetOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* תוכן הפאנל: התקדמות ומשימות */}
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>
                  <span>Interactive Objectives</span>
                  <span>{Math.round(((completedTasks.createTicket ? 1 : 0) + (completedTasks.useFilter ? 1 : 0) + (completedTasks.resolveTicket ? 1 : 0)) / 3 * 100)}%</span>                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${((completedTasks.createTicket ? 1 : 0) + (completedTasks.useFilter ? 1 : 0) + (completedTasks.resolveTicket ? 1 : 0)) / 3 * 100}%`, height: '100%',
                    background: '#2563eb',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: completedTasks.createTicket ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${completedTasks.createTicket ? '#bbf7d0' : '#e2e8f0'}`
                }}>
                  <span>{completedTasks.createTicket ? '✅' : '⚪'}</span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: completedTasks.createTicket ? '#166534' : '#334155' }}>
                    Create first incident
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: completedTasks.useFilter ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${completedTasks.useFilter ? '#bbf7d0' : '#e2e8f0'}`
                }}>
                  <span>{completedTasks.useFilter ? '✅' : '⚪'}</span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: completedTasks.useFilter ? '#166534' : '#334155' }}>
                    Filter incidents by priority
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: completedTasks.resolveTicket ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${completedTasks.resolveTicket ? '#bbf7d0' : '#e2e8f0'}`
                }}>
                  <span>{completedTasks.resolveTicket ? '✅' : '⚪'}</span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: completedTasks.resolveTicket ? '#166534' : '#334155' }}>
                    Resolve an open incident
                  </span>
                </div>
              </div>

              {/* כפתור הפעלה מחדש של הסיור המודרך */}
              <button
                onClick={() => {
                  setGuideStep(1);
                  setIsWidgetOpen(false);
                }}
                style={{
                  width: '100%',
                  marginTop: '18px',
                  padding: '9px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#2563eb',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Relaunch Walkthrough Guide
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Modal - Incident Form */}
      {isModalOpen && (
        <div
          className="animate-pop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '20px'
          }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Create Service Incident</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Incident Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Unable to generate monthly analytics report"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Assignment Group
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    background: '#ffffff'
                  }}
                >
                  <option value="Information Systems">Information Systems</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>

              {/* Priority Field with Step 2 Tooltip */}
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                  Impact / Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: guideStep === 2 ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    fontSize: '14px',
                    background: '#ffffff'
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                {guideStep === 2 && (
                  <div style={{
                    position: 'absolute',
                    top: '72px',
                    left: '0',
                    right: '0',
                    background: '#1e293b',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    zIndex: 60
                  }}>
                    <div style={{ fontWeight: '700', color: '#60a5fa', marginBottom: '2px' }}>
                      💡 Step 2: Accurate Classification
                    </div>
                    Select the priority based on organizational SLA rules. Once filled, submit the incident to complete the adoption task.
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: guideStep === 2 ? '70px' : '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '9px 18px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#475569',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    background: '#2563eb',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}