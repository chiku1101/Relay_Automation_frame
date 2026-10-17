import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Download, 
  ExternalLink, 
  FileText, 
  Flame, 
  Layers, 
  Plus, 
  Radio, 
  RefreshCw, 
  ShieldAlert, 
  Terminal, 
  Wifi, 
  X,
  Zap
} from 'lucide-react';

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
    title: 'last_kmsg (CPU3 soft lockup trace)',
    timestamp: '2026-09-25 02:34:55.100',
    lines: [
      { type: 'info', text: '02:34:20.100 [sched] CPU3: scheduling PttAudioEngine task' },
      { type: 'warn', text: '02:34:40.102 [lockup] watchdog: BUG: soft lockup - CPU#3 stuck for 22s! [PttAudioEngine:618]' },
      { type: 'err', text: '02:34:44.103 [lockup] Modules linked in: wlan(O) rmnet_perf(O) audio_prm(O)' },
      { type: 'err', text: '02:34:48.104 [panic] Kernel panic - not syncing: softlockup: hung tasks' }
    ]
  },
  traces_service: {
    title: 'traces.txt (service timeout in PttKeepalive)',
    timestamp: '2026-09-24 06:24:11.890',
    lines: [
      { type: 'warn', text: '06:24:08.100 [ActivityManager] Timeout executing service: ServiceRecord{4a180 com.relay.ptt/.service.PttKeepaliveService}' },
      { type: 'err', text: '06:24:11.890 [ANRManager] ANR in com.relay.ptt: Broadcast of Intent { act=com.relay.action.HEARTBEAT }' }
    ]
  }
};

const Monitoring = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalLogKey, setModalLogKey] = useState('logcat');
  const [toastMessage, setToastMessage] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const [alertRules, setAlertRules] = useState([
    { id: 1, name: 'Reboot occurs', desc: 'Slack #relay-hw-alerts, page oncall', enabled: true },
    { id: 2, name: 'ANR or crash in com.relay.*', desc: 'File bug, attach bugreport', enabled: true },
    { id: 3, name: 'Temperature > 45 °C for > 5 min', desc: 'Slack #relay-hw-alerts', enabled: true },
    { id: 4, name: 'Battery drop > 15% / h while charging', desc: 'Slack #relay-hw-alerts', enabled: false },
    { id: 5, name: 'Wi-Fi disconnect during idle', desc: 'Log event only', enabled: true }
  ]);

  const [bugForm, setBugForm] = useState({
    title: '[Soak Defect] System PSS leak +16MB/day during continuous PTT loop',
    component: 'com.relay.ptt',
    severity: 'High - P2',
    notes: 'Observed continuous linear slope in PSS during 7-day soak on Relay X-002. Build 2.4.0 (0923).'
  });

  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const openLogViewer = (key) => {
    setModalLogKey(key);
    setActiveModal('logs');
  };

  const toggleRule = (id) => {
    setAlertRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    showToast('Alert rule preference updated');
  };

  const handleDownloadAllLogs = () => {
    showToast('Preparing 4.1 GB telemetry archive (logcat, bugreport, traces.txt)...');
    setTimeout(() => {
      showToast('Download started: relay-soak-x002-telemetry-archive.tar.gz');
    }, 1200);
  };

  const handleCreateBugSubmit = (e) => {
    e.preventDefault();
    setActiveModal(null);
    showToast(`Created Jira Defect RELAY-4921: "${bugForm.title}"`);
  };

  const handleAddRuleSubmit = (e) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;
    const newRule = {
      id: alertRules.length + 1,
      name: newRuleName,
      desc: newRuleDesc || 'Custom alert channel',
      enabled: true
    };
    setAlertRules([...alertRules, newRule]);
    setActiveModal(null);
    setNewRuleName('');
    setNewRuleDesc('');
    showToast('New hardware alert rule enabled');
  };

  const timelineEvents = [
    { id: 'anr1', x: 232, label: 'ANR', type: 'anr', logKey: 'traces_service', time: 'Sep 24 06:24', desc: 'ANR in com.relay.ptt (service timeout)' },
    { id: 'reboot', x: 300, label: 'Reboot', type: 'reboot', logKey: 'bugreport', time: 'Sep 25 02:52', desc: 'Watchdog bark: CPU3 stuck in soft lockup' },
    { id: 'thermal', x: 318, label: '46.2°C', type: 'thermal', logKey: 'thermal', time: 'Sep 25 05:17', desc: 'Temperature peaked at 46.2 °C' },
    { id: 'anr2', x: 358, label: 'ANR', type: 'anr', logKey: 'traces_input', time: 'Sep 25 19:36', desc: 'ANR in com.relay.ptt (input dispatch)' }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-slate-100 px-4 py-2.5 rounded-xl text-xs font-medium shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Telemetry Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between shadow-lg">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Uptime since boot</div>
          <div className="text-xl font-bold font-mono text-slate-100 my-1">23 h 50 m</div>
          <div className="text-[11px] font-mono text-slate-500">Soak elapsed 2 d 4 h</div>
        </div>

        <div className="bg-[#0e1422] border border-rose-500/30 rounded-xl p-4 flex flex-col justify-between shadow-lg">
          <div className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold">Unexpected Reboots</div>
          <div className="text-xl font-bold font-mono text-rose-400 my-1">1</div>
          <div className="text-[11px] font-mono text-rose-300/80">Sep 25 02:52 · watchdog</div>
        </div>

        <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between shadow-lg">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">ANRs / Crashes</div>
          <div className="text-xl font-bold font-mono text-amber-400 my-1">2 / 0</div>
          <div className="text-[11px] font-mono text-slate-500">Both in com.relay.ptt</div>
        </div>

        <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between shadow-lg">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Peak Temperature</div>
          <div className="text-xl font-bold font-mono text-amber-400 my-1">46.2 °C</div>
          <div className="text-[11px] font-mono text-amber-400/80 font-semibold">Above 45 °C for 6 min</div>
        </div>

        <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between shadow-lg">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Memory Trend</div>
          <div className="text-xl font-bold font-mono text-amber-400 my-1">+16 MB/day</div>
          <div className="text-[11px] font-mono text-amber-400/80 font-semibold">Possible slow leak</div>
        </div>

        <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between shadow-lg">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Wi-Fi Disconnects</div>
          <div className="text-xl font-bold font-mono text-slate-100 my-1">7</div>
          <div className="text-[11px] font-mono text-slate-500">5 during idle sleep</div>
        </div>
      </div>

      {/* Main 2-Column Telemetry Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Timeline Chart & Automated Findings (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Timeline Chart Card */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Activity className="size-4 text-blue-400" />
                  Soak Timeline Matrix · Sep 23 22:00 – Sep 30 22:00
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Continuous telemetry sampling across memory PSS, quiet-therm, and battery rail.</p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-blue-500 rounded" />
                  <span>Build 0923 (Active)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-t border-dashed border-slate-500" />
                  <span>Build 0919 Baseline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-t border-dotted border-rose-500" />
                  <span>Safety Limit</span>
                </div>
              </div>
            </div>

            {/* SVG Timeline Chart */}
            <div className="w-full overflow-x-auto bg-slate-950 border border-slate-800/80 rounded-xl p-2">
              <svg 
                className="w-full min-w-[700px] h-72" 
                viewBox="0 0 880 430"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const svgX = ((e.clientX - rect.left) / rect.width) * 880;
                  if (svgX >= 160 && svgX <= 840) {
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
                {/* Y Axis Guide Lines */}
                <line x1="160" y1="20" x2="840" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="160" y1="100" x2="840" y2="100" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="160" y1="180" x2="840" y2="180" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="160" y1="260" x2="840" y2="260" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="160" y1="340" x2="840" y2="340" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Y Axis Labels */}
                <text x="140" y="55" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="end" fontFamily="var(--font-mono)">Memory (PSS)</text>
                <text x="140" y="70" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">MB / day</text>
                
                <text x="140" y="135" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="end" fontFamily="var(--font-mono)">quiet-therm</text>
                <text x="140" y="150" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">°C sensor</text>

                <text x="140" y="215" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="end" fontFamily="var(--font-mono)">Battery SOC</text>
                <text x="140" y="230" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">% remaining</text>

                <text x="140" y="295" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="end" fontFamily="var(--font-mono)">PTT duty cycle</text>
                <text x="140" y="310" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">tx / rx / idle</text>

                {/* Paths: Memory */}
                <path d="M 160 65 L 210 63 L 260 61 L 310 59 L 360 56 L 375 55" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                <path d="M 160 67 L 210 65 L 260 64 L 310 63 L 360 61 L 840 45" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Paths: Thermal */}
                <line x1="160" y1="125" x2="840" y2="125" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 160 148 L 195 146 L 220 140 L 250 142 L 285 136 L 305 138 L 318 122 L 335 144 L 375 141" fill="none" stroke="#3b82f6" strokeWidth="2" />

                {/* Paths: Battery */}
                <path d="M 160 225 L 208 221 L 210 223 L 265 217 L 268 220 L 318 214 L 322 216 L 375 210" fill="none" stroke="#3b82f6" strokeWidth="2" />

                {/* Event Markers on Timeline */}
                {timelineEvents.map((ev) => (
                  <g key={ev.id} onClick={() => openLogViewer(ev.logKey)} className="cursor-pointer group">
                    <rect 
                      x={ev.x - 18} 
                      y="342" 
                      width="36" 
                      height="18" 
                      rx="4" 
                      fill={ev.type === 'thermal' ? '#ef4444' : ev.type === 'reboot' ? '#dc2626' : '#f59e0b'} 
                      className="transition-transform group-hover:scale-105"
                    />
                    <text x={ev.x} y="355" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                      {ev.label}
                    </text>
                  </g>
                ))}

                {/* NOW Line */}
                <line x1="375" y1="20" x2="375" y2="395" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 2" />
                <text x="375" y="16" fill="#ef4444" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">● NOW</text>

                {/* Days axis labels */}
                {['D1 - Sep 23', 'D2 - Sep 24', 'D3 - Sep 25', 'D4 - Sep 26', 'D5 - Sep 27', 'D6 - Sep 28', 'D7 - Sep 29'].map((day, idx) => (
                  <text key={day} x={175 + idx * 105} y="416" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)">
                    {day}
                  </text>
                ))}

                {/* Tooltip Cursor */}
                {hoveredPoint && (
                  <g>
                    <line x1={hoveredPoint.x} y1="20" x2={hoveredPoint.x} y2="395" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={hoveredPoint.x} cy="56" r="3" fill="#2563eb" />
                    <rect x={Math.min(hoveredPoint.x + 8, 740)} y="40" width="105" height="36" rx="4" fill="#0f172a" stroke="#334155" />
                    <text x={Math.min(hoveredPoint.x + 16, 748)} y="54" fill="#f8fafc" fontSize="10" fontWeight="600">
                      {hoveredPoint.label}
                    </text>
                    <text x={Math.min(hoveredPoint.x + 16, 748)} y="68" fill="#93c5fd" fontSize="9">
                      {hoveredPoint.isPastNow ? 'Projected Reference' : 'Live Sensor Data'}
                    </text>
                  </g>
                )}
              </svg>
            </div>

            <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
              <span>Hover across matrix to inspect time slices. Click markers to jump to relevant log artifacts.</span>
              <button onClick={() => openLogViewer('logcat')} className="text-blue-400 hover:text-blue-300 font-medium">
                Open raw logcat →
              </button>
            </div>
          </div>

          {/* Automated Findings Cards */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Automated Soak Findings</h3>
                <p className="text-xs text-slate-500 font-mono">Proactively flagged by the hardware anomaly detection model</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
                3 anomalies
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Finding 1 */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/30 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
                    Memory Leak
                  </span>
                  <div className="text-xs font-semibold text-slate-200 leading-snug">
                    System PSS grows ~16 MB/day during PTT loop
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Highest contributor: com.relay.ptt (+11 MB/day)
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal('createBug')}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
                >
                  Create Jira Defect
                </button>
              </div>

              {/* Finding 2 */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-rose-500/30 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold uppercase">
                    Kernel Stability
                  </span>
                  <div className="text-xs font-semibold text-slate-200 leading-snug">
                    Reboot after CPU3 soft lockup in audio router
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    last_kmsg and watchdog dump captured
                  </div>
                </div>
                <button
                  onClick={() => openLogViewer('last_kmsg')}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
                >
                  Inspect Panic Log
                </button>
              </div>

              {/* Finding 3 */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/30 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
                    Thermal Spike
                  </span>
                  <div className="text-xs font-semibold text-slate-200 leading-snug">
                    Peak 46.2 °C during 18W QC fast charge
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    CPU throttled to 1.6 GHz to clear threshold
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal('compareThermal')}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
                >
                  Compare Thermal Baseline
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Events, Alerts, Retention (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Recent Event Log */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Hardware Event Stream</h3>
              <button
                onClick={() => setActiveModal('eventDrawer')}
                className="text-xs text-blue-400 hover:text-blue-300 font-mono"
              >
                All 23 events →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-200 font-medium">Wi-Fi disconnect, reconnected in 4.2 s</div>
                  <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                    Sep 26 01:34 · <span className="text-blue-400 hover:underline cursor-pointer" onClick={() => openLogViewer('logcat')}>logcat</span>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-200 font-medium">ANR in com.relay.ptt (input dispatch)</div>
                  <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                    Sep 25 19:36 · <span className="text-blue-400 hover:underline cursor-pointer" onClick={() => openLogViewer('traces_input')}>traces.txt</span>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-200 font-medium">Unexpected reboot: watchdog timeout</div>
                  <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                    Sep 25 02:52 · <span className="text-blue-400 hover:underline cursor-pointer" onClick={() => openLogViewer('bugreport')}>bugreport</span>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-200 font-medium">Kernel soft lockup on CPU#3</div>
                  <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                    Sep 25 02:34 · <span className="text-blue-400 hover:underline cursor-pointer" onClick={() => openLogViewer('last_kmsg')}>last_kmsg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Alert Rules */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Alert Triggers</h3>
              <button
                onClick={() => setActiveModal('addRule')}
                className="px-2 py-0.5 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-mono border border-blue-500/30"
              >
                + Add Rule
              </button>
            </div>

            <div className="space-y-2">
              {alertRules.map((rule) => (
                <div key={rule.id} className="p-2 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-slate-200 truncate">{rule.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">{rule.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRule(rule.id)}
                    className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors shrink-0 ${
                      rule.enabled ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
                    }`}
                  >
                    <div className={`bg-white size-3.5 rounded-full shadow-md transform transition-transform ${
                      rule.enabled ? 'translate-x-3.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Storage & Retention */}
          <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Telemetry Storage & Retention</h3>
            <div className="divide-y divide-slate-800/60 text-xs font-mono">
              <div className="py-1.5 flex justify-between text-slate-400">
                <span>Metrics Sampling</span>
                <span className="text-slate-200 font-bold">every 30 s</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-400">
                <span>Ring Buffer (logcat)</span>
                <span className="text-slate-200">2 GB ring / device</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-400">
                <span>Bugreport Dump</span>
                <span className="text-slate-200">On crash / ANR</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-400">
                <span>TTL Retention</span>
                <span className="text-slate-200">90 days</span>
              </div>
            </div>

            <button
              onClick={handleDownloadAllLogs}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-900/30"
            >
              <Download className="size-3.5" /> Download Full Archive (4.1 GB)
            </button>
          </div>

        </div>

      </div>

      {/* Log Viewer Modal */}
      {activeModal === 'logs' && SAMPLE_LOGS[modalLogKey] && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <div className="w-full max-w-2xl bg-[#0a0f1b] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Terminal className="size-4 text-blue-400" />
                  {SAMPLE_LOGS[modalLogKey].title}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Captured at: {SAMPLE_LOGS[modalLogKey].timestamp}
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-300">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-3 bg-black/80 border border-slate-900 rounded-xl max-h-72 overflow-y-auto font-mono text-[11px] space-y-1">
              {SAMPLE_LOGS[modalLogKey].lines.map((ln, idx) => (
                <div key={idx} className={
                  ln.type === 'err' ? 'text-rose-400 font-semibold' :
                  ln.type === 'warn' ? 'text-amber-300' :
                  ln.type === 'info' ? 'text-sky-300' : 'text-slate-400'
                }>
                  {ln.text}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(SAMPLE_LOGS[modalLogKey].lines.map(l => l.text).join('\n'));
                  showToast('Log copied to clipboard');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Jira Bug Modal */}
      {activeModal === 'createBug' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <div className="w-full max-w-lg bg-[#0a0f1b] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="size-4 text-amber-400" /> Create Defect Ticket
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-300">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBugSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Issue Summary</label>
                <input
                  type="text"
                  value={bugForm.title}
                  onChange={e => setBugForm({ ...bugForm, title: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Subsystem Component</label>
                  <input
                    type="text"
                    value={bugForm.component}
                    onChange={e => setBugForm({ ...bugForm, component: e.target.value })}
                    className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Severity</label>
                  <select
                    value={bugForm.severity}
                    onChange={e => setBugForm({ ...bugForm, severity: e.target.value })}
                    className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option>Critical - P0</option>
                    <option>High - P1</option>
                    <option>High - P2</option>
                    <option>Medium - P3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium">Reproduction Notes</label>
                <textarea
                  rows={3}
                  value={bugForm.notes}
                  onChange={e => setBugForm({ ...bugForm, notes: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400">
                📎 Attached: soak-1045-meminfo.dump, bugreport.zip (822 MB trace)
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                >
                  Create Jira Defect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compare Thermal Baseline Modal */}
      {activeModal === 'compareThermal' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <div className="w-full max-w-lg bg-[#0a0f1b] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Flame className="size-4 text-amber-400" /> Thermal Profile Comparison
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-300">
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-1">
                <div className="text-slate-400 font-mono text-[11px]">Current Soak (Build 0923)</div>
                <div className="text-2xl font-bold font-mono text-rose-400">46.2 °C</div>
                <div className="text-slate-500 text-[11px]">Triggered during PTT call while on 18W QC fast charge.</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-blue-500/30 space-y-1">
                <div className="text-slate-400 font-mono text-[11px]">Prior Soak (Build 0919)</div>
                <div className="text-2xl font-bold font-mono text-blue-400">42.0 °C</div>
                <div className="text-slate-500 text-[11px]">Peak recorded during Day 4 continuous audio streaming.</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong>Root cause delta:</strong> Build 0923 introduces a <strong>+4.2 °C delta</strong> under identical charging current. Governor did not step down clock frequency until threshold breached.
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => openLogViewer('thermal')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Inspect Thermal Log
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Alert Rule Modal */}
      {activeModal === 'addRule' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <div className="w-full max-w-md bg-[#0a0f1b] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Plus className="size-4 text-blue-400" /> Add Alert Rule
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-300">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddRuleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Rule Condition / Name</label>
                <input
                  type="text"
                  placeholder="e.g. CPU > 90% for 3 min"
                  value={newRuleName}
                  onChange={e => setNewRuleName(e.target.value)}
                  required
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Notification Destination</label>
                <input
                  type="text"
                  placeholder="e.g. Slack #relay-qa & email test-leads@relay.go"
                  value={newRuleDesc}
                  onChange={e => setNewRuleDesc(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All Events Drawer Modal */}
      {activeModal === 'eventDrawer' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <div className="w-full max-w-lg bg-[#0a0f1b] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-100">All Soak Events (23)</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-300">
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-200 font-medium">Wi-Fi disconnect, reconnected in 4.2 s</div>
                  <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">Sep 26 01:34 · logcat</div>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-200 font-medium">ANR in com.relay.ptt (input dispatch)</div>
                  <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">Sep 25 19:36 · traces.txt</div>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-200 font-medium">Temperature 46.2 °C, above 45 °C for 6 min</div>
                  <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">Sep 25 05:17 · thermal log</div>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-200 font-medium">Unexpected reboot, reason: watchdog</div>
                  <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">Sep 25 02:52 · bugreport</div>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-200 font-medium">Kernel: soft lockup on CPU3</div>
                  <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">Sep 25 02:34 · last_kmsg</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitoring;
