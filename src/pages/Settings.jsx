import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Cpu, 
  Key, 
  Bell, 
  HardDrive,
  Check, 
  Save, 
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  Send,
  Trash2,
  RotateCcw,
  ShieldAlert,
  Server,
  Zap,
  Radio,
  ExternalLink
} from 'lucide-react';

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
  { id: 'x001', name: 'Relay X-001', bench: 'Bench A-12', ip: '192.168.4.101', status: 'Online', daemon: 'v2.4.1' },
  { id: 'x002', name: 'Relay X-002', bench: 'Bench A-14 (Soak)', ip: '192.168.4.102', status: 'Soaking', daemon: 'v2.4.1' },
  { id: 'm001', name: 'Relay M-001', bench: 'Bench B-03', ip: '192.168.4.105', status: 'Offline', daemon: 'v2.4.0' },
  { id: 'm002', name: 'Relay M-002', bench: 'Bench B-04', ip: '192.168.4.106', status: 'Online', daemon: 'v2.4.1' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [form, setForm] = useState(INITIAL_SETTINGS);
  const [showKey, setShowKey] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [savedRecently, setSavedRecently] = useState(false);
  const [isPingingFleet, setIsPingingFleet] = useState(false);
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
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

  useEffect(() => {
    const onSave = () => handleSave();
    const onReset = () => handleResetDefaults();
    window.addEventListener('save-workspace-settings', onSave);
    window.addEventListener('reset-settings-defaults', onReset);
    return () => {
      window.removeEventListener('save-workspace-settings', onSave);
      window.removeEventListener('reset-settings-defaults', onReset);
    };
  }, [form]);

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(form.apiKey);
    showToast('API token copied to clipboard');
  };

  const handleRollKey = () => {
    const newKey = 'rl_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setForm(prev => ({ ...prev, apiKey: newKey }));
    showToast('Rolled API token. Active connections must update headers.');
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

  const updateField = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const tabs = [
    { id: 'general', label: 'General & Execution', icon: Sliders },
    { id: 'fleet', label: 'Fleet & Hardware', icon: Cpu },
    { id: 'api', label: 'API & Integrations', icon: Key },
    { id: 'notifications', label: 'Alerts & Webhooks', icon: Bell },
    { id: 'retention', label: 'Storage & Safety', icon: HardDrive },
  ];

  return (
    <div className="settings-container">
      <div className="settings-kpi-grid">
        <div className="card stat-card" style={{ padding: '16px 20px' }}>
          <div className="flex-between">
            <span className="stat-label">CLUSTER TIER</span>
            <Server size={16} color="#2563eb" />
          </div>
          <div className="stat-value" style={{ fontSize: '18px', marginTop: '6px' }}>Enterprise Cloud</div>
          <div className="stat-desc">us-east-relay-01 · 99.98% uptime</div>
        </div>

        <div className="card stat-card" style={{ padding: '16px 20px' }}>
          <div className="flex-between">
            <span className="stat-label">FLEET CAPACITY</span>
            <Cpu size={16} color="#059669" />
          </div>
          <div className="stat-value" style={{ fontSize: '18px', marginTop: '6px' }}>6 Active Runners</div>
          <div className="stat-desc">{form.maxConcurrentRuns} max concurrent threads</div>
        </div>

        <div className="card stat-card" style={{ padding: '16px 20px' }}>
          <div className="flex-between">
            <span className="stat-label">API SECURITY</span>
            <Zap size={16} color="#7c3aed" />
          </div>
          <div className="stat-value" style={{ fontSize: '18px', marginTop: '6px' }}>Token Live</div>
          <div className="stat-desc">Last authenticated 3m ago</div>
        </div>

        <div className="card stat-card" style={{ padding: '16px 20px' }}>
          <div className="flex-between">
            <span className="stat-label">STORAGE ALLOCATION</span>
            <HardDrive size={16} color="#d97706" />
          </div>
          <div className="stat-value" style={{ fontSize: '18px', marginTop: '6px' }}>18.4 GB Used</div>
          <div className="stat-desc">{form.retentionDays} days retention policy</div>
        </div>
      </div>

      <div className="settings-tabs-bar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`settings-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="settings-section-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title">
                  <Sliders size={18} color="#2563eb" />
                  Workspace Profile & Environment
                </h3>
                <p className="settings-card-desc">Configure workspace identity, base branches, and default target devices</p>
              </div>
              <span className="badge badge-primary">Core Profile</span>
            </div>

            <div className="settings-grid-2">
              <div className="settings-form-group">
                <label className="settings-label">Workspace Display Name</label>
                <input
                  type="text"
                  value={form.workspaceName}
                  onChange={(e) => updateField('workspaceName', e.target.value)}
                  className="settings-input"
                  placeholder="e.g. Relay Automation Core"
                />
                <span className="settings-hint">Shown in Slack alerts, daily digests, and CI report headers</span>
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Primary Regression Branch</label>
                <select
                  value={form.primaryBranch}
                  onChange={(e) => updateField('primaryBranch', e.target.value)}
                  className="settings-select"
                >
                  <option value="main">main (Production development)</option>
                  <option value="release/2.4">release/2.4 (Active stabilization)</option>
                  <option value="staging">staging (Pre-merge integration)</option>
                </select>
                <span className="settings-hint">Used for regression baseline comparison</span>
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Default Target Device Pool</label>
                <select
                  value={form.defaultTarget}
                  onChange={(e) => updateField('defaultTarget', e.target.value)}
                  className="settings-select"
                >
                  <option value="all">All Relay Hardware (A13 + A16 models)</option>
                  <option value="relay-x">Relay X series only (A16 hardware)</option>
                  <option value="relay-m">Relay M series only (A13/A16 hardware)</option>
                </select>
                <span className="settings-hint">Pre-selected device filter when creating new test plans</span>
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Timezone & Clock Synchronizer</label>
                <select
                  value={form.timezone}
                  onChange={(e) => updateField('timezone', e.target.value)}
                  className="settings-select"
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">America/New_York (EST / EDT)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST / PDT)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="Europe/London">Europe/London (BST / GMT)</option>
                </select>
                <span className="settings-hint">Coordinates scheduled runs and daily soak timeline timestamps</span>
              </div>
            </div>
          </div>

          <div className="settings-section-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title">
                  <Zap size={18} color="#2563eb" />
                  Execution Pipeline & Retry Policies
                </h3>
                <p className="settings-card-desc">Control automated test runner behavior, concurrency limits, and retry logic</p>
              </div>
              <span className="badge badge-success">Optimized</span>
            </div>

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Automatic Flaky Failure Retries</div>
                <div className="settings-switch-desc">Automatically re-queue test cases that fail once to verify whether failures are environmental or true code defects (up to 2 attempts).</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.autoRerun ? 'active' : ''}`}
                onClick={() => updateField('autoRerun', !form.autoRerun)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Fail-Fast on Critical Setup Steps</div>
                <div className="settings-switch-desc">Immediately abort entire test plan if initial fastboot flashing, bootloader sanity, or Wi-Fi provisioning checks fail.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.failFast ? 'active' : ''}`}
                onClick={() => updateField('failFast', !form.failFast)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Capture Artifacts on 100% Passed Runs</div>
                <div className="settings-switch-desc">Save full logcat, dmesg, and battery metrics even when suites pass cleanly. Disabling saves disk bandwidth.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.collectPassingArtifacts ? 'active' : ''}`}
                onClick={() => updateField('collectPassingArtifacts', !form.collectPassingArtifacts)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>

            <div className="settings-grid-3" style={{ marginTop: '8px' }}>
              <div className="settings-form-group">
                <label className="settings-label">Max Concurrent Runs</label>
                <input
                  type="number"
                  min="1"
                  max="64"
                  value={form.maxConcurrentRuns}
                  onChange={(e) => updateField('maxConcurrentRuns', e.target.value)}
                  className="settings-input"
                />
                <span className="settings-hint">Parallel harness threads</span>
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Suite Timeout Limit</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={form.timeoutMinutes}
                    onChange={(e) => updateField('timeoutMinutes', e.target.value)}
                    className="settings-input"
                  />
                  <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>min</span>
                </div>
                <span className="settings-hint">Aborts hanging adb commands</span>
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Default Log Verbosity</label>
                <select
                  value={form.defaultLogLevel}
                  onChange={(e) => updateField('defaultLogLevel', e.target.value)}
                  className="settings-select"
                >
                  <option value="debug">DEBUG (Verbose stack trace)</option>
                  <option value="info">INFO (Standard telemetry)</option>
                  <option value="warn">WARN / ERROR only</option>
                </select>
                <span className="settings-hint">Applied to daemon stdout</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fleet' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="settings-section-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title">
                  <Cpu size={18} color="#2563eb" />
                  Hardware Safety & Thermal Guard
                </h3>
                <p className="settings-card-desc">Safety rules protecting physical Relay devices from thermal stress and battery degradation</p>
              </div>
              <span className="badge badge-warning">Hardware Protection</span>
            </div>

            <div className="settings-callout warning">
              <AlertTriangle size={18} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Active Thermal Protection Protocol:</strong> If device surface sensors exceed the configured limit during a 7-day soak, test automation is automatically paused, screen brightness drops to 0%, and cooling fans activate on bench harness.
              </div>
            </div>

            <div className="settings-grid-2">
              <div className="settings-form-group">
                <label className="settings-label">
                  Thermal Emergency Threshold
                  <span style={{ color: '#dc2626', fontWeight: '700' }}>{form.thermalThreshold} °C</span>
                </label>
                <input
                  type="range"
                  min="38"
                  max="52"
                  step="0.5"
                  value={form.thermalThreshold}
                  onChange={(e) => updateField('thermalThreshold', e.target.value)}
                  style={{ width: '100%', accentColor: '#2563eb' }}
                />
                <span className="settings-hint">Threshold triggers safety cool-down cycle (Default: 45.0 °C)</span>
              </div>

              <div className="settings-form-group">
                <label className="settings-label">
                  Low Battery Cutoff Threshold
                  <span style={{ color: '#d97706', fontWeight: '700' }}>{form.batteryCutoff}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={form.batteryCutoff}
                  onChange={(e) => updateField('batteryCutoff', e.target.value)}
                  style={{ width: '100%', accentColor: '#2563eb' }}
                />
                <span className="settings-hint">Pauses high-power RF transmission to prevent battery brownouts</span>
              </div>
            </div>

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Auto USB Relay Power-Cycle</div>
                <div className="settings-switch-desc">Trigger physical USB relay disconnect/reconnect if adb does not respond for 3 consecutive pings.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.autoPowerCycle ? 'active' : ''}`}
                onClick={() => updateField('autoPowerCycle', !form.autoPowerCycle)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Auto-Quarantine Unresponsive Nodes</div>
                <div className="settings-switch-desc">Automatically remove offline or bootlooping devices from active job scheduling queues to prevent queue stall.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.autoQuarantine ? 'active' : ''}`}
                onClick={() => updateField('autoQuarantine', !form.autoQuarantine)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Nightly OTA Firmware Pre-Warm</div>
                <div className="settings-switch-desc">Pre-download tomorrow's nightly OTA image directly to the harness local cache at 02:00 AM to eliminate flash latency.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.nightlyOtaPrewarm ? 'active' : ''}`}
                onClick={() => updateField('nightlyOtaPrewarm', !form.nightlyOtaPrewarm)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>
          </div>

          <div className="settings-section-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title">
                  <Radio size={18} color="#2563eb" />
                  Registered Fleet Harness Nodes
                </h3>
                <p className="settings-card-desc">Hardware test benches connected to this Relay cluster</p>
              </div>
              <button
                type="button"
                className="settings-action-pill"
                onClick={handlePingFleet}
                disabled={isPingingFleet}
              >
                <RefreshCw size={13} className={isPingingFleet ? 'animate-spin' : ''} />
                {isPingingFleet ? 'Pinging Nodes...' : 'Ping All Nodes'}
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{ padding: '10px 16px' }}>DEVICE</th>
                    <th style={{ padding: '10px 16px' }}>BENCH LOCATION</th>
                    <th style={{ padding: '10px 16px' }}>IP ADDRESS</th>
                    <th style={{ padding: '10px 16px' }}>DAEMON VERSION</th>
                    <th style={{ padding: '10px 16px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {FLEET_NODES.map(node => (
                    <tr key={node.id}>
                      <td style={{ padding: '12px 16px', fontWeight: '600', color: '#111827' }}>{node.name}</td>
                      <td style={{ padding: '12px 16px', color: '#4b5563', fontSize: '13px' }}>{node.bench}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#374151' }}>{node.ip}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>{node.daemon}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${
                          node.status === 'Online' ? 'badge-success' :
                          node.status === 'Soaking' ? 'badge-primary' : 'badge-danger'
                        }`}>
                          {node.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="settings-section-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title">
                  <Key size={18} color="#2563eb" />
                  Cluster API Authentication Token
                </h3>
                <p className="settings-card-desc">Token used by external CI pipelines (GitHub Actions, Jenkins, GitLab) to trigger test suites and query run status</p>
              </div>
              <span className="badge badge-success">Active & Verified</span>
            </div>

            <div className="settings-form-group">
              <label className="settings-label">
                Active Relay API Token
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '400' }}>Prefix: rl_live_</span>
              </label>

              <div className="settings-token-card">
                <span className="settings-token-text">
                  {showKey ? form.apiKey : 'rl_live_••••••••••••••••••••••••••••••••'}
                </span>
                <button
                  type="button"
                  className="settings-action-pill"
                  onClick={() => setShowKey(!showKey)}
                  title={showKey ? 'Hide Token' : 'Show Token'}
                >
                  {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                  {showKey ? 'Hide' : 'Reveal'}
                </button>
                <button
                  type="button"
                  className="settings-action-pill"
                  onClick={handleCopyKey}
                  title="Copy to Clipboard"
                >
                  <Copy size={13} />
                  Copy
                </button>
                <button
                  type="button"
                  className="settings-action-pill"
                  onClick={handleRollKey}
                  style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                  title="Rotate Token"
                >
                  <RefreshCw size={13} />
                  Roll Token
                </button>
              </div>
              <span className="settings-hint">Keep this token secure. It grants programmatic execution rights on all registered hardware benches.</span>
            </div>

            <div className="settings-grid-3" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>TOKEN SCOPE</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginTop: '2px' }}>read:fleet · write:runs</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>CREATED ON</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginTop: '2px' }}>Sep 14, 2026 (24d ago)</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>LAST AUTHENTICATED</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#059669', marginTop: '2px' }}>3 mins ago (CI/CD Node)</div>
              </div>
            </div>
          </div>

          <div className="settings-section-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title">
                  <Send size={18} color="#2563eb" />
                  CI / CD Inbound Webhooks
                </h3>
                <p className="settings-card-desc">Endpoints configured in repository webhooks to automatically trigger regressions on new commits</p>
              </div>
              <button
                type="button"
                className="settings-action-pill"
                onClick={handleTestWebhook}
                disabled={isSendingWebhook}
              >
                <Send size={13} />
                {isSendingWebhook ? 'Testing...' : 'Send Test Webhook'}
              </button>
            </div>

            <div className="settings-form-group">
              <label className="settings-label">GitHub Actions Webhook Endpoint</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  readOnly
                  value="https://relay-ci.corp.internal/api/v2/webhooks/github/push-event"
                  className="settings-input"
                  style={{ background: '#f8fafc', fontFamily: 'monospace', fontSize: '12.5px' }}
                />
                <button
                  type="button"
                  className="settings-action-pill"
                  onClick={() => {
                    navigator.clipboard?.writeText('https://relay-ci.corp.internal/api/v2/webhooks/github/push-event');
                    showToast('Copied GitHub webhook URL');
                  }}
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>

            <div className="settings-form-group">
              <label className="settings-label">Jenkins Pipeline Webhook Endpoint</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  readOnly
                  value="https://relay-ci.corp.internal/api/v2/webhooks/jenkins/build-artifact"
                  className="settings-input"
                  style={{ background: '#f8fafc', fontFamily: 'monospace', fontSize: '12.5px' }}
                />
                <button
                  type="button"
                  className="settings-action-pill"
                  onClick={() => {
                    navigator.clipboard?.writeText('https://relay-ci.corp.internal/api/v2/webhooks/jenkins/build-artifact');
                    showToast('Copied Jenkins webhook URL');
                  }}
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>
          </div>

          <div className="settings-section-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title">
                  <ExternalLink size={18} color="#2563eb" />
                  Connected Services
                </h3>
                <p className="settings-card-desc">External observability and issue tracking integrations</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>Slack Bot Integration</div>
                  <div style={{ fontSize: '12.5px', color: '#6b7280' }}>Connected to workspace: Relay Technologies (#relay-alerts, #relay-qa)</div>
                </div>
                <span className="badge badge-success">Connected</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>Jira Bug Tracker</div>
                  <div style={{ fontSize: '12.5px', color: '#6b7280' }}>Connected to project: RELAY (Auto-files regressions and logs traces)</div>
                </div>
                <span className="badge badge-success">Connected</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>Datadog / Prometheus Exporter</div>
                  <div style={{ fontSize: '12.5px', color: '#6b7280' }}>Metrics endpoint active on port :9090/metrics (Scraped every 15s)</div>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="settings-section-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title">
                  <Bell size={18} color="#2563eb" />
                  Notification Channels & Recipients
                </h3>
                <p className="settings-card-desc">Where urgent alerts and regression results should be broadcast</p>
              </div>
              <span className="badge badge-primary">Alert Channels</span>
            </div>

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Slack Incident Alerts</div>
                <div className="settings-switch-desc">Post real-time warnings to Slack channels whenever a test run fails or thermal threshold is breached.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.alertSlack ? 'active' : ''}`}
                onClick={() => updateField('alertSlack', !form.alertSlack)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>

            {form.alertSlack && (
              <div className="settings-form-group" style={{ paddingLeft: '16px', borderLeft: '3px solid #2563eb' }}>
                <label className="settings-label">Target Slack Channel</label>
                <input
                  type="text"
                  value={form.slackChannel}
                  onChange={(e) => updateField('slackChannel', e.target.value)}
                  className="settings-input"
                  style={{ maxWidth: '320px' }}
                />
              </div>
            )}

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Daily Executive Digest Email</div>
                <div className="settings-switch-desc">Send 08:00 AM EST summary report with pass rate trends, flake radar, and fleet health.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.alertEmail ? 'active' : ''}`}
                onClick={() => updateField('alertEmail', !form.alertEmail)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>

            {form.alertEmail && (
              <div className="settings-form-group" style={{ paddingLeft: '16px', borderLeft: '3px solid #2563eb' }}>
                <label className="settings-label">Digest Recipient Email</label>
                <input
                  type="email"
                  value={form.emailRecipient}
                  onChange={(e) => updateField('emailRecipient', e.target.value)}
                  className="settings-input"
                  style={{ maxWidth: '360px' }}
                />
              </div>
            )}

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">PagerDuty On-Call Paging</div>
                <div className="settings-switch-desc">Page on-call QA engineers only if multi-day soak test unexpectedly halts due to infrastructure power failure.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.alertPagerDuty ? 'active' : ''}`}
                onClick={() => updateField('alertPagerDuty', !form.alertPagerDuty)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>
          </div>

          <div className="settings-section-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title">
                  <ShieldAlert size={18} color="#2563eb" />
                  Incident Triggers & Escalation Rules
                </h3>
                <p className="settings-card-desc">Define which events trigger immediate engineering notifications</p>
              </div>
              <span className="badge badge-warning">High Priority</span>
            </div>

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Hardware Thermal Overheating (&gt; {form.thermalThreshold} °C)</div>
                <div className="settings-switch-desc">Fires alert if hardware bench sensors remain above thermal threshold for 5 continuous minutes.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.notifyOnThermal ? 'active' : ''}`}
                onClick={() => updateField('notifyOnThermal', !form.notifyOnThermal)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Unexpected Kernel Panic / Reboot</div>
                <div className="settings-switch-desc">Fires immediately when Android last_kmsg or pstore shows a kernel panic during test execution.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.notifyOnReboot ? 'active' : ''}`}
                onClick={() => updateField('notifyOnReboot', !form.notifyOnReboot)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Battery Drain Anomaly (&gt; 8% per hour during Standby)</div>
                <div className="settings-switch-desc">Alerts power optimization team if wake lock holds CPU during deep sleep test intervals.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.notifyOnDrain ? 'active' : ''}`}
                onClick={() => updateField('notifyOnDrain', !form.notifyOnDrain)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Application Not Responding (ANR) in com.relay.ptt</div>
                <div className="settings-switch-desc">Captures traces.txt immediately and attaches stack trace to bug triage report.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.notifyOnAnr ? 'active' : ''}`}
                onClick={() => updateField('notifyOnAnr', !form.notifyOnAnr)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>

            <div className="settings-switch-item">
              <div className="settings-switch-text">
                <div className="settings-switch-label">Pass Rate Drop vs Previous Baseline (&gt; {form.passRateDropThreshold}%)</div>
                <div className="settings-switch-desc">Alerts release managers if nightly regression pass rate drops by more than threshold points.</div>
              </div>
              <button
                type="button"
                className={`settings-toggle-btn ${form.notifyOnDrop ? 'active' : ''}`}
                onClick={() => updateField('notifyOnDrop', !form.notifyOnDrop)}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'retention' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="settings-section-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title">
                  <HardDrive size={18} color="#2563eb" />
                  Data Retention & Artifact Storage
                </h3>
                <p className="settings-card-desc">Configure retention lifecycle for test logs, bugreports, and screen recording video files</p>
              </div>
              <span className="badge badge-primary">Disk Policy</span>
            </div>

            <div className="settings-grid-3">
              <div className="settings-form-group">
                <label className="settings-label">Telemetry Time-Series Retention</label>
                <select
                  value={form.retentionDays}
                  onChange={(e) => updateField('retentionDays', e.target.value)}
                  className="settings-select"
                >
                  <option value="30">30 Days</option>
                  <option value="90">90 Days (Enterprise default)</option>
                  <option value="180">180 Days (Half year)</option>
                  <option value="365">365 Days (Full year archive)</option>
                </select>
                <span className="settings-hint">Battery, CPU, and temperature telemetry</span>
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Video Screen Recordings</label>
                <select
                  value={form.videoRetentionDays}
                  onChange={(e) => updateField('videoRetentionDays', e.target.value)}
                  className="settings-select"
                >
                  <option value="14">14 Days (Recommended)</option>
                  <option value="30">30 Days</option>
                  <option value="60">60 Days</option>
                </select>
                <span className="settings-hint">MP4 recordings of failing tests</span>
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Bugreport Archive Retention</label>
                <select
                  defaultValue="90"
                  className="settings-select"
                >
                  <option value="90">90 Days (Standard)</option>
                  <option value="180">180 Days (Long soak)</option>
                  <option value="365">365 Days (Permanent)</option>
                </select>
                <span className="settings-hint">Compressed .zip bugreports</span>
              </div>
            </div>

            <div style={{ marginTop: '10px', background: '#f8fafc', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>Cluster Storage Quota: 18.4 GB of 100 GB</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>18.4% used</span>
              </div>
              <div className="progress-bar" style={{ height: '8px' }}>
                <div className="progress-fill" style={{ width: '18.4%' }}></div>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '12px', color: '#6b7280' }}>
                <span>Logcat & dmesg: <strong>8.2 GB</strong></span>
                <span>•</span>
                <span>Video recordings: <strong>6.1 GB</strong></span>
                <span>•</span>
                <span>Bugreports: <strong>4.1 GB</strong></span>
              </div>
            </div>
          </div>

          <div className="danger-zone-card">
            <h3 className="danger-zone-header">
              <AlertTriangle size={18} color="#dc2626" />
              Danger Zone & Maintenance
            </h3>
            <p style={{ fontSize: '13px', color: '#7f1d1d', margin: 0 }}>
              Destructive workspace actions. These operations cannot be undone and require administrative privileges.
            </p>

            <div className="danger-zone-item">
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#111827' }}>Flush Live Telemetry Cache</div>
                <div style={{ fontSize: '12.5px', color: '#6b7280' }}>Clears in-memory WebSocket buffers for active soak graphs without deleting historical reports.</div>
              </div>
              <button
                type="button"
                className="btn-danger-outline"
                onClick={() => showToast('Flushed telemetry cache (12.4 MB freed)')}
              >
                <Trash2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Flush Cache
              </button>
            </div>

            <div className="danger-zone-item">
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#111827' }}>Purge Runs Older Than 90 Days</div>
                <div style={{ fontSize: '12.5px', color: '#6b7280' }}>Permanently remove archived run logs and screenshots older than 3 months to reclaim disk space.</div>
              </div>
              <button
                type="button"
                className="btn-danger-outline"
                onClick={() => showToast('Archival purge completed (3.8 GB reclaimed)')}
              >
                <Trash2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Purge Old Runs
              </button>
            </div>

            <div className="danger-zone-item">
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#111827' }}>Reset Workspace to Factory Defaults</div>
                <div style={{ fontSize: '12.5px', color: '#6b7280' }}>Restore default concurrency limits, alerts, and schedules back to factory profile.</div>
              </div>
              <button
                type="button"
                className="btn-danger-outline"
                onClick={handleResetDefaults}
              >
                <RotateCcw size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          Workspace configuration synchronized with Relay daemon cluster
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleResetDefaults}
          >
            Reset Defaults
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
          >
            {savedRecently ? <Check size={15} /> : <Save size={15} />}
            {savedRecently ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="settings-toast">
          <Check size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Settings;
