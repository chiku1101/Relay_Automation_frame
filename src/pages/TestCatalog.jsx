import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Layers, 
  CheckSquare, 
  Plus, 
  RefreshCw, 
  SlidersHorizontal, 
  Clock, 
  Cpu, 
  ShieldCheck, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { Badge, Button, Modal, SearchInput } from '../components/ui';

const QUICK_GROUPS = [
  'Device driver', 'Bootloader', 'HAL', 'Framework', 'Connectivity',
  'Stress', 'Soak', 'Power', 'Performance', 'System E2E',
  'Functional · PTT', 'OTA', 'Security', 'Audio'
];

const TAG_FILTERS = [
  'Model: all', 'Android: 13, 16', 'Priority: P1', 'Needs: BT',
  'Needs: SIM', 'Needs: Dock', 'Duration: < 5m'
];

const MATRIX_COLUMNS = [
  { key: 'sanity', label: 'Sanity' },
  { key: 'functional', label: 'Functional' },
  { key: 'stress', label: 'Stress' },
  { key: 'soak', label: 'Soak' },
  { key: 'perf', label: 'Perf' },
  { key: 'power', label: 'Power' },
  { key: 'e2e', label: 'E2E' },
  { key: 'compliance', label: 'Compliance' }
];

const MATRIX_ROWS = [
  { id: 'bootloader', name: 'Bootloader', values: { sanity: 4, functional: 10, stress: 2, soak: null, perf: 2, power: null, e2e: null, compliance: null }, total: 18 },
  { id: 'kernel', name: 'Kernel & Drivers', values: { sanity: 12, functional: 88, stress: 18, soak: 4, perf: 10, power: 6, e2e: null, compliance: 4 }, total: 142 },
  { id: 'hal', name: 'Hardware Abstraction (HAL)', values: { sanity: 4, functional: 26, stress: 4, soak: null, perf: 2, power: 2, e2e: null, compliance: 2 }, total: 40 },
  { id: 'framework', name: 'Android Framework', values: { sanity: 3, functional: 19, stress: 2, soak: null, perf: 2, power: null, e2e: 2, compliance: null }, total: 28 },
  { id: 'system_ui', name: 'System UI / UX', values: { sanity: 2, functional: 12, stress: null, soak: null, perf: 2, power: null, e2e: null, compliance: null }, total: 16 },
  { id: 'connectivity', name: 'RF & Connectivity (5G/Wi-Fi)', values: { sanity: 4, functional: 28, stress: 6, soak: 2, perf: 4, power: 2, e2e: 2, compliance: null }, total: 48 },
  { id: 'audio', name: 'Audio DSP & Codecs', values: { sanity: 1, functional: 7, stress: null, soak: null, perf: 2, power: null, e2e: null, compliance: null }, total: 10 },
  { id: 'ptt', name: 'PTT Fast-Dispatch Service', values: { sanity: 1, functional: 3, stress: null, soak: null, perf: null, power: null, e2e: 1, compliance: null }, total: 5 },
  { id: 'location', name: 'Location & GNSS Tracking', values: { sanity: 1, functional: 4, stress: null, soak: null, perf: 1, power: null, e2e: null, compliance: null }, total: 6 },
  { id: 'accessories', name: 'Accessories (BT/Cradle)', values: { sanity: 1, functional: 6, stress: null, soak: null, perf: null, power: 1, e2e: null, compliance: null }, total: 8 },
  { id: 'ota', name: 'OTA Dual-Slot A/B Update', values: { sanity: 1, functional: 8, stress: 1, soak: null, perf: null, power: null, e2e: 2, compliance: null }, total: 12 },
  { id: 'security', name: 'Security & Keystore (STS)', values: { sanity: 1, functional: 6, stress: null, soak: null, perf: null, power: null, e2e: null, compliance: 5 }, total: 12 },
  { id: 'telephony', name: 'Carrier & VoLTE IMS', isPlanned: true, values: { sanity: null, functional: null, stress: null, soak: null, perf: null, power: null, e2e: null, compliance: null }, total: 0 },
  { id: 'sos', name: 'Emergency SOS & Man-Down', isPlanned: true, values: { sanity: null, functional: null, stress: null, soak: null, perf: null, power: null, e2e: null, compliance: null }, total: 0 },
  { id: 'mdm', name: 'Zero-Touch MDM Enroll', isPlanned: true, values: { sanity: null, functional: null, stress: null, soak: null, perf: null, power: null, e2e: null, compliance: null }, total: 0 },
];

const COLUMN_TOTALS = {
  sanity: 35,
  functional: 217,
  stress: 33,
  soak: 6,
  perf: 25,
  power: 11,
  e2e: 7,
  compliance: 11,
  grandTotal: 345
};

const SAMPLE_KERNEL_STRESS_CASES = [
  { id: 'DRV_I2C_STRESS_022', name: 'DRV_I2C_STRESS_022', desc: 'I2C bus: 10k back-to-back burst transfers without NACK', priority: 'P1', duration: '8 min', models: 'X, M', android: 'A13, A16', checked: true },
  { id: 'DRV_SPI_STRESS_004', name: 'DRV_SPI_STRESS_004', desc: 'SPI flash circular read/write block integrity check', priority: 'P1', duration: '6 min', models: 'X, M', android: 'A13, A16', checked: true },
  { id: 'DRV_USB_STRESS_010', name: 'DRV_USB_STRESS_010', desc: 'USB attach/detach ×500 cycle via hardware relay matrix', priority: 'P2', duration: '12 min', models: 'X', android: 'A16', checked: true },
  { id: 'DRV_GPIO_PTTKEY_003', name: 'DRV_GPIO_PTTKEY_003', desc: 'PTT key interrupt debounce & press/release ×5,000', priority: 'P1', duration: '5 min', models: 'X, M', android: 'A13, A16', checked: true },
  { id: 'DRV_CAM_STRESS_007', name: 'DRV_CAM_STRESS_007', desc: 'Camera HAL stream open/close ×1,000 without memory leak', priority: 'P3', duration: '9 min', models: 'X', android: 'A16', checked: false },
  { id: 'DRV_SUSPEND_RESUME_015', name: 'DRV_SUSPEND_RESUME_015', desc: 'Deep sleep suspend/resume RTC alarm wake cycle ×300', priority: 'P1', duration: '15 min', models: 'X, M', android: 'A13, A16', checked: true }
];

const COVERAGE_GAPS = [
  { name: 'Carrier & VoLTE IMS (APN, eSIM, Emergency)', count: '28 planned', severity: 'warning' },
  { name: 'Compliance: CTS / VTS / STS Google suites', count: '4 planned', severity: 'neutral' },
  { name: 'PTT MOS audio latency & PESQ quality score', count: '22 planned', severity: 'warning' },
  { name: 'RF attenuation & handover roaming stress', count: '18 planned', severity: 'neutral' },
  { name: 'Man-down accelerometer interrupt calibration', count: '12 planned', severity: 'neutral' },
  { name: 'Zero-touch provisioning & enterprise MDM', count: '51 planned', severity: 'primary' }
];

const TestCatalog = () => {
  const [activeGroup, setActiveGroup] = useState('Device driver');
  const [selectedCell, setSelectedCell] = useState({ rowId: 'kernel', colKey: 'stress' });
  const [testCases, setTestCases] = useState(SAMPLE_KERNEL_STRESS_CASES);
  const [toastMessage, setToastMessage] = useState(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [newTestCaseModal, setNewTestCaseModal] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState({
    id: '',
    name: '',
    component: 'Kernel & drivers',
    type: 'Stress',
    priority: 'P1',
    duration: '10 min'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const handleSync = () => {
      showToast('Synchronized 345 Robot Framework tags across git repository.');
    };
    const handleOpenNew = () => {
      setNewTestCaseModal(true);
    };

    window.addEventListener('sync-robot-tags', handleSync);
    window.addEventListener('open-new-test-case-modal', handleOpenNew);

    return () => {
      window.removeEventListener('sync-robot-tags', handleSync);
      window.removeEventListener('open-new-test-case-modal', handleOpenNew);
    };
  }, []);

  const getCellColor = (val, isSelected) => {
    if (isSelected) return 'bg-blue-600 text-white font-bold ring-2 ring-blue-400 ring-offset-2 ring-offset-[#080b12]';
    if (val === null || val === undefined) return 'bg-slate-900/40 text-slate-700 hover:bg-slate-800/40';
    if (val <= 2) return 'bg-blue-950/40 text-blue-400 border border-blue-900/40 hover:bg-blue-900/40';
    if (val <= 6) return 'bg-blue-900/50 text-blue-300 border border-blue-800/60 hover:bg-blue-800/60';
    if (val <= 15) return 'bg-blue-700/60 text-blue-200 border border-blue-600/60 hover:bg-blue-600/60';
    if (val <= 30) return 'bg-blue-600/70 text-white font-semibold hover:bg-blue-500/70';
    return 'bg-blue-500 text-white font-bold shadow-sm shadow-blue-500/30';
  };

  const handleCellClick = (rowId, colKey, val) => {
    if (val === null || val === undefined) return;
    setSelectedCell({ rowId, colKey });
  };

  const toggleCaseCheckbox = (id) => {
    setTestCases(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const selectedRowObj = MATRIX_ROWS.find(r => r.id === selectedCell.rowId) || MATRIX_ROWS[1];
  const selectedColObj = MATRIX_COLUMNS.find(c => c.key === selectedCell.colKey) || MATRIX_COLUMNS[2];
  const selectedCellCount = selectedRowObj.values[selectedCell.colKey] || 0;

  const handleAddToPlan = () => {
    const selectedCount = testCases.filter(c => c.checked).length;
    showToast(`Added ${selectedCount} cases from ${selectedRowObj.name} (${selectedColObj.label}) to pipeline`);
  };

  const handleCreateCaseSubmit = (e) => {
    e.preventDefault();
    if (!newCaseForm.name) return;
    const createdId = newCaseForm.id || `TEST_${Date.now().toString().slice(-4)}`;
    setTestCases(prev => [
      {
        id: createdId,
        name: createdId,
        desc: newCaseForm.name,
        priority: newCaseForm.priority,
        duration: newCaseForm.duration,
        models: 'X, M',
        android: 'A13, A16',
        checked: true
      },
      ...prev
    ]);
    setNewTestCaseModal(false);
    showToast(`Registered test case: ${createdId}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700/80 text-white px-4 py-2.5 rounded-lg text-xs font-medium shadow-2xl flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="size-2 rounded-full bg-blue-500 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-[#0d121f] border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-medium">Test Architecture Matrix</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400 font-mono">345 Verified Robot Framework Tags</span>
          </div>
          <h1 className="text-base font-semibold text-slate-100 mt-0.5">Component × Test Type Coverage Heatmap</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm" 
            icon={RefreshCw} 
            onClick={() => showToast('Refreshed git repository test catalog tags')}
          >
            Sync Tags
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            icon={Plus} 
            onClick={() => setNewTestCaseModal(true)}
          >
            New Test Case
          </Button>
        </div>
      </div>

      {/* Filter chips bar */}
      <div className="bg-[#0d121f] border border-slate-800/80 rounded-xl p-3.5 space-y-2.5 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider shrink-0 font-medium">Domain:</span>
          {QUICK_GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setActiveGroup(g)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all whitespace-nowrap ${
                activeGroup === g
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono pt-1.5 border-t border-slate-800/60">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider shrink-0 font-medium">Tag Filters:</span>
          {TAG_FILTERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => showToast(`Applied tag filter: ${t}`)}
              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10.5px] text-slate-400 hover:text-slate-200 hover:border-slate-700 whitespace-nowrap"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Heatmap Matrix (Left) & Inspector + Gaps (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Heatmap Matrix */}
        <div className="lg:col-span-8 bg-[#0d121f] border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Grid className="size-4 text-blue-400" />
                Coverage Heatmap
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Click any cell to inspect executable test cases and assign to pipelines</p>
            </div>
            {/* Heatmap Legend */}
            <div className="flex items-center gap-2 text-[10.5px] font-mono text-slate-400">
              <span>0</span>
              <div className="w-24 h-2 rounded-full bg-gradient-to-r from-slate-900 via-blue-900 to-blue-500 border border-slate-800" />
              <span>88+</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#090d16] border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 font-medium">Subsystem / Component</th>
                  {MATRIX_COLUMNS.map(col => (
                    <th key={col.key} className="py-2.5 px-2 text-center font-medium">{col.label}</th>
                  ))}
                  <th className="py-2.5 px-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11.5px]">
                {MATRIX_ROWS.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/20">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-300 flex items-center gap-2">
                      <span>{row.name}</span>
                      {row.isPlanned && <Badge variant="warning" className="text-[9.5px] py-0 px-1">Planned</Badge>}
                    </td>
                    {MATRIX_COLUMNS.map(col => {
                      const val = row.values[col.key];
                      const isSelected = selectedCell.rowId === row.id && selectedCell.colKey === col.key;
                      const hasVal = val !== null && val !== undefined;

                      return (
                        <td key={col.key} className="py-1 px-1 text-center">
                          <button
                            type="button"
                            disabled={!hasVal}
                            onClick={() => handleCellClick(row.id, col.key, val)}
                            className={`w-9 h-7 rounded text-[11px] transition-all flex items-center justify-center mx-auto cursor-pointer disabled:cursor-not-allowed ${getCellColor(val, isSelected)}`}
                          >
                            {hasVal ? val : '·'}
                          </button>
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-300">
                      {row.total}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-[#090d16] border-t-2 border-slate-700/80 font-bold text-slate-200">
                  <td className="py-3 px-3 uppercase text-[11px]">Subsystem Grand Totals</td>
                  {MATRIX_COLUMNS.map(col => (
                    <td key={col.key} className="py-3 px-2 text-center text-blue-400">
                      {COLUMN_TOTALS[col.key]}
                    </td>
                  ))}
                  <td className="py-3 px-3 text-right text-emerald-400">
                    {COLUMN_TOTALS.grandTotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Inspector and Coverage Gaps */}
        <div className="lg:col-span-4 space-y-4">
          {/* Test Case Inspector */}
          <div className="bg-[#0d121f] border border-slate-800/80 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10.5px] font-mono uppercase text-slate-500">Selected Cell</span>
                <h3 className="text-xs font-semibold text-slate-200">
                  {selectedRowObj.name} × {selectedColObj.label}
                </h3>
              </div>
              <Button variant="primary" size="sm" onClick={handleAddToPlan}>
                Stage in Plan
              </Button>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {testCases.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-lg border border-slate-800 bg-[#111622]/60 text-xs space-y-1.5"
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={c.checked}
                      onChange={() => toggleCaseCheckbox(c.id)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[11px] font-semibold text-slate-200 truncate">{c.name}</div>
                      <p className="text-[10.5px] text-slate-400 mt-0.5 leading-snug">{c.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 pl-5 pt-1 text-[10px] font-mono text-slate-500">
                    <Badge variant={c.priority === 'P1' ? 'danger' : 'neutral'} className="text-[9.5px] py-0 px-1">
                      {c.priority}
                    </Badge>
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded">{c.duration}</span>
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded">{c.models}</span>
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded">{c.android}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs" 
              onClick={() => setShowAllModal(true)}
            >
              Inspect All {selectedCellCount} Cases
            </Button>
          </div>

          {/* Coverage Gaps Roadmap */}
          <div className="bg-[#0d121f] border border-slate-800/80 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-amber-400" />
                Coverage Gaps (135 Planned)
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {COVERAGE_GAPS.map((gap, idx) => (
                <div key={idx} className="p-2 rounded-lg border border-slate-800/80 bg-[#111622]/40 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-300 font-medium truncate">{gap.name}</span>
                  <Badge variant={gap.severity} className="text-[10px] shrink-0 font-mono">{gap.count}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: All Test Cases */}
      <Modal
        isOpen={showAllModal}
        onClose={() => setShowAllModal(false)}
        title={`All ${selectedCellCount} Cases: ${selectedRowObj.name}`}
        description="Comprehensive list of verified Robot Framework test identifiers for this component."
        icon={Grid}
        footer={
          <Button variant="primary" onClick={() => setShowAllModal(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {testCases.map((c) => (
            <div key={c.id} className="p-2.5 rounded-lg border border-slate-800 bg-[#111622] text-xs">
              <div className="font-mono text-slate-200 font-medium">{c.name}</div>
              <p className="text-slate-400 text-[11px] mt-0.5">{c.desc}</p>
              <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-slate-500">
                <span className="text-amber-400">{c.priority}</span>
                <span>{c.duration}</span>
                <span>{c.models}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Modal: New Test Case */}
      <Modal
        isOpen={newTestCaseModal}
        onClose={() => setNewTestCaseModal(false)}
        title="Register New Test Definition"
        description="Add a new Robot Framework test definition to the matrix catalog."
        icon={Plus}
        footer={
          <>
            <Button variant="ghost" onClick={() => setNewTestCaseModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateCaseSubmit}>
              Register Case
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateCaseSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Test Identifier</label>
            <input
              type="text"
              placeholder="e.g. DRV_NFC_STRESS_001"
              value={newCaseForm.id}
              onChange={(e) => setNewCaseForm({ ...newCaseForm, id: e.target.value })}
              className="w-full bg-[#111622] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Scenario Description</label>
            <input
              type="text"
              required
              placeholder="e.g. NFC field polling loop with card present"
              value={newCaseForm.name}
              onChange={(e) => setNewCaseForm({ ...newCaseForm, name: e.target.value })}
              className="w-full bg-[#111622] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Component</label>
              <select
                value={newCaseForm.component}
                onChange={(e) => setNewCaseForm({ ...newCaseForm, component: e.target.value })}
                className="w-full bg-[#111622] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option>Kernel & Drivers</option>
                <option>Bootloader</option>
                <option>Hardware Abstraction (HAL)</option>
                <option>RF & Connectivity</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Test Type</label>
              <select
                value={newCaseForm.type}
                onChange={(e) => setNewCaseForm({ ...newCaseForm, type: e.target.value })}
                className="w-full bg-[#111622] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option>Stress</option>
                <option>Sanity</option>
                <option>Functional</option>
                <option>Perf</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TestCatalog;
