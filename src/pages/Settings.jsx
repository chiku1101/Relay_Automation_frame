import React, { useState } from 'react';
import { 
  Sliders, 
  Shield, 
  Bell, 
  Cpu, 
  Key, 
  Check, 
  Save, 
  RefreshCw 
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    workspaceName: 'Relay Automation Core',
    retentionDays: '90',
    telemetryRate: '1s',
    autoRerun: true,
    alertSlack: true,
    alertEmail: false,
    apiKey: 'rl_live_89f3a9018e4726b1c8f4',
    maxConcurrentRuns: '16',
    defaultLogLevel: 'debug'
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Workspace Settings</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage execution parameters, fleet limits, and notification triggers</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
        >
          {saved ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? 'Settings Saved' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        {[
          { id: 'general', label: 'General & Execution', icon: Sliders },
          { id: 'fleet', label: 'Fleet & Runners', icon: Cpu },
          { id: 'api', label: 'API Keys & Integrations', icon: Key },
          { id: 'notifications', label: 'Alerts & Webhooks', icon: Bell },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                isActive 
                  ? 'border-blue-600 text-blue-600 font-semibold' 
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Workspace Name</label>
              <input
                type="text"
                value={form.workspaceName}
                onChange={(e) => setForm({ ...form, workspaceName: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Telemetry Polling Rate</label>
              <select
                value={form.telemetryRate}
                onChange={(e) => setForm({ ...form, telemetryRate: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="500ms">500ms (High precision)</option>
                <option value="1s">1 second (Recommended)</option>
                <option value="5s">5 seconds (Low bandwidth)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Telemetry Data Retention</label>
              <select
                value={form.retentionDays}
                onChange={(e) => setForm({ ...form, retentionDays: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="30">30 Days</option>
                <option value="90">90 Days (Enterprise default)</option>
                <option value="365">365 Days (Long soak archive)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Default Log Verbosity</label>
              <select
                value={form.defaultLogLevel}
                onChange={(e) => setForm({ ...form, defaultLogLevel: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="info">INFO</option>
                <option value="debug">DEBUG (Verbose stack trace)</option>
                <option value="warn">WARN / ERROR only</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-gray-800">Automatic Failure Retries</h4>
              <p className="text-[11px] text-gray-500">Automatically re-queue failed flaky tests up to 2 times</p>
            </div>
            <input 
              type="checkbox" 
              checked={form.autoRerun}
              onChange={(e) => setForm({ ...form, autoRerun: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {activeTab === 'fleet' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Max Concurrent Test Runs</label>
              <input
                type="number"
                value={form.maxConcurrentRuns}
                onChange={(e) => setForm({ ...form, maxConcurrentRuns: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Runner Heartbeat Timeout</label>
              <input
                type="text"
                defaultValue="45s"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
            <Cpu className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-800">
              <span className="font-semibold">6 Relay test runners online:</span> All hardware harness nodes are synchronized and receiving automatic firmware OTA update bundles.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Active Relay API Token</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={form.apiKey}
                readOnly
                className="w-full text-xs px-3 py-2 font-mono bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
              />
              <button 
                type="button"
                className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Roll
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Used by CI/CD GitHub Actions to trigger regression test suites.</p>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h4 className="text-xs font-semibold text-gray-800">Slack Incident Notifications</h4>
              <p className="text-[11px] text-gray-500">Post immediate failure webhooks into #relay-alerts</p>
            </div>
            <input 
              type="checkbox" 
              checked={form.alertSlack}
              onChange={(e) => setForm({ ...form, alertSlack: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-gray-800">Daily Digest Email</h4>
              <p className="text-[11px] text-gray-500">Send 08:00 AM summary report to qa-leads@relay.internal</p>
            </div>
            <input 
              type="checkbox" 
              checked={form.alertEmail}
              onChange={(e) => setForm({ ...form, alertEmail: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
