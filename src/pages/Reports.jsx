import React, { useState, useEffect } from 'react';

const INITIAL_RUNS = [
  {
    id: '#1047',
    plan: 'Nightly Regression',
    build: '2.4.0 (0926)',
    passCount: 209,
    failCount: 5,
    skipCount: 0,
    duration: '1 h 40 m...',
    date: 'Sep 26 01:00',
    result: 'Running',
    device: 'Relay X-001 · RX1A0231 · Android 16',
    trigger: 'triggered by schedule'
  },
  {
    id: '#1044',
    plan: 'OTA 2.3.9 -> 2.4.0',
    build: '2.4.0 (0926)',
    passCount: 24,
    failCount: 0,
    skipCount: 0,
    duration: '38 m',
    date: 'Sep 26 00:12',
    result: 'Passed',
    device: 'Relay X-001 · RX1A0231 · Android 16',
    trigger: 'triggered by manual run'
  },
  {
    id: '#1039',
    plan: 'Nightly Regression',
    build: '2.4.0 (0925)',
    passCount: 336,
    failCount: 7,
    skipCount: 2,
    duration: '3 h 04 m',
    date: 'Sep 25 01:00',
    result: 'Failed',
    device: 'Relay X-001 · RX1A0231 · Android 16 · build 2.4.0 (0925) · 3 h 04 m · triggered by schedule',
    trigger: 'triggered by schedule'
  },
  {
    id: '#1036',
    plan: 'Weekly Stress',
    build: '2.3.9 (0919)',
    passCount: 31,
    failCount: 2,
    skipCount: 0,
    duration: '4 h 00 m',
    date: 'Sep 19 22:00',
    result: 'Failed',
    device: 'Relay X-001 · RX1A0231 · Android 16',
    trigger: 'triggered by weekly schedule'
  },
  {
    id: '#1031',
    plan: 'Nightly Regression',
    build: '2.3.9 (0919)',
    passCount: 332,
    failCount: 11,
    skipCount: 2,
    duration: '3 h 01 m',
    date: 'Sep 20 01:00',
    result: 'Failed',
    device: 'Relay X-001 · RX1A0231 · Android 16',
    trigger: 'triggered by schedule'
  },
  {
    id: '#1030',
    plan: 'PTT Smoke',
    build: '2.3.9 (0919)',
    passCount: 5,
    failCount: 0,
    skipCount: 0,
    duration: '12 m',
    date: 'Sep 19 00:20',
    result: 'Passed',
    device: 'Relay X-001 · RX1A0231 · Android 16',
    trigger: 'triggered by CI webhook'
  }
];

const FAILURES_1039 = [
  {
    id: 'f1',
    test: 'CONN_WIFI_ROAM_014',
    component: 'Connectivity · Wi-Fi',
    error: 'Roam to AP-2 took 4.8 s, limit 2 s',
    since: 'New in 0925',
    sinceType: 'new',
    evidence: ['log', 'screenshot', 'video'],
    bug: 'RLY-2231',
    isBugLink: true
  },
  {
    id: 'f2',
    test: 'PTT_FLOOR_003',
    component: 'PTT service',
    error: 'Floor grant not received within 500 ms',
    since: 'New in 0925',
    sinceType: 'new',
    evidence: ['log', 'screenshot', 'video'],
    bug: 'Create bug',
    isBugLink: false
  },
  {
    id: 'f3',
    test: 'DRV_I2C_STRESS_022',
    component: 'Kernel & drivers',
    error: 'i2c-3 timeout after 1,800 transfers',
    since: 'Since 0905',
    sinceType: 'older',
    evidence: ['log', 'screenshot'],
    bug: 'RLY-2198',
    isBugLink: true
  },
  {
    id: 'f4',
    test: 'SYSUI_QS_TILE_011',
    component: 'System UI',
    error: 'Wi-Fi tile state not updated after toggle',
    since: 'New in 0925',
    sinceType: 'new',
    evidence: ['log', 'screenshot', 'video'],
    bug: 'RLY-2234',
    isBugLink: true
  },
  {
    id: 'f5',
    test: 'BT_A2DP_RECONN_07',
    component: 'Connectivity · BT',
    error: 'Headset reconnect failed (flaky: 3 of 10)',
    since: 'Flaky',
    sinceType: 'flaky',
    evidence: ['log', 'screenshot'],
    bug: 'RLY-2170',
    isBugLink: true
  }
];

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState('RX1A0231');
  const [deviceChipActive, setDeviceChipActive] = useState(true);
  const [buildChipActive, setBuildChipActive] = useState(true);
  const [selectedRunId, setSelectedRunId] = useState('#1039');
  const [activeTab, setActiveTab] = useState('failures');
  const [compareCheckboxes, setCompareCheckboxes] = useState({
    '#1047': true,
    '#1031': true
  });
  const [leftBuild, setLeftBuild] = useState('2.3.9 (0919)');
  const [rightBuild, setRightBuild] = useState('2.4.0 (0926)');
  const [shareConfig, setShareConfig] = useState({
    whoCanOpen: 'organization',
    expires: '30days',
    logs: true,
    screenshots: true,
    videos: false,
    deviceMetrics: true
  });
  const [toastMessage, setToastMessage] = useState(null);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState(null);
  const [createBugModal, setCreateBugModal] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  useEffect(() => {
    const handleExportCSV = () => {
      showToast('Exporting reports dataset to Relay-Reports-Export.csv...');
    };
    window.addEventListener('export-reports-csv', handleExportCSV);
    return () => window.removeEventListener('export-reports-csv', handleExportCSV);
  }, []);

  const toggleCompareRun = (id) => {
    setCompareCheckboxes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyLink = () => {
    const link = `https://relay-qa.corp.internal/reports/run-${selectedRunId.replace('#', '')}`;
    navigator.clipboard?.writeText(link);
    showToast(`Copied share link to clipboard: relay-qa/reports/run-${selectedRunId.replace('#', '')}`);
  };

  const filteredRuns = INITIAL_RUNS.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.plan.toLowerCase().includes(q) ||
      r.build.toLowerCase().includes(q) ||
      r.device.toLowerCase().includes(q)
    );
  });

  const selectedRunObj = INITIAL_RUNS.find(r => r.id === selectedRunId) || INITIAL_RUNS[2];

  return (
    <div className="reports-page">
      <div className="reports-filter-card">
        <div className="reports-search-bar">
          <div className="reports-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            className="reports-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by device, serial number, run #, test name, or build..."
          />
          {searchQuery && (
            <button className="reports-search-clear" onClick={() => setSearchQuery('')} title="Clear search">
              ✕
            </button>
          )}
        </div>

        <div className="reports-chips-row">
          <div className="reports-chips-group">
            {deviceChipActive && (
              <span className="filter-chip-active">
                Device: Relay X-001 (RX1A0231)
                <button className="chip-remove-btn" onClick={() => setDeviceChipActive(false)}>✕</button>
              </span>
            )}
            {buildChipActive && (
              <span className="filter-chip-active">
                Build: 2.3.9 (0919) → 2.4.0 (0926)
                <button className="chip-remove-btn" onClick={() => setBuildChipActive(false)}>✕</button>
              </span>
            )}

            <button className="filter-chip-btn" onClick={() => showToast('Filter by Plan')}>+ Plan</button>
            <button className="filter-chip-btn" onClick={() => showToast('Filter by Component')}>+ Component</button>
            <button className="filter-chip-btn" onClick={() => showToast('Filter by Result status')}>+ Result</button>
            <button className="filter-chip-btn" onClick={() => showToast('Filter by Trigger trigger')}>+ Triggered by</button>
            <button className="filter-chip-btn" onClick={() => showToast('Select date range')}>Date: last 30 days</button>
          </div>

          <div className="reports-summary-count">
            6 runs · 1,187 test executions
          </div>
        </div>
      </div>

      <div className="reports-main-layout">
        <div className="reports-left-col">
          <div className="reports-card">
            <div className="reports-card-header">
              <div className="reports-card-title">Runs</div>
              <div className="reports-card-subtitle">Select two runs to compare</div>
            </div>

            <div className="reports-table-container">
              <table className="reports-runs-table">
                <thead>
                  <tr>
                    <th style={{ width: '32px' }}></th>
                    <th>Run</th>
                    <th>Plan</th>
                    <th>Build</th>
                    <th>Pass / fail / skip</th>
                    <th>Duration</th>
                    <th>Date</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRuns.map((r) => {
                    const isSelected = r.id === selectedRunId;
                    const isChecked = !!compareCheckboxes[r.id];
                    return (
                      <tr 
                        key={r.id} 
                        className={isSelected ? 'selected-row' : ''}
                        onClick={() => setSelectedRunId(r.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => toggleCompareRun(r.id)}
                            style={{ cursor: 'pointer', accentColor: '#2563eb' }}
                          />
                        </td>
                        <td className="run-id-cell">{r.id}</td>
                        <td className="run-plan-cell">{r.plan}</td>
                        <td className="run-build-cell">{r.build}</td>
                        <td className="counts-cell">
                          <span className="counts-pass">{r.passCount}</span> / <span className="counts-fail">{r.failCount}</span> / <span className="counts-skip">{r.skipCount}</span>
                        </td>
                        <td style={{ color: '#4b5563' }}>{r.duration}</td>
                        <td style={{ color: '#6b7280', fontSize: '12px' }}>{r.date}</td>
                        <td>
                          <span className={`status-badge ${r.result.toLowerCase()}`}>
                            {r.result}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="reports-card">
            <div className="reports-card-header" style={{ alignItems: 'flex-start' }}>
              <div>
                <div className="reports-card-title" style={{ fontSize: '16px' }}>
                  Run {selectedRunObj.id} · {selectedRunObj.plan}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Relay X-001 · RX1A0231 · Android 16 · build {selectedRunObj.build} · {selectedRunObj.duration} · {selectedRunObj.trigger}
                </div>
              </div>
              <span className={`status-badge ${selectedRunObj.result.toLowerCase()}`}>
                {selectedRunObj.result}
              </span>
            </div>

            <div className="run-details-tabs">
              <button 
                className={`run-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                Summary
              </button>
              <button 
                className={`run-tab-btn ${activeTab === 'failures' ? 'active' : ''}`}
                onClick={() => setActiveTab('failures')}
              >
                Failures (7)
              </button>
              <button 
                className={`run-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All cases (345)
              </button>
              <button 
                className={`run-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                onClick={() => setActiveTab('logs')}
              >
                Logs
              </button>
              <button 
                className={`run-tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
                onClick={() => setActiveTab('metrics')}
              >
                Device metrics
              </button>
            </div>

            {activeTab === 'failures' && (
              <div className="reports-table-container">
                <table className="failures-table">
                  <thead>
                    <tr>
                      <th style={{ width: '22%' }}>Test</th>
                      <th style={{ width: '38%' }}>Error</th>
                      <th style={{ width: '15%' }}>Since</th>
                      <th style={{ width: '15%' }}>Evidence</th>
                      <th style={{ width: '10%' }}>Bug</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FAILURES_1039.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="test-name-title">{item.test}</div>
                          <div className="test-component-sub">{item.component}</div>
                        </td>
                        <td>
                          <div className="test-error-desc">{item.error}</div>
                        </td>
                        <td>
                          <span className={`since-badge ${item.sinceType}`}>
                            {item.since}
                          </span>
                        </td>
                        <td>
                          <div className="evidence-links">
                            {item.evidence.map((ev, idx) => (
                              <React.Fragment key={ev}>
                                <span 
                                  className="evidence-link"
                                  onClick={() => setActiveEvidenceModal({ test: item.test, type: ev, error: item.error })}
                                >
                                  {ev}
                                </span>
                                {idx < item.evidence.length - 1 && <span>·</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        </td>
                        <td>
                          {item.isBugLink ? (
                            <span 
                              className="bug-link"
                              onClick={() => showToast(`Opening Jira ticket ${item.bug}...`)}
                            >
                              {item.bug}
                            </span>
                          ) : (
                            <span 
                              className="bug-link"
                              onClick={() => setCreateBugModal(item)}
                            >
                              Create bug
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'summary' && (
              <div style={{ padding: '16px 0', fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>
                <p><strong>Execution Summary:</strong> Total 345 test cases planned across 8 device test components.</p>
                <p>Pass rate for this build is <strong>97.4%</strong> (336 passed, 7 failed, 2 skipped due to dependency preconditions).</p>
                <p>Main regression area: <em>Wi-Fi Roaming handoff latency</em> and <em>PTT audio floor negotiation</em>.</p>
              </div>
            )}

            {activeTab === 'all' && (
              <div style={{ padding: '16px 0', fontSize: '13px', color: '#4b5563' }}>
                Displaying 345 test executions for build {selectedRunObj.build}. Use search to filter specific test methods.
              </div>
            )}

            {activeTab === 'logs' && (
              <div style={{ padding: '16px 0' }}>
                <div style={{ background: '#0f172a', color: '#f8fafc', padding: '14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.5' }}>
                  <div>[01:00:02.100] TEST_RUN_STARTED: Nightly Regression (runner: relay-orchestrator-v2)</div>
                  <div>[01:00:03.450] DEVICE_CONNECTED: Relay X-001 (RX1A0231) via ADB over TLS</div>
                  <div>[01:00:05.120] PACKAGE_INSTALLED: com.relay.qa.tests (targetSdk: 35)</div>
                  <div>[01:04:12.890] FAIL: CONN_WIFI_ROAM_014 - AssertFailed: roam time 4812ms &gt; threshold 2000ms</div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div style={{ padding: '16px 0', fontSize: '13px', color: '#4b5563', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Peak Thermal</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>41.8 °C</div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Average Battery Drain</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>1.9 %/h</div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Memory High Watermark</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>820 MB</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="reports-right-col">
          <div className="reports-card">
            <div className="reports-card-header">
              <div className="reports-card-title">Build comparison</div>
              <div className="reports-card-subtitle">Relay X-001 · Nightly</div>
            </div>

            <div className="compare-selectors-row">
              <select 
                className="compare-select" 
                value={leftBuild} 
                onChange={(e) => setLeftBuild(e.target.value)}
              >
                <option value="2.3.9 (0919)">2.3.9 (0919)</option>
                <option value="2.3.8 (0912)">2.3.8 (0912)</option>
                <option value="2.3.7 (0905)">2.3.7 (0905)</option>
              </select>

              <span className="compare-arrow">→</span>

              <select 
                className="compare-select" 
                value={rightBuild} 
                onChange={(e) => setRightBuild(e.target.value)}
              >
                <option value="2.4.0 (0926)">2.4.0 (0926)</option>
                <option value="2.4.0 (0925)">2.4.0 (0925)</option>
                <option value="2.4.0-rc1">2.4.0-rc1</option>
              </select>
            </div>

            <div className="compare-stats-grid">
              <div className="compare-stat-box">
                <span className="compare-stat-label">Pass rate</span>
                <span className="compare-stat-val">95.1%</span>
                <span className="compare-stat-sub trend-down">▼ 1.2 pts</span>
              </div>

              <div className="compare-stat-box">
                <span className="compare-stat-label">New fails</span>
                <span className="compare-stat-val">4</span>
                <span className="compare-stat-sub">regressions</span>
              </div>

              <div className="compare-stat-box">
                <span className="compare-stat-label">Fixed</span>
                <span className="compare-stat-val">2</span>
                <span className="compare-stat-sub">now pass</span>
              </div>

              <div className="compare-stat-box">
                <span className="compare-stat-label">Flaky</span>
                <span className="compare-stat-val">3</span>
                <span className="compare-stat-sub">mixed</span>
              </div>
            </div>

            <div className="perf-power-section">
              <div className="perf-power-title">Performance and power</div>
              <table className="perf-power-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>0919</th>
                    <th>0926</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Boot time</td>
                    <td>19.8 s</td>
                    <td>21.4 s</td>
                    <td><span className="perf-change danger">+8%</span></td>
                  </tr>
                  <tr>
                    <td>PTT floor-grab latency</td>
                    <td>176 ms</td>
                    <td>182 ms</td>
                    <td><span className="perf-change neutral">+3%</span></td>
                  </tr>
                  <tr>
                    <td>PTT app cold start</td>
                    <td>790 ms</td>
                    <td>820 ms</td>
                    <td><span className="perf-change neutral">+4%</span></td>
                  </tr>
                  <tr>
                    <td>Wi-Fi connect time</td>
                    <td>2.2 s</td>
                    <td>2.1 s</td>
                    <td><span className="perf-change success">-5%</span></td>
                  </tr>
                  <tr>
                    <td>Idle battery drain</td>
                    <td>1.7 %/h</td>
                    <td>1.9 %/h</td>
                    <td><span className="perf-change danger">+12%</span></td>
                  </tr>
                </tbody>
              </table>
              <div className="perf-power-footer-note">
                Changes worse than 5% are flagged.
              </div>
            </div>
          </div>

          <div className="reports-card">
            <div className="reports-card-header">
              <div className="reports-card-title">Share run {selectedRunId}</div>
            </div>

            <div className="share-link-group">
              <input
                type="text"
                readOnly
                className="share-link-input"
                value={`relay-qa/reports/run-${selectedRunId.replace('#', '')}`}
              />
              <button className="btn-copy-link" onClick={handleCopyLink}>
                Copy link
              </button>
            </div>

            <div className="share-config-grid">
              <div className="share-field">
                <label className="share-field-label">Who can open</label>
                <select 
                  className="share-field-select"
                  value={shareConfig.whoCanOpen}
                  onChange={(e) => setShareConfig({ ...shareConfig, whoCanOpen: e.target.value })}
                >
                  <option value="organization">Anyone in your organization</option>
                  <option value="qa_team">Relay QA Team only</option>
                  <option value="public_link">Anyone with link</option>
                </select>
              </div>

              <div className="share-field">
                <label className="share-field-label">Link expires</label>
                <select 
                  className="share-field-select"
                  value={shareConfig.expires}
                  onChange={(e) => setShareConfig({ ...shareConfig, expires: e.target.value })}
                >
                  <option value="30days">In 30 days</option>
                  <option value="7days">In 7 days</option>
                  <option value="90days">In 90 days</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>

            <div className="share-checkboxes-row">
              <label className="share-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={shareConfig.logs} 
                  onChange={(e) => setShareConfig({ ...shareConfig, logs: e.target.checked })}
                />
                Logs
              </label>

              <label className="share-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={shareConfig.screenshots} 
                  onChange={(e) => setShareConfig({ ...shareConfig, screenshots: e.target.checked })}
                />
                Screenshots
              </label>

              <label className="share-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={shareConfig.videos} 
                  onChange={(e) => setShareConfig({ ...shareConfig, videos: e.target.checked })}
                />
                Videos
              </label>

              <label className="share-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={shareConfig.deviceMetrics} 
                  onChange={(e) => setShareConfig({ ...shareConfig, deviceMetrics: e.target.checked })}
                />
                Device metrics
              </label>
            </div>

            <div className="share-actions-row">
              <button className="share-action-btn" onClick={() => showToast('Opening draft email with test run summary...')}>
                Email
              </button>
              <button className="share-action-btn" onClick={() => showToast('Posted run summary to Slack #relay-qa-regressions')}>
                Post to Slack
              </button>
              <button className="share-action-btn" onClick={() => showToast('Drafting Jira release validation ticket...')}>
                Create Jira issue
              </button>
              <button className="share-action-btn" onClick={() => showToast('Generating PDF Report: Relay-Run-1039.pdf...')}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#111827',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '500',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ color: '#10b981' }}>✓</span>
          {toastMessage}
        </div>
      )}

      {activeEvidenceModal && (
        <div className="reports-modal-backdrop" onClick={() => setActiveEvidenceModal(null)}>
          <div className="reports-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="reports-modal-header">
              <div>
                <h3>Evidence: {activeEvidenceModal.test}</h3>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  Artifact type: {activeEvidenceModal.type.toUpperCase()}
                </span>
              </div>
              <button onClick={() => setActiveEvidenceModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>
                ✕
              </button>
            </div>
            <div className="reports-modal-body">
              {activeEvidenceModal.type === 'log' && (
                <div style={{ background: '#0f172a', color: '#f8fafc', padding: '14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {`09-25 01:14:22.418  2100  2890 E WifiStateMachine: Roaming failed to switch to BSSID 74:ac:b9:42:11:80 within 2000ms SLA
09-25 01:14:23.102  2100  2890 W WifiNative: Driver roam time elapsed: 4812 ms
09-25 01:14:23.110  2100  2890 E RelayTestFramework: ASSERTION FAILED: [CONN_WIFI_ROAM_014] expected <= 2000 ms, actual 4812 ms
Stacktrace:
  at com.relay.qa.tests.wifi.WifiRoamingTest.testFastBssTransition(WifiRoamingTest.kt:88)`}
                </div>
              )}

              {activeEvidenceModal.type === 'screenshot' && (
                <div style={{ textAlign: 'center', background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                  <div style={{ width: '180px', height: '280px', background: '#1e293b', borderRadius: '16px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', padding: '16px' }}>
                    <div style={{ width: '40px', height: '4px', background: '#475569', borderRadius: '2px', marginBottom: '16px' }}></div>
                    <span style={{ fontSize: '11px', color: '#f87171', fontWeight: '600' }}>⚠ Test Assertion Failed</span>
                    <span style={{ fontSize: '10px', marginTop: '8px', textAlign: 'center' }}>{activeEvidenceModal.error}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '12px' }}>
                    Captured at timestamp 01:14:23.110 (Frame 4,812ms)
                  </div>
                </div>
              )}

              {activeEvidenceModal.type === 'video' && (
                <div style={{ textAlign: 'center', background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                  <div style={{ width: '100%', height: '220px', background: '#0f172a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                    ▶ Recording playback: 00:04.812 (H.265 / 1080p 60fps)
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '12px' }}>
                    Screen recording synchronized with ADB logcat stream
                  </div>
                </div>
              )}
            </div>
            <div className="reports-modal-footer">
              <button 
                className="share-action-btn"
                onClick={() => {
                  showToast(`Downloading ${activeEvidenceModal.type} artifact...`);
                }}
              >
                Download artifact
              </button>
              <button 
                className="btn-copy-link" 
                onClick={() => setActiveEvidenceModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {createBugModal && (
        <div className="reports-modal-backdrop" onClick={() => setCreateBugModal(null)}>
          <div className="reports-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="reports-modal-header">
              <h3>Create Jira Issue for Test Failure</h3>
              <button onClick={() => setCreateBugModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="reports-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Summary</label>
                <input 
                  type="text" 
                  defaultValue={`[${createBugModal.test}] ${createBugModal.error}`}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Component</label>
                  <input 
                    type="text" 
                    defaultValue={createBugModal.component}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Priority</label>
                  <select style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }} defaultValue="High - P1">
                    <option>Blocker - P0</option>
                    <option>High - P1</option>
                    <option>Medium - P2</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Regression Details</label>
                <div style={{ fontSize: '12px', color: '#4b5563', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  Detected in build <strong>2.4.0 (0925)</strong> on device Relay X-001.<br />
                  Logs, screenshot and video artifacts are automatically attached.
                </div>
              </div>
            </div>
            <div className="reports-modal-footer">
              <button className="share-action-btn" onClick={() => setCreateBugModal(null)}>Cancel</button>
              <button 
                className="btn-copy-link" 
                onClick={() => {
                  setCreateBugModal(null);
                  showToast(`Created Jira issue RLY-2235: [${createBugModal.test}] ${createBugModal.error}`);
                }}
              >
                Create Jira Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
