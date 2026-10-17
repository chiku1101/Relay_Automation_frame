import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Smartphone, 
  Activity, 
  Zap, 
  RotateCcw, 
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge, StatCard, Button } from '../components/ui';

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
        <circle cx={cx} cy={cy} r={5} fill="#38bdf8" stroke="#080b12" strokeWidth={2} />
        <text x={cx + 8} y={cy + 4} fill="#f8fafc" fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">
          95.1%
        </text>
      </g>
    );
  }
  return <circle key={`dot-${payload.name}`} cx={cx} cy={cy} r={4} fill="#3b82f6" stroke="#080b12" strokeWidth={1.5} />;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value || payload[1]?.value;
    return (
      <div style={{
        background: '#0c1220',
        border: '1px solid #23324d',
        borderRadius: '6px',
        padding: '8px 12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11.5px'
      }}>
        <div style={{ color: '#8896b3', marginBottom: '2px' }}>Build {label}</div>
        <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '13px' }}>Pass Rate: {val}%</div>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 6 Origin UI Styled Telemetry Stat Cards */}
      <div className="dashboard-grid">
        <StatCard
          label="Active Runs"
          value="3 Active"
          description="2 running · 1 queued"
          icon={Play}
          accentColor="#38bdf8"
          trend={{ type: 'up', text: 'SLOTS 2/4' }}
        />
        <StatCard
          label="Pass Rate · 0926"
          value="95.1%"
          description="Target > 95.0% met"
          icon={CheckCircle2}
          accentColor="#34d399"
          trend={{ type: 'down', text: '-1.2 pts' }}
        />
        <StatCard
          label="Executions (7d)"
          value="1,284"
          description="1,221 pass · 51 fail · 12 skip"
          icon={Layers}
          accentColor="#60a5fa"
          trend={{ type: 'up', text: '+8.4%' }}
        />
        <StatCard
          label="Fleet Hardware"
          value="5 Nodes"
          description="4 online · 1 in soak"
          icon={Smartphone}
          accentColor="#38bdf8"
        />
        <StatCard
          label="Open Failures"
          value="17 Bugs"
          description="9 new · 5 known · 3 flaky"
          icon={AlertTriangle}
          accentColor="#f87171"
          trend={{ type: 'down', text: '+4 new' }}
        />
        <StatCard
          label="Auto Coverage"
          value="72%"
          description="345 of 480 planned test cases"
          icon={Zap}
          accentColor="#c084fc"
          trend={{ type: 'up', text: '345 CASES' }}
        />
      </div>

      <div className="dashboard-main-grid">
        {/* Left Column: Active Runs, Fleet Nodes, Performance breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Active and Recent Runs Table */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', marginBottom: '0' }}>
              <div className="card-title" style={{ fontSize: '14.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Play size={15} color="#38bdf8" /> Active and Recent Suite Executions
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/runs')}
              >
                View all runs
              </Button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '20px' }}>RUN</th>
                  <th>TEST PLAN</th>
                  <th>BUILD</th>
                  <th>DEVICE TARGET</th>
                  <th>STEP PROGRESS</th>
                  <th>STATUS</th>
                  <th style={{ paddingRight: '20px' }}>TRIGGER SOURCE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: '700', paddingLeft: '20px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>#1047</td>
                  <td style={{ fontWeight: '600', color: '#f1f5f9' }}>Nightly Regression</td>
                  <td style={{ fontSize: '12px', color: '#8896b3', fontFamily: 'var(--font-mono)' }}>2.4.0 (0926)</td>
                  <td style={{ fontSize: '12px', color: '#cbd5e1' }}>X-001, M-002</td>
                  <td style={{ width: '190px' }}>
                    <div className="progress-bar" style={{ height: '5px' }}>
                      <div className="progress-fill" style={{ width: '62%' }}></div>
                    </div>
                    <div className="progress-text">214 / 345 · step 4 of 8</div>
                  </td>
                  <td>
                    <Badge variant="primary" pulse size="sm">Running</Badge>
                  </td>
                  <td style={{ fontSize: '11.5px', color: '#8896b3', paddingRight: '20px' }}>Schedule · Daily 01:00</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', paddingLeft: '20px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>#1048</td>
                  <td style={{ fontWeight: '600', color: '#f1f5f9' }}>PTT Smoke</td>
                  <td style={{ fontSize: '12px', color: '#8896b3', fontFamily: 'var(--font-mono)' }}>2.4.0 (0926)</td>
                  <td style={{ fontSize: '12px', color: '#cbd5e1' }}>M-002</td>
                  <td style={{ width: '190px' }}>
                    <div className="progress-bar" style={{ height: '5px' }}></div>
                    <div className="progress-text">Waits for M-002 free</div>
                  </td>
                  <td>
                    <Badge variant="neutral" size="sm">Queued</Badge>
                  </td>
                  <td style={{ fontSize: '11.5px', color: '#8896b3', paddingRight: '20px' }}>CI · commit #99a21e0</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', paddingLeft: '20px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>#1045</td>
                  <td style={{ fontWeight: '600', color: '#f1f5f9' }}>7-Day Memory Soak</td>
                  <td style={{ fontSize: '12px', color: '#8896b3', fontFamily: 'var(--font-mono)' }}>2.4.0 (0923)</td>
                  <td style={{ fontSize: '12px', color: '#cbd5e1' }}>X-002</td>
                  <td style={{ width: '190px' }}>
                    <div className="progress-bar" style={{ height: '5px' }}>
                      <div className="progress-fill" style={{ width: '40%' }}></div>
                    </div>
                    <div className="progress-text">Day 3 of 7 · Continuous</div>
                  </td>
                  <td>
                    <Badge variant="purple" pulse size="sm">Soaking</Badge>
                  </td>
                  <td style={{ fontSize: '11.5px', color: '#8896b3', paddingRight: '20px' }}>Lab Soak Daemon</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', paddingLeft: '20px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>#1044</td>
                  <td style={{ fontWeight: '600', color: '#f1f5f9' }}>OTA 2.3.9 → 2.4.0</td>
                  <td style={{ fontSize: '12px', color: '#8896b3', fontFamily: 'var(--font-mono)' }}>2.4.0 (0926)</td>
                  <td style={{ fontSize: '12px', color: '#cbd5e1' }}>X-001</td>
                  <td style={{ width: '190px' }}>
                    <div className="progress-bar" style={{ height: '5px' }}>
                      <div className="progress-fill" style={{ width: '100%' }}></div>
                    </div>
                    <div className="progress-text">24 / 24 verified</div>
                  </td>
                  <td>
                    <Badge variant="success" size="sm">Passed</Badge>
                  </td>
                  <td style={{ fontSize: '11.5px', color: '#8896b3', paddingRight: '20px' }}>CI · build webhook</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', paddingLeft: '20px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>#1043</td>
                  <td style={{ fontWeight: '600', color: '#f1f5f9' }}>Nightly Regression</td>
                  <td style={{ fontSize: '12px', color: '#8896b3', fontFamily: 'var(--font-mono)' }}>2.4.0 (0925)</td>
                  <td style={{ fontSize: '12px', color: '#cbd5e1' }}>M-002</td>
                  <td style={{ width: '190px' }}>
                    <div className="progress-bar" style={{ height: '5px' }}>
                      <div className="progress-fill failed" style={{ width: '100%' }}></div>
                    </div>
                    <div className="progress-text">331 pass · 14 fail</div>
                  </td>
                  <td>
                    <Badge variant="danger" size="sm">Failed</Badge>
                  </td>
                  <td style={{ fontSize: '11.5px', color: '#8896b3', paddingRight: '20px' }}>Schedule · Daily 01:00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Hardware Device Fleet Cards */}
          <div>
            <div className="card-header" style={{ marginBottom: '12px' }}>
              <div className="card-title" style={{ fontSize: '14.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={16} color="#38bdf8" /> Physical Hardware Lab Fleet (Bay Alpha)
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/devices')}
              >
                Fleet Manager
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '2px solid #34d399' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '13.5px', color: '#f1f5f9' }}>Relay X-001</span>
                    <Badge variant="primary" pulse size="sm">Running</Badge>
                  </div>
                  <div style={{ fontSize: '11px', color: '#8896b3', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                    Qualcomm QCS610 · A16
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '14px', color: '#cbd5e1', lineHeight: '1.3' }}>
                    Nightly #1047 · HAL validation · Reserved until 04:30
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11.5px', marginBottom: '14px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Battery</span><span style={{ color: '#34d399' }}>71% @ 4.12V</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Thermal</span><span style={{ color: '#f1f5f9' }}>37.0 °C</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Wi-Fi RSSI</span><span style={{ color: '#38bdf8' }}>-61 dBm</span></div>
                  </div>
                </div>
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/monitoring')}
                  style={{ width: '100%' }}
                >
                  Open Telemetry
                </Button>
              </div>
              
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '2px solid #60a5fa' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '13.5px', color: '#f1f5f9' }}>Relay X-002</span>
                    <Badge variant="warning" pulse size="sm">Soak (7d)</Badge>
                  </div>
                  <div style={{ fontSize: '11px', color: '#8896b3', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                    Chamber B · Jig #2
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '14px', color: '#cbd5e1', lineHeight: '1.3' }}>
                    Soak #1045 · Day 3 of 7 continuous · Reserved Sep 30
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11.5px', marginBottom: '14px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Battery</span><span style={{ color: '#34d399' }}>100% (Dock)</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Thermal</span><span style={{ color: '#fbbf24' }}>42.1 °C</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Wi-Fi RSSI</span><span style={{ color: '#38bdf8' }}>-66 dBm</span></div>
                  </div>
                </div>
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/monitoring')}
                  style={{ width: '100%' }}
                >
                  Chamber Telemetry
                </Button>
              </div>

              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '2px solid #38bdf8' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '13.5px', color: '#f1f5f9' }}>Relay M-002</span>
                    <Badge variant="success" size="sm">Online</Badge>
                  </div>
                  <div style={{ fontSize: '11px', color: '#8896b3', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                    ESP32-S3 CAN Jig
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '14px', color: '#cbd5e1', lineHeight: '1.3' }}>
                    Queued for PTT Smoke #1048 · FreeRTOS v1.12.4
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11.5px', marginBottom: '14px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>VBUS Rail</span><span style={{ color: '#34d399' }}>12.0V DC</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Thermal</span><span style={{ color: '#f1f5f9' }}>29.8 °C</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Current</span><span style={{ color: '#38bdf8' }}>180 mA</span></div>
                  </div>
                </div>
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/devices')}
                  style={{ width: '100%' }}
                >
                  View Device
                </Button>
              </div>

              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '2px solid #ef4444' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '13.5px', color: '#f1f5f9' }}>Relay X-003</span>
                    <Badge variant="danger" size="sm">Offline</Badge>
                  </div>
                  <div style={{ fontSize: '11px', color: '#8896b3', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                    Vehicle Jig #3
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '14px', color: '#cbd5e1', lineHeight: '1.3' }}>
                    Low battery cutoff (18% @ 3.42V) · Awaiting bench charge
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11.5px', marginBottom: '14px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Battery</span><span style={{ color: '#f87171' }}>18% Cutoff</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Thermal</span><span style={{ color: '#64748b' }}>22.4 °C</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Link</span><span style={{ color: '#64748b' }}>Unreachable</span></div>
                  </div>
                </div>
                <Button 
                  variant="danger"
                  size="sm"
                  onClick={() => alert('Dispatched Wake-on-LAN and USB Relay power cycle pulse.')}
                  style={{ width: '100%' }}
                >
                  USB Power-Cycle
                </Button>
              </div>

            </div>
          </div>
          
          {/* Charts: Component Pass Rate and Across Builds Trend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="card" style={{ padding: '18px 20px' }}>
              <div className="card-header" style={{ marginBottom: '14px' }}>
                <div className="card-title" style={{ fontSize: '14px' }}>Pass Rate by Subsystem · Build 0926</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/test-catalog')}
                >
                  Matrix →
                </Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {[
                  { name: 'Bootloader & HSM', val: 100 },
                  { name: 'Kernel & drivers', val: 96.5 },
                  { name: 'HAL Services', val: 95.0 },
                  { name: 'Android Framework', val: 96.4 },
                  { name: 'System UI & Buttons', val: 93.8 },
                  { name: 'Connectivity & Wi-Fi', val: 89.6, color: '#f59e0b' },
                  { name: 'Audio Pipeline', val: 90.0 },
                  { name: 'PTT Floor Control', val: 80.0, color: '#f59e0b' },
                  { name: 'OTA Firmware Delta', val: 100 },
                  { name: 'Security STS Compliance', val: 100 },
                ].map(comp => (
                  <div key={comp.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '130px', fontSize: '12px', color: '#cbd5e1' }}>{comp.name}</div>
                    <div style={{ flex: 1, height: '6px', background: '#131b2c', borderRadius: '4px', overflow: 'hidden', border: '1px solid #1a253c' }}>
                      <div style={{ width: `${comp.val}%`, height: '100%', background: comp.color || 'linear-gradient(90deg, #2563eb, #38bdf8)', borderRadius: '4px' }}></div>
                    </div>
                    <div style={{ width: '42px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: comp.color || '#f1f5f9', fontFamily: 'var(--font-mono)' }}>{comp.val}%</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header" style={{ marginBottom: '10px' }}>
                  <div className="card-title" style={{ fontSize: '14px' }}>Pass Rate Trend Across Builds</div>
                  <div style={{ fontSize: '11px', color: '#8896b3', fontFamily: 'var(--font-mono)' }}>Full regression · Fleet X</div>
                </div>
                <div style={{ height: '220px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 15, right: 35, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a253c" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} dy={5} />
                      <YAxis domain={[92, 98]} ticks={[92, 94, 96, 98]} tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Line 
                        type="linear" 
                        dataKey="solidVal" 
                        stroke="#38bdf8" 
                        strokeWidth={2.5} 
                        dot={<CustomizedDot />} 
                        isAnimationActive={false} 
                      />
                      <Line 
                        type="linear" 
                        dataKey="dashedVal" 
                        stroke="#38bdf8" 
                        strokeWidth={2.5} 
                        strokeDasharray="4 4" 
                        dot={<CustomizedDot />} 
                        isAnimationActive={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '10px', fontFamily: 'var(--font-mono)' }}>
                Dashed point: Build 0926 regression currently executing (62% complete)
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Release Readiness, Hardware Telemetry Alerts, Failure Triage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Release Readiness Status Card */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div className="card-header" style={{ marginBottom: '14px' }}>
              <div className="card-title" style={{ fontSize: '14px' }}>Release Gate · v2.4.0 (0926)</div>
              <Badge variant="warning" size="sm">RC In Review</Badge>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
              <div style={{ background: '#0a0f1b', border: '1px solid #1a253c', padding: '10px 12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: '#7b8ea8', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>vs Build 0919</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#f87171', fontFamily: 'var(--font-mono)' }}>4 new failures</div>
              </div>
              <div style={{ background: '#0a0f1b', border: '1px solid #1a253c', padding: '10px 12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: '#7b8ea8', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>Fixed in 0926</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#34d399', fontFamily: 'var(--font-mono)' }}>2 test cases</div>
              </div>
              <div style={{ background: '#0a0f1b', border: '1px solid #1a253c', padding: '10px 12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: '#7b8ea8', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>Boot Duration</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', fontFamily: 'var(--font-mono)' }}>
                  21.4 s <span style={{ fontSize: '11px', color: '#f87171' }}>+8%</span>
                </div>
              </div>
              <div style={{ background: '#0a0f1b', border: '1px solid #1a253c', padding: '10px 12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: '#7b8ea8', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>PTT Floor-Grab</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', fontFamily: 'var(--font-mono)' }}>
                  182 ms <span style={{ fontSize: '11px', color: '#f87171' }}>+6ms</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#cbd5e1' }}>Bootloader & Smoke Gate</span>
                <Badge variant="success" size="sm">Passed</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#cbd5e1' }}>Full Nightly Regression</span>
                <Badge variant="primary" pulse size="sm">62% Running</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#cbd5e1' }}>OTA Fastboot Delta Verification</span>
                <Badge variant="success" size="sm">Passed</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#cbd5e1' }}>7-Day Hardware Soak</span>
                <Badge variant="warning" pulse size="sm">Day 3 of 7</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#cbd5e1' }}>Security STS Compliance</span>
                <Badge variant="neutral" size="sm">Scheduled</Badge>
              </div>
            </div>
            
            <Button 
              variant="secondary"
              size="md"
              onClick={() => navigate('/reports')}
              style={{ width: '100%' }}
            >
              Inspect Release Regression Diff
            </Button>
          </div>
          
          {/* Hardware Telemetry Feed */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div className="card-header" style={{ marginBottom: '14px' }}>
              <div className="card-title" style={{ fontSize: '14px' }}>Hardware Lab Event Feed</div>
              <Badge variant="success" pulse size="sm">Live</Badge>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', marginTop: '6px', flexShrink: 0, boxShadow: '0 0 6px #ef4444' }}></div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#f1f5f9' }}>Relay X-003 offline during fastboot flash</div>
                  <div style={{ fontSize: '11px', color: '#8896b3', marginTop: '2px' }}>02:14 · Battery dropped below 3.42V cutoff. Auto power cycle queued.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', marginTop: '6px', flexShrink: 0, boxShadow: '0 0 6px #ef4444' }}></div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#f1f5f9' }}>Unexpected watchdog reboot on X-002</div>
                  <div style={{ fontSize: '11px', color: '#8896b3', marginTop: '2px' }}>Sep 25 02:52 · CPU3 stuck in soft lockup. Bugreport saved.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b', marginTop: '6px', flexShrink: 0, boxShadow: '0 0 6px #f59e0b' }}></div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#f1f5f9' }}>Thermal peak 46.2 °C on X-002</div>
                  <div style={{ fontSize: '11px', color: '#8896b3', marginTop: '2px' }}>Sep 25 05:17 · Above 45°C limit for 6 min. Frequency throttled to 1.6GHz.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#38bdf8', marginTop: '6px', flexShrink: 0, boxShadow: '0 0 6px #38bdf8' }}></div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#f1f5f9' }}>New firmware build 2.4.0 (0926) indexed</div>
                  <div style={{ fontSize: '11px', color: '#8896b3', marginTop: '2px' }}>00:05 · Jenkins build #4812 signed & ready for bench testing.</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Failure Triage */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div className="card-header" style={{ marginBottom: '12px' }}>
              <div className="card-title" style={{ fontSize: '14px' }}>Active Failure Triage (17 Open)</div>
              <Button 
                variant="ghost" 
                size="sm" 
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/reports')}
              >
                All failures
              </Button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'CONN_WIFI_ROAM_014', sub: 'Connectivity · Wi-Fi', tag: 'New', variant: 'danger', bug: 'RLY-2231' },
                { id: 'PTT_FLOOR_003', sub: 'PTT service · Audio', tag: 'New', variant: 'danger', bug: 'RLY-2233' },
                { id: 'DRV_I2C_STRESS_022', sub: 'Kernel & drivers', tag: 'Known', variant: 'warning', bug: 'RLY-2198' },
                { id: 'BT_A2DP_RECONN_07', sub: 'Connectivity · Bluetooth', tag: 'Flaky', variant: 'neutral', bug: '3 of 10 fail' },
                { id: 'SYSUI_QS_TILE_011', sub: 'System UI & Service', tag: 'New', variant: 'danger', bug: 'RLY-2234' },
              ].map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #162033' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <code style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{item.id}</code>
                    <span style={{ fontSize: '11px', color: '#7b8ea8' }}>{item.sub}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge variant={item.variant} size="sm">{item.tag}</Badge>
                    <span style={{ fontSize: '11px', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{item.bug}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
