import React, { useState, useEffect } from 'react';

const QUICK_GROUPS = [
  'Device driver', 'Bootloader', 'HAL', 'Framework', 'Connectivity',
  'Stress', 'Soak', 'Power', 'Performance', 'System E2E',
  'Functional · PTT, System UI', 'OTA', 'Security', 'Accessory',
  'Audio', 'Compliance', 'Telephony'
];

const TAG_FILTERS = [
  'Model: all', 'Android: 13, 16', 'Priority: any', 'Needs: BT headset',
  'Needs: SIM', 'Needs: charging dock', 'Needs: network emulator', 'Duration: < 5 min'
];

const MATRIX_COLUMNS = [
  { key: 'sanity', label: 'Sanity' },
  { key: 'functional', label: 'Functional' },
  { key: 'stress', label: 'Stress' },
  { key: 'soak', label: 'Soak' },
  { key: 'perf', label: 'Perf /\nstability' },
  { key: 'power', label: 'Power' },
  { key: 'e2e', label: 'System\nE2E' },
  { key: 'compliance', label: 'Compliance' }
];

const MATRIX_ROWS = [
  { id: 'bootloader', name: 'Bootloader', values: { sanity: 4, functional: 10, stress: 2, soak: null, perf: 2, power: null, e2e: null, compliance: null }, total: 18 },
  { id: 'kernel', name: 'Kernel & drivers', values: { sanity: 12, functional: 88, stress: 18, soak: 4, perf: 10, power: 6, e2e: null, compliance: 4 }, total: 142 },
  { id: 'hal', name: 'HAL', values: { sanity: 4, functional: 26, stress: 4, soak: null, perf: 2, power: 2, e2e: null, compliance: 2 }, total: 40 },
  { id: 'framework', name: 'Android framework', values: { sanity: 3, functional: 19, stress: 2, soak: null, perf: 2, power: null, e2e: 2, compliance: null }, total: 28 },
  { id: 'system_ui', name: 'System UI', values: { sanity: 2, functional: 12, stress: null, soak: null, perf: 2, power: null, e2e: null, compliance: null }, total: 16 },
  { id: 'connectivity', name: 'Connectivity', values: { sanity: 4, functional: 28, stress: 6, soak: 2, perf: 4, power: 2, e2e: 2, compliance: null }, total: 48 },
  { id: 'audio', name: 'Audio', values: { sanity: 1, functional: 7, stress: null, soak: null, perf: 2, power: null, e2e: null, compliance: null }, total: 10 },
  { id: 'ptt', name: 'PTT service', values: { sanity: 1, functional: 3, stress: null, soak: null, perf: null, power: null, e2e: 1, compliance: null }, total: 5 },
  { id: 'location', name: 'Location / GNSS', values: { sanity: 1, functional: 4, stress: null, soak: null, perf: 1, power: null, e2e: null, compliance: null }, total: 6 },
  { id: 'accessories', name: 'Accessories', values: { sanity: 1, functional: 6, stress: null, soak: null, perf: null, power: 1, e2e: null, compliance: null }, total: 8 },
  { id: 'ota', name: 'OTA / update', values: { sanity: 1, functional: 8, stress: 1, soak: null, perf: null, power: null, e2e: 2, compliance: null }, total: 12 },
  { id: 'security', name: 'Security', values: { sanity: 1, functional: 6, stress: null, soak: null, perf: null, power: null, e2e: null, compliance: 5 }, total: 12 },
  { id: 'telephony', name: 'Telephony & carrier', isPlanned: true, values: { sanity: null, functional: null, stress: null, soak: null, perf: null, power: null, e2e: null, compliance: null }, total: 0 },
  { id: 'sos', name: 'Emergency / SOS', isPlanned: true, values: { sanity: null, functional: null, stress: null, soak: null, perf: null, power: null, e2e: null, compliance: null }, total: 0 },
  { id: 'mdm', name: 'Provisioning & MDM', isPlanned: true, values: { sanity: null, functional: null, stress: null, soak: null, perf: null, power: null, e2e: null, compliance: null }, total: 0 },
  { id: 'buttons', name: 'Buttons, LED, haptics', isPlanned: true, values: { sanity: null, functional: null, stress: null, soak: null, perf: null, power: null, e2e: null, compliance: null }, total: 0 },
  { id: 'fault', name: 'Fault injection', isPlanned: true, values: { sanity: null, functional: null, stress: null, soak: null, perf: null, power: null, e2e: null, compliance: null }, total: 0 },
  { id: 'dispatch', name: 'Dispatch / backend', isPlanned: true, values: { sanity: null, functional: null, stress: null, soak: null, perf: null, power: null, e2e: null, compliance: null }, total: 0 }
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
  {
    id: 'DRV_I2C_STRESS_022',
    name: 'DRV_I2C_STRESS_022',
    desc: 'I2C bus: 10k back-to-back transfers',
    priority: 'P1',
    duration: '8 min',
    models: 'X, M',
    android: 'A13, A16',
    checked: true
  },
  {
    id: 'DRV_SPI_STRESS_004',
    name: 'DRV_SPI_STRESS_004',
    desc: 'SPI flash read/write loop',
    priority: 'P1',
    duration: '6 min',
    models: 'X, M',
    android: 'A13, A16',
    checked: true
  },
  {
    id: 'DRV_USB_STRESS_010',
    name: 'DRV_USB_STRESS_010',
    desc: 'USB attach/detach ×500 (relay-controlled)',
    priority: 'P2',
    duration: '12 min',
    models: 'X',
    android: 'A16',
    checked: true
  },
  {
    id: 'DRV_GPIO_PTTKEY_003',
    name: 'DRV_GPIO_PTTKEY_003',
    desc: 'PTT key press/release ×5,000',
    priority: 'P1',
    duration: '5 min',
    models: 'X, M',
    android: 'A13, A16',
    checked: true
  },
  {
    id: 'DRV_CAM_STRESS_007',
    name: 'DRV_CAM_STRESS_007',
    desc: 'Camera open/close ×1,000',
    priority: 'P3',
    duration: '9 min',
    models: 'X',
    android: 'A16',
    checked: false
  },
  {
    id: 'DRV_SUSPEND_RESUME_015',
    name: 'DRV_SUSPEND_RESUME_015',
    desc: 'Suspend/resume cycle ×300',
    priority: 'P1',
    duration: '15 min',
    models: 'X, M',
    android: 'A13, A16',
    checked: true
  }
];

const COVERAGE_GAPS = [
  { name: 'Telephony & carrier (VoLTE, APN, SIM)', count: '28 planned' },
  { name: 'Compliance: CTS / VTS / STS runs', count: '4 planned' },
  { name: 'PTT performance and audio quality', count: '22 planned' },
  { name: 'Network impairment and roaming', count: '18 planned' },
  { name: 'Emergency / SOS and man-down', count: '12 planned' },
  { name: 'Provisioning, MDM and fault injection', count: '51 planned' }
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
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
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

  const getCellColorClass = (val) => {
    if (val === null || val === undefined) return 'empty';
    if (val <= 2) return 'lvl-1';
    if (val <= 6) return 'lvl-2';
    if (val <= 12) return 'lvl-3';
    if (val <= 20) return 'lvl-4';
    if (val <= 30) return 'lvl-5';
    return 'lvl-max';
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
    showToast(`Added ${selectedCount} test cases from ${selectedRowObj.name} × ${selectedColObj.label.replace('\n', ' ')} to test plan.`);
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
    showToast(`Created test case: ${createdId}`);
  };

  return (
    <div className="test-catalog-page">
      {/* Quick groups & Tag Filters Card */}
      <div className="catalog-filters-card">
        {/* Row 1: Quick groups */}
        <div className="filters-row">
          <div className="filters-row-label">Quick groups</div>
          <div className="filters-chips-wrap">
            {QUICK_GROUPS.map((group) => (
              <button
                key={group}
                className={`catalog-pill-btn ${activeGroup === group ? 'active' : ''}`}
                onClick={() => setActiveGroup(group)}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Filter by tag */}
        <div className="filters-row">
          <div className="filters-row-label">Filter by tag</div>
          <div className="filters-chips-wrap">
            {TAG_FILTERS.map((tag) => (
              <button
                key={tag}
                className="tag-filter-pill"
                onClick={() => showToast(`Applied tag filter: ${tag}`)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="catalog-main-layout">
        {/* Left Column: Coverage Matrix */}
        <div className="catalog-left-col">
          <div className="catalog-card">
            <div className="catalog-card-header">
              <div>
                <div className="catalog-card-title">
                  Coverage matrix: component × test type
                </div>
                <div className="catalog-card-subtitle">
                  Each case has one component and one type, plus tags. Select a cell to see its cases.
                </div>
              </div>

              {/* Heatmap Legend */}
              <div className="heatmap-legend-box">
                <span>0</span>
                <div className="heatmap-gradient-bar"></div>
                <span>88</span>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="matrix-table-container">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>Component</th>
                    {MATRIX_COLUMNS.map(col => (
                      <th key={col.key} style={{ width: '9%' }}>
                        {col.label.split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </th>
                    ))}
                    <th style={{ width: '6%' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {MATRIX_ROWS.map((row) => (
                    <tr key={row.id}>
                      <td className="matrix-component-cell">
                        <span>{row.name}</span>
                        {row.isPlanned && <span className="planned-tag">Planned</span>}
                      </td>

                      {MATRIX_COLUMNS.map((col) => {
                        const val = row.values[col.key];
                        const isSelected = selectedCell.rowId === row.id && selectedCell.colKey === col.key;
                        const colorClass = getCellColorClass(val);

                        return (
                          <td key={col.key}>
                            <div
                              className={`matrix-cell ${colorClass} ${isSelected ? 'active-cell' : ''}`}
                              onClick={() => handleCellClick(row.id, col.key, val)}
                            >
                              {val !== null && val !== undefined ? val : '—'}
                            </div>
                          </td>
                        );
                      })}

                      <td>
                        <div className="matrix-total-cell">
                          {row.total}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Summary Total Row */}
                  <tr style={{ borderTop: '2px solid #e2e8f0' }}>
                    <td className="matrix-component-cell" style={{ fontWeight: 700, paddingTop: '10px' }}>
                      Total
                    </td>
                    {MATRIX_COLUMNS.map((col) => (
                      <td key={col.key} style={{ paddingTop: '10px' }}>
                        <div className="matrix-total-cell">
                          {COLUMN_TOTALS[col.key]}
                        </div>
                      </td>
                    ))}
                    <td style={{ paddingTop: '10px' }}>
                      <div className="matrix-grand-total-pill">
                        {COLUMN_TOTALS.grandTotal}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="matrix-footer-note">
              Regression, smoke and nightly are saved test plans built from this catalog, not separate test types.
            </div>
          </div>
        </div>

        {/* Right Column: Selected Cell Test Cases & Coverage Gaps */}
        <div className="catalog-right-col">
          {/* Card 1: Selected Cell Test Cases */}
          <div className="catalog-card">
            <div className="catalog-card-header" style={{ marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {selectedRowObj.name} × {selectedColObj.label.replace('\n', ' ')}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>
                  {selectedCellCount} cases · 1 h 10 m
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleAddToPlan}
                style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px', backgroundColor: '#1d4ed8' }}
              >
                Add to plan
              </button>
            </div>

            {/* Test Cases List */}
            <div className="cases-list">
              {testCases.map((c) => (
                <div key={c.id} className="case-item">
                  <input
                    type="checkbox"
                    className="case-checkbox"
                    checked={c.checked}
                    onChange={() => toggleCaseCheckbox(c.id)}
                  />
                  <div className="case-info">
                    <div className="case-name">{c.name}</div>
                    <div className="case-desc">{c.desc}</div>
                    <div className="case-tags-row">
                      <span className="case-tag priority">{c.priority}</span>
                      <span className="case-tag">{c.duration}</span>
                      <span className="case-tag">{c.models}</span>
                      <span className="case-tag">{c.android}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <span
              className="case-show-more-link"
              onClick={() => setShowAllModal(true)}
            >
              Show all {selectedCellCount}
            </span>
          </div>

          {/* Card 2: Coverage Gaps */}
          <div className="catalog-card">
            <div className="catalog-card-header" style={{ marginBottom: '12px' }}>
              <div className="catalog-card-title">Coverage gaps</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>135 planned</div>
            </div>

            <div className="gaps-list">
              {COVERAGE_GAPS.map((gap, index) => (
                <div key={index} className="gap-item">
                  <span className="gap-name">{gap.name}</span>
                  <span className="gap-count">{gap.count}</span>
                </div>
              ))}
            </div>
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

      {/* Show All Modal */}
      {showAllModal && (
        <div className="catalog-modal-backdrop" onClick={() => setShowAllModal(false)}>
          <div className="catalog-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="catalog-modal-header">
              <h3>All {selectedCellCount} Test Cases: {selectedRowObj.name}</h3>
              <button onClick={() => setShowAllModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="catalog-modal-body">
              <div className="cases-list">
                {testCases.map((c) => (
                  <div key={c.id} className="case-item">
                    <input
                      type="checkbox"
                      className="case-checkbox"
                      checked={c.checked}
                      onChange={() => toggleCaseCheckbox(c.id)}
                    />
                    <div className="case-info">
                      <div className="case-name">{c.name}</div>
                      <div className="case-desc">{c.desc}</div>
                      <div className="case-tags-row">
                        <span className="case-tag priority">{c.priority}</span>
                        <span className="case-tag">{c.duration}</span>
                        <span className="case-tag">{c.models}</span>
                        <span className="case-tag">{c.android}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="catalog-modal-footer">
              <button className="btn btn-primary" onClick={() => setShowAllModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* New Test Case Modal */}
      {newTestCaseModal && (
        <div className="catalog-modal-backdrop" onClick={() => setNewTestCaseModal(false)}>
          <div className="catalog-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="catalog-modal-header">
              <h3>New Test Case Definition</h3>
              <button onClick={() => setNewTestCaseModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateCaseSubmit}>
              <div className="catalog-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Test Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. DRV_NFC_STRESS_001"
                    value={newCaseForm.id}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, id: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Description / Test Scenario</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NFC field polling loop with card present"
                    value={newCaseForm.name}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Component</label>
                    <select
                      value={newCaseForm.component}
                      onChange={(e) => setNewCaseForm({ ...newCaseForm, component: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    >
                      <option>Kernel & drivers</option>
                      <option>Bootloader</option>
                      <option>HAL</option>
                      <option>Android framework</option>
                      <option>Connectivity</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Test Type</label>
                    <select
                      value={newCaseForm.type}
                      onChange={(e) => setNewCaseForm({ ...newCaseForm, type: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    >
                      <option>Stress</option>
                      <option>Sanity</option>
                      <option>Functional</option>
                      <option>Perf / stability</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="catalog-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setNewTestCaseModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#1d4ed8' }}>Create Case</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCatalog;
