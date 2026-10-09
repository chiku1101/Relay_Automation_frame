import React, { useState, useEffect } from 'react';

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
    nextRun: 'Next build',
    lastResult: 'Passed',
    enabled: true,
    category: 'build',
    repeat: 'Daily',
    startTime: '02:00',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    activeDays: [0, 1, 2, 3, 4],
    alsoNewBuild: true,
    ciSource: 'Jenkins · relay-a16/release',
    onlyIf: 'Build smoke passes',
    buildToTest: 'Latest release candidate',
    busyPolicy: 'wait',
    waitHours: '3',
    notify: 'Slack #relay-releases',
    notifyWhen: 'On failure only'
  },
  {
    id: 4,
    name: 'Weekly Stress',
    planName: 'Plan: Stress · drivers + connectivity',
    testPlan: 'Stress · drivers + connectivity (12 steps)',
    trigger: 'Weekly · Sat 22:00',
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

  // Selected schedule editing form state
  const selectedSchedule = schedules.find((s) => s.id === selectedId) || schedules[0];
  const [formData, setFormData] = useState(selectedSchedule);

  useEffect(() => {
    if (selectedSchedule) {
      setFormData(selectedSchedule);
    }
  }, [selectedId, selectedSchedule]);

  // Listen to TopBar "+ New schedule" button click event
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
    showToast(nextEnabled ? `Schedule resumed` : `Schedule paused`);
  };

  const handleRunNow = () => {
    showToast(`Triggered run for "${formData.name}" now`);
  };

  // Filter schedules
  const filteredSchedules = schedules.filter((s) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Time-based') return s.category === 'time' || s.trigger.toLowerCase().includes('daily') || s.trigger.toLowerCase().includes('weekly');
    if (activeFilter === 'Build-triggered') return s.category === 'build' || s.trigger.toLowerCase().includes('build');
    if (activeFilter === 'Paused') return !s.enabled || s.lastResult === 'Paused';
    return true;
  });

  return (
    <div className="schedules-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#1f2937',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
            zIndex: 9999,
            transition: 'all 0.2s ease'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Top 2-Column Section */}
      <div className="schedules-top-grid">
        {/* Left Column: Schedules List */}
        <div className="schedules-card schedules-list-card">
          <div className="card-header-flex">
            <h2 className="card-title-count">{schedules.length} schedules</h2>
            <div className="filter-tabs">
              {['All', 'Time-based', 'Build-triggered', 'Paused'].map((tab) => (
                <button
                  key={tab}
                  className={`filter-tab-btn ${activeFilter === tab ? 'active' : ''}`}
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="schedules-table-container">
            <table className="schedules-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>Schedule</th>
                  <th style={{ width: '28%' }}>Trigger</th>
                  <th style={{ width: '16%' }}>Devices</th>
                  <th style={{ width: '14%' }}>Next run</th>
                  <th style={{ width: '10%' }}>Last result</th>
                  <th style={{ width: '4%', textAlign: 'center' }}>On</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((item) => (
                  <tr
                    key={item.id}
                    className={`schedule-row ${selectedId === item.id ? 'selected' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <td>
                      <div className="schedule-name-cell">
                        <span className="schedule-name">{item.name}</span>
                        <span className="schedule-plan-sub">{item.planName}</span>
                      </div>
                    </td>
                    <td>{item.trigger}</td>
                    <td>{item.devices}</td>
                    <td>{item.nextRun}</td>
                    <td>
                      <span className={`status-pill ${item.lastResult.toLowerCase()}`}>
                        {item.lastResult}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(e) => handleToggleSchedule(item.id, e)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Edit Schedule */}
        <div className="schedules-card edit-schedule-card">
          <div className="edit-schedule-header">
            <div>
              <div className="edit-subtitle">Edit schedule</div>
              <h2 className="edit-title">{formData.name}</h2>
            </div>
            {formData.enabled ? (
              <span className="badge-enabled">Enabled</span>
            ) : (
              <span className="badge-disabled">Paused</span>
            )}
          </div>

          <div className="schedule-form">
            {/* Test Plan */}
            <div className="form-group">
              <label className="form-label">Test plan</label>
              <select
                className="form-select"
                value={formData.testPlan}
                onChange={(e) => handleFormChange('testPlan', e.target.value)}
              >
                <option value="Nightly Regression · Relay fleet (9 steps)">
                  Nightly Regression · Relay fleet (9 steps)
                </option>
                <option value="PTT Smoke (4 steps)">PTT Smoke (4 steps)</option>
                <option value="OTA 2.3.x → latest (6 steps)">OTA 2.3.x → latest (6 steps)</option>
                <option value="Stress · drivers + connectivity (12 steps)">
                  Stress · drivers + connectivity (12 steps)
                </option>
                <option value="Soak · PTT call loop + idle (1 long step)">
                  Soak · PTT call loop + idle (1 long step)
                </option>
                <option value="Nightly Regression · A13 (8 steps)">
                  Nightly Regression · A13 (8 steps)
                </option>
              </select>
            </div>

            {/* Trigger Mode */}
            <div className="form-group">
              <label className="form-label">Trigger</label>
              <div className="segmented-control">
                {[
                  { id: 'once', label: 'Once' },
                  { id: 'recurring', label: 'Recurring' },
                  { id: 'build', label: 'New build' },
                  { id: 'after', label: 'After a run' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`segmented-btn ${formData.triggerType === t.id ? 'active' : ''}`}
                    onClick={() => handleFormChange('triggerType', t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Repeat & Start Time */}
            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Repeat</label>
                <select
                  className="form-select"
                  value={formData.repeat}
                  onChange={(e) => handleFormChange('repeat', e.target.value)}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Start time</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.startTime}
                  onChange={(e) => handleFormChange('startTime', e.target.value)}
                />
              </div>
            </div>

            {/* Days Selector */}
            <div className="form-group">
              <label className="form-label">Days</label>
              <div className="days-selector">
                {dayLabels.map((lbl, idx) => {
                  const isActive = formData.activeDays?.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`day-circle ${isActive ? '' : 'inactive'}`}
                      onClick={() => toggleDay(idx)}
                    >
                      {lbl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CI New Build Inset Box */}
            <div className="ci-box">
              <label className="ci-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.alsoNewBuild}
                  onChange={(e) => handleFormChange('alsoNewBuild', e.target.checked)}
                />
                Also run when a new build arrives
              </label>

              {formData.alsoNewBuild && (
                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11.5px', color: '#6b7280' }}>
                      CI source
                    </label>
                    <select
                      className="form-select"
                      style={{ height: '32px', fontSize: '12px' }}
                      value={formData.ciSource}
                      onChange={(e) => handleFormChange('ciSource', e.target.value)}
                    >
                      <option value="Jenkins · relay-a16/main">Jenkins · relay-a16/main</option>
                      <option value="Jenkins · relay-a16/release">Jenkins · relay-a16/release</option>
                      <option value="GitHub Actions · main">GitHub Actions · main</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11.5px', color: '#6b7280' }}>
                      Only if
                    </label>
                    <select
                      className="form-select"
                      style={{ height: '32px', fontSize: '12px' }}
                      value={formData.onlyIf}
                      onChange={(e) => handleFormChange('onlyIf', e.target.value)}
                    >
                      <option value="Build smoke passes">Build smoke passes</option>
                      <option value="All unit tests pass">All unit tests pass</option>
                      <option value="Always trigger">Always trigger</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Build to test */}
            <div className="form-group">
              <label className="form-label">Build to test</label>
              <select
                className="form-select"
                value={formData.buildToTest}
                onChange={(e) => handleFormChange('buildToTest', e.target.value)}
              >
                <option value="Latest build at run time">Latest build at run time</option>
                <option value="Latest release candidate">Latest release candidate</option>
                <option value="Specific pinned build (0926)">Specific pinned build (0926)</option>
              </select>
            </div>

            {/* Busy device policy */}
            <div className="form-group">
              <label className="form-label">If devices are busy at start time</label>
              <div className="radio-group">
                <label className="radio-item">
                  <input
                    type="radio"
                    name="busyPolicy"
                    checked={formData.busyPolicy === 'wait'}
                    onChange={() => handleFormChange('busyPolicy', 'wait')}
                  />
                  <span>
                    Wait up to
                    <input
                      type="text"
                      className="inline-num-input"
                      value={formData.waitHours}
                      onChange={(e) => handleFormChange('waitHours', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    then skip
                  </span>
                </label>

                <label className="radio-item">
                  <input
                    type="radio"
                    name="busyPolicy"
                    checked={formData.busyPolicy === 'skip'}
                    onChange={() => handleFormChange('busyPolicy', 'skip')}
                  />
                  <span>Skip this occurrence</span>
                </label>

                <label className="radio-item">
                  <input
                    type="radio"
                    name="busyPolicy"
                    checked={formData.busyPolicy === 'any'}
                    onChange={() => handleFormChange('busyPolicy', 'any')}
                  />
                  <span>Run on any free device with the same model</span>
                </label>
              </div>
            </div>

            {/* Notify & When */}
            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Notify</label>
                <select
                  className="form-select"
                  value={formData.notify}
                  onChange={(e) => handleFormChange('notify', e.target.value)}
                >
                  <option value="Slack #relay-qa + email">Slack #relay-qa + email</option>
                  <option value="Slack #relay-qa">Slack #relay-qa</option>
                  <option value="Email only">Email only</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">When</label>
                <select
                  className="form-select"
                  value={formData.notifyWhen}
                  onChange={(e) => handleFormChange('notifyWhen', e.target.value)}
                >
                  <option value="On failure only">On failure only</option>
                  <option value="Always">Always</option>
                  <option value="On failure or finish">On failure or finish</option>
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div className="edit-form-actions">
              <button type="button" className="btn-secondary-white" onClick={handlePauseToggle}>
                {formData.enabled ? 'Pause' : 'Resume'}
              </button>
              <button type="button" className="btn-secondary-white" onClick={handleRunNow}>
                Run now
              </button>
              <button type="button" className="btn-primary-blue" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card: Device Calendar */}
      <div className="device-calendar-card">
        <div className="calendar-header">
          <div className="calendar-title-group">
            <h3 className="calendar-main-title">Device calendar · Sat Sep 26 – Fri Oct 2</h3>
            <p className="calendar-sub-title">
              Scheduled runs and reservations per device. Overlaps are flagged before they happen.
            </p>
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-color-box scheduled"></span>
              <span>Scheduled run</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-box soak"></span>
              <span>Soak</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-box conflict"></span>
              <span>Conflict</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-box offline"></span>
              <span>Offline</span>
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="timeline-grid-wrapper">
          {/* Vertical Red Now Line */}
          <div className="now-time-indicator">
            <span className="now-time-badge">Now 02:40</span>
          </div>

          <div className="timeline-grid">
            {/* Header row */}
            <div className="timeline-header-cell" style={{ background: '#f9fafb' }}></div>
            {['Sat 26', 'Sun 27', 'Mon 28', 'Tue 29', 'Wed 30', 'Thu 1', 'Fri 2'].map((day) => (
              <div key={day} className="timeline-header-cell">
                {day}
              </div>
            ))}

            {/* Row 1: Relay X-001 (A16) */}
            <div className="timeline-row">
              <div className="device-label-cell">
                <span className="device-name">Relay X-001</span>
                <span className="device-model">A16</span>
              </div>

              {/* Sat 26 */}
              <div className="timeline-day-track">
                <div
                  className="timeline-block-n"
                  title="Nightly Regression · 01:00 - 02:15"
                >
                  N
                </div>
              </div>

              {/* Sun 27 (Conflict) */}
              <div className="timeline-day-track">
                <div
                  className="conflict-cluster"
                  title="Conflict: Weekly Stress (Sat 22:00-Sun 02:00) overlaps Nightly Regression (01:00)"
                >
                  <span className="timeline-block-we">We</span>
                  <span className="timeline-block-n">N</span>
                </div>
              </div>

              {/* Mon 28 */}
              <div className="timeline-day-track">
                <div className="timeline-block-n" title="Nightly Regression · 01:00">
                  N
                </div>
              </div>

              {/* Tue 29 */}
              <div className="timeline-day-track">
                <div className="timeline-block-n" title="Nightly Regression · 01:00">
                  N
                </div>
              </div>

              {/* Wed 30 */}
              <div className="timeline-day-track">
                <div className="timeline-block-n" title="Nightly Regression · 01:00">
                  N
                </div>
              </div>

              {/* Thu 1 */}
              <div className="timeline-day-track">
                <div className="timeline-block-n" title="Nightly Regression · 01:00">
                  N
                </div>
              </div>

              {/* Fri 2 */}
              <div className="timeline-day-track">
                <div className="timeline-block-n" title="Nightly Regression · 01:00">
                  N
                </div>
              </div>
            </div>

            {/* Row 2: Relay X-002 (A16) */}
            <div className="timeline-row">
              <div className="device-label-cell">
                <span className="device-name">Relay X-002</span>
                <span className="device-model">A16</span>
              </div>

              {/* Sat 26 to Wed 30: Solid Soak Bar */}
              <div className="timeline-day-track" style={{ position: 'relative' }}>
                <div className="soak-span-bar">
                  Soak #1045 · day 3 of 7 · ends Wed 22:00
                </div>
              </div>
              <div className="timeline-day-track"></div>
              <div className="timeline-day-track"></div>
              <div className="timeline-day-track"></div>
              <div className="timeline-day-track"></div>
              <div className="timeline-day-track"></div>
              <div className="timeline-day-track"></div>
            </div>

            {/* Row 3: Relay M-001 (A13) */}
            <div className="timeline-row">
              <div className="device-label-cell">
                <span className="device-name">Relay M-001</span>
                <span className="device-model">A13</span>
              </div>

              {/* Hatched offline track across all 7 days */}
              <div className="timeline-day-track" style={{ position: 'relative' }}>
                <div className="offline-span-bar">
                  Offline since 02:14 · A13 Regression paused
                </div>
              </div>
              <div className="timeline-day-track"></div>
              <div className="timeline-day-track"></div>
              <div className="timeline-day-track"></div>
              <div className="timeline-day-track"></div>
              <div className="timeline-day-track"></div>
              <div className="timeline-day-track"></div>
            </div>

            {/* Row 4: Relay M-002 (A16) */}
            <div className="timeline-row">
              <div className="device-label-cell">
                <span className="device-name">Relay M-002</span>
                <span className="device-model">A16</span>
              </div>

              {/* Sat 26 */}
              <div className="timeline-day-track" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="timeline-block-n" title="Nightly Regression · 01:00">
                  N
                </div>
                <div className="timeline-block-thin" title="PTT Smoke run"></div>
              </div>

              {/* Sun 27 (Conflict) */}
              <div className="timeline-day-track">
                <div
                  className="conflict-cluster"
                  title="Conflict: Weekly Stress overlaps Nightly Regression"
                >
                  <span className="timeline-block-we">We</span>
                  <span className="timeline-block-n">N</span>
                </div>
              </div>

              {/* Mon 28 */}
              <div className="timeline-day-track">
                <div className="timeline-block-n" title="Nightly Regression · 01:00">
                  N
                </div>
              </div>

              {/* Tue 29 */}
              <div className="timeline-day-track">
                <div className="timeline-block-n" title="Nightly Regression · 01:00">
                  N
                </div>
              </div>

              {/* Wed 30 */}
              <div className="timeline-day-track">
                <div className="timeline-block-n" title="Nightly Regression · 01:00">
                  N
                </div>
              </div>

              {/* Thu 1 */}
              <div className="timeline-day-track">
                <div className="timeline-block-n" title="Nightly Regression · 01:00">
                  N
                </div>
              </div>

              {/* Fri 2 */}
              <div className="timeline-day-track">
                <div className="timeline-block-n" title="Nightly Regression · 01:00">
                  N
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conflict Warning Box */}
        <div className="conflict-banner">
          <div className="conflict-banner-left">
            <span className="conflict-badge-text">Conflict Sun 01:00</span>
            <span className="conflict-desc-text">
              Weekly Stress (Sat 22:00 – Sun 02:00) overlaps Nightly Regression on X-001 and M-002.
              Nightly will wait until 02:00 (policy: wait up to 2 h).
            </span>
          </div>
          <button
            type="button"
            className="btn-resolve"
            onClick={() => setShowResolveModal(true)}
          >
            Resolve
          </button>
        </div>
      </div>

      {/* Resolve Conflict Modal */}
      {showResolveModal && (
        <div className="modal-overlay" onClick={() => setShowResolveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Resolve Schedule Conflict</h3>
            <p className="modal-desc">
              Weekly Stress (Sat 22:00 – Sun 02:00) overlaps with Nightly Regression on devices
              X-001 and M-002 on Sunday 01:00.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  background: '#eff6ff',
                  cursor: 'pointer'
                }}
              >
                <input type="radio" name="resolveOption" defaultChecked style={{ marginTop: '3px' }} />
                <div>
                  <strong style={{ fontSize: '13px', color: '#1e40af' }}>
                    Shift Nightly Regression to 02:00 on Sundays
                  </strong>
                  <p style={{ fontSize: '12px', color: '#4b5563', margin: '2px 0 0' }}>
                    Nightly will execute immediately after Weekly Stress completes without queuing.
                  </p>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <input type="radio" name="resolveOption" style={{ marginTop: '3px' }} />
                <div>
                  <strong style={{ fontSize: '13px', color: '#111827' }}>
                    Keep queue wait policy (wait up to 2 h)
                  </strong>
                  <p style={{ fontSize: '12px', color: '#4b5563', margin: '2px 0 0' }}>
                    Nightly will queue and start as soon as each device frees up.
                  </p>
                </div>
              </label>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary-white"
                onClick={() => setShowResolveModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary-blue"
                onClick={() => {
                  setShowResolveModal(false);
                  showToast('Conflict resolution applied');
                }}
              >
                Apply resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Schedule Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Create New Schedule</h3>
            <p className="modal-desc">
              Define a recurring or build-triggered execution schedule for your test suites.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Schedule name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Daily Audio & Voice smoke"
                  defaultValue="Daily Audio & Voice smoke"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Test plan</label>
                <select className="form-select" defaultValue="PTT Smoke (4 steps)">
                  <option value="PTT Smoke (4 steps)">PTT Smoke (4 steps)</option>
                  <option value="Nightly Regression · Relay fleet (9 steps)">
                    Nightly Regression · Relay fleet (9 steps)
                  </option>
                  <option value="OTA 2.3.x → latest (6 steps)">OTA 2.3.x → latest (6 steps)</option>
                  <option value="Stress · drivers + connectivity (12 steps)">
                    Stress · drivers + connectivity (12 steps)
                  </option>
                </select>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Trigger</label>
                  <select className="form-select" defaultValue="Daily">
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="New build">On new build</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Start time</label>
                  <input type="text" className="form-input" defaultValue="04:00" />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary-white"
                onClick={() => setShowNewModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary-blue"
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
              >
                Create schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules;
