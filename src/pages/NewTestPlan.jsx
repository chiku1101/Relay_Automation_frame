import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

const NewTestPlan = () => {
  const [suiteLibrary] = useState([
    { id: 1, name: 'Bootloader · Sanity', count: '4 cases · 6 min', added: true },
    { id: 2, name: 'Kernel & drivers · Functional', count: '88 cases · 52 min', added: true },
    { id: 3, name: 'Kernel & drivers · Stress', count: '18 cases · 1 h 10 m', added: false },
    { id: 4, name: 'HAL · Functional', count: '26 cases · 18 min', added: true },
    { id: 5, name: 'Connectivity · Functional', count: '28 cases · 25 min · needs SIM', added: true },
    { id: 6, name: 'Connectivity · Stress', count: '6 cases · 1 h', added: true },
    { id: 7, name: 'PTT service · Functional', count: '3 cases · 8 min · needs PTT account', added: true },
    { id: 8, name: 'PTT service · System E2E', count: '1 case · 12 min · 2 devices', added: false },
    { id: 9, name: 'Audio · Functional', count: '7 cases · 10 min', added: false },
    { id: 10, name: 'Accessories · Functional', count: '6 cases · needs BT + USB headset', added: false },
    { id: 11, name: 'OTA / update · Functional', count: '8 cases · 40 min', added: false },
    { id: 12, name: 'Security · Compliance (STS)', count: '5 cases · 30 min', added: false },
  ]);

  const [pipeline] = useState([
    { id: 's1', type: 'system', icon: 'S', title: 'Flash build\n2.4.0 (0926)', desc: 'fastboot · verify fingerprint', action: 'Stop plan', time: '15m' },
    { id: 's2', type: 'system', icon: 'S', title: 'Factory reset +\nprovisioning', desc: 'Wi-Fi profile, SIM check, PTT account login', action: 'Stop plan', time: '10m' },
    { id: '1', type: 'suite', icon: '1', title: 'Bootloader ·\nSanity', tag: 'Gate', desc: '4 cases · 6 min', action: 'Stop plan', time: '10m' },
    { id: '2', type: 'suite', icon: '2', title: 'Kernel &\ndrivers ·\nFunctional', desc: '88 cases · 52 min', action: 'Continue', time: '1h 15m' },
    { id: '3', type: 'suite', icon: '3', title: 'HAL ·\nFunctional', desc: '26 cases · 18 min', action: 'Continue', time: '30m' },
    { id: '4', type: 'suite', icon: '4', title: 'Connectivity ·\nFunctional', desc: '28 cases · 25 min', action: 'Retry failed ×2', time: '45m' },
    { id: '5', type: 'suite', icon: '5', title: 'PTT service ·\nFunctional', desc: '3 cases · 8 min', action: 'Retry failed ×1', time: '15m' },
    { id: '6', type: 'suite', icon: '6', title: 'Connectivity ·\nStress (Wi-Fi\nreconnect loop)', desc: '6 cases · 1 h', action: 'Continue', time: '1h 30m' },
    { id: 't1', type: 'system', icon: 'T', title: 'Teardown:\ncollect\nbugreport,\nrelease device', desc: 'Always runs,\neven after a stop', action: 'Continue', time: '10m' },
  ]);

  const [devices] = useState([
    { id: 'd1', name: 'Relay X-001', spec: 'A16 · RX1A0231', status: 'Available', statusColor: '#16a34a', checked: true },
    { id: 'd2', name: 'Relay M-002', spec: 'A16 · RM1B0412', status: 'Busy until 04:30 · this plan will queue', statusColor: '#b45309', checked: true },
    { id: 'd3', name: 'Relay X-002', spec: 'A16 · RX1A0232', status: 'Reserved by Soak #1045 until Sep 30', statusColor: '#6b7280', checked: false },
    { id: 'd4', name: 'Relay M-001', spec: 'A13 · RM1B0118', status: 'Offline since 02:14', statusColor: '#dc2626', checked: false },
  ]);

  return (
    <div className="new-plan-container">
      <div className="plan-columns">
        {/* Column 1: Suite Library */}
        <div className="plan-col card library-col">
          <div className="col-header flex-between">
            <h2 className="col-title">Suite library</h2>
            <a href="#" className="link">Catalog</a>
          </div>
          
          <div className="search-box">
            <input type="text" placeholder="Search suites or test IDs" className="search-input" />
          </div>

          <div className="filter-pills">
            <span className="pill pill-active">Component: any</span>
            <span className="pill">Type: any</span>
            <span className="pill">Model: Relay X, M</span>
            <span className="pill">Needs HW</span>
          </div>

          <div className="suite-list">
            {suiteLibrary.map((suite) => (
              <div key={suite.id} className="suite-item">
                <div className="suite-info">
                  <div className="suite-name">{suite.name}</div>
                  <div className="suite-desc">{suite.count}</div>
                </div>
                {suite.added ? (
                  <span className="added-badge">Added</span>
                ) : (
                  <button className="add-btn">+ Add</button>
                )}
              </div>
            ))}
          </div>
          <div className="suite-footer-text">
            Expand any suite to include or exclude single test cases.
          </div>
        </div>

        {/* Column 2: Execution Pipeline */}
        <div className="plan-col main-pipeline-col">
          <div className="card pipeline-card">
            <div className="pipeline-header-area">
              <div className="flex-between">
                <h2 className="col-title">Execution pipeline</h2>
                <button className="btn btn-secondary btn-sm">+ Setup / teardown step</button>
              </div>
              <p className="pipeline-subtext">Steps run top to bottom on every selected device.<br />Drag to reorder.</p>
              
              <div className="pipeline-table-header">
                <span className="th-step">Step</span>
                <span className="th-fail">If a test fails</span>
                <span className="th-time">Timeout</span>
              </div>
            </div>

            <div className="pipeline-list">
              {pipeline.map((item) => (
                <div key={item.id} className="pipeline-item">
                  <GripVertical size={16} className="drag-handle" />
                  <div className={`step-icon ${item.type === 'system' ? 'system-icon' : 'suite-icon'}`}>
                    {item.icon}
                  </div>
                  <div className="step-content">
                    <div className="step-title-row">
                      <span className="step-title">{item.title}</span>
                      {item.tag && <span className="tag-gate">{item.tag}</span>}
                    </div>
                    <div className="step-desc">{item.desc}</div>
                  </div>
                  <div className="step-action">
                    <select className="select-input select-sm" defaultValue={item.action}>
                      <option value="Stop plan">Stop plan</option>
                      <option value="Continue">Continue</option>
                      <option value="Retry failed ×1">Retry failed ×1</option>
                      <option value="Retry failed ×2">Retry failed ×2</option>
                    </select>
                  </div>
                  <div className="step-time">
                    <input type="text" className="input-sm" defaultValue={item.time} />
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-add-suite-full">+ Add suite from library</button>
          </div>

          <div className="matrix-section">
            <h3 className="matrix-title">Device × step matrix</h3>
            <p className="matrix-desc">Clear a cell to skip that step on one device, for example 5G tests on a Wi-Fi-only unit.</p>
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Relay X-001<br /><span style={{ fontWeight: '400', color: '#6b7280', fontSize: '11px' }}>A16 · 0926</span></th>
                  <th>Relay M-002<br /><span style={{ fontWeight: '400', color: '#6b7280', fontSize: '11px' }}>A16 · 0926</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1 · Bootloader · Sanity</td>
                  <td><input type="checkbox" defaultChecked /></td>
                  <td><input type="checkbox" defaultChecked /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 3: Right Panel */}
        <div className="plan-col right-panel">
          <div className="card right-card">
            <h3 className="panel-title">Build under test</h3>
            <div className="form-group">
              <label>Build</label>
              <select className="select-input full-width" defaultValue="latest">
                <option value="latest">A16 · 2.4.0 (0926) · latest</option>
              </select>
            </div>
            <label className="checkbox-label mt-3">
              <input type="checkbox" defaultChecked />
              Flash this build before step 1
            </label>
          </div>

          <div className="card right-card">
            <h3 className="panel-title">Execution mode</h3>
            <div className="radio-group">
              <label className="radio-option selected">
                <div className="radio-header">
                  <input type="radio" name="exec-mode" defaultChecked />
                  <span className="radio-title">Parallel</span>
                </div>
                <div className="radio-desc">Every device runs the full pipeline at the same time</div>
              </label>
              
              <label className="radio-option">
                <div className="radio-header">
                  <input type="radio" name="exec-mode" />
                  <span className="radio-title">Distributed</span>
                </div>
                <div className="radio-desc">Split suites across devices to finish sooner</div>
              </label>

              <label className="radio-option">
                <div className="radio-header">
                  <input type="radio" name="exec-mode" />
                  <span className="radio-title">Sequential</span>
                </div>
                <div className="radio-desc">One device after another</div>
              </label>
            </div>
          </div>

          <div className="card right-card devices-card">
            <div className="flex-between mb-3">
              <h3 className="panel-title m-0">Devices</h3>
              <button className="btn btn-secondary btn-sm">Select all available</button>
            </div>
            
            <div className="filter-pills devices-filters">
              <span className="pill pill-active">Relay X</span>
              <span className="pill pill-active">Relay M</span>
              <span className="pill">Android 13</span>
              <span className="pill pill-active">Android 16</span>
              <span className="pill">Has BT headset</span>
            </div>

            <div className="device-list">
              {devices.map((device) => (
                <label key={device.id} className="device-item">
                  <input type="checkbox" defaultChecked={device.checked} />
                  <div className="device-info">
                    <div className="device-name">
                      {device.name} <span className="device-spec">{device.spec}</span>
                    </div>
                    <div className="device-status" style={{ color: device.statusColor }}>
                      {device.status}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card right-card summary-card">
            <h3 className="panel-title">Summary</h3>
            <div className="summary-list">
              <div className="summary-row">
                <span className="summary-label">Devices</span>
                <span className="summary-val">2</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Steps</span>
                <span className="summary-val">6 suites + 3 system</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Test cases</span>
                <span className="summary-val">155 per device</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Estimated time</span>
                <span className="summary-val">≈ 3 h 10 m</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Start</span>
                <span className="summary-val">Queues for M-002</span>
              </div>
            </div>
            <p className="summary-footer">
              Collected: logcat, dmesg, screenshots on failure, screen recording on failure, bugreport at teardown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTestPlan;
