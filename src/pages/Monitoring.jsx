import React, { useState } from 'react';

// Realistic sample log data for each event type
const SAMPLE_LOGS = {
  logcat: {
    title: 'logcat (Wi-Fi disconnect & reconnect)',
    timestamp: '2026-09-26 01:34:12.482',
    lines: [
      { type: 'info', text: '09-26 01:34:08.112  1420  1890 I wpa_supplicant: wlan0: CTRL-EVENT-DISCONNECTED bssid=74:ac:b9:42:11:80 reason=4' },
      { type: 'warn', text: '09-26 01:34:08.114  1850  2104 W WifiClientModeManager: [wlan0] Lost connection to AP: Relay-Mesh-QA-5G' },
      { type: 'info', text: '09-26 01:34:08.120  1850  2104 I ConnectivityService: NetworkAgentInfo [WIFI () - 104] disconnected' },
      { type: 'info', text: '09-26 01:34:09.540  1420  1890 I wpa_supplicant: wlan0: Trying to associate with SSID "Relay-Mesh-QA-5G"' },
      { type: 'info', text: '09-26 01:34:10.210  1420  1890 I wpa_supplicant: wlan0: Associated with 74:ac:b9:42:11:80' },
      { type: 'info', text: '09-26 01:34:11.830  1420  1890 I wpa_supplicant: wlan0: WPA: Key negotiation completed with 74:ac:b9:42:11:80 [PTK=CCMP GTK=CCMP]' },
      { type: 'info', text: '09-26 01:34:12.482  1850  2104 I ConnectivityService: NetworkAgentInfo [WIFI () - 105] connected, validation passed (4.2 s total downtime)' }
    ]
  },
  traces_input: {
    title: 'ANR traces.txt · com.relay.ptt (input dispatch)',
    timestamp: '2026-09-25 19:36:44.109',
    lines: [
      { type: 'err', text: '----- pid 4812 at 2026-09-25 19:36:44 -----' },
      { type: 'err', text: 'Cmd line: com.relay.ptt' },
      { type: 'warn', text: '"main" prio=5 tid=1 Blocked' },
      { type: 'warn', text: '  | sysTid=4812 nice=-10 cgrp=default sched=0/0 handle=0x76b2c8e4f0' },
      { type: 'warn', text: '  | state=S schedstat=( 142981024 459102 384 ) utm=11 stm=3 core=2 HZ=100' },
      { type: 'warn', text: '  waiting to lock <0x0a41bc9f> (com.relay.ptt.audio.PttAudioRouter) held by thread 18 ("AudioPlaybackThread")' },
      { type: 'text', text: '  at com.relay.ptt.ui.PttTalkButton.onTouchEvent(PttTalkButton.kt:142)' },
      { type: 'text', text: '  at android.view.View.dispatchTouchEvent(View.java:14321)' },
      { type: 'text', text: '  at android.view.ViewGroup.dispatchTransformedTouchEvent(ViewGroup.java:3110)' },
      { type: 'text', text: '  at android.view.ViewGroup.dispatchTouchEvent(ViewGroup.java:2780)' },
      { type: 'err', text: 'Reason: Input dispatching timed out (Waiting to send key event to com.relay.ptt because focused window has not finished previous event)' }
    ]
  },
  thermal: {
    title: 'thermal_engine.log · Peak 46.2 °C',
    timestamp: '2026-09-25 05:17:02.000',
    lines: [
      { type: 'info', text: '05:12:00.010 [thermal-engine] Sensor quiet-therm: 42.4 C | battery: 41.8 C | cpu0-3: 48.0 C' },
      { type: 'warn', text: '05:14:00.012 [thermal-engine] Sensor quiet-therm: 44.9 C | charging_rate=18W | ptt_call_active=true' },
      { type: 'err', text: '05:15:30.014 [thermal-engine] WARNING: quiet-therm exceeded 45.0 C (Current: 45.8 C)' },
      { type: 'err', text: '05:17:02.016 [thermal-engine] PEAK: quiet-therm=46.2 C (Duration >45 C: 6m 12s)' },
      { type: 'info', text: '05:17:15.018 [thermal-engine] CPU throttle mitigation evaluated: CPU freq capped to 1600 MHz' },
      { type: 'info', text: '05:21:40.020 [thermal-engine] Sensor quiet-therm cooled to 44.1 C, threshold cleared' }
    ]
  },
  bugreport: {
    title: 'bugreport-Relay-X-002-2026-09-25-02-52.dump',
    timestamp: '2026-09-25 02:52:19.000',
    lines: [
      { type: 'err', text: 'SYSTEM REBOOT DETECTED: boot_reason=watchdog, reboot_target=kernel' },
      { type: 'err', text: 'Kernel panic - not syncing: Watchdog bark: CPU3 stuck in soft lockup for 26s!' },
      { type: 'warn', text: 'CPU: 3 PID: 618 Comm: PttAudioEngine Tainted: G        W  O      5.10.149-android12-9 #1' },
      { type: 'text', text: 'Hardware name: Qualcomm Technologies, Inc. QCS610 RB3 Gen2' },
      { type: 'text', text: 'Call trace:' },
      { type: 'text', text: ' dump_backtrace+0x0/0x1ec' },
      { type: 'text', text: ' show_stack+0x18/0x24' },
      { type: 'text', text: ' dump_stack_lvl+0x68/0x84' },
      { type: 'text', text: ' panic+0x158/0x364' },
      { type: 'text', text: ' watchdog_timer_fn+0x240/0x258' },
      { type: 'info', text: 'Uptime prior to reboot: 46 h 12 m 18 s | Battery SOC: 88%' }
    ]
  },
  last_kmsg: {
    title: '/sys/fs/pstore/console-ramoops (last_kmsg)',
    timestamp: '2026-09-25 02:34:55.000',
    lines: [
      { type: 'info', text: '[166415.820120] qcom,cpubw: bw_mon update avg: 3120 MB/s' },
      { type: 'warn', text: '[166420.104230] watchdog: BUG: soft lockup - CPU#3 stuck for 22s! [PttAudioEngine:618]' },
      { type: 'err', text: '[166424.108420] watchdog: BUG: soft lockup - CPU#3 stuck for 26s! [PttAudioEngine:618]' },
      { type: 'err', text: '[166424.108450] Kernel panic - not syncing: softlockup: hung tasks' },
      { type: 'err', text: '[166424.108480] SMP: stopping secondary CPUs' },
      { type: 'warn', text: '[166424.109100] ipi_cpu_stop: CPU0 stopped' },
      { type: 'warn', text: '[166424.109120] ipi_cpu_stop: CPU1 stopped' },
      { type: 'warn', text: '[166424.109130] ipi_cpu_stop: CPU2 stopped' },
      { type: 'info', text: '[166424.110200] ramoops: console-ramoops dump written (8421 bytes)' }
    ]
  },
  traces_service: {
    title: 'ANR traces.txt · com.relay.ptt (service timeout)',
    timestamp: '2026-09-24 06:24:18.000',
    lines: [
      { type: 'err', text: '----- pid 3102 at 2026-09-24 06:24:18 -----' },
      { type: 'err', text: 'Cmd line: com.relay.ptt' },
      { type: 'warn', text: '"main" prio=5 tid=1 Native' },
      { type: 'warn', text: '  waiting on condition: com.relay.ptt.service.PttBackgroundSyncService' },
      { type: 'text', text: '  at android.os.MessageQueue.nativePollOnce(Native Method)' },
      { type: 'text', text: '  at android.os.MessageQueue.next(MessageQueue.java:335)' },
      { type: 'text', text: '  at android.os.Looper.loopOnce(Looper.java:161)' },
      { type: 'err', text: 'Reason: Context.startForegroundService() did not then call Service.startForeground(): ServiceRecord{90fae44 u0 com.relay.ptt/.service.PttBackgroundSyncService}' }
    ]
  }
};

const Monitoring = () => {
  // Alert rules state
  const [alertRules, setAlertRules] = useState([
    { id: 1, name: 'Unexpected reboot', desc: 'Collect bugreport · email + Slack', enabled: true },
    { id: 2, name: 'Temperature > 45 °C for 5 min', desc: 'Slack #relay-qa', enabled: true },
    { id: 3, name: 'Battery drain > 8% per hour', desc: 'Slack #relay-qa', enabled: true },
    { id: 4, name: 'Memory growth > 50 MB in 24 h', desc: 'Create finding', enabled: true },
    { id: 5, name: 'Device offline > 10 min', desc: 'Power-cycle, then email', enabled: true }
  ]);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'logs' | 'createBug' | 'compareThermal' | 'addRule' | 'eventDrawer'
  const [modalLogKey, setModalLogKey] = useState('bugreport');
  const [toastMessage, setToastMessage] = useState(null);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [bugForm, setBugForm] = useState({
    title: 'System PSS grows about 16 MB/day on build 0923',
    component: 'com.relay.ptt',
    severity: 'High - P2',
    notes: 'Detected in Soak #1045 Day 3. Suspected leak in audio packet buffer cache.'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const toggleRule = (id) => {
    setAlertRules(prev =>
      prev.map(rule => {
        if (rule.id === id) {
          const nextState = !rule.enabled;
          showToast(`Rule "${rule.name}" is now ${nextState ? 'enabled' : 'disabled'}`);
          return { ...rule, enabled: nextState };
        }
        return rule;
      })
    );
  };

  const openLogViewer = (key) => {
    setModalLogKey(key);
    setActiveModal('logs');
  };

  const handleDownloadAllLogs = () => {
    showToast('Preparing download package: Relay-X-002-Soak-1045-logs.tar.gz (4.1 GB)...');
  };

  const handleAddRuleSubmit = (e) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;
    const newRule = {
      id: Date.now(),
      name: newRuleName.trim(),
      desc: newRuleDesc.trim() || 'Slack #relay-qa',
      enabled: true
    };
    setAlertRules(prev => [...prev, newRule]);
    setNewRuleName('');
    setNewRuleDesc('');
    setActiveModal(null);
    showToast(`Added alert rule: "${newRule.name}"`);
  };

  const handleCreateBugSubmit = (e) => {
    e.preventDefault();
    setActiveModal(null);
    showToast(`Created Jira issue RELAY-4819: "${bugForm.title}"`);
  };

  // Timeline events plotted on chart
  const timelineEvents = [
    { id: 'anr1', x: 252, label: 'ANR', type: 'anr', logKey: 'traces_service', time: 'Sep 24 06:24', desc: 'ANR in com.relay.ptt (service timeout)' },
    { id: 'thermal', x: 320, label: 'H Temp', type: 'thermal', logKey: 'thermal', time: 'Sep 25 05:17', desc: 'Peak 46.2 °C above 45 °C for 6 min' },
    { id: 'anr2', x: 358, label: 'ANR', type: 'anr', logKey: 'traces_input', time: 'Sep 25 19:36', desc: 'ANR in com.relay.ptt (input dispatch)' }
  ];

  return (
    <div className="monitoring-page">
      {/* 6 Top Metric / KPI Cards */}
      <div className="monitoring-stats-grid">
        <div className="monitoring-stat-card">
          <div className="monitoring-stat-label">Uptime since last boot</div>
          <div className="monitoring-stat-value">23 h 50 m</div>
          <div className="monitoring-stat-desc">Soak elapsed 2 d 4 h</div>
        </div>

        <div className="monitoring-stat-card">
          <div className="monitoring-stat-label">Unexpected reboots</div>
          <div className="monitoring-stat-value danger">1</div>
          <div className="monitoring-stat-desc">Sep 25 02:52 · watchdog</div>
        </div>

        <div className="monitoring-stat-card">
          <div className="monitoring-stat-label">ANRs / crashes</div>
          <div className="monitoring-stat-value">2 / 0</div>
          <div className="monitoring-stat-desc">Both in com.relay.ptt</div>
        </div>

        <div className="monitoring-stat-card">
          <div className="monitoring-stat-label">Peak temperature</div>
          <div className="monitoring-stat-value">46.2 °C</div>
          <div className="monitoring-stat-desc warning-text">Above 45 °C for 6 min</div>
        </div>

        <div className="monitoring-stat-card">
          <div className="monitoring-stat-label">Memory trend</div>
          <div className="monitoring-stat-value">+16 MB/day</div>
          <div className="monitoring-stat-desc warning-text">Possible leak</div>
        </div>

        <div className="monitoring-stat-card">
          <div className="monitoring-stat-label">Wi-Fi disconnects</div>
          <div className="monitoring-stat-value">7</div>
          <div className="monitoring-stat-desc">5 during idle</div>
        </div>
      </div>

      {/* Main 2-Column Content Layout */}
      <div className="monitoring-main-layout">
        {/* Left Column */}
        <div className="monitoring-left-col">
          {/* Soak Timeline Chart Card */}
          <div className="monitoring-card">
            <div className="monitoring-card-header">
              <div className="monitoring-card-title">
                Soak timeline · Sep 23 22:00 – Sep 30 22:00
              </div>
              <div className="timeline-legend">
                <div className="legend-item">
                  <span className="legend-line blue-solid"></span>
                  <span>Build 0923 (now)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-line slate-dashed"></span>
                  <span>Build 0919 soak</span>
                </div>
                <div className="legend-item">
                  <span className="legend-line red-dotted"></span>
                  <span>Threshold</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Multi-track Timeline */}
            <div className="timeline-chart-wrapper">
              <svg 
                className="timeline-svg-container" 
                viewBox="0 0 880 430"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const svgX = ((e.clientX - rect.left) / rect.width) * 880;
                  if (svgX >= 160 && svgX <= 840) {
                    // Calculate interpolated progress
                    const dayRatio = (svgX - 160) / (840 - 160);
                    const totalHours = dayRatio * 168;
                    const elapsedDays = Math.floor(totalHours / 24) + 1;
                    const elapsedH = Math.floor(totalHours % 24);
                    setHoveredPoint({
                      x: svgX,
                      label: `D${elapsedDays} (${elapsedH}:00)`,
                      isPastNow: svgX > 375
                    });
                  }
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <defs>
                  <linearGradient id="futureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* Grid Channel Dividers */}
                {/* Track 1: Battery 20 - 95 */}
                {/* Track 2: Temperature 95 - 175 */}
                {/* Track 3: Memory 175 - 255 */}
                {/* Track 4: CPU 255 - 335 */}
                {/* Track 5: Events 335 - 370 */}
                {/* Track 6: Test activity 370 - 395 */}
                <line x1="160" y1="95" x2="840" y2="95" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="160" y1="175" x2="840" y2="175" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="160" y1="255" x2="840" y2="255" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="160" y1="335" x2="840" y2="335" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="160" y1="370" x2="840" y2="370" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="160" y1="395" x2="840" y2="395" stroke="#e2e8f0" strokeWidth="1" />

                {/* Day vertical grid lines */}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                  const gx = 160 + (i * (680 / 6));
                  return (
                    <g key={i}>
                      <line x1={gx} y1="20" x2={gx} y2="395" stroke="#f8fafc" strokeWidth="1" />
                      <line x1={gx} y1="395" x2={gx} y2="400" stroke="#cbd5e1" strokeWidth="1" />
                    </g>
                  );
                })}

                {/* Left labels column */}
                {/* Battery */}
                <text x="24" y="44" fill="#6b7280" fontSize="12" fontWeight="500">Battery</text>
                <text x="24" y="64" fill="#111827" fontSize="15" fontWeight="700">64%</text>

                {/* Temperature */}
                <text x="24" y="122" fill="#6b7280" fontSize="12" fontWeight="500">Temperature</text>
                <text x="24" y="142" fill="#111827" fontSize="15" fontWeight="700">39.1 °C</text>

                {/* Memory */}
                <text x="24" y="200" fill="#6b7280" fontSize="12" fontWeight="500">Memory (system PSS)</text>
                <text x="24" y="220" fill="#111827" fontSize="15" fontWeight="700">822 MB</text>

                {/* CPU */}
                <text x="24" y="278" fill="#6b7280" fontSize="12" fontWeight="500">CPU</text>
                <text x="24" y="298" fill="#111827" fontSize="15" fontWeight="700">31%</text>

                {/* Events label */}
                <text x="24" y="356" fill="#6b7280" fontSize="12" fontWeight="500">Events</text>

                {/* Test activity label */}
                <text x="24" y="386" fill="#6b7280" fontSize="12" fontWeight="500">Test activity</text>

                {/* Shaded future area from "Now" line (x=375) to right edge (x=840) */}
                <rect x="375" y="20" width="465" height="375" fill="url(#futureGradient)" opacity="0.8" />
                <text x="590" y="235" fill="#64748b" fontSize="12" fontWeight="500" textAnchor="middle">
                  4 d 1.8 h remaining
                </text>

                {/* Temperature Threshold line at 45 °C */}
                {/* 45 °C threshold corresponds to Y = 118 */}
                <line x1="160" y1="118" x2="840" y2="118" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 3" />
                <text x="815" y="112" fill="#ef4444" fontSize="11" fontWeight="600" textAnchor="end">45 °C</text>

                {/* Red dashed vertical alert marker at peak temperature event (x=320) */}
                <line x1="320" y1="114" x2="320" y2="355" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* TRACK 1: BATTERY */}
                {/* Build 0919 (Grey Dashed) Sawtooth baseline (full 7 days) */}
                <path
                  d="M 160 25 L 210 75 L 215 30 L 265 72 L 270 28 L 320 74 L 325 32 L 375 75 L 380 30 L 430 74 L 435 28 L 485 76 L 490 30 L 540 75 L 545 32 L 595 73 L 600 28 L 650 75 L 655 30 L 705 74 L 710 32 L 760 76 L 765 30 L 815 74 L 840 55"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />

                {/* Build 0923 (Solid Blue) Sawtooth (up to Now: x=375) */}
                <path
                  d="M 160 30 L 205 78 L 210 28 L 258 76 L 264 26 L 312 79 L 318 29 L 366 74 L 372 32 L 375 52"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* TRACK 2: TEMPERATURE */}
                {/* Build 0919 (Grey dashed) */}
                <path
                  d="M 160 148 Q 200 142, 230 152 T 300 144 T 375 140 T 450 145 T 520 142 T 600 146 T 680 143 T 760 145 T 840 144"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />

                {/* Build 0923 (Solid Blue) with peak spike at x=320 reaching 46.2 °C (y=114) */}
                <path
                  d="M 160 146 Q 190 144, 210 150 T 250 142 T 280 148 L 305 132 L 320 114 L 332 136 L 350 147 L 375 145"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* TRACK 3: MEMORY (System PSS) */}
                {/* Build 0919 (Grey dashed) */}
                <path
                  d="M 160 226 L 210 223 L 212 225 L 270 220 L 272 222 L 330 218 L 375 215 T 450 212 T 530 208 T 610 205 T 690 202 T 770 198 T 840 195"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />

                {/* Build 0923 (Solid Blue) with upward trend (+16 MB/day) */}
                <path
                  d="M 160 225 L 208 221 L 210 223 L 265 217 L 268 220 L 318 214 L 322 216 L 375 210"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* TRACK 4: CPU */}
                {/* Build 0923 (Solid Blue) Fluctuations */}
                <path
                  d="M 160 308 L 175 308 L 180 292 L 195 292 L 200 308 L 220 308 L 225 285 L 235 285 L 240 308 L 260 308 L 265 282 L 280 282 L 285 308 L 305 308 L 310 274 L 325 274 L 330 308 L 345 308 L 350 288 L 365 288 L 370 308 L 375 306"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* TRACK 5: EVENTS BADGES */}
                {timelineEvents.map((ev) => (
                  <g 
                    key={ev.id} 
                    className="timeline-event-marker"
                    onClick={() => openLogViewer(ev.logKey)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect 
                      x={ev.x - 18} 
                      y="342" 
                      width="36" 
                      height="18" 
                      rx="4" 
                      fill={ev.type === 'thermal' ? '#ef4444' : '#f59e0b'} 
                    />
                    <text 
                      x={ev.x} 
                      y="355" 
                      fill="#ffffff" 
                      fontSize="10" 
                      fontWeight="700" 
                      textAnchor="middle"
                    >
                      {ev.label}
                    </text>
                  </g>
                ))}

                {/* TRACK 6: TEST ACTIVITY BLOCKS */}
                <g>
                  {/* PTT call block 1 */}
                  <rect x="180" y="375" width="40" height="15" rx="3" fill="#dbeafe" />
                  <text x="200" y="386" fill="#1d4ed8" fontSize="9" fontWeight="600" textAnchor="middle">PTT call</text>

                  {/* Idle standby block 1 */}
                  <rect x="224" y="375" width="42" height="15" rx="3" fill="#f1f5f9" />
                  <text x="245" y="386" fill="#475569" fontSize="9" fontWeight="500" textAnchor="middle">Idle stan</text>

                  {/* PTT call block 2 */}
                  <rect x="270" y="375" width="40" height="15" rx="3" fill="#dbeafe" />
                  <text x="290" y="386" fill="#1d4ed8" fontSize="9" fontWeight="600" textAnchor="middle">PTT call</text>

                  {/* Idle standby block 2 */}
                  <rect x="314" y="375" width="42" height="15" rx="3" fill="#f1f5f9" />
                  <text x="335" y="386" fill="#475569" fontSize="9" fontWeight="500" textAnchor="middle">Idle stan</text>
                </g>

                {/* Vertical "Now" Divider at x = 375 */}
                <line x1="375" y1="20" x2="375" y2="395" stroke="#1e293b" strokeWidth="2" />
                <text x="375" y="16" fill="#1e293b" fontSize="11" fontWeight="700" textAnchor="middle">Now</text>

                {/* X-AXIS LABELS (D1 to D7) */}
                <text x="175" y="416" fill="#64748b" fontSize="11" fontWeight="500">D1 - Sep 23</text>
                <text x="285" y="416" fill="#64748b" fontSize="11" fontWeight="500">D2 - Sep 24</text>
                <text x="395" y="416" fill="#64748b" fontSize="11" fontWeight="500">D3 - Sep 25</text>
                <text x="505" y="416" fill="#64748b" fontSize="11" fontWeight="500">D4 - Sep 26</text>
                <text x="615" y="416" fill="#64748b" fontSize="11" fontWeight="500">D5 - Sep 27</text>
                <text x="725" y="416" fill="#64748b" fontSize="11" fontWeight="500">D6 - Sep 28</text>
                <text x="805" y="416" fill="#64748b" fontSize="11" fontWeight="500">D7 - Sep 29</text>

                {/* Interactive Crosshair & Tooltip */}
                {hoveredPoint && (
                  <g>
                    <line 
                      x1={hoveredPoint.x} 
                      y1="20" 
                      x2={hoveredPoint.x} 
                      y2="395" 
                      stroke="#3b82f6" 
                      strokeWidth="1" 
                      strokeDasharray="2 2" 
                    />
                    <circle cx={hoveredPoint.x} cy="52" r="3" fill="#2563eb" />
                    <rect 
                      x={Math.min(hoveredPoint.x + 8, 740)} 
                      y="40" 
                      width="100" 
                      height="38" 
                      rx="4" 
                      fill="#0f172a" 
                      opacity="0.9" 
                    />
                    <text 
                      x={Math.min(hoveredPoint.x + 16, 748)} 
                      y="54" 
                      fill="#f8fafc" 
                      fontSize="10" 
                      fontWeight="600"
                    >
                      {hoveredPoint.label}
                    </text>
                    <text 
                      x={Math.min(hoveredPoint.x + 16, 748)} 
                      y="68" 
                      fill="#93c5fd" 
                      fontSize="9"
                    >
                      {hoveredPoint.isPastNow ? 'Projected reference' : 'Live sensor data'}
                    </text>
                  </g>
                )}
              </svg>
            </div>

            <div className="timeline-footer-hint">
              Drag across the chart to zoom. Select any event to open the logs, bugreport and test step recorded at that moment.
            </div>
          </div>

          {/* Findings to review Card */}
          <div className="monitoring-card">
            <div className="monitoring-card-header">
              <div className="monitoring-card-title">Findings to review</div>
              <div className="findings-header-desc">Detected automatically from the soak data</div>
            </div>

            <div className="findings-grid">
              {/* Finding 1: Memory */}
              <div className="finding-card">
                <div>
                  <span className="finding-badge badge-yellow">Memory</span>
                  <div className="finding-title" style={{ marginTop: '8px' }}>
                    System PSS grows about 16 MB/day, similar to build 0919
                  </div>
                  <div className="finding-desc">
                    Largest growth: com.relay.ptt (+11 MB/day)
                  </div>
                </div>
                <button 
                  className="finding-btn"
                  onClick={() => setActiveModal('createBug')}
                >
                  Create bug
                </button>
              </div>

              {/* Finding 2: Stability */}
              <div className="finding-card">
                <div>
                  <span className="finding-badge badge-red">Stability</span>
                  <div className="finding-title" style={{ marginTop: '8px' }}>
                    Reboot after kernel soft lockup, during PTT call loop
                  </div>
                  <div className="finding-desc">
                    last_kmsg and bugreport attached
                  </div>
                </div>
                <button 
                  className="finding-btn"
                  onClick={() => openLogViewer('last_kmsg')}
                >
                  Open logs
                </button>
              </div>

              {/* Finding 3: Thermal */}
              <div className="finding-card">
                <div>
                  <span className="finding-badge badge-orange">Thermal</span>
                  <div className="finding-title" style={{ marginTop: '8px' }}>
                    46.2 °C while charging during a call
                  </div>
                  <div className="finding-desc">
                    No throttling recorded. Build 0919 peaked at 42 °C.
                  </div>
                </div>
                <button 
                  className="finding-btn"
                  onClick={() => setActiveModal('compareThermal')}
                >
                  Compare
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="monitoring-right-col">
          {/* Card 1: Event log */}
          <div className="monitoring-card">
            <div className="monitoring-card-header">
              <div className="monitoring-card-title">Event log</div>
              <button 
                onClick={() => setActiveModal('eventDrawer')} 
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: 0 }}
              >
                All 23
              </button>
            </div>

            <div className="event-log-list">
              {/* Event 1 */}
              <div className="event-log-item">
                <span className="event-dot blue"></span>
                <div className="event-content">
                  <div className="event-title">Wi-Fi disconnect, reconnected in 4 s</div>
                  <div className="event-meta">
                    Sep 26 01:34 · <span className="event-link" onClick={() => openLogViewer('logcat')}>logcat</span>
                  </div>
                </div>
              </div>

              {/* Event 2 */}
              <div className="event-log-item">
                <span className="event-dot amber"></span>
                <div className="event-content">
                  <div className="event-title">ANR in com.relay.ptt (input dispatch)</div>
                  <div className="event-meta">
                    Sep 25 19:36 · <span className="event-link" onClick={() => openLogViewer('traces_input')}>traces</span>
                  </div>
                </div>
              </div>

              {/* Event 3 */}
              <div className="event-log-item">
                <span className="event-dot amber"></span>
                <div className="event-content">
                  <div className="event-title">Temperature 46.2 °C, above 45 °C for 6 min</div>
                  <div className="event-meta">
                    Sep 25 05:17 · <span className="event-link" onClick={() => openLogViewer('thermal')}>thermal log</span>
                  </div>
                </div>
              </div>

              {/* Event 4 */}
              <div className="event-log-item">
                <span className="event-dot red"></span>
                <div className="event-content">
                  <div className="event-title">Unexpected reboot, reason: watchdog</div>
                  <div className="event-meta">
                    Sep 25 02:52 · <span className="event-link" onClick={() => openLogViewer('bugreport')}>bugreport</span>
                  </div>
                </div>
              </div>

              {/* Event 5 */}
              <div className="event-log-item">
                <span className="event-dot red"></span>
                <div className="event-content">
                  <div className="event-title">Kernel: soft lockup on CPU3</div>
                  <div className="event-meta">
                    Sep 25 02:34 · <span className="event-link" onClick={() => openLogViewer('last_kmsg')}>last_kmsg</span>
                  </div>
                </div>
              </div>

              {/* Event 6 */}
              <div className="event-log-item">
                <span className="event-dot amber"></span>
                <div className="event-content">
                  <div className="event-title">ANR in com.relay.ptt (service timeout)</div>
                  <div className="event-meta">
                    Sep 24 06:24 · <span className="event-link" onClick={() => openLogViewer('traces_service')}>traces</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Alert rules */}
          <div className="monitoring-card">
            <div className="monitoring-card-header">
              <div className="monitoring-card-title">Alert rules</div>
              <button 
                className="finding-btn"
                onClick={() => setActiveModal('addRule')}
                style={{ padding: '4px 10px', fontSize: '12px' }}
              >
                + Rule
              </button>
            </div>

            <div className="alert-rules-list">
              {alertRules.map((rule) => (
                <div className="alert-rule-item" key={rule.id}>
                  <div className="alert-rule-info">
                    <div className="alert-rule-name">{rule.name}</div>
                    <div className="alert-rule-desc">{rule.desc}</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={rule.enabled} 
                      onChange={() => toggleRule(rule.id)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Capture and retention */}
          <div className="monitoring-card">
            <div className="monitoring-card-header">
              <div className="monitoring-card-title">Capture and retention</div>
            </div>

            <div className="retention-table">
              <div className="retention-row">
                <span className="retention-key">Metrics sampling</span>
                <span className="retention-value">every 30 s</span>
              </div>
              <div className="retention-row">
                <span className="retention-key">logcat, dmesg</span>
                <span className="retention-value">continuous, 2 GB ring</span>
              </div>
              <div className="retention-row">
                <span className="retention-key">Bugreport</span>
                <span className="retention-value">on reboot, ANR, crash</span>
              </div>
              <div className="retention-row">
                <span className="retention-key">Perfetto trace</span>
                <span className="retention-value">on ANR</span>
              </div>
              <div className="retention-row">
                <span className="retention-key">Retention</span>
                <span className="retention-value">90 days</span>
              </div>
            </div>

            <button 
              className="btn-download-logs" 
              onClick={handleDownloadAllLogs}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download all logs (4.1 GB)
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Toast */}
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

      {/* Modal 1: Log Viewer Modal */}
      {activeModal === 'logs' && SAMPLE_LOGS[modalLogKey] && (
        <div className="monitoring-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="monitoring-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="monitoring-modal-header">
              <div>
                <h3>{SAMPLE_LOGS[modalLogKey].title}</h3>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  Captured at: {SAMPLE_LOGS[modalLogKey].timestamp}
                </span>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>
            <div className="monitoring-modal-body">
              <div className="log-terminal">
                {SAMPLE_LOGS[modalLogKey].lines.map((ln, i) => (
                  <div key={i} className={
                    ln.type === 'err' ? 'log-err' : 
                    ln.type === 'warn' ? 'log-warn' : 
                    ln.type === 'info' ? 'log-info' : ''
                  }>
                    {ln.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="monitoring-modal-footer">
              <button 
                className="finding-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(SAMPLE_LOGS[modalLogKey].lines.map(l => l.text).join('\n'));
                  showToast('Log contents copied to clipboard');
                }}
              >
                Copy to clipboard
              </button>
              <button 
                className="btn btn-primary" 
                style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '6px' }}
                onClick={() => setActiveModal(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Create Bug Modal */}
      {activeModal === 'createBug' && (
        <div className="monitoring-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="monitoring-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="monitoring-modal-header">
              <h3>Create Defect Ticket</h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateBugSubmit}>
              <div className="monitoring-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Issue Summary</label>
                  <input 
                    type="text" 
                    value={bugForm.title} 
                    onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }} 
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Component</label>
                    <input 
                      type="text" 
                      value={bugForm.component} 
                      onChange={(e) => setBugForm({ ...bugForm, component: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Severity</label>
                    <select 
                      value={bugForm.severity}
                      onChange={(e) => setBugForm({ ...bugForm, severity: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    >
                      <option>Critical - P0</option>
                      <option>High - P1</option>
                      <option>High - P2</option>
                      <option>Medium - P3</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Investigation Context</label>
                  <textarea 
                    rows={4}
                    value={bugForm.notes} 
                    onChange={(e) => setBugForm({ ...bugForm, notes: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', fontFamily: 'inherit' }} 
                  />
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                  📎 <strong>Attached:</strong> soak-1045-meminfo.dump, bugreport.zip (822 MB system PSS trace)
                </div>
              </div>
              <div className="monitoring-modal-footer">
                <button type="button" className="finding-btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '6px' }}>Create Jira Bug</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Thermal Comparison Modal */}
      {activeModal === 'compareThermal' && (
        <div className="monitoring-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="monitoring-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="monitoring-modal-header">
              <h3>Thermal Profile Comparison</h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="monitoring-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Current Soak (Build 0923)</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#dc2626', marginTop: '4px' }}>46.2 °C</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Triggered during PTT call while on 18W QC fast charge.
                  </div>
                </div>
                <div style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Prior Soak (Build 0919)</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#2563eb', marginTop: '4px' }}>42.0 °C</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Peak recorded during Day 4 audio streaming.
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
                <p><strong>Analysis:</strong> Build 0923 introduces a <strong>+4.2 °C delta</strong> under identical charging current and network conditions. Kernel thermal governor did not throttle core frequencies until sensor reached 46.0 °C.</p>
              </div>
            </div>
            <div className="monitoring-modal-footer">
              <button className="finding-btn" onClick={() => openLogViewer('thermal')}>View Thermal Log</button>
              <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '6px' }} onClick={() => setActiveModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Add Alert Rule Modal */}
      {activeModal === 'addRule' && (
        <div className="monitoring-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="monitoring-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="monitoring-modal-header">
              <h3>Add Alert Rule</h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddRuleSubmit}>
              <div className="monitoring-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Rule Condition / Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CPU > 90% for 3 min" 
                    value={newRuleName} 
                    onChange={(e) => setNewRuleName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Action & Destination</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Slack #relay-qa & email test-leads@relay.go" 
                    value={newRuleDesc} 
                    onChange={(e) => setNewRuleDesc(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }} 
                  />
                </div>
              </div>
              <div className="monitoring-modal-footer">
                <button type="button" className="finding-btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '6px' }}>Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: All 23 Events Drawer Modal */}
      {activeModal === 'eventDrawer' && (
        <div className="monitoring-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="monitoring-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="monitoring-modal-header">
              <h3>All Soak Events (23)</h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="monitoring-modal-body" style={{ maxHeight: '420px' }}>
              <div className="event-log-list">
                <div className="event-log-item">
                  <span className="event-dot blue"></span>
                  <div className="event-content">
                    <div className="event-title">Wi-Fi disconnect, reconnected in 4 s</div>
                    <div className="event-meta">Sep 26 01:34 · <span className="event-link" onClick={() => openLogViewer('logcat')}>logcat</span></div>
                  </div>
                </div>
                <div className="event-log-item">
                  <span className="event-dot amber"></span>
                  <div className="event-content">
                    <div className="event-title">ANR in com.relay.ptt (input dispatch)</div>
                    <div className="event-meta">Sep 25 19:36 · <span className="event-link" onClick={() => openLogViewer('traces_input')}>traces</span></div>
                  </div>
                </div>
                <div className="event-log-item">
                  <span className="event-dot amber"></span>
                  <div className="event-content">
                    <div className="event-title">Temperature 46.2 °C, above 45 °C for 6 min</div>
                    <div className="event-meta">Sep 25 05:17 · <span className="event-link" onClick={() => openLogViewer('thermal')}>thermal log</span></div>
                  </div>
                </div>
                <div className="event-log-item">
                  <span className="event-dot red"></span>
                  <div className="event-content">
                    <div className="event-title">Unexpected reboot, reason: watchdog</div>
                    <div className="event-meta">Sep 25 02:52 · <span className="event-link" onClick={() => openLogViewer('bugreport')}>bugreport</span></div>
                  </div>
                </div>
                <div className="event-log-item">
                  <span className="event-dot red"></span>
                  <div className="event-content">
                    <div className="event-title">Kernel: soft lockup on CPU3</div>
                    <div className="event-meta">Sep 25 02:34 · <span className="event-link" onClick={() => openLogViewer('last_kmsg')}>last_kmsg</span></div>
                  </div>
                </div>
                <div className="event-log-item">
                  <span className="event-dot amber"></span>
                  <div className="event-content">
                    <div className="event-title">ANR in com.relay.ptt (service timeout)</div>
                    <div className="event-meta">Sep 24 06:24 · <span className="event-link" onClick={() => openLogViewer('traces_service')}>traces</span></div>
                  </div>
                </div>
                <div className="event-log-item">
                  <span className="event-dot blue"></span>
                  <div className="event-content">
                    <div className="event-title">Wi-Fi roaming handoff to AP-02 (-68 dBm)</div>
                    <div className="event-meta">Sep 24 01:12 · <span className="event-link" onClick={() => openLogViewer('logcat')}>logcat</span></div>
                  </div>
                </div>
                <div className="event-log-item">
                  <span className="event-dot blue"></span>
                  <div className="event-content">
                    <div className="event-title">Full battery charge cycle completed (100%)</div>
                    <div className="event-meta">Sep 23 23:40 · <span className="event-link" onClick={() => openLogViewer('logcat')}>logcat</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="monitoring-modal-footer">
              <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '6px' }} onClick={() => setActiveModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitoring;
