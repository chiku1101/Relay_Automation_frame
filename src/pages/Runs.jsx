import React, { useState } from 'react';
import { 
  Play, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Smartphone, 
  RotateCcw, 
  Terminal, 
  ChevronRight, 
  X, 
  Activity,
  Layers,
  StopCircle,
  FileText,
  Zap,
  Gauge
} from 'lucide-react';
import { Badge, SearchInput, StatCard, Tabs, Modal, Button } from '../components/ui';

const INITIAL_RUNS = [
  {
    id: '#1048',
    name: 'PTT Audio Latency & VoIP Jitter Soak',
    plan: 'PTT Audio & Network Stress (4 steps)',
    devices: ['Relay X-002 (Soak Chamber B)'],
    build: '2.4.1-rc3 (0926)',
    status: 'running',
    progress: 74,
    stepCurrent: 'Step 8 of 12: 5,000 PTT Pings under 10% Packet Loss',
    duration: '42m 18s',
    remaining: '~14m left',
    triggeredBy: 'Manual by C. Sonar',
    passCount: 142,
    failCount: 1,
    skipCount: 0
  },
  {
    id: '#1047',
    name: 'Nightly Regression Matrix · Fleet Tier 1',
    plan: 'Nightly Regression · Relay fleet (9 steps)',
    devices: ['Relay X-001 (Bench A)', 'Relay M-002 (CAN Jig)'],
    build: '2.4.0 (0926)',
    status: 'passed',
    progress: 100,
    stepCurrent: 'Complete · 345/350 passed',
    duration: '1h 40m',
    remaining: 'Finished',
    triggeredBy: 'Schedule Daily 01:00 UTC',
    passCount: 345,
    failCount: 5,
    skipCount: 0
  },
  {
    id: '#1046',
    name: 'OTA Fastboot & Recovery Delta Flash Cycle',
    plan: 'OTA 2.3.9 -> 2.4.0 verification (6 steps)',
    devices: ['Relay X-001 (Bench A)'],
    build: '2.4.0 (0926)',
    status: 'passed',
    progress: 100,
    stepCurrent: 'Complete · 24/24 passed',
    duration: '38m 12s',
    remaining: 'Finished',
    triggeredBy: 'Jenkins CI webhook · build 0926',
    passCount: 24,
    failCount: 0,
    skipCount: 0
  },
  {
    id: '#1045',
    name: '7-Day Continuous Memory Leak & Wi-Fi Soak',
    plan: '7-Day Hardware & Memory Stability (4 steps)',
    devices: ['Relay X-002 (Soak Chamber B)'],
    build: '2.4.0 (0925)',
    status: 'failed',
    progress: 68,
    stepCurrent: 'Halted: Watchdog bark CPU3 reboot detected',
    duration: '46h 12m',
    remaining: 'Aborted',
    triggeredBy: 'Hardware Lab Soak Schedule',
    passCount: 812,
    failCount: 1,
    skipCount: 0
  },
  {
    id: '#1044',
    name: 'Thermal Throttling & 18W Fast Charge Matrix',
    plan: 'Thermal & Power Stress Suite (5 steps)',
    devices: ['Relay X-003 (Lab Bay C)'],
    build: '2.4.0 (0925)',
    status: 'failed',
    progress: 100,
    stepCurrent: 'Failed: Peak 46.2°C exceeded 45.0°C safety cap',
    duration: '2h 15m',
    remaining: 'Finished',
    triggeredBy: 'PR #482 Merge to main',
    passCount: 31,
    failCount: 2,
    skipCount: 0
  },
  {
    id: '#1043',
    name: 'CAN Bus Peripheral Frame Ingestion & Echo',
    plan: 'CAN Protocol & Hardware Rig Echo (8 steps)',
    devices: ['Relay M-002 (CAN Jig)'],
    build: '1.12.4 (FreeRTOS)',
    status: 'passed',
    progress: 100,
    stepCurrent: 'Complete · 88/88 passed',
    duration: '18m 40s',
    remaining: 'Finished',
    triggeredBy: 'GitLab CI commit #b4198cc',
    passCount: 88,
    failCount: 0,
    skipCount: 0
  },
  {
    id: '#1049',
    name: 'Kernel Driver Deep Sleep / Low-Power S2',
    plan: 'Power State & Wake-on-LAN (4 steps)',
    devices: ['Relay X-001 (Bench A)'],
    build: '2.4.1-rc3 (0926)',
    status: 'queued',
    progress: 0,
    stepCurrent: 'Queued · Waiting for Bench A lock release',
    duration: '--',
    remaining: 'Starts in ~12m',
    triggeredBy: 'Schedule Daily 04:00 UTC',
    passCount: 0,
    failCount: 0,
    skipCount: 0
  }
];

const Runs = () => {
  const [runs, setRuns] = useState(INITIAL_RUNS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRunLog, setSelectedRunLog] = useState(null);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [newRunPlan, setNewRunPlan] = useState('nightly');
  const [newRunDevice, setNewRunDevice] = useState('x001');

  const filteredRuns = runs.filter(run => {
    const matchesFilter = filter === 'all' || run.status === filter;
    const matchesSearch = 
      run.id.toLowerCase().includes(search.toLowerCase()) ||
      run.name.toLowerCase().includes(search.toLowerCase()) ||
      run.plan.toLowerCase().includes(search.toLowerCase()) ||
      run.devices.some(d => d.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleTriggerNewRun = () => {
    const newRun = {
      id: `#10${Math.floor(50 + Math.random() * 40)}`,
      name: newRunPlan === 'nightly' ? 'Nightly Regression Suite' : newRunPlan === 'ptt' ? 'PTT Audio Latency Matrix' : 'Fastboot Flash & Sanity',
      plan: newRunPlan === 'nightly' ? 'Nightly Regression · 9 steps' : 'PTT Stress · 4 steps',
      devices: [newRunDevice === 'x001' ? 'Relay X-001 (Bench A)' : 'Relay M-002 (CAN Jig)'],
      build: '2.4.1-rc3 (0926)',
      status: 'running',
      progress: 5,
      stepCurrent: 'Step 1 of 8: Fastboot bootloader verification',
      duration: '0m 35s',
      remaining: '~25m left',
      triggeredBy: 'Manual by C. Sonar',
      passCount: 4,
      failCount: 0,
      skipCount: 0
    };
    setRuns([newRun, ...runs]);
    setShowTriggerModal(false);
  };

  const tabsConfig = [
    { id: 'all', label: 'All Executions', count: runs.length },
    { id: 'running', label: 'Running', count: runs.filter(r => r.status === 'running').length },
    { id: 'passed', label: 'Passed', count: runs.filter(r => r.status === 'passed').length },
    { id: 'failed', label: 'Failed', count: runs.filter(r => r.status === 'failed').length },
    { id: 'queued', label: 'Queued', count: runs.filter(r => r.status === 'queued').length }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Origin UI Inspired Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <StatCard
          label="Active Executions"
          value="2 Running · 1 Queued"
          description="Concurrency: 2/4 Bench Bay slots"
          icon={Play}
          accentColor="#38bdf8"
          trend={{ type: 'up', text: 'ACTIVE' }}
        />
        <StatCard
          label="Executions (24h)"
          value="42 Runs"
          description="1,284 total test cases across fleet"
          icon={Layers}
          accentColor="#60a5fa"
          trend={{ type: 'up', text: '+14%' }}
        />
        <StatCard
          label="Fleet Pass Rate"
          value="95.1%"
          description="1,221 pass · 51 fail · 12 skip"
          icon={CheckCircle2}
          accentColor="#34d399"
          trend={{ type: 'down', text: '-1.2 pts' }}
        />
        <StatCard
          label="Average Duration"
          value="46 min"
          description="p95: 1h 40m · p50: 24m"
          icon={Clock}
          accentColor="#fbbf24"
        />
      </div>

      {/* Origin UI Segmented Filter and Search Bar */}
      <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <Tabs
          tabs={tabsConfig}
          activeTab={filter}
          onChange={setFilter}
          variant="segmented"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search run ID, plan or device..."
            shortcut="⌘F"
            width="280px"
          />
          <Button 
            variant="secondary"
            size="md"
            icon={RotateCcw}
            onClick={() => setRuns([...INITIAL_RUNS])}
          >
            Reset
          </Button>
          <Button 
            variant="primary"
            size="md"
            icon={Play}
            onClick={() => setShowTriggerModal(true)}
          >
            Trigger Fleet Run
          </Button>
        </div>
      </div>

      {/* Runs Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 20px' }}>RUN ID & TEST NAME</th>
              <th style={{ padding: '12px 20px' }}>PLAN & BUILD</th>
              <th style={{ padding: '12px 20px' }}>TARGET HARDWARE</th>
              <th style={{ padding: '12px 20px', width: '220px' }}>STATUS & PROGRESS</th>
              <th style={{ padding: '12px 20px' }}>DURATION</th>
              <th style={{ padding: '12px 20px' }}>TRIGGERED BY</th>
              <th style={{ padding: '12px 20px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredRuns.map((run) => (
              <tr key={run.id}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      fontFamily: 'var(--font-mono)', 
                      fontWeight: '800', 
                      color: '#38bdf8',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {run.id}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9' }}>
                        {run.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                        {run.stepCurrent}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12.5px', color: '#cbd5e1', fontWeight: '500' }}>
                      {run.plan}
                    </span>
                    <span style={{ fontSize: '11px', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                      Build {run.build}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {run.devices.map((dev, idx) => (
                      <span key={idx} style={{ 
                        fontSize: '11.5px', 
                        color: '#94a3b8', 
                        fontFamily: 'var(--font-mono)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Smartphone size={12} color="#38bdf8" /> {dev}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Badge
                        variant={run.status === 'running' ? 'primary' : run.status === 'passed' ? 'success' : run.status === 'failed' ? 'danger' : 'neutral'}
                        pulse={run.status === 'running'}
                        size="sm"
                      >
                        {run.status === 'running' ? 'In Progress' : run.status}
                      </Badge>
                      <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                        {run.progress}%
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: '5px' }}>
                      <div 
                        className={`progress-fill ${run.status === 'failed' ? 'failed' : ''}`}
                        style={{ width: `${run.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontFamily: 'var(--font-mono)', fontSize: '11.5px' }}>
                    <span style={{ color: '#f1f5f9' }}>{run.duration}</span>
                    <span style={{ color: '#64748b' }}>{run.remaining}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: '12px', color: '#8896b3' }}>
                    {run.triggeredBy}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button 
                      variant="secondary"
                      size="sm"
                      icon={Terminal}
                      onClick={() => setSelectedRunLog(run)}
                    >
                      Live Logs
                    </Button>
                    {run.status === 'failed' && (
                      <Button 
                        variant="outline"
                        size="sm"
                        icon={RotateCcw}
                        style={{ padding: '0 8px', color: '#fbbf24' }}
                        title="Rerun Failed Cases"
                        onClick={() => alert(`Rerunning failed test cases for ${run.id}...`)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Origin UI Modal for Live Execution Console */}
      {selectedRunLog && (
        <Modal
          isOpen={!!selectedRunLog}
          onClose={() => setSelectedRunLog(null)}
          title={`Live Hardware Execution Console · ${selectedRunLog.id}`}
          description={`Real-time ADB stream from ${selectedRunLog.devices[0]} on Build ${selectedRunLog.build}`}
          icon={Terminal}
          iconColor="#38bdf8"
          maxWidth="720px"
          footer={
            <>
              <Button variant="outline" size="md" onClick={() => setSelectedRunLog(null)}>
                Close
              </Button>
              <Button 
                variant="primary" 
                size="md"
                onClick={() => alert(`Full execution log bundle for ${selectedRunLog.id} exported.`)}
              >
                Download Raw Logcat
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Transport: <strong style={{ color: '#f1f5f9' }}>USB-C High-Speed</strong> · Daemon: <strong style={{ color: '#38bdf8' }}>v2.4.1</strong>
              </div>
              <Badge variant="success" pulse size="sm">
                Streaming
              </Badge>
            </div>

            <div className="log-terminal" style={{ maxHeight: '320px' }}>
              <div className="log-info">[RUN-ORCHESTRATOR] Initializing hardware session on {selectedRunLog.devices[0]}</div>
              <div className="log-info">[ADB-DAEMON] Connected to 192.168.10.42:5555 · Transport: USB-C High-Speed</div>
              <div>09-26 01:34:02.109 I/Fastboot: Fastboot bootloader signature valid (HSM verified)</div>
              <div>09-26 01:34:04.221 I/RelayKernel: Linux version 5.10.149-android12-9 (gcc version 10.2.1)</div>
              <div>09-26 01:34:08.112 I/wpa_supplicant: wlan0: Associated with 74:ac:b9:42:11:80 (Relay-Mesh-QA-5G)</div>
              <div>09-26 01:34:11.830 I/ConnectivityService: NetworkAgentInfo [WIFI () - 105] connected, validation passed</div>
              <div className="log-info">[TEST-RUNNER] Executing Robot Framework Suite: PttAudioEngineStress.robot</div>
              <div>09-26 01:34:15.012 I/PttAudioEngine: AudioTrack buffer initialized (1920 frames @ 48000Hz, Opus 20ms)</div>
              <div>09-26 01:34:20.400 I/PttAudioEngine: PTT button depressed via hardware GPIO line #44</div>
              <div className="log-warn">09-26 01:34:22.110 W/ThermalEngine: Sensor quiet-therm rising: 42.4 C (ambient 23.0 C)</div>
              <div>09-26 01:34:25.991 I/PttAudioEngine: Audio latency assertion: TX-to-Air 38ms (Threshold &lt; 60ms: PASS)</div>
              {selectedRunLog.status === 'failed' ? (
                <>
                  <div className="log-err">09-26 01:34:38.109 E/KernelWatchdog: Watchdog bark: CPU3 stuck in soft lockup!</div>
                  <div className="log-err">[FAIL] Execution aborted due to hardware reboot</div>
                </>
              ) : (
                <div className="log-info">[STATUS] Step execution proceeding nominally · 0 assertion failures</div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Origin UI Modal for Trigger Run */}
      {showTriggerModal && (
        <Modal
          isOpen={showTriggerModal}
          onClose={() => setShowTriggerModal(false)}
          title="Trigger Hardware Suite Execution"
          description="Provision a target hardware bench node and initiate test execution"
          icon={Play}
          iconColor="#38bdf8"
          maxWidth="520px"
          footer={
            <>
              <Button variant="outline" size="md" onClick={() => setShowTriggerModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="md"
                icon={Play}
                onClick={handleTriggerNewRun}
              >
                Launch Execution
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Select Test Plan / Suite
              </label>
              <select 
                className="select-input" 
                value={newRunPlan}
                onChange={e => setNewRunPlan(e.target.value)}
                style={{ width: '100%', height: '38px' }}
              >
                <option value="nightly">Nightly Regression Suite · Relay fleet (9 steps)</option>
                <option value="ptt">PTT Audio Latency & VoIP Jitter Matrix (4 steps)</option>
                <option value="fastboot">OTA Fastboot Flash & Bootloader Sanity (6 steps)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Target Hardware Device
              </label>
              <select 
                className="select-input" 
                value={newRunDevice}
                onChange={e => setNewRunDevice(e.target.value)}
                style={{ width: '100%', height: '38px' }}
              >
                <option value="x001">Relay Hub X-001 (Bench Bay A · Online & Ready)</option>
                <option value="m002">Relay Micro M-002 (Bench Bay A CAN Jig · Online)</option>
                <option value="x002">Relay Hub X-002 (Soak Chamber B · Warning: Soak active)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Firmware Build Package
              </label>
              <select className="select-input" style={{ width: '100%', height: '38px' }}>
                <option value="rc3">RelayOS 2.4.1-rc3 (Build 0926 · Latest RC)</option>
                <option value="stable">RelayOS 2.4.0 (Build 0919 · Golden Stable)</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Runs;
