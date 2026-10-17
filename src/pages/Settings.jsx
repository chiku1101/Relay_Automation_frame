import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Cpu, 
  Key, 
  Bell, 
  HardDrive, 
  User, 
  Zap, 
  Activity, 
  Flame, 
  Radio, 
  Server, 
  Send, 
  ExternalLink, 
  ShieldAlert, 
  Trash2, 
  Check, 
  Save, 
  Copy, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  AlertTriangle, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MotionSlideMenu } from '@/components/unlumen-ui/motion-slide-menu';
import { Button, Badge } from '../components/ui';

// Project-specific MotionSlideMenu items tailored to Relay Automation Frame
const settingsMenuItems = [
  {
    id: 'general',
    label: 'General & Execution',
    icon: <Sliders />,
    children: [
      { id: 'profile', label: 'Workspace Profile', icon: <User /> },
      { id: 'execution', label: 'Pipeline & Retries', icon: <Zap /> },
      { id: 'concurrency', label: 'Runner Concurrency', icon: <Activity /> }
    ]
  },
  {
    id: 'fleet',
    label: 'Fleet & Hardware',
    icon: <Cpu />,
    children: [
      { id: 'thermal', label: 'Thermal Safety Guard', icon: <Flame /> },
      { id: 'relays', label: 'USB Relay Automation', icon: <Radio /> },
      { id: 'nodes', label: 'Registered Benches', icon: <Server /> }
    ]
  },
  {
    id: 'api',
    label: 'API & Webhooks',
    icon: <Key />,
    children: [
      { id: 'tokens', label: 'API Bearer Token', icon: <Key /> },
      { id: 'webhooks', label: 'CI/CD Webhooks', icon: <Send /> },
      { id: 'services', label: 'Connected Apps', icon: <ExternalLink /> }
    ]
  },
  {
    id: 'notifications',
    label: 'Alerts & Escalations',
    icon: <Bell />,
    children: [
      { id: 'channels', label: 'Slack & Email', icon: <Bell /> },
      { id: 'triggers', label: 'Incident Triggers', icon: <ShieldAlert /> }
    ]
  },
  {
    id: 'storage',
    label: 'Storage & Safety',
    icon: <HardDrive />,
    children: [
      { id: 'retention', label: 'Data Retention', icon: <HardDrive /> },
      { id: 'danger', label: 'Danger Zone', icon: <Trash2 /> }
    ]
  }
];

const INITIAL_SETTINGS = {
  workspaceName: 'Relay Automation Core',
  primaryBranch: 'main',
  defaultTarget: 'all',
  timezone: 'UTC',
  telemetryRate: '1s',
  defaultLogLevel: 'debug',
  retentionDays: '90',
  videoRetentionDays: '30',
  maxConcurrentRuns: '16',
  timeoutMinutes: '60',
  autoRerun: true,
  failFast: false,
  collectPassingArtifacts: false,
  thermalThreshold: '45',
  batteryCutoff: '20',
  autoPowerCycle: true,
  autoQuarantine: true,
  nightlyOtaPrewarm: true,
  alertSlack: true,
  alertEmail: false,
  alertPagerDuty: false,
  notifyOnThermal: true,
  notifyOnReboot: true,
  notifyOnDrain: true,
  notifyOnAnr: true,
  notifyOnDrop: true,
  apiKey: 'rl_live_89f3a9018e4726b1c8f49a0e71c9',
  slackChannel: '#relay-alerts',
  emailRecipient: 'qa-leads@relay.internal',
  passRateDropThreshold: '5'
};

const FLEET_NODES = [
  { id: 'x001', name: 'Relay X-001', bench: 'Bench A-12', ip: '192.168.4.101', status: 'Online', variant: 'success', daemon: 'v2.4.1' },
  { id: 'x002', name: 'Relay X-002', bench: 'Bench A-14 (Soak)', ip: '192.168.4.102', status: 'Soaking', variant: 'primary', daemon: 'v2.4.1' },
  { id: 'm001', name: 'Relay M-001', bench: 'Bench B-03', ip: '192.168.4.105', status: 'Offline', variant: 'danger', daemon: 'v2.4.0' },
  { id: 'm002', name: 'Relay M-002', bench: 'Bench B-04', ip: '192.168.4.106', status: 'Online', variant: 'success', daemon: 'v2.4.1' },
];

export default function Settings() {
  const [form, setForm] = useState(INITIAL_SETTINGS);
  const [activeId, setActiveId] = useState('profile');
  const [showKey, setShowKey] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [savedRecently, setSavedRecently] = useState(false);
  const [isPingingFleet, setIsPingingFleet] = useState(false);
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateField = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    setSavedRecently(true);
    showToast('Workspace settings saved successfully');
    setTimeout(() => setSavedRecently(false), 2500);
  };

  const handleResetDefaults = () => {
    setForm(INITIAL_SETTINGS);
    showToast('Settings restored to default configuration');
  };

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(form.apiKey);
    showToast('API token copied to clipboard');
  };

  const handleRollKey = () => {
    const newKey = 'rl_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setForm(prev => ({ ...prev, apiKey: newKey }));
    showToast('Rolled API token. Active runners must update headers.');
  };

  const handlePingFleet = () => {
    setIsPingingFleet(true);
    setTimeout(() => {
      setIsPingingFleet(false);
      showToast('Fleet ping completed: 3 nodes responded (avg 4.2 ms), 1 node timed out (Relay M-001)');
    }, 900);
  };

  const handleTestWebhook = () => {
    setIsSendingWebhook(true);
    setTimeout(() => {
      setIsSendingWebhook(false);
      showToast('Test payload delivered to GitHub Actions & Jenkins (HTTP 200 OK)');
    }, 850);
  };

  // Map any parent or sub-item click to appropriate active section
  const handleSelectMenuItem = (item) => {
    if (item.children && item.children.length > 0) {
      setActiveId(item.children[0].id);
    } else {
      setActiveId(item.id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700/80 text-white px-4 py-2.5 rounded-lg text-xs font-medium shadow-2xl flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="size-2 rounded-full bg-blue-500 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d121f] border border-slate-800/80 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-medium">Relay Automation Core</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400 font-mono capitalize">{activeId.replace('-', ' ')}</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-100 mt-1">Harness & Workspace Settings</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant="success" dot pulse>Daemon Active (v2.4.1)</Badge>
        </div>
      </div>

      {/* Main Grid: Motion Slide Menu (Left) & Active Settings View (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: MotionSlideMenu tailored to project */}
        <div className="md:col-span-4 lg:col-span-4 sticky top-4 space-y-4">
          <MotionSlideMenu
            items={settingsMenuItems}
            activeId={activeId}
            onSelect={handleSelectMenuItem}
            title="Relay Settings"
          />

          <div className="p-3.5 bg-[#0d121f] border border-slate-800/80 rounded-2xl text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold font-mono text-[10.5px] uppercase tracking-wider">
              <Sparkles className="size-3.5 text-blue-400" />
              Hierarchical Navigation
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Drill down into categories to configure hardware relays, thermal guard, runner concurrency, and CI/CD webhooks.
            </p>
          </div>
        </div>

        {/* Right: Selected Category Settings Panel */}
        <div className="md:col-span-8 lg:col-span-8 space-y-5">
          {/* 1. Profile / General Profile */}
          {(activeId === 'profile' || activeId === 'general') && (
            <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Sliders className="size-4 text-blue-400" />
                    Workspace Profile & Environment
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Configure workspace identity, base branches, and default target devices</p>
                </div>
                <Badge variant="primary">Core Profile</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Workspace Display Name</label>
                  <input
                    type="text"
                    value={form.workspaceName}
                    onChange={(e) => updateField('workspaceName', e.target.value)}
                    className="w-full bg-[#111622] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Shown in Slack alerts, daily digests, and CI report headers</span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Primary Regression Branch</label>
                  <select
                    value={form.primaryBranch}
                    onChange={(e) => updateField('primaryBranch', e.target.value)}
                    className="w-full bg-[#111622] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="main">main (Production development)</option>
                    <option value="release/2.4">release/2.4 (Active stabilization)</option>
                    <option value="staging">staging (Pre-merge integration)</option>
                  </select>
                  <span className="text-[10px] text-slate-500 mt-1 block">Used for regression baseline comparison</span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Default Target Device Pool</label>
                  <select
                    value={form.defaultTarget}
                    onChange={(e) => updateField('defaultTarget', e.target.value)}
                    className="w-full bg-[#111622] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Relay Hardware (A13 + A16 models)</option>
                    <option value="relay-x">Relay X series only (A16 hardware)</option>
                    <option value="relay-m">Relay M series only (A13/A16 hardware)</option>
                  </select>
                  <span className="text-[10px] text-slate-500 mt-1 block">Pre-selected device filter when creating new test plans</span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Timezone & Clock Synchronizer</label>
                  <select
                    value={form.timezone}
                    onChange={(e) => updateField('timezone', e.target.value)}
                    className="w-full bg-[#111622] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">America/New_York (EST / EDT)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST / PDT)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  </select>
                  <span className="text-[10px] text-slate-500 mt-1 block">Coordinates scheduled runs and daily soak timeline timestamps</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. Execution & Retries */}
          {activeId === 'execution' && (
            <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Zap className="size-4 text-emerald-400" />
                    Pipeline & Flaky Retry Rules
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Control automated test runner behavior, concurrency limits, and retry logic</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="space-y-3">
                {[
                  { field: 'autoRerun', label: 'Automatic Flaky Failure Retries', desc: 'Automatically re-queue test cases that fail once to verify environmental flakiness vs code defects (up to 2 attempts).' },
                  { field: 'failFast', label: 'Fail-Fast on Critical Setup Steps', desc: 'Immediately abort entire test plan if initial fastboot flashing, bootloader sanity, or Wi-Fi provisioning checks fail.' },
                  { field: 'collectPassingArtifacts', label: 'Capture Artifacts on 100% Passed Runs', desc: 'Save full logcat, dmesg, and battery metrics even when suites pass cleanly. Disabling saves disk bandwidth.' }
                ].map(item => (
                  <div key={item.field} className="p-3 bg-[#111622]/60 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-medium text-slate-200">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField(item.field, !form[item.field])}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        form[item.field] ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          form[item.field] ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Concurrency Limits */}
          {activeId === 'concurrency' && (
            <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Activity className="size-4 text-purple-400" />
                    Runner Concurrency & Timeouts
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Control execution limits across your physical Relay test bench harness</p>
                </div>
                <Badge variant="purple">16 Threads Max</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Max Concurrent Runs</label>
                  <input
                    type="number"
                    min="1"
                    max="64"
                    value={form.maxConcurrentRuns}
                    onChange={(e) => updateField('maxConcurrentRuns', e.target.value)}
                    className="w-full bg-[#111622] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Parallel harness threads</span>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Suite Timeout Limit</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="5"
                      max="300"
                      value={form.timeoutMinutes}
                      onChange={(e) => updateField('timeoutMinutes', e.target.value)}
                      className="w-full bg-[#111622] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                    />
                    <span className="text-slate-500 font-mono text-xs">min</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Aborts hanging adb commands</span>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Default Log Verbosity</label>
                  <select
                    value={form.defaultLogLevel}
                    onChange={(e) => updateField('defaultLogLevel', e.target.value)}
                    className="w-full bg-[#111622] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                  >
                    <option value="debug">DEBUG (Verbose stack)</option>
                    <option value="info">INFO (Standard telemetry)</option>
                    <option value="warn">WARN / ERROR only</option>
                  </select>
                  <span className="text-[10px] text-slate-500 mt-1 block">Applied to daemon stdout</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. Thermal Guard */}
          {(activeId === 'thermal' || activeId === 'fleet') && (
            <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Flame className="size-4 text-rose-400" />
                    Hardware Thermal Guard & Battery Cutoff
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Automated safety triggers protecting physical Relay devices from battery degradation</p>
                </div>
                <Badge variant="warning">Hardware Protection</Badge>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl flex items-start gap-3 text-xs text-amber-200">
                <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Active Thermal Protection Protocol:</strong> If device surface temperature exceeds limit during soak, test automation automatically pauses, screen brightness drops to 0%, and bench cooling fans turn on.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 text-xs mb-1">
                    <span>Thermal Emergency Threshold</span>
                    <span className="text-rose-400 font-mono font-bold">{form.thermalThreshold} °C</span>
                  </div>
                  <input
                    type="range"
                    min="38"
                    max="52"
                    step="0.5"
                    value={form.thermalThreshold}
                    onChange={(e) => updateField('thermalThreshold', e.target.value)}
                    className="w-full accent-blue-500"
                  />
                  <span className="text-[10.5px] text-slate-500 block mt-1">Triggers emergency cool-down cycle (Default: 45.0 °C)</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-xs mb-1">
                    <span>Low Battery Cutoff Threshold</span>
                    <span className="text-amber-400 font-mono font-bold">{form.batteryCutoff}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={form.batteryCutoff}
                    onChange={(e) => updateField('batteryCutoff', e.target.value)}
                    className="w-full accent-blue-500"
                  />
                  <span className="text-[10.5px] text-slate-500 block mt-1">Pauses high-power RF transmission to prevent brownouts</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. Relays Automation */}
          {activeId === 'relays' && (
            <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Radio className="size-4 text-blue-400" />
                    USB Relay Power-Cycle & Quarantine
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Physical USB relay disconnect/reconnect and automated node quarantine</p>
                </div>
                <Badge variant="primary">Relay Matrix</Badge>
              </div>

              <div className="space-y-3">
                {[
                  { field: 'autoPowerCycle', label: 'Auto USB Relay Power-Cycle', desc: 'Trigger physical USB relay disconnect/reconnect if adb does not respond for 3 consecutive pings.' },
                  { field: 'autoQuarantine', label: 'Auto-Quarantine Unresponsive Nodes', desc: 'Automatically remove offline or bootlooping devices from active job scheduling queues.' },
                  { field: 'nightlyOtaPrewarm', label: 'Nightly OTA Firmware Pre-Warm', desc: 'Pre-download tomorrow\'s nightly OTA image directly to the harness local cache at 02:00 AM.' }
                ].map(item => (
                  <div key={item.field} className="p-3 bg-[#111622]/60 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-medium text-slate-200">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField(item.field, !form[item.field])}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        form[item.field] ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          form[item.field] ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Registered Benches */}
          {activeId === 'nodes' && (
            <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Server className="size-4 text-purple-400" />
                    Registered Fleet Harness Nodes
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Physical hardware test benches connected to this Relay cluster</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  onClick={handlePingFleet}
                  loading={isPingingFleet}
                >
                  Ping All Nodes
                </Button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#090d16] border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Device Node</th>
                      <th className="py-2.5 px-3">Bench Location</th>
                      <th className="py-2.5 px-3">IP Address</th>
                      <th className="py-2.5 px-3">Daemon</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11.5px]">
                    {FLEET_NODES.map(node => (
                      <tr key={node.id} className="hover:bg-slate-800/20">
                        <td className="py-3 px-3 font-sans font-medium text-slate-200">{node.name}</td>
                        <td className="py-3 px-3 text-slate-400">{node.bench}</td>
                        <td className="py-3 px-3 text-blue-400">{node.ip}</td>
                        <td className="py-3 px-3 text-slate-400">{node.daemon}</td>
                        <td className="py-3 px-3">
                          <Badge variant={node.variant} dot pulse={node.status === 'Online'}>
                            {node.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. API Bearer Token */}
          {(activeId === 'tokens' || activeId === 'api') && (
            <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Key className="size-4 text-blue-400" />
                    Cluster API Authentication Token
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Token used by external CI pipelines (GitHub Actions, Jenkins, GitLab) to trigger test suites</p>
                </div>
                <Badge variant="success" dot pulse>Active & Verified</Badge>
              </div>

              <div className="p-4 bg-[#111622] rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="font-mono text-xs text-slate-200 truncate">
                  {showKey ? form.apiKey : 'rl_live_••••••••••••••••••••••••••••••••'}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="sm" icon={showKey ? EyeOff : Eye} onClick={() => setShowKey(!showKey)}>
                    {showKey ? 'Hide' : 'Reveal'}
                  </Button>
                  <Button variant="outline" size="sm" icon={Copy} onClick={handleCopyKey}>
                    Copy
                  </Button>
                  <Button variant="danger" size="sm" icon={RefreshCw} onClick={handleRollKey}>
                    Roll Token
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#111622]/40 rounded-xl border border-slate-800/80 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">Token Scope</span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">read:fleet · write:runs</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">Created On</span>
                  <span className="text-slate-200 mt-0.5 block">Sep 14, 2026 (24d ago)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">Last Authenticated</span>
                  <span className="text-emerald-400 font-semibold mt-0.5 block">3 mins ago (CI Node)</span>
                </div>
              </div>
            </div>
          )}

          {/* 8. Webhooks */}
          {activeId === 'webhooks' && (
            <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Send className="size-4 text-purple-400" />
                    CI / CD Inbound Webhooks
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Endpoints configured in repository webhooks to automatically trigger regressions</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Send}
                  onClick={handleTestWebhook}
                  loading={isSendingWebhook}
                >
                  Send Test Webhook
                </Button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">GitHub Actions Webhook Endpoint</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="https://relay-ci.corp.internal/api/v2/webhooks/github/push-event"
                      className="flex-1 bg-[#111622] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300"
                    />
                    <Button variant="outline" size="sm" icon={Copy} onClick={() => {
                      navigator.clipboard?.writeText('https://relay-ci.corp.internal/api/v2/webhooks/github/push-event');
                      showToast('Copied GitHub webhook URL');
                    }} />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Jenkins Pipeline Webhook Endpoint</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="https://relay-ci.corp.internal/api/v2/webhooks/jenkins/build-artifact"
                      className="flex-1 bg-[#111622] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300"
                    />
                    <Button variant="outline" size="sm" icon={Copy} onClick={() => {
                      navigator.clipboard?.writeText('https://relay-ci.corp.internal/api/v2/webhooks/jenkins/build-artifact');
                      showToast('Copied Jenkins webhook URL');
                    }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. Connected Services */}
          {activeId === 'services' && (
            <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <ExternalLink className="size-4 text-emerald-400" />
                  Connected Services & Integrations
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">External issue trackers and telemetry exporters</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-[#111622]/60 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Slack Bot Integration</div>
                    <div className="text-[11px] text-slate-400">Relay Technologies (#relay-alerts, #relay-qa)</div>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>

                <div className="p-3.5 bg-[#111622]/60 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Jira Bug Tracker</div>
                    <div className="text-[11px] text-slate-400">Auto-files regressions into project RELAY</div>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>

                <div className="p-3.5 bg-[#111622]/60 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Prometheus / Datadog Exporter</div>
                    <div className="text-[11px] text-slate-400">Metrics active on port :9090/metrics (15s scrape interval)</div>
                  </div>
                  <Badge variant="primary">Active</Badge>
                </div>
              </div>
            </div>
          )}

          {/* 10. Slack & Email Channels */}
          {(activeId === 'channels' || activeId === 'notifications') && (
            <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Bell className="size-4 text-amber-400" />
                    Notification Channels & Recipients
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Where urgent alerts and regression results should be broadcast</p>
                </div>
                <Badge variant="primary">Alert Channels</Badge>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-[#111622]/60 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-slate-200">Slack Incident Alerts</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Post real-time warnings whenever a test run fails or thermal threshold is breached.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('alertSlack', !form.alertSlack)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      form.alertSlack ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        form.alertSlack ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {form.alertSlack && (
                  <div className="p-3 bg-[#090d16] border border-slate-800 rounded-xl text-xs space-y-1">
                    <label className="text-[11px] font-medium text-slate-400 block">Target Slack Channel</label>
                    <input
                      type="text"
                      value={form.slackChannel}
                      onChange={(e) => updateField('slackChannel', e.target.value)}
                      className="w-full max-w-sm bg-[#111622] border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-slate-200"
                    />
                  </div>
                )}

                <div className="p-3 bg-[#111622]/60 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-slate-200">Daily Executive Digest Email</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Send 08:00 AM EST summary report with pass rate trends, flake radar, and fleet health.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('alertEmail', !form.alertEmail)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      form.alertEmail ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        form.alertEmail ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 11. Incident Triggers */}
          {activeId === 'triggers' && (
            <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <ShieldAlert className="size-4 text-rose-400" />
                    Critical Incident Escalation Rules
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Events that trigger immediate pager escalation and automated bug triage</p>
                </div>
                <Badge variant="danger">Escalation Policy</Badge>
              </div>

              <div className="space-y-3">
                {[
                  { field: 'notifyOnThermal', label: `Thermal Overheating (> ${form.thermalThreshold} °C)`, desc: 'Fires alert if bench sensors remain above thermal threshold for 5 continuous minutes.' },
                  { field: 'notifyOnReboot', label: 'Kernel Panic & Unexpected Reboots', desc: 'Fires immediately when Android last_kmsg or pstore registers a kernel panic during test execution.' },
                  { field: 'notifyOnAnr', label: 'ANR in com.relay.ptt Dispatch Daemon', desc: 'Captures traces.txt immediately and attaches thread stack dumps to bug triage reports.' },
                  { field: 'notifyOnDrop', label: `Pass Rate Drop vs Baseline (> ${form.passRateDropThreshold}%)`, desc: 'Alerts release managers if nightly regression pass rate drops by more than threshold points.' }
                ].map(rule => (
                  <div key={rule.field} className="p-3 bg-[#111622]/60 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-medium text-slate-200">{rule.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{rule.desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField(rule.field, !form[rule.field])}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        form[rule.field] ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          form[rule.field] ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. Retention Policy */}
          {(activeId === 'retention' || activeId === 'storage') && (
            <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <HardDrive className="size-4 text-blue-400" />
                    Data Retention & Artifact Storage
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Configure retention lifecycle for test logs, bugreports, and screen recording video files</p>
                </div>
                <Badge variant="primary">Disk Policy</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Telemetry Time-Series</label>
                  <select
                    value={form.retentionDays}
                    onChange={(e) => updateField('retentionDays', e.target.value)}
                    className="w-full bg-[#111622] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="30">30 Days</option>
                    <option value="90">90 Days (Enterprise default)</option>
                    <option value="180">180 Days (Half year)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Video Screen Recordings</label>
                  <select
                    value={form.videoRetentionDays}
                    onChange={(e) => updateField('videoRetentionDays', e.target.value)}
                    className="w-full bg-[#111622] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="14">14 Days (Recommended)</option>
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Bugreport Archives</label>
                  <select defaultValue="90" className="w-full bg-[#111622] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200">
                    <option value="90">90 Days (Standard)</option>
                    <option value="180">180 Days (Long soak)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-[#111622]/60 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Cluster Storage: 18.4 GB of 100 GB</span>
                  <span className="font-mono text-blue-400 font-bold">18.4% used</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '18.4%' }} />
                </div>
                <div className="flex gap-4 text-[11px] text-slate-500 font-mono pt-1">
                  <span>Logcat: 8.2 GB</span>
                  <span>•</span>
                  <span>Videos: 6.1 GB</span>
                  <span>•</span>
                  <span>Bugreports: 4.1 GB</span>
                </div>
              </div>
            </div>
          )}

          {/* 13. Danger Zone */}
          {activeId === 'danger' && (
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <h3 className="text-base font-semibold text-rose-300 flex items-center gap-2">
                <AlertTriangle className="size-4 text-rose-400" />
                Danger Zone & Maintenance
              </h3>
              <p className="text-xs text-rose-300/80">
                Destructive workspace actions. These operations cannot be undone and require administrative privileges.
              </p>

              <div className="space-y-3">
                {[
                  { title: 'Flush Live Telemetry Cache', desc: 'Clears in-memory WebSocket buffers for active soak graphs without deleting historical reports.', btn: 'Flush Cache', act: () => showToast('Flushed telemetry cache (12.4 MB freed)') },
                  { title: 'Purge Runs Older Than 90 Days', desc: 'Permanently remove archived run logs and screenshots older than 3 months to reclaim disk space.', btn: 'Purge Old Runs', act: () => showToast('Archival purge completed (3.8 GB reclaimed)') },
                  { title: 'Reset Workspace to Factory Defaults', desc: 'Restore default concurrency limits, alerts, and schedules back to factory profile.', btn: 'Reset Defaults', act: handleResetDefaults }
                ].map(action => (
                  <div key={action.title} className="p-3.5 bg-[#0d121f] rounded-xl border border-rose-900/30 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{action.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{action.desc}</div>
                    </div>
                    <Button variant="danger" size="sm" onClick={action.act} className="shrink-0">
                      {action.btn}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="bg-[#0d121f] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Synced with Relay daemon cluster
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleResetDefaults}>
                Reset Defaults
              </Button>
              <Button variant="primary" size="sm" icon={savedRecently ? Check : Save} onClick={handleSave}>
                {savedRecently ? 'Saved!' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
