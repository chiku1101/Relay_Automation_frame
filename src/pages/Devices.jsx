import React, { useState } from 'react';
import { Smartphone, Plus, RefreshCw, Search } from 'lucide-react';

const Devices = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="card stat-card">
          <div className="stat-label">Total fleet nodes</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">No hardware registered</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Online & ready</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">0 available for test plans</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Currently in soak</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">0 executing suites</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Fleet health index</div>
          <div className="stat-value">--</div>
          <div className="stat-desc">Awaiting node telemetry</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['all', 'online', 'busy', 'offline'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={filter === item ? 'pill pill-active' : 'pill'}
              style={{ textTransform: 'capitalize', padding: '6px 14px', fontSize: '12px' }}
            >
              {item === 'all' ? 'All fleet (0)' : item}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <input
              type="text"
              placeholder="Filter serial or IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              style={{ height: '36px', fontSize: '13px', paddingLeft: '12px' }}
            />
          </div>
          <button className="btn btn-secondary" style={{ height: '36px', fontSize: '13px' }}>
            <RefreshCw size={14} /> Ping Fleet
          </button>
          <button className="btn btn-primary" style={{ height: '36px', fontSize: '13px' }}>
            <Plus size={14} /> Register Device
          </button>
        </div>
      </div>

      {/* Devices Table with Clean Empty State */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '14px 20px' }}>DEVICE / SERIAL</th>
              <th style={{ padding: '14px 20px' }}>ROLE & BENCH</th>
              <th style={{ padding: '14px 20px' }}>IP ADDRESS</th>
              <th style={{ padding: '14px 20px' }}>STATUS</th>
              <th style={{ padding: '14px 20px' }}>BATTERY & TEMP</th>
              <th style={{ padding: '14px 20px' }}>FIRMWARE</th>
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
                    <Smartphone size={22} color="#2563eb" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>
                    No devices registered in fleet
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, maxWidth: '420px', lineHeight: '1.5' }}>
                    Connect physical Relay hardware benches, USB-tethered units, or virtual device instances to run automation.
                  </p>
                  <div style={{ marginTop: '8px' }}>
                    <button className="btn btn-primary" style={{ height: '36px', fontSize: '13px' }}>
                      <Plus size={14} /> Register First Device
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

export default Devices;
