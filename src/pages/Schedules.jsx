import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Plus, 
  ChevronRight, 
  Filter, 
  Sliders, 
  Bell, 
  Smartphone,
  Cpu,
  Layers,
  Check
} from 'lucide-react';

const initialSchedules = [
  {
    id: 1,
    name: 'Nightly Regression',
    planName: 'Plan: Nightly Regression · Relay fleet',
    testPlan: 'Nightly Regression · Relay fleet (9 steps)',
    trigger: 'Daily 01:00 + on new build',
    triggerType: 'recurring',
    devices: 'X-001, M-002',
    nextRun: 'Sun 01:00',
    lastResult: 'Running',
    enabled: true,
    category: 'time',
    repeat: 'Daily',
    startTime: '01:00',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    alsoNewBuild: true,
    ciSource: 'Jenkins · relay-a16/main',
    onlyIf: 'Build smoke passes',
    buildToTest: 'Latest build at run time',
    busyPolicy: 'wait',
    waitHours: '2',
    notify: 'Slack #relay-qa + email',
    notifyWhen: 'On failure only'
  },
  {
    id: 2,
    name: 'PTT Smoke on new build',
    planName: 'Plan: PTT Smoke',
    testPlan: 'PTT Smoke (4 steps)',
    trigger: 'New build · Jenkins relay-a16/main',
    triggerType: 'build',
    devices: 'M-002',
    nextRun: 'Queued now',
    lastResult: 'Queued',
    enabled: true,
    category: 'build',
    repeat: 'Daily',
    startTime: '00:00',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    alsoNewBuild: true,
    ciSource: 'Jenkins · relay-a16/main',
    onlyIf: 'Any commit to main',
    buildToTest: 'Triggering build',
    busyPolicy: 'skip',
    waitHours: '1',
    notify: 'Slack #relay-qa',
    notifyWhen: 'Always'
  },
  {
    id: 3,
    name: 'OTA upgrade path',
    planName: 'Plan: OTA 2.3.x → latest',
    testPlan: 'OTA 2.3.x → latest (6 steps)',
    trigger: 'New build · A16 release branch',
    triggerType: 'build',
    devices: 'X-001',
    nextRun: 'Waiting for RC build',
    lastResult: 'Passed',
    enabled: true,
    category: 'build',
    repeat: 'Daily',
    startTime: '00:00',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    alsoNewBuild: true,
    ciSource: 'Jenkins · relay-a16/release',
    onlyIf: 'Build smoke passes',
    buildToTest: 'Release candidate',
    busyPolicy: 'skip',
    waitHours: '1',
    notify: 'Slack #relay-qa + email',
    notifyWhen: 'Always'
  },
  {
    id: 4,
    name: 'Weekly Stress & Longevity',
    planName: 'Plan: Stress · drivers + connectivity',
    testPlan: 'Stress · drivers + connectivity (12 steps)',
    trigger: 'Sat 22:00',
    triggerType: 'recurring',
    devices: 'X-001, M-002',
    nextRun: 'Sat 22:00',
    lastResult: 'Passed',
    enabled: true,
    category: 'time',
    repeat: 'Weekly',
    startTime: '22:00',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    activeDays: [5],
    alsoNewBuild: false,
    ciSource: 'Jenkins · relay-a16/main',
    onlyIf: 'Build smoke passes',
    buildToTest: 'Latest build at run time',
    busyPolicy: 'wait',
    waitHours: '2',
    notify: 'Slack #relay-qa + email',
    notifyWhen: 'Always'
  },
  {
    id: 5,
    name: 'Soak · 7 days',
    planName: 'Plan: Soak · PTT call loop + idle',
    testPlan: 'Soak · PTT call loop + idle (1 long step)',
    trigger: 'Once · Sep 23 22:00',
    triggerType: 'once',
    devices: 'X-002',
    nextRun: 'Ends Sep 30 22:00',
    lastResult: 'Running',
    enabled: true,
    category: 'time',
    repeat: 'Once',
    startTime: '22:00',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    activeDays: [2],
    alsoNewBuild: false,
    ciSource: 'Jenkins · relay-a16/main',
    onlyIf: 'Build smoke passes',
    buildToTest: 'Build 2.4.0 (0923)',
    busyPolicy: 'skip',
    waitHours: '1',
    notify: 'Slack #relay-qa + email',
    notifyWhen: 'On failure or finish'
  },
  {
    id: 6,
    name: 'A13 Regression',
    planName: 'Plan: Nightly Regression · A13',
    testPlan: 'Nightly Regression · A13 (8 steps)',
    trigger: 'Daily 03:00',
    triggerType: 'recurring',
    devices: 'M-001',
    nextRun: 'Paused: device offline',
    lastResult: 'Paused',
    enabled: false,
    category: 'paused',
    repeat: 'Daily',
    startTime: '03:00',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    alsoNewBuild: false,
    ciSource: 'Jenkins · relay-a13/main',
    onlyIf: 'Build smoke passes',
    buildToTest: 'Latest build at run time',
    busyPolicy: 'wait',
    waitHours: '2',
    notify: 'Slack #relay-a13-alerts',
    notifyWhen: 'On failure only'
  }
];

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const Schedules = () => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(1);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const selectedSchedule = schedules.find((s) => s.id === selectedId) || schedules[0];
  const [formData, setFormData] = useState(selectedSchedule);

  useEffect(() => {
    if (selectedSchedule) {
      setFormData(selectedSchedule);
    }
  }, [selectedId, selectedSchedule]);

  useEffect(() => {
    const handleOpenNew = () => setShowNewModal(true);
    window.addEventListener('open-new-schedule-modal', handleOpenNew);
    return () => window.removeEventListener('open-new-schedule-modal', handleOpenNew);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleSchedule = (id, e) => {
    e.stopPropagation();
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextEnabled = !s.enabled;
          const nextResult = nextEnabled ? (s.lastResult === 'Paused' ? 'Queued' : s.lastResult) : 'Paused';
          return { ...s, enabled: nextEnabled, lastResult: nextResult };
        }
        return s;
      })
    );
  };

  const handleFormChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const toggleDay = (dayIndex) => {
    setFormData((prev) => {
      const exists = prev.activeDays.includes(dayIndex);
      const nextDays = exists
        ? prev.activeDays.filter((d) => d !== dayIndex)
        : [...prev.activeDays, dayIndex].sort();
      return { ...prev, activeDays: nextDays };
    });
  };

  const handleSave = () => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === formData.id ? { ...formData } : s))
    );
    showToast(`Schedule "${formData.name}" saved successfully`);
  };

  const handlePauseToggle = () => {
    const nextEnabled = !formData.enabled;
    const updated = {
      ...formData,
      enabled: nextEnabled,
      lastResult: nextEnabled ? 'Running' : 'Paused'
    };
    setFormData(updated);
    setSchedules((prev) =>
      prev.map((s) => (s.id === formData.id ? updated : s))
    );
    showToast(nextEnabled ? 'Schedule resumed' : 'Schedule paused');
  };

  const handleRunNow = () => {
    showToast(`Triggered run for "${formData.name}" now`);
  };

  const filteredSchedules = schedules.filter((s) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Time-based') return s.category === 'time' || s.trigger.toLowerCase().includes('daily') || s.trigger.toLowerCase().includes('weekly');
    if (activeFilter === 'Build-triggered') return s.category === 'build' || s.trigger.toLowerCase().includes('build');
    if (activeFilter === 'Paused') return !s.enabled || s.lastResult === 'Paused';
    return true;
  });

  const getResultBadge = (result) => {
    switch (result?.toLowerCase()) {
      case 'running':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'passed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'failed':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'queued':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'paused':
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-slate-100 px-4 py-2.5 rounded-xl text-xs font-medium shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top 2-Column Grid: List & Edit Form */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: Schedules List Table */}
        <div className="xl:col-span-7 bg-[#0e1422] border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
                  {schedules.length}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Automation Schedules</h2>
                  <p className="text-[11px] text-slate-400 font-mono">Automated CI/CD triggers & timed regression routines</p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 gap-0.5 self-start sm:self-auto overflow-x-auto max-w-full">
                {['All', 'Time-based', 'Build-triggered', 'Paused'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all whitespace-nowrap ${
                      activeFilter === tab
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                    <th className="py-2.5 px-3">Schedule</th>
                    <th className="py-2.5 px-3">Trigger</th>
                    <th className="py-2.5 px-3">Devices</th>
                    <th className="py-2.5 px-3">Next Run</th>
                    <th className="py-2.5 px-3">Result</th>
                    <th className="py-2.5 px-3 text-center">Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11.5px]">
                  {filteredSchedules.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-950/30 border-l-2 border-l-blue-500'
                            : 'hover:bg-slate-800/30'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-sans font-semibold text-slate-200">{item.name}</div>
                          <div className="text-[10.5px] text-slate-400 truncate max-w-[180px]">{item.planName}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{item.trigger}</td>
                        <td className="py-3 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px]">
                            {item.devices}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-400">{item.nextRun}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium border ${getResultBadge(item.lastResult)}`}>
                            {item.lastResult}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => handleToggleSchedule(item.id, e)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                              item.enabled ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
                            }`}
                          >
                            <div
                              className={`bg-white size-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                                item.enabled ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Showing {filteredSchedules.length} of {schedules.length} routines</span>
            <button
              onClick={() => setShowNewModal(true)}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="size-3.5" /> New Schedule
            </button>
          </div>
        </div>

        {/* Right: Edit Schedule Form */}
        <div className="xl:col-span-5 bg-[#0e1422] border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold">Configuration Plane</span>
                <h2 className="text-base font-semibold text-slate-100">{formData.name}</h2>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-medium border ${
                formData.enabled 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {formData.enabled ? 'Enabled' : 'Paused'}
              </span>
            </div>

            {/* Test Plan Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Target Test Plan</label>
              <select
                value={formData.testPlan}
                onChange={(e) => handleFormChange('testPlan', e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Nightly Regression · Relay fleet (9 steps)">Nightly Regression · Relay fleet (9 steps)</option>
                <option value="PTT Smoke (4 steps)">PTT Smoke (4 steps)</option>
                <option value="OTA 2.3.x → latest (6 steps)">OTA 2.3.x → latest (6 steps)</option>
                <option value="Stress · drivers + connectivity (12 steps)">Stress · drivers + connectivity (12 steps)</option>
                <option value="Soak · PTT call loop + idle (1 long step)">Soak · PTT call loop + idle (1 long step)</option>
                <option value="Nightly Regression · A13 (8 steps)">Nightly Regression · A13 (8 steps)</option>
              </select>
            </div>

            {/* Trigger Segmented Control */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Trigger Mode</label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                {[
                  { id: 'once', label: 'Once' },
                  { id: 'recurring', label: 'Recurring' },
                  { id: 'build', label: 'New Build' },
                  { id: 'after', label: 'Cascade' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleFormChange('triggerType', t.id)}
                    className={`py-1.5 text-[11px] rounded font-medium transition-all ${
                      formData.triggerType === t.id
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Repeat & Start Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Cadence</label>
                <select
                  value={formData.repeat}
                  onChange={(e) => handleFormChange('repeat', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Execution Window</label>
                <input
                  type="text"
                  value={formData.startTime}
                  onChange={(e) => handleFormChange('startTime', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="01:00 UTC"
                />
              </div>
            </div>

            {/* Day Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Active Days</label>
              <div className="flex gap-1.5">
                {dayLabels.map((lbl, idx) => {
                  const isActive = formData.activeDays?.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`size-8 rounded-lg text-xs font-mono font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/50'
                          : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {lbl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CI Automation Hook */}
            <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2.5">
              <label className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.alsoNewBuild}
                  onChange={(e) => handleFormChange('alsoNewBuild', e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
                />
                <span>Also trigger automatically on incoming CI builds</span>
              </label>

              {formData.alsoNewBuild && (
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400">CI Pipeline</label>
                    <select
                      value={formData.ciSource}
                      onChange={(e) => handleFormChange('ciSource', e.target.value)}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
                    >
                      <option value="Jenkins · relay-a16/main">Jenkins · relay-a16/main</option>
                      <option value="Jenkins · relay-a16/release">Jenkins · relay-a16/release</option>
                      <option value="GitHub Actions · main">GitHub Actions · main</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400">Gating Gate</label>
                    <select
                      value={formData.onlyIf}
                      onChange={(e) => handleFormChange('onlyIf', e.target.value)}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
                    >
                      <option value="Build smoke passes">Build smoke passes</option>
                      <option value="All unit tests pass">All unit tests pass</option>
                      <option value="Always trigger">Always trigger</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Busy Policy */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Hardware Fleet Busy Policy</label>
              <div className="space-y-1.5 text-xs text-slate-300">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="radio"
                    name="busyPolicy"
                    checked={formData.busyPolicy === 'wait'}
                    onChange={() => handleFormChange('busyPolicy', 'wait')}
                    className="text-blue-600"
                  />
                  <span>
                    Wait in queue up to{' '}
                    <input
                      type="text"
                      value={formData.waitHours}
                      onChange={(e) => handleFormChange('waitHours', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 px-1 py-0.5 text-center bg-slate-950 border border-slate-700 rounded text-blue-400 font-mono text-xs inline-block mx-1"
                    />{' '}
                    hours then skip
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="radio"
                    name="busyPolicy"
                    checked={formData.busyPolicy === 'skip'}
                    onChange={() => handleFormChange('busyPolicy', 'skip')}
                    className="text-blue-600"
                  />
                  <span>Skip execution immediately if devices are occupied</span>
                </label>
              </div>
            </div>

            {/* Notification channels */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Notification Hook</label>
                <select
                  value={formData.notify}
                  onChange={(e) => handleFormChange('notify', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Slack #relay-qa + email">Slack #relay-qa + email</option>
                  <option value="Slack #relay-qa">Slack #relay-qa</option>
                  <option value="Email only">Email only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Alert Condition</label>
                <select
                  value={formData.notifyWhen}
                  onChange={(e) => handleFormChange('notifyWhen', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="On failure only">On failure only</option>
                  <option value="Always">Always</option>
                  <option value="On failure or finish">On failure or finish</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handlePauseToggle}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
            >
              {formData.enabled ? 'Pause Routine' : 'Resume Routine'}
            </button>
            <button
              type="button"
              onClick={handleRunNow}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <Play className="size-3 text-blue-400" /> Run Now
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-md shadow-blue-900/30"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Device Calendar Timeline Grid */}
      <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Calendar className="size-4 text-blue-400" />
              Device Calendar · Sat Sep 26 – Fri Oct 2
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Scheduled runs and reservations across physical testbeds. Conflict engine proactively flags resource overlaps.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-500" />
              <span>Scheduled run</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>Soak test</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-500" />
              <span>Conflict</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-slate-600" />
              <span>Offline</span>
            </div>
          </div>
        </div>

        {/* Timeline Matrix */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px] border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
            {/* Days Header */}
            <div className="grid grid-cols-8 border-b border-slate-800 bg-[#121829] text-[11px] font-mono font-medium text-slate-400">
              <div className="p-2.5 border-r border-slate-800 text-slate-500">Device</div>
              {['Sat 26', 'Sun 27', 'Mon 28', 'Tue 29', 'Wed 30', 'Thu 1', 'Fri 2'].map((day) => (
                <div key={day} className="p-2.5 text-center border-r border-slate-800/60 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Row 1: Relay X-001 */}
            <div className="grid grid-cols-8 border-b border-slate-800/60 items-center hover:bg-slate-900/40 transition-colors">
              <div className="p-2.5 border-r border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-200">Relay X-001</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">A16</span>
              </div>
              <div className="p-2 text-center border-r border-slate-800/40">
                <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 font-mono text-[10.5px] border border-blue-500/40" title="Nightly Regression · 01:00">
                  N
                </span>
              </div>
              <div className="p-2 text-center border-r border-slate-800/40">
                <span className="px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 font-mono text-[10.5px] border border-rose-500/50" title="Conflict: Weekly Stress overlaps Nightly">
                  ⚡ We+N
                </span>
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-2 text-center border-r border-slate-800/40 last:border-r-0">
                  <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 font-mono text-[10.5px] border border-blue-500/40">
                    N
                  </span>
                </div>
              ))}
            </div>

            {/* Row 2: Relay X-002 (Soak) */}
            <div className="grid grid-cols-8 border-b border-slate-800/60 items-center hover:bg-slate-900/40 transition-colors">
              <div className="p-2.5 border-r border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-200">Relay X-002</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">A16</span>
              </div>
              <div className="col-span-5 p-2 border-r border-slate-800/40">
                <div className="w-full py-1 px-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center justify-between">
                  <span>⚡ Soak #1045 · Day 3 of 7 · Ends Wed 22:00</span>
                  <span className="text-[10px] text-amber-400/80">PTT call loop + idle</span>
                </div>
              </div>
              <div className="col-span-2 p-2 text-center text-slate-600 font-mono text-xs">Available</div>
            </div>

            {/* Row 3: Relay M-001 (Offline) */}
            <div className="grid grid-cols-8 border-b border-slate-800/60 items-center hover:bg-slate-900/40 transition-colors">
              <div className="p-2.5 border-r border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-400">Relay M-001</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 font-mono text-[10px]">A13</span>
              </div>
              <div className="col-span-7 p-2">
                <div className="w-full py-1 px-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-500 font-mono text-xs flex items-center justify-between">
                  <span>Offline since 02:14 (USB disconnect) · A13 Regression paused</span>
                  <span className="text-[10px] text-rose-400/80">Awaiting Lab Tech</span>
                </div>
              </div>
            </div>

            {/* Row 4: Relay M-002 */}
            <div className="grid grid-cols-8 items-center hover:bg-slate-900/40 transition-colors">
              <div className="p-2.5 border-r border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-200">Relay M-002</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">A16</span>
              </div>
              <div className="p-2 text-center border-r border-slate-800/40 flex items-center justify-center gap-1">
                <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 font-mono text-[10.5px] border border-blue-500/40">N</span>
                <span className="size-2 rounded-full bg-cyan-400" title="PTT Smoke run" />
              </div>
              <div className="p-2 text-center border-r border-slate-800/40">
                <span className="px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 font-mono text-[10.5px] border border-rose-500/50">
                  ⚡ We+N
                </span>
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-2 text-center border-r border-slate-800/40 last:border-r-0">
                  <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 font-mono text-[10.5px] border border-blue-500/40">
                    N
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conflict Warning Banner */}
        <div className="p-3.5 bg-rose-950/30 border border-rose-800/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertTriangle className="size-5 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <div className="text-xs font-semibold text-rose-300">Conflict Detected · Sunday 01:00 UTC</div>
              <div className="text-[11.5px] text-rose-300/80 mt-0.5">
                Weekly Stress (Sat 22:00 – Sun 02:00) overlaps Nightly Regression on X-001 and M-002. Nightly will wait until 02:00.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowResolveModal(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors self-start sm:self-auto shrink-0 shadow-sm"
          >
            Resolve Conflict
          </button>
        </div>
      </div>

      {/* Resolve Conflict Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-400" /> Resolve Schedule Conflict
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Weekly Stress (Sat 22:00 – Sun 02:00) overlaps with Nightly Regression on devices X-001 and M-002 on Sunday 01:00.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-blue-500/40 bg-blue-950/20 cursor-pointer">
                <input type="radio" name="resolveOption" defaultChecked className="mt-1 text-blue-600" />
                <div>
                  <strong className="text-blue-300 font-semibold">Shift Nightly Regression to 02:00 on Sundays</strong>
                  <p className="text-slate-400 mt-0.5">Nightly will execute immediately after Weekly Stress completes without queuing.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/40 cursor-pointer hover:border-slate-700">
                <input type="radio" name="resolveOption" className="mt-1 text-blue-600" />
                <div>
                  <strong className="text-slate-200 font-semibold">Keep queue wait policy (wait up to 2 h)</strong>
                  <p className="text-slate-400 mt-0.5">Nightly will queue and start as soon as each device frees up.</p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowResolveModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResolveModal(false);
                  showToast('Conflict resolution applied: Shifted to 02:00 on Sundays');
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
              >
                Apply Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Schedule Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Plus className="size-4 text-blue-400" /> Create New Schedule
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Define a recurring or build-triggered execution schedule for your test suites.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Schedule Name</label>
                <input
                  type="text"
                  defaultValue="Daily Audio & Voice smoke"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Test Plan</label>
                <select defaultValue="PTT Smoke (4 steps)" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200">
                  <option value="PTT Smoke (4 steps)">PTT Smoke (4 steps)</option>
                  <option value="Nightly Regression · Relay fleet (9 steps)">Nightly Regression · Relay fleet (9 steps)</option>
                  <option value="OTA 2.3.x → latest (6 steps)">OTA 2.3.x → latest (6 steps)</option>
                  <option value="Stress · drivers + connectivity (12 steps)">Stress · drivers + connectivity (12 steps)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Trigger</label>
                  <select defaultValue="Daily" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200">
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="New build">On new build</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Start Time</label>
                  <input type="text" defaultValue="04:00" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewModal(false);
                  const newSched = {
                    id: schedules.length + 1,
                    name: 'Daily Audio & Voice smoke',
                    planName: 'Plan: Audio & Voice',
                    testPlan: 'PTT Smoke (4 steps)',
                    trigger: 'Daily 04:00',
                    triggerType: 'recurring',
                    devices: 'X-001',
                    nextRun: 'Tomorrow 04:00',
                    lastResult: 'Queued',
                    enabled: true,
                    category: 'time',
                    repeat: 'Daily',
                    startTime: '04:00',
                    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                    activeDays: [0, 1, 2, 3, 4],
                    alsoNewBuild: false,
                    ciSource: 'Jenkins · relay-a16/main',
                    onlyIf: 'Build smoke passes',
                    buildToTest: 'Latest build at run time',
                    busyPolicy: 'wait',
                    waitHours: '2',
                    notify: 'Slack #relay-qa',
                    notifyWhen: 'On failure only'
                  };
                  setSchedules([newSched, ...schedules]);
                  setSelectedId(newSched.id);
                  showToast('New schedule created!');
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
              >
                Create Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules;
