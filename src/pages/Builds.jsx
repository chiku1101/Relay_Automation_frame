import React, { useState } from 'react';
import { Box, Upload, Terminal, Search } from 'lucide-react';

const Builds = () => {
  const [channel, setChannel] = useState('all');
  const [search, setSearch] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="card stat-card">
          <div className="stat-label">Current release</div>
          <div className="stat-value">--</div>
          <div className="stat-desc">No release published</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Release candidate</div>
          <div className="stat-value">--</div>
          <div className="stat-desc">No active RC bundle</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">CI verification rate</div>
          <div className="stat-value">--</div>
          <div className="stat-desc">Awaiting build webhook</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Total build artifacts</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">0 binaries stored</div>
        </div>
      </div>

      <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['all', 'stable', 'release-candidate', 'nightly'].map((item) => (
            <button
              key={item}
              onClick={() => setChannel(item)}
              className={channel === item ? 'pill pill-active' : 'pill'}
              style={{ textTransform: 'capitalize', padding: '6px 14px', fontSize: '12px' }}
            >
              {item === 'all' ? 'All channels (0)' : item.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <input
              type="text"
              placeholder="Search version or commit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              style={{ height: '36px', fontSize: '13px', paddingLeft: '12px' }}
            />
          </div>
          <button className="btn btn-secondary" style={{ height: '36px', fontSize: '13px' }}>
            <Terminal size={14} /> CI Logs
          </button>
          <button className="btn btn-primary" style={{ height: '36px', fontSize: '13px' }}>
            <Upload size={14} /> Upload Build Artifact
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '14px 20px' }}>ARTIFACT / RELEASE TAG</th>
              <th style={{ padding: '14px 20px' }}>CHANNEL</th>
              <th style={{ padding: '14px 20px' }}>BRANCH & COMMIT</th>
              <th style={{ padding: '14px 20px' }}>VERIFICATION</th>
              <th style={{ padding: '14px 20px' }}>PACKAGE SIZE</th>
              <th style={{ padding: '14px 20px' }}>BUILD TIMESTAMP</th>
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
                    <Box size={22} color="#2563eb" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>
                    No build artifacts uploaded
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, maxWidth: '420px', lineHeight: '1.5' }}>
                    Upload compiled firmware packages (.bin, .img) or connect GitHub Actions / GitLab CI webhooks to store test builds.
                  </p>
                  <div style={{ marginTop: '8px' }}>
                    <button className="btn btn-primary" style={{ height: '36px', fontSize: '13px' }}>
                      <Upload size={14} /> Upload First Build
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

export default Builds;
