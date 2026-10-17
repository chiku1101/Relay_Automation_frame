import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Share2, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ExternalLink, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sliders,
  Calendar,
  Layers,
  ChevronRight,
  ShieldAlert,
  Play
} from 'lucide-react';

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
    failCount: 5,
    skipCount: 1,
    duration: '2 h 58 m',
    date: 'Sep 19 01:00',
    result: 'Failed',
    device: 'Relay X-001 · RX1A0231 · Android 16',
    trigger: 'triggered by schedule'
  },
  {
    id: '#1027',
    plan: 'PTT Smoke',
    build: '2.3.9 (0919)',
    passCount: 12,
    failCount: 0,
    skipCount: 0,
    duration: '14 m',
    date: 'Sep 18 16:30',
    result: 'Passed',
    device: 'Relay X-001 · RX1A0231 · Android 16',
    trigger: 'triggered by new build'
  }
];

const FAILURES_1039 = [
  {
    id: 1,
    test: 'testFastBssTransition',
    component: 'Connectivity · Wi-Fi Roaming',
    error: 'AssertFailed: roam time 4812ms > 2000ms threshold',
    since: 'New in 0925',
    sinceType: 'new',
    evidence: ['log', 'screenshot', 'video'],
    bug: 'Create bug',
    isBugLink: false
  },
  {
    id: 2,
    test: 'testWpa3EnterpriseAuth',
    component: 'Connectivity · Wi-Fi Security',
    error: 'EAP-TLS handshake timeout after 30s',
    since: 'Since 0919 (3 runs)',
    sinceType: 'recurring',
    evidence: ['log'],
    bug: 'RLY-2184',
    isBugLink: true
  },
  {
    id: 3,
    test: 'testPttFloorRequestUnderLoad',
    component: 'PTT Service · Audio Routing',
    error: 'Floor-grant latency 680ms > 350ms budget',
    since: 'New in 0925',
    sinceType: 'new',
    evidence: ['log', 'screenshot'],
    bug: 'Create bug',
    isBugLink: false
  },
  {
    id: 4,
    test: 'testThermalThrottlingDutyCycle',
    component: 'Kernel & Thermal · Governor',
    error: 'CPU clock throttled to 1.1GHz during active call',
    since: 'Since 0912 (5 runs)',
    sinceType: 'recurring',
    evidence: ['log'],
    bug: 'RLY-2102',
    isBugLink: true
  },
  {
    id: 5,
    test: 'testHeadsetInsertionDebounce',
    component: 'Audio & HAL · Wired Headset',
    error: 'Jack state flapped twice in 50ms',
    since: 'New in 0925',
    sinceType: 'new',
    evidence: ['log', 'screenshot'],
    bug: 'Create bug',
    isBugLink: false
  },
  {
    id: 6,
    test: 'testBtA2dpReconnectionLoop',
    component: 'Connectivity · Bluetooth Stack',
    error: 'ACL link disconnected reason: LMP response timeout',
    since: 'Flaky (2/5 pass)',
    sinceType: 'flaky',
    evidence: ['log', 'video'],
    bug: 'Create bug',
    isBugLink: false
  },
  {
    id: 7,
    test: 'testFastbootRebootToSystem',
    component: 'Bootloader · Lifecycle',
    error: 'Device took 42s to reach boot_completed > 30s SLA',
    since: 'New in 0925',
    sinceType: 'new',
    evidence: ['log'],
    bug: 'Create bug',
    isBugLink: false
  }
];

const Reports = () => {
  const [selectedRunId, setSelectedRunId] = useState('#1039');
  const [activeTab, setActiveTab] = useState('failures');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  
  const [deviceChipActive, setDeviceChipActive] = useState(true);
  const [buildChipActive, setBuildChipActive] = useState(true);

  const [compareCheckboxes, setCompareCheckboxes] = useState({ '#1039': true, '#1031': true });
  const [leftBuild, setLeftBuild] = useState('2.3.9 (0919)');
  const [rightBuild, setRightBuild] = useState('2.4.0 (0926)');

  const [activeEvidenceModal, setActiveEvidenceModal] = useState(null);
  const [createBugModal, setCreateBugModal] = useState(null);

  const [shareConfig, setShareConfig] = useState({
    whoCanOpen: 'organization',
    expires: '30days',
    logs: true,
    screenshots: true,
    videos: false,
    deviceMetrics: true
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleCompareRun = (id) => {
    setCompareCheckboxes(prev => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
  };

  const handleCopyLink = () => {
    const link = `https://relay-qa.internal/reports/run-${selectedRunId.replace('#', '')}`;
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

  const getResultBadge = (result) => {
    switch (result?.toLowerCase()) {
      case 'running':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'passed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'failed':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-slate-100 px-4 py-2.5 rounded-xl text-xs font-medium shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Query Header */}
      <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 size-4 text-slate-500" />
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search runs by device serial, run ID (#1039), test name, or firmware build..."
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {deviceChipActive && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-mono flex items-center gap-1.5">
                Device: Relay X-001 (RX1A0231)
                <button onClick={() => setDeviceChipActive(false)} className="hover:text-blue-200">✕</button>
              </span>
            )}
            {buildChipActive && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-mono flex items-center gap-1.5">
                Build: 2.3.9 → 2.4.0
                <button onClick={() => setBuildChipActive(false)} className="hover:text-blue-200">✕</button>
              </span>
            )}

            <button onClick={() => showToast('Filter by Plan')} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono">
              + Plan
            </button>
            <button onClick={() => showToast('Filter by Component')} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono">
              + Component
            </button>
            <button onClick={() => showToast('Filter by Result')} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono">
              + Result
            </button>
            <button onClick={() => showToast('Filter by Date')} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono">
              Date: 30 days
            </button>
          </div>

          <div className="text-xs font-mono text-slate-500 shrink-0">
            {filteredRuns.length} runs · 1,187 test executions
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Runs Table & Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Runs List & Detailed Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Runs Table */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Execution History</h2>
              <span className="text-[11px] font-mono text-slate-500">Check boxes to compare two runs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10.5px] font-mono text-slate-400 uppercase tracking-wider">
                    <th className="py-2 px-2 w-8"></th>
                    <th className="py-2 px-2">Run</th>
                    <th className="py-2 px-2">Plan</th>
                    <th className="py-2 px-2">Build</th>
                    <th className="py-2 px-2">Pass / Fail / Skip</th>
                    <th className="py-2 px-2">Duration</th>
                    <th className="py-2 px-2">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono text-[11.5px]">
                  {filteredRuns.map((r) => {
                    const isSelected = r.id === selectedRunId;
                    const isChecked = !!compareCheckboxes[r.id];
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedRunId(r.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-950/30 border-l-2 border-l-blue-500' : 'hover:bg-slate-900/40'
                        }`}
                      >
                        <td className="py-2.5 px-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCompareRun(r.id)}
                            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                          />
                        </td>
                        <td className="py-2.5 px-2 font-bold text-slate-200">{r.id}</td>
                        <td className="py-2.5 px-2 font-sans font-medium text-slate-300">{r.plan}</td>
                        <td className="py-2.5 px-2 text-slate-400">{r.build}</td>
                        <td className="py-2.5 px-2">
                          <span className="text-emerald-400 font-bold">{r.passCount}</span>
                          <span className="text-slate-600"> / </span>
                          <span className="text-rose-400 font-bold">{r.failCount}</span>
                          <span className="text-slate-600"> / </span>
                          <span className="text-slate-500">{r.skipCount}</span>
                        </td>
                        <td className="py-2.5 px-2 text-slate-400">{r.duration}</td>
                        <td className="py-2.5 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getResultBadge(r.result)}`}>
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

          {/* Detailed Inspector Card for Selected Run */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <div className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span>Run {selectedRunObj.id}</span>
                  <span className="text-slate-500">·</span>
                  <span>{selectedRunObj.plan}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  {selectedRunObj.device} · duration {selectedRunObj.duration}
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border self-start sm:self-auto ${getResultBadge(selectedRunObj.result)}`}>
                {selectedRunObj.result}
              </span>
            </div>

            {/* Run Detail Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2">
              {[
                { id: 'failures', label: `Failures (${selectedRunObj.failCount})` },
                { id: 'summary', label: 'Summary' },
                { id: 'all', label: 'All Cases (345)' },
                { id: 'logs', label: 'Log Stream' },
                { id: 'metrics', label: 'Hardware Metrics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Failures Table */}
            {activeTab === 'failures' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10.5px] font-mono text-slate-400 uppercase tracking-wider">
                      <th className="py-2 px-2.5">Failing Test</th>
                      <th className="py-2 px-2.5">Error Reason</th>
                      <th className="py-2 px-2.5">First Seen</th>
                      <th className="py-2 px-2.5">Artifacts</th>
                      <th className="py-2 px-2.5">Jira Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 font-mono text-[11.5px]">
                    {FAILURES_1039.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-2.5 px-2.5">
                          <div className="font-semibold text-slate-200">{item.test}</div>
                          <div className="text-[10px] text-slate-500">{item.component}</div>
                        </td>
                        <td className="py-2.5 px-2.5 text-rose-300 font-mono text-[11px] max-w-[200px] truncate">
                          {item.error}
                        </td>
                        <td className="py-2.5 px-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                            item.sinceType === 'new'
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {item.since}
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5">
                          <div className="flex items-center gap-1.5">
                            {item.evidence.map((ev) => (
                              <button
                                key={ev}
                                onClick={() => setActiveEvidenceModal({ test: item.test, type: ev, error: item.error })}
                                className="text-[10.5px] text-blue-400 hover:text-blue-300 hover:underline"
                              >
                                {ev}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 px-2.5">
                          {item.isBugLink ? (
                            <button
                              onClick={() => showToast(`Opening Jira defect ${item.bug}...`)}
                              className="text-amber-400 hover:underline font-mono text-xs"
                            >
                              {item.bug}
                            </button>
                          ) : (
                            <button
                              onClick={() => setCreateBugModal(item)}
                              className="px-2 py-0.5 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[10.5px] font-sans font-medium"
                            >
                              + File Bug
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Summary */}
            {activeTab === 'summary' && (
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300 leading-relaxed font-mono">
                <p><strong>Execution Status:</strong> Total 345 test cases planned across 8 device test components.</p>
                <p>Pass rate for this build is <strong className="text-emerald-400">97.4%</strong> (336 passed, 7 failed, 2 skipped due to dependencies).</p>
                <p>Top regression cluster: <em>Wi-Fi Roaming BSS transition latency</em> and <em>PTT audio floor-grant negotiation</em>.</p>
              </div>
            )}

            {/* Tab: Log Stream */}
            {activeTab === 'logs' && (
              <div className="p-3 bg-black/80 border border-slate-900 rounded-xl font-mono text-[11px] text-slate-300 space-y-1 max-h-56 overflow-y-auto">
                <div className="text-slate-500">[01:00:02.100] TEST_RUN_STARTED: Nightly Regression (runner: relay-orchestrator-v2)</div>
                <div className="text-sky-400">[01:00:03.450] DEVICE_CONNECTED: Relay X-001 (RX1A0231) via ADB over TLS</div>
                <div className="text-slate-300">[01:00:05.120] PACKAGE_INSTALLED: com.relay.qa.tests (targetSdk: 35)</div>
                <div className="text-rose-400 font-bold">[01:04:12.890] FAIL: CONN_WIFI_ROAM_014 - AssertFailed: roam time 4812ms &gt; threshold 2000ms</div>
                <div className="text-amber-300">[01:04:13.100] EVIDENCE_DUMP: Saved failure screenshot and bugreport snippet</div>
              </div>
            )}

            {/* Tab: Hardware Metrics */}
            {activeTab === 'metrics' && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10.5px] font-mono text-slate-400">Peak Thermal</div>
                  <div className="text-lg font-bold font-mono text-amber-400 mt-1">41.8 °C</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10.5px] font-mono text-slate-400">Battery Drain</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-1">1.9 %/h</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10.5px] font-mono text-slate-400">Memory High-Watermark</div>
                  <div className="text-lg font-bold font-mono text-sky-400 mt-1">820 MB</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Comparison & Share (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Build Comparison Card */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Build Delta Comparison</h3>
                <p className="text-[11px] font-mono text-slate-500">Relay X-001 · Nightly Regression</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-mono">
                Diff View
              </span>
            </div>

            {/* Comparison Selectors */}
            <div className="grid grid-cols-11 items-center gap-2">
              <div className="col-span-5">
                <select
                  value={leftBuild}
                  onChange={(e) => setLeftBuild(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                >
                  <option value="2.3.9 (0919)">2.3.9 (0919)</option>
                  <option value="2.3.8 (0912)">2.3.8 (0912)</option>
                  <option value="2.3.7 (0905)">2.3.7 (0905)</option>
                </select>
              </div>

              <div className="col-span-1 text-center text-slate-500">→</div>

              <div className="col-span-5">
                <select
                  value={rightBuild}
                  onChange={(e) => setRightBuild(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                >
                  <option value="2.4.0 (0926)">2.4.0 (0926)</option>
                  <option value="2.4.0 (0925)">2.4.0 (0925)</option>
                  <option value="2.4.0-rc1">2.4.0-rc1</option>
                </select>
              </div>
            </div>

            {/* Comparison Stat Badges */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Pass Rate</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5">95.1%</div>
                <div className="text-[9.5px] text-rose-400 mt-0.5">▼ 1.2 pts</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">New Fails</div>
                <div className="text-sm font-bold text-rose-400 mt-0.5">4</div>
                <div className="text-[9.5px] text-rose-300 mt-0.5">regressed</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Fixed</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">2</div>
                <div className="text-[9.5px] text-emerald-300 mt-0.5">now pass</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Flaky</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">3</div>
                <div className="text-[9.5px] text-amber-300 mt-0.5">intermittent</div>
              </div>
            </div>

            {/* Performance and Power Table */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-200">Performance & Energy Footprint</div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10.5px] font-mono text-slate-400 uppercase">
                    <th className="py-1 px-1">Metric</th>
                    <th className="py-1 px-1 text-center">0919</th>
                    <th className="py-1 px-1 text-center">0926</th>
                    <th className="py-1 px-1 text-right">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono text-[11px]">
                  <tr>
                    <td className="py-1.5 px-1 text-slate-300">Boot time</td>
                    <td className="py-1.5 px-1 text-center text-slate-400">19.8 s</td>
                    <td className="py-1.5 px-1 text-center text-slate-200">21.4 s</td>
                    <td className="py-1.5 px-1 text-right text-rose-400 font-semibold">+8%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-1 text-slate-300">PTT floor latency</td>
                    <td className="py-1.5 px-1 text-center text-slate-400">176 ms</td>
                    <td className="py-1.5 px-1 text-center text-slate-200">182 ms</td>
                    <td className="py-1.5 px-1 text-right text-slate-400">+3%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-1 text-slate-300">PTT cold start</td>
                    <td className="py-1.5 px-1 text-center text-slate-400">790 ms</td>
                    <td className="py-1.5 px-1 text-center text-slate-200">820 ms</td>
                    <td className="py-1.5 px-1 text-right text-slate-400">+4%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-1 text-slate-300">Wi-Fi connect time</td>
                    <td className="py-1.5 px-1 text-center text-slate-400">2.2 s</td>
                    <td className="py-1.5 px-1 text-center text-slate-200">2.1 s</td>
                    <td className="py-1.5 px-1 text-right text-emerald-400 font-semibold">-5%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-1 text-slate-300">Idle battery drain</td>
                    <td className="py-1.5 px-1 text-center text-slate-400">1.7 %/h</td>
                    <td className="py-1.5 px-1 text-center text-slate-200">1.9 %/h</td>
                    <td className="py-1.5 px-1 text-right text-rose-400 font-semibold">+12%</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-[10px] text-slate-500 font-mono">
                Regressions worse than 5% SLA threshold are flagged automatically.
              </div>
            </div>
          </div>

          {/* Share Run Link & Export Actions */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Share2 className="size-3.5 text-blue-400" />
                Share Run {selectedRunId}
              </h3>
            </div>

            {/* Share link input */}
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`relay-qa/reports/run-${selectedRunId.replace('#', '')}`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Copy className="size-3.5" /> Copy
              </button>
            </div>

            {/* Scope & Expiration */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Access Control</label>
                <select
                  value={shareConfig.whoCanOpen}
                  onChange={(e) => setShareConfig({ ...shareConfig, whoCanOpen: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300"
                >
                  <option value="organization">Organization Internal</option>
                  <option value="qa_team">QA Team Only</option>
                  <option value="public_link">Anyone with Link</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Link Expiration</label>
                <select
                  value={shareConfig.expires}
                  onChange={(e) => setShareConfig({ ...shareConfig, expires: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300"
                >
                  <option value="30days">30 Days</option>
                  <option value="7days">7 Days</option>
                  <option value="90days">90 Days</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>

            {/* Included Artifacts Checkboxes */}
            <div className="flex flex-wrap gap-3 text-xs text-slate-300 font-mono">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareConfig.logs}
                  onChange={(e) => setShareConfig({ ...shareConfig, logs: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Raw Logs</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareConfig.screenshots}
                  onChange={(e) => setShareConfig({ ...shareConfig, screenshots: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Screenshots</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareConfig.videos}
                  onChange={(e) => setShareConfig({ ...shareConfig, videos: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Screen Video</span>
              </label>
            </div>

            {/* Quick Export Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => showToast('Opening draft email with test run summary...')}
                className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
              >
                Email Report
              </button>
              <button
                onClick={() => showToast('Posted run summary to Slack #relay-qa-regressions')}
                className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
              >
                Post to Slack
              </button>
              <button
                onClick={() => showToast('Drafting Jira release validation ticket...')}
                className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
              >
                File Jira Issue
              </button>
              <button
                onClick={() => showToast('Generating PDF Report: Relay-Run-1039.pdf...')}
                className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Evidence Modal */}
      {activeEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveEvidenceModal(null)}>
          <div className="w-full max-w-xl bg-[#0a0f1b] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <FileText className="size-4 text-blue-400" /> Evidence: {activeEvidenceModal.test}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Artifact Format: {activeEvidenceModal.type.toUpperCase()}
                </p>
              </div>
              <button onClick={() => setActiveEvidenceModal(null)} className="text-slate-500 hover:text-slate-300">
                <X className="size-4" />
              </button>
            </div>

            <div>
              {activeEvidenceModal.type === 'log' && (
                <div className="p-3 bg-black/80 border border-slate-900 rounded-xl font-mono text-[11px] text-slate-300 space-y-1">
                  <div className="text-rose-400">09-25 01:14:22.418  2100  2890 E WifiStateMachine: Roaming failed to switch to BSSID within 2000ms SLA</div>
                  <div className="text-amber-300">09-25 01:14:23.102  2100  2890 W WifiNative: Driver roam time elapsed: 4812 ms</div>
                  <div className="text-rose-400 font-bold">09-25 01:14:23.110  2100  2890 E RelayTestFramework: ASSERTION FAILED: expected &lt;= 2000 ms, actual 4812 ms</div>
                  <div className="text-slate-500">at com.relay.qa.tests.wifi.WifiRoamingTest.testFastBssTransition(WifiRoamingTest.kt:88)</div>
                </div>
              )}

              {activeEvidenceModal.type === 'screenshot' && (
                <div className="p-8 bg-slate-950 border border-dashed border-slate-800 rounded-xl text-center space-y-2">
                  <div className="w-48 h-64 bg-slate-900 border border-slate-800 rounded-2xl mx-auto flex flex-col items-center justify-center p-4">
                    <span className="text-xs font-bold text-rose-400">⚠ Assertion Failed</span>
                    <span className="text-[10px] text-slate-500 text-center mt-2">{activeEvidenceModal.error}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">Captured at timestamp 01:14:23.110 (Frame 4,812ms)</div>
                </div>
              )}

              {activeEvidenceModal.type === 'video' && (
                <div className="p-8 bg-slate-950 border border-dashed border-slate-800 rounded-xl text-center space-y-2">
                  <div className="w-full h-48 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-sky-400 font-mono text-xs">
                    ▶ Screen recording: 00:04.812 (H.265 / 1080p 60fps)
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">Video synchronized with high-frequency ADB log stream</div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => showToast(`Downloaded ${activeEvidenceModal.type} artifact bundle`)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Download Artifact
              </button>
              <button
                onClick={() => setActiveEvidenceModal(null)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Jira Bug Modal */}
      {createBugModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setCreateBugModal(null)}>
          <div className="w-full max-w-lg bg-[#0a0f1b] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="size-4 text-amber-400" /> Create Jira Issue
              </h3>
              <button onClick={() => setCreateBugModal(null)} className="text-slate-500 hover:text-slate-300">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Summary</label>
                <input
                  type="text"
                  defaultValue={`[${createBugModal.test}] ${createBugModal.error}`}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Component</label>
                  <input
                    type="text"
                    defaultValue={createBugModal.component}
                    className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Priority</label>
                  <select defaultValue="High - P1" className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200">
                    <option>Blocker - P0</option>
                    <option>High - P1</option>
                    <option>Medium - P2</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400">
                Detected in build <strong>2.4.0 (0925)</strong> on device Relay X-001.<br />
                Logs, screenshot, and video artifacts attached automatically.
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setCreateBugModal(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCreateBugModal(null);
                  showToast(`Created Jira issue RLY-2235: [${createBugModal.test}] ${createBugModal.error}`);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
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
