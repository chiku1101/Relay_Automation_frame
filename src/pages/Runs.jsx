import React, { useState } from 'react';
import { Play, Filter, Search } from 'lucide-react';

const Runs = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="card stat-card">
          <div className="stat-label">Active executions</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">0 running · 0 queued</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Executions · last 24h</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">No executions recorded</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Pass rate</div>
          <div className="stat-value">--</div>
          <div className="stat-desc">Awaiting first test run</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Average duration</div>
          <div className="stat-value">--</div>
          <div className="stat-desc">No duration telemetry</div>
        </div>
      </div>

      <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['all', 'running', 'passed', 'failed'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={filter === item ? 'pill pill-active' : 'pill'}
              style={{ textTransform: 'capitalize', padding: '6px 14px', fontSize: '12px' }}
            >
              {item === 'all' ? 'All runs (0)' : item}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <input
              type="text"
              placeholder="Search run ID or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              style={{ height: '36px', fontSize: '13px', paddingLeft: '12px' }}
            />
          </div>
          <button className="btn btn-secondary" style={{ height: '36px', fontSize: '13px' }}>
            <Filter size={14} /> Filter
          </button>
          <button className="btn btn-primary" style={{ height: '36px', fontSize: '13px' }}>
            <Play size={14} fill="currentColor" /> Trigger Run
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '14px 20px' }}>RUN ID & NAME</th>
              <th style={{ padding: '14px 20px' }}>TEST PLAN</th>
              <th style={{ padding: '14px 20px' }}>TARGET DEVICE</th>
              <th style={{ padding: '14px 20px' }}>STATUS & PROGRESS</th>
              <th style={{ padding: '14px 20px' }}>DURATION</th>
              <th style={{ padding: '14px 20px' }}>TRIGGERED BY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Play size={20} fill="#2563eb" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>
                    No test runs found
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, maxWidth: '420px', lineHeight: '1.5' }}>
                    There are no test runs matching your criteria. Select a test plan from your catalog or trigger a new execution to get started.
                  </p>
                  <div style={{ marginTop: '8px' }}>
                    <button className="btn btn-primary" style={{ height: '36px', fontSize: '13px' }}>
                      <Play size={13} fill="currentColor" /> Trigger New Test Run
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Runs;
