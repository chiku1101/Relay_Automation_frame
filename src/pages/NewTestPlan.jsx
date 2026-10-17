import React, { useState } from 'react';
import { 
  GripVertical, 
  Search, 
  Plus, 
  Layers, 
  CheckCircle2, 
  Cpu, 
  Smartphone, 
  Clock, 
  Sliders, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NewTestPlan = () => {
  const [suiteLibrary, setSuiteLibrary] = useState([
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
    { id: 's1', type: 'system', icon: 'S', title: 'Flash build 2.4.0 (0926)', desc: 'fastboot · verify fingerprint', action: 'Stop plan', time: '15m' },
    { id: 's2', type: 'system', icon: 'S', title: 'Factory reset + provisioning', desc: 'Wi-Fi profile, SIM check, PTT account login', action: 'Stop plan', time: '10m' },
    { id: '1', type: 'suite', icon: '1', title: 'Bootloader · Sanity', tag: 'Gate', desc: '4 cases · 6 min', action: 'Stop plan', time: '10m' },
    { id: '2', type: 'suite', icon: '2', title: 'Kernel & drivers · Functional', desc: '88 cases · 52 min', action: 'Continue', time: '1h 15m' },
    { id: '3', type: 'suite', icon: '3', title: 'HAL · Functional', desc: '26 cases · 18 min', action: 'Continue', time: '30m' },
    { id: '4', type: 'suite', icon: '4', title: 'Connectivity · Functional', desc: '28 cases · 25 min', action: 'Retry failed ×2', time: '45m' },
    { id: '5', type: 'suite', icon: '5', title: 'PTT service · Functional', desc: '3 cases · 8 min', action: 'Retry failed ×1', time: '15m' },
    { id: '6', type: 'suite', icon: '6', title: 'Connectivity · Stress (Wi-Fi reconnect loop)', desc: '6 cases · 1 h', action: 'Continue', time: '1h 30m' },
    { id: 't1', type: 'system', icon: 'T', title: 'Teardown: collect bugreport, release device', desc: 'Always runs, even after a stop', action: 'Continue', time: '10m' },
  ]);

  const [devices, setDevices] = useState([
    { id: 'd1', name: 'Relay X-001', spec: 'A16 · RX1A0231', status: 'Available', statusColor: 'emerald', checked: true },
    { id: 'd2', name: 'Relay M-002', spec: 'A16 · RM1B0412', status: 'Busy until 04:30 · this plan will queue', statusColor: 'amber', checked: true },
    { id: 'd3', name: 'Relay X-002', spec: 'A16 · RX1A0232', status: 'Reserved by Soak #1045 until Sep 30', statusColor: 'slate', checked: false },
    { id: 'd4', name: 'Relay M-001', spec: 'A13 · RM1B0118', status: 'Offline since 02:14', statusColor: 'rose', checked: false },
  ]);

  const [searchFilter, setSearchFilter] = useState('');
  const [activeComponent, setActiveComponent] = useState('any');
  const [execMode, setExecMode] = useState('parallel');

  const toggleSuite = (id) => {
    setSuiteLibrary((prev) =>
      prev.map((s) => (s.id === id ? { ...s, added: !s.added } : s))
    );
  };

  const toggleDevice = (id) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, checked: !d.checked } : d))
    );
  };

  const filteredSuites = suiteLibrary.filter((s) =>
    s.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
            <span>Execution Plane</span>
            <span>/</span>
            <span>Plan Builder</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">Configure Test Pipeline & Target Fleet</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/test-plans"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={() => alert('Test plan staged and ready for trigger!')}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-lg shadow-blue-900/30 flex items-center gap-1.5"
          >
            <CheckCircle2 className="size-3.5" /> Save Test Plan
          </button>
        </div>
      </div>

      {/* Main 3-Column Plan Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Column 1: Suite Library (3 cols) */}
        <div className="lg:col-span-3 bg-[#0e1422] border border-slate-800/80 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Suite Library</h2>
              <Link to="/test-catalog" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono">
                Catalog <ExternalLink className="size-3" />
              </Link>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search suites or test IDs..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-1">
              {['Component: any', 'Relay X, M', 'Needs HW'].map((chip, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10.5px] font-mono text-slate-400 cursor-pointer hover:border-slate-700"
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* Suite Items List */}
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredSuites.map((suite) => (
                <div
                  key={suite.id}
                  className="p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 transition-colors flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-200 truncate">{suite.name}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">{suite.count}</div>
                  </div>
                  {suite.added ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-medium">
                      Added
                    </span>
                  ) : (
                    <button
                      onClick={() => toggleSuite(suite.id)}
                      className="px-2 py-0.5 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[10.5px] font-mono transition-colors"
                    >
                      + Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] font-mono text-slate-400">
            Expand any suite in the catalog to include or exclude single test cases.
          </div>
        </div>

        {/* Column 2: Execution Pipeline (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Execution Pipeline</h2>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Steps execute sequentially top to bottom. Drag handle to reorder.</p>
              </div>
              <button className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors">
                + Setup Step
              </button>
            </div>

            {/* Pipeline Header */}
            <div className="grid grid-cols-12 text-[10.5px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 bg-slate-900/60 rounded-lg">
              <span className="col-span-6">Step</span>
              <span className="col-span-4">Failure Policy</span>
              <span className="col-span-2 text-right">Timeout</span>
            </div>

            {/* Pipeline Step Items */}
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {pipeline.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-xl border border-slate-800/70 bg-slate-900/30 hover:border-slate-700 transition-colors grid grid-cols-12 items-center gap-2"
                >
                  <div className="col-span-6 flex items-center gap-2 min-w-0">
                    <GripVertical className="size-3.5 text-slate-600 shrink-0 cursor-grab" />
                    <div className={`size-5 rounded flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                      item.type === 'system'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-200 truncate flex items-center gap-1.5">
                        <span>{item.title}</span>
                        {item.tag && (
                          <span className="px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-mono border border-rose-500/30">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{item.desc}</div>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <select
                      defaultValue={item.action}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-[11px] text-slate-300 font-mono"
                    >
                      <option value="Stop plan">Stop plan</option>
                      <option value="Continue">Continue</option>
                      <option value="Retry failed ×1">Retry ×1</option>
                      <option value="Retry failed ×2">Retry ×2</option>
                    </select>
                  </div>

                  <div className="col-span-2 text-right">
                    <input
                      type="text"
                      defaultValue={item.time}
                      className="w-12 bg-slate-950 border border-slate-800 rounded px-1 py-1 text-[11px] font-mono text-center text-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-2 rounded-xl border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/20 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors">
              + Append Suite from Library
            </button>
          </div>

          {/* Matrix Section */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-2.5">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Device × Step Matrix</h3>
              <p className="text-[11px] text-slate-500 font-mono">Deselect a cell to bypass a step on specific hardware (e.g. cellular SIM tests on Wi-Fi-only testbeds).</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10.5px] font-mono text-slate-400">
                    <th className="py-1.5 px-2">Pipeline Step</th>
                    <th className="py-1.5 px-2 text-center">Relay X-001 (A16)</th>
                    <th className="py-1.5 px-2 text-center">Relay M-002 (A16)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 px-2 text-slate-300">1 · Bootloader · Sanity</td>
                    <td className="py-2 px-2 text-center"><input type="checkbox" defaultChecked className="text-blue-600 rounded" /></td>
                    <td className="py-2 px-2 text-center"><input type="checkbox" defaultChecked className="text-blue-600 rounded" /></td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-300">2 · Kernel & Drivers · Functional</td>
                    <td className="py-2 px-2 text-center"><input type="checkbox" defaultChecked className="text-blue-600 rounded" /></td>
                    <td className="py-2 px-2 text-center"><input type="checkbox" defaultChecked className="text-blue-600 rounded" /></td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-300">5 · Connectivity · Functional (SIM)</td>
                    <td className="py-2 px-2 text-center"><input type="checkbox" defaultChecked className="text-blue-600 rounded" /></td>
                    <td className="py-2 px-2 text-center"><input type="checkbox" defaultChecked className="text-blue-600 rounded" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Column 3: Fleet & Configuration (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Build Selection */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Build under test</h3>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Binary Release</label>
              <select className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200">
                <option value="latest">A16 · 2.4.0 (0926) · latest</option>
                <option value="rc">A16 · 2.4.1-rc3 · release candidate</option>
                <option value="stable">A16 · 2.4.0-release · golden</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
              <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0" />
              <span>Fastboot flash this build before step 1</span>
            </label>
          </div>

          {/* Execution Topology */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Execution Topology</h3>
            <div className="space-y-2">
              {[
                { id: 'parallel', title: 'Parallel Execution', desc: 'Every device runs the full pipeline concurrently' },
                { id: 'distributed', title: 'Distributed Matrix', desc: 'Split suites across devices to reduce total cycle time' },
                { id: 'sequential', title: 'Sequential Fallback', desc: 'Execute on one device after another' }
              ].map((opt) => (
                <label
                  key={opt.id}
                  onClick={() => setExecMode(opt.id)}
                  className={`block p-2.5 rounded-xl border cursor-pointer transition-all ${
                    execMode === opt.id
                      ? 'border-blue-500/40 bg-blue-950/20'
                      : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="exec-mode"
                      checked={execMode === opt.id}
                      onChange={() => setExecMode(opt.id)}
                      className="text-blue-600"
                    />
                    <span className="text-xs font-semibold text-slate-200">{opt.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-1 pl-5">{opt.desc}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Target Fleet Selection */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Hardware Fleet</h3>
              <button
                onClick={() => setDevices(devices.map(d => ({ ...d, checked: true })))}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-mono"
              >
                Select all
              </button>
            </div>

            <div className="space-y-2">
              {devices.map((device) => (
                <label
                  key={device.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    device.checked
                      ? 'border-slate-700 bg-slate-900/60'
                      : 'border-slate-800/60 bg-slate-950/40 opacity-70'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={device.checked}
                    onChange={() => toggleDevice(device.id)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span>{device.name}</span>
                      <span className="font-mono text-[10px] text-slate-500">{device.spec}</span>
                    </div>
                    <div className={`text-[10.5px] font-mono mt-0.5 ${
                      device.statusColor === 'emerald' ? 'text-emerald-400' :
                      device.statusColor === 'amber' ? 'text-amber-400' :
                      device.statusColor === 'rose' ? 'text-rose-400' : 'text-slate-500'
                    }`}>
                      {device.status}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Execution Summary Card */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Pipeline Summary</h3>
            <div className="divide-y divide-slate-800/60 text-xs font-mono">
              <div className="py-1.5 flex justify-between text-slate-400">
                <span>Target Devices</span>
                <span className="text-slate-200 font-bold">{devices.filter(d => d.checked).length}</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-400">
                <span>Step Count</span>
                <span className="text-slate-200">6 suites + 3 system</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-400">
                <span>Test Cases</span>
                <span className="text-slate-200">155 per device</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-400">
                <span>Estimated Runtime</span>
                <span className="text-blue-400 font-semibold">≈ 3 h 10 m</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800">
              Artifact capture: logcat, dmesg, failure screenshots, MP4 screen recording, bugreport dump.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default NewTestPlan;
