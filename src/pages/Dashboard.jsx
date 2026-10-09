import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

const chartData = [
  { name: '0829', solidVal: 93.8, dashedVal: null },
  { name: '0905', solidVal: 94.5, dashedVal: null },
  { name: '0912', solidVal: 95.8, dashedVal: null },
  { name: '0919', solidVal: 96.3, dashedVal: 96.3 },
  { name: '0926', solidVal: null, dashedVal: 95.1 },
];

const CustomizedDot = (props) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy) return null;
  if (payload.name === '0926') {
    return (
      <g key="dot-0926">
        <circle cx={cx} cy={cy} r={4} fill="#2563eb" />
        <text x={cx + 6} y={cy + 4} fill="#111827" fontSize="11" fontWeight="700">
          95.1%
        </text>
      </g>
    );
  }
  return <circle key={`dot-${payload.name}`} cx={cx} cy={cy} r={3.5} fill="#2563eb" />;
};

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-label">Active runs</div>
          <div className="stat-value">3</div>
          <div className="stat-desc">2 running · 1 queued</div>
        </div>
        
        <div className="card stat-card">
          <div className="stat-label">Pass rate · build 0926</div>
          <div className="stat-value">95.1%</div>
          <div className="stat-desc stat-trend-down">▼ 1.2 pts vs 0919</div>
        </div>
        
        <div className="card stat-card">
          <div className="stat-label">Executions · last 7 days</div>
          <div className="stat-value">1,284</div>
          <div className="stat-desc">1,221 pass · 51 fail · 12 skip</div>
        </div>
        
        <div className="card stat-card">
          <div className="stat-label">Devices</div>
          <div className="stat-value">4</div>
          <div className="stat-desc">3 online · 1 offline</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Open failures</div>
          <div className="stat-value">17</div>
          <div className="stat-desc">9 new · 5 known · 3 flaky</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Automation coverage</div>
          <div className="stat-value">72%</div>
          <div className="stat-desc">345 of 480 planned cases</div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '0' }}>
            <div className="card-header" style={{ padding: '20px 24px 16px', marginBottom: '0' }}>
              <div className="card-title" style={{ fontSize: '15px' }}>Active and recent runs</div>
              <a href="#" className="link">All runs</a>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>Run</th>
                  <th>Plan</th>
                  <th>Build</th>
                  <th>Devices</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th style={{ paddingRight: '24px' }}>Triggered by</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: '500', paddingLeft: '24px' }}>#1047</td>
                  <td style={{ fontWeight: '600', lineHeight: '1.3' }}>Nightly<br />Regression</td>
                  <td style={{ fontSize: '13px', color: '#374151', lineHeight: '1.3' }}>2.4.0<br />(0926)</td>
                  <td style={{ fontSize: '13px' }}>X-001, M-<br />002</td>
                  <td style={{ width: '190px' }}>
                    <div className="progress-bar" style={{ height: '5px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                      <div className="progress-fill" style={{ width: '62%', height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }}></div>
                    </div>
                    <div className="progress-text" style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>214 / 345 · step 4 of 8</div>
                  </td>
                  <td><span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>Running</span></td>
                  <td style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.3', paddingRight: '24px' }}>Schedule ·<br />Nightly</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '500', paddingLeft: '24px' }}>#1048</td>
                  <td style={{ fontWeight: '600' }}>PTT Smoke</td>
                  <td style={{ fontSize: '13px', color: '#374151', lineHeight: '1.3' }}>2.4.0<br />(0926)</td>
                  <td style={{ fontSize: '13px' }}>M-002</td>
                  <td style={{ width: '190px' }}>
                    <div className="progress-bar" style={{ height: '5px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}></div>
                    <div className="progress-text" style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Waits for M-002</div>
                  </td>
                  <td><span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>Queued</span></td>
                  <td style={{ fontSize: '12px', color: '#6b7280', paddingRight: '24px' }}>CI · new build</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '500', paddingLeft: '24px' }}>#1045</td>
                  <td style={{ fontWeight: '600' }}>Soak · 7 days</td>
                  <td style={{ fontSize: '13px', color: '#374151', lineHeight: '1.3' }}>2.4.0<br />(0923)</td>
                  <td style={{ fontSize: '13px' }}>X-002</td>
                  <td style={{ width: '190px' }}>
                    <div className="progress-bar" style={{ height: '5px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                      <div className="progress-fill" style={{ width: '40%', height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }}></div>
                    </div>
                    <div className="progress-text" style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Day 3 of 7</div>
                  </td>
                  <td><span className="badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>Soaking</span></td>
                  <td style={{ fontSize: '12px', color: '#6b7280', paddingRight: '24px' }}>Santosh S</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '500', paddingLeft: '24px' }}>#1044</td>
                  <td style={{ fontWeight: '600', lineHeight: '1.3' }}>OTA 2.3.9 →<br />2.4.0</td>
                  <td style={{ fontSize: '13px', color: '#374151', lineHeight: '1.3' }}>2.4.0<br />(0926)</td>
                  <td style={{ fontSize: '13px' }}>X-001</td>
                  <td style={{ width: '190px' }}>
                    <div className="progress-bar" style={{ height: '5px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                      <div className="progress-fill" style={{ width: '100%', height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }}></div>
                    </div>
                    <div className="progress-text" style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>24 / 24</div>
                  </td>
                  <td><span className="badge" style={{ background: '#dcfce7', color: '#15803d' }}>Passed</span></td>
                  <td style={{ fontSize: '12px', color: '#6b7280', paddingRight: '24px' }}>CI · new build</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '500', paddingLeft: '24px' }}>#1043</td>
                  <td style={{ fontWeight: '600', lineHeight: '1.3' }}>Nightly<br />Regression</td>
                  <td style={{ fontSize: '13px', color: '#374151', lineHeight: '1.3' }}>2.4.0<br />(0925)</td>
                  <td style={{ fontSize: '13px' }}>M-002</td>
                  <td style={{ width: '190px' }}>
                    <div className="progress-bar" style={{ height: '5px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                      <div className="progress-fill" style={{ width: '100%', height: '100%', backgroundColor: '#b91c1c', borderRadius: '3px' }}></div>
                    </div>
                    <div className="progress-text" style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>331 pass · 14 fail</div>
                  </td>
                  <td><span className="badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Failed</span></td>
                  <td style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.3', paddingRight: '24px' }}>Schedule ·<br />Nightly</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '500', paddingLeft: '24px' }}>#1042</td>
                  <td style={{ fontWeight: '600', lineHeight: '1.3' }}>Bootloader<br />Sanity</td>
                  <td style={{ fontSize: '13px', color: '#374151', lineHeight: '1.3' }}>2.4.0<br />(0925)</td>
                  <td style={{ fontSize: '13px' }}>M-001</td>
                  <td style={{ width: '190px' }}>
                    <div className="progress-bar" style={{ height: '5px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                      <div className="progress-fill" style={{ width: '28%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '3px' }}></div>
                    </div>
                    <div className="progress-text" style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Device went offline</div>
                  </td>
                  <td><span className="badge" style={{ background: '#fef3c7', color: '#b45309' }}>Aborted</span></td>
                  <td style={{ fontSize: '12px', color: '#6b7280', paddingRight: '24px' }}>Santosh S</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div className="flex-between" style={{ marginBottom: '14px' }}>
              <h2 className="card-title" style={{ margin: 0, fontSize: '15px' }}>Device fleet</h2>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Reservations prevent two runs sharing a device &nbsp; <a href="#" className="link">Monitor devices</a>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex-between mb-4">
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Relay X-001</div>
                    <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>Running</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.3' }}>
                    Android 16 ·<br />0926
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '16px', minHeight: '44px', color: '#111827', lineHeight: '1.3' }}>
                    Nightly #1047 · HAL validation · reserved until 04:30
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', marginBottom: '16px' }}>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Battery</span><span style={{ fontWeight: '500' }}>71%</span></div>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Temp</span><span style={{ fontWeight: '500' }}>37 °C</span></div>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Wi-Fi</span><span style={{ fontWeight: '500' }}>-61 dBm</span></div>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Cellular</span><span style={{ fontWeight: '500' }}>LTE -92</span></div>
                  </div>
                </div>
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '6px 12px' }}>Open live view</button>
              </div>
              
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex-between mb-4">
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Relay X-002</div>
                    <span className="badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>Soaking</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.3' }}>
                    Android 16 ·<br />0923
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '16px', minHeight: '44px', color: '#111827', lineHeight: '1.3' }}>
                    Soak #1045 · day 3 of 7 · reserved until Sep 30
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', marginBottom: '16px' }}>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Battery</span><span style={{ fontWeight: '500' }}>58%</span></div>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Temp</span><span style={{ fontWeight: '500' }}>41 °C</span></div>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Wi-Fi</span><span style={{ fontWeight: '500' }}>-66 dBm</span></div>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Cellular</span><span style={{ fontWeight: '500' }}>5G -88</span></div>
                  </div>
                </div>
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '6px 12px' }}>Open monitor</button>
              </div>

              <div className="card" style={{ padding: '16px', borderTop: '3px solid #ef4444', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex-between mb-4">
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Relay M-001</div>
                    <span className="badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Offline</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.3' }}>
                    Android 13 ·<br />0925
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '16px', minHeight: '44px', color: '#111827', lineHeight: '1.3' }}>
                    Last seen 02:14 during #1042 · adb not responding
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', marginBottom: '16px' }}>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Battery</span><span style={{ color: '#9ca3af' }}>—</span></div>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Temp</span><span style={{ color: '#9ca3af' }}>—</span></div>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Wi-Fi</span><span style={{ color: '#9ca3af' }}>—</span></div>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Cellular</span><span style={{ color: '#9ca3af' }}>—</span></div>
                  </div>
                </div>
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '12px', padding: '6px 8px', whiteSpace: 'nowrap' }}>Power-cycle (USB relay)</button>
              </div>

              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex-between mb-4">
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Relay M-002</div>
                    <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>Running</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.3' }}>
                    Android 16 ·<br />0926
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '16px', minHeight: '44px', color: '#111827', lineHeight: '1.3' }}>
                    Nightly #1047 · then PTT Smoke #1048 (queued)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', marginBottom: '16px' }}>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Battery</span><span style={{ fontWeight: '500' }}>83%</span></div>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Temp</span><span style={{ fontWeight: '500' }}>35 °C</span></div>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Wi-Fi</span><span style={{ fontWeight: '500' }}>-55 dBm</span></div>
                    <div className="flex-between"><span style={{ color: '#6b7280' }}>Cellular</span><span style={{ fontWeight: '500' }}>5G -84</span></div>
                  </div>
                </div>
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '6px 12px' }}>Open live view</button>
              </div>

            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div className="card-header" style={{ marginBottom: '16px' }}>
                <div className="card-title" style={{ fontSize: '15px' }}>Pass rate by component · 0926</div>
                <a href="#" className="link">Catalog</a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Bootloader', val: 100 },
                  { name: 'Kernel & drivers', val: 96.5 },
                  { name: 'HAL', val: 95 },
                  { name: 'Framework', val: 96.4 },
                  { name: 'System UI', val: 93.8 },
                  { name: 'Connectivity', val: 89.6, color: '#b45309' },
                  { name: 'Audio', val: 90 },
                  { name: 'PTT service', val: 80, color: '#b45309' },
                  { name: 'OTA / update', val: 100 },
                  { name: 'Security', val: 100 },
                ].map(comp => (
                  <div key={comp.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '110px', fontSize: '13px', color: '#111827' }}>{comp.name}</div>
                    <div style={{ flex: 1, height: '7px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${comp.val}%`, height: '100%', background: comp.color || '#2563eb', borderRadius: '4px' }}></div>
                    </div>
                    <div style={{ width: '42px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#111827' }}>{comp.val}%</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header" style={{ marginBottom: '12px' }}>
                  <div className="card-title" style={{ fontSize: '15px' }}>Pass rate across builds</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Full regression, Relay X</div>
                </div>
                <div style={{ height: '230px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 15, right: 35, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} dy={5} />
                      <YAxis domain={[92, 98]} ticks={[92, 94, 96, 98]} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                      <RechartsTooltip />
                      <Line 
                        type="linear" 
                        dataKey="solidVal" 
                        stroke="#2563eb" 
                        strokeWidth={2.5} 
                        dot={<CustomizedDot />} 
                        isAnimationActive={false} 
                      />
                      <Line 
                        type="linear" 
                        dataKey="dashedVal" 
                        stroke="#2563eb" 
                        strokeWidth={2.5} 
                        strokeDasharray="4 4" 
                        dot={<CustomizedDot />} 
                        isAnimationActive={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>
                Dashed point: run still in progress
              </div>
            </div>
          </div>
          
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '20px' }}>
            <div className="flex-between mb-4">
              <div className="card-title" style={{ margin: 0, fontSize: '15px' }}>Release readiness · 2.4.0 (0926)</div>
              <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>In progress</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>vs build 0919</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>4 new failures</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Fixed since 0919</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>2 tests</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Boot time</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                  21.4 s <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: '600' }}>+8%</span>
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>PTT floor-grab</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                  182 ms <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: '600' }}>+6</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div className="flex-between">
                <span style={{ fontSize: '13px', color: '#111827' }}>Sanity / smoke</span>
                <span className="badge" style={{ background: '#dcfce7', color: '#15803d' }}>Passed</span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '13px', color: '#111827' }}>Full regression</span>
                <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>62% running</span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '13px', color: '#111827' }}>OTA 2.3.9 → 2.4.0</span>
                <span className="badge" style={{ background: '#dcfce7', color: '#15803d' }}>Passed</span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '13px', color: '#111827' }}>7-day soak</span>
                <span className="badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>Day 3 of 7</span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '13px', color: '#111827' }}>CTS / VTS / STS</span>
                <span className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>Not run</span>
              </div>
            </div>
            
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontWeight: '600', padding: '8px 16px' }}>Compare with 0919</button>
          </div>
          
          <div className="card" style={{ padding: '20px' }}>
            <div className="card-header" style={{ marginBottom: '16px' }}>
              <div className="card-title" style={{ fontSize: '15px' }}>Alerts and events</div>
              <a href="#" className="link">Alert rules</a>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', marginTop: '5px', flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '2px' }}>Relay M-001 went offline during #1042</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>02:14 · auto power-cycle failed · needs attention</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', marginTop: '5px', flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '2px' }}>Unexpected reboot on X-002 (soak)</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Sep 25, 02:52 · bugreport and last_kmsg captured</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', marginTop: '5px', flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '2px' }}>X-002 temperature 46.2 °C, above 45 °C for 6 min</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Sep 25, 05:17 · Slack #relay-qa notified</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', marginTop: '5px', flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '2px' }}>ANR in com.relay.ptt on M-002 (#1047)</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>01:32 · traces.txt attached to run</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginTop: '5px', flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '2px' }}>New build 2.4.0 (0926) from Jenkins</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>00:05 · triggered OTA test and PTT Smoke</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card" style={{ padding: '20px' }}>
            <div className="card-header" style={{ marginBottom: '16px' }}>
              <div className="card-title" style={{ fontSize: '15px' }}>Failure triage</div>
              <a href="#" className="link">All failures</a>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', fontSize: '13px', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ color: '#6b7280', fontWeight: '600' }}>Test</div>
                <div style={{ color: '#6b7280', fontWeight: '600' }}>Type</div>
                <div style={{ color: '#6b7280', fontWeight: '600' }}>Bug</div>
              </div>
                
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '600', color: '#111827' }}>CONN_WIFI_ROAM_014</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Connectivity · Wi-Fi</div>
                </div>
                <div><span className="badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>New</span></div>
                <div><a href="#" className="link" style={{ fontSize: '13px' }}>RLY-2231</a></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '600', color: '#111827' }}>PTT_FLOOR_003</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>PTT service</div>
                </div>
                <div><span className="badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>New</span></div>
                <div><a href="#" className="link" style={{ fontSize: '13px' }}>Create bug</a></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '600', color: '#111827' }}>DRV_I2C_STRESS_022</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Kernel & drivers</div>
                </div>
                <div><span className="badge" style={{ background: '#ffedd5', color: '#c2410c' }}>Known</span></div>
                <div><a href="#" className="link" style={{ fontSize: '13px' }}>RLY-2198</a></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '600', color: '#111827' }}>BT_A2DP_RECONN_07</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Connectivity · BT</div>
                </div>
                <div><span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>Flaky</span></div>
                <div><a href="#" className="link" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '13px' }}>3 of 10 fail</a></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '600', color: '#111827' }}>SYSUI_QS_TILE_011</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>System UI</div>
                </div>
                <div><span className="badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>New</span></div>
                <div><a href="#" className="link" style={{ fontSize: '13px' }}>RLY-2234</a></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
