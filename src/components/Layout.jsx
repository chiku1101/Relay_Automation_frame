import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  Play, 
  Calendar, 
  Smartphone, 
  Activity, 
  FileText, 
  Box, 
  Library, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">R</div>
        <div className="logo-text">
          <span className="logo-title">Relay Automation</span>
          <span className="logo-subtitle">Test Framework 2.0</span>
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-section-title">OVERVIEW</div>
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard /> Dashboard
        </NavLink>
      </div>

      <div className="nav-section">
        <div className="nav-section-title">EXECUTE</div>
        <NavLink to="/test-plans" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <ListTodo /> Test Plans
        </NavLink>
        <NavLink to="/runs" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Play /> Runs
        </NavLink>
        <NavLink to="/schedules" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Calendar /> Schedules
        </NavLink>
      </div>

      <div className="nav-section">
        <div className="nav-section-title">FLEET</div>
        <NavLink to="/devices" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Smartphone /> Devices
        </NavLink>
        <NavLink to="/monitoring" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Activity /> Monitoring
        </NavLink>
      </div>

      <div className="nav-section">
        <div className="nav-section-title">ANALYZE</div>
        <NavLink to="/reports" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <FileText /> Reports
        </NavLink>
        <NavLink to="/builds" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Box /> Builds
        </NavLink>
      </div>

      <div className="nav-section">
        <div className="nav-section-title">LIBRARY</div>
        <NavLink to="/test-catalog" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Library /> Test Catalog
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item">
          <Settings /> Settings
        </NavLink>
      </div>
    </aside>
  );
};

const TopBar = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    if (location.pathname === '/') return { label: 'Overview', title: 'Dashboard' };
    if (location.pathname.startsWith('/test-plans')) return { label: 'Test Plans / New plan', title: 'Nightly Regression · Relay fleet' };
    if (location.pathname === '/runs') return { label: 'Execute', title: 'Runs' };
    if (location.pathname === '/schedules') return { label: 'Execute', title: 'Schedules' };
    if (location.pathname === '/devices') return { label: 'Fleet', title: 'Devices' };
    if (location.pathname === '/monitoring') return { label: 'Fleet / Monitoring', title: 'Relay X-002 · Soak #1045' };
    if (location.pathname === '/reports') return { label: 'Analyze', title: 'Reports' };
    if (location.pathname === '/builds') return { label: 'Analyze', title: 'Builds' };
    if (location.pathname === '/test-catalog') return { label: 'Library', title: 'Test Catalog' };
    if (location.pathname === '/settings') return { label: 'System', title: 'Workspace Settings' };
    return { label: '', title: '' };
  };

  const { label, title } = getPageTitle();

  return (
    <div className="top-bar">
      <div className="page-title">
        {location.pathname.startsWith('/test-plans') ? (
          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '2px' }}>
            <NavLink to="/test-plans" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: '500' }}>Test Plans</NavLink> / New plan
          </div>
        ) : (
          label && <span className="page-title-label">{label}</span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 className="page-title-text" style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: 0 }}>{title}</h1>
          {location.pathname === '/monitoring' && (
            <span style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '600',
              padding: '2px 8px',
              borderRadius: '9999px',
              letterSpacing: '0.01em',
              lineHeight: '1.4'
            }}>Day 3 of 7</span>
          )}
          {location.pathname === '/test-catalog' && (
            <span style={{
              fontSize: '13px',
              color: '#6b7280',
              fontWeight: '400',
              marginLeft: '4px'
            }}>345 automated · 135 planned</span>
          )}
        </div>
      </div>
      
      {location.pathname === '/monitoring' && (
        <div className="top-bar-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select 
            className="select-input" 
            defaultValue="x002" 
            style={{ height: '34px', borderRadius: '6px', padding: '0 10px', fontSize: '13px', background: '#fff', border: '1px solid #d1d5db', color: '#111827' }}
          >
            <option value="x002">Relay X-002 (soak)</option>
            <option value="x001">Relay X-001 (prod)</option>
            <option value="x003">Relay X-003 (field)</option>
          </select>

          <select 
            className="select-input" 
            defaultValue="0919" 
            style={{ height: '34px', borderRadius: '6px', padding: '0 10px', fontSize: '13px', background: '#fff', border: '1px solid #d1d5db', color: '#111827' }}
          >
            <option value="0919">Compare: X-002 soak on 0919</option>
            <option value="0912">Compare: X-002 soak on 0912</option>
            <option value="none">No comparison</option>
          </select>

          <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
            <button type="button" style={{ padding: '6px 10px', border: 'none', background: '#fff', fontSize: '12px', cursor: 'pointer', borderRight: '1px solid #e5e7eb', color: '#374151' }}>1 h</button>
            <button type="button" style={{ padding: '6px 10px', border: 'none', background: '#fff', fontSize: '12px', cursor: 'pointer', borderRight: '1px solid #e5e7eb', color: '#374151' }}>24 h</button>
            <button type="button" style={{ padding: '6px 12px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>Soak (7 d)</button>
            <button type="button" style={{ padding: '6px 10px', border: 'none', background: '#fff', fontSize: '12px', cursor: 'pointer', borderLeft: '1px solid #e5e7eb', color: '#374151' }}>Custom</button>
          </div>

          <button 
            type="button"
            className="btn btn-secondary" 
            onClick={() => window.dispatchEvent(new CustomEvent('export-monitoring-report'))}
            style={{ height: '34px', borderRadius: '6px', padding: '0 14px', fontSize: '13px', fontWeight: '500', background: '#fff', border: '1px solid #d1d5db' }}
          >
            Export
          </button>
        </div>
      )}

      {location.pathname === '/reports' && (
        <div className="top-bar-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select 
            className="select-input" 
            defaultValue="saved_x001" 
            style={{ height: '34px', borderRadius: '6px', padding: '0 10px', fontSize: '13px', background: '#fff', border: '1px solid #d1d5db', color: '#111827' }}
          >
            <option value="saved_x001">Saved view: Relay X-001 across builds</option>
            <option value="nightly_reg">Saved view: Nightly Regression</option>
            <option value="failed_recent">Saved view: Recent Failures</option>
          </select>

          <button 
            type="button"
            className="btn btn-secondary" 
            onClick={() => window.dispatchEvent(new CustomEvent('export-reports-csv'))}
            style={{ height: '34px', borderRadius: '6px', padding: '0 14px', fontSize: '13px', fontWeight: '500', background: '#fff', border: '1px solid #d1d5db' }}
          >
            Export CSV
          </button>
        </div>
      )}

      {location.pathname === '/test-catalog' && (
        <div className="top-bar-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
            <button type="button" style={{ padding: '6px 12px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>Matrix</button>
            <button type="button" style={{ padding: '6px 10px', border: 'none', background: '#fff', fontSize: '12px', cursor: 'pointer', borderLeft: '1px solid #e5e7eb', color: '#374151' }}>By component</button>
            <button type="button" style={{ padding: '6px 10px', border: 'none', background: '#fff', fontSize: '12px', cursor: 'pointer', borderLeft: '1px solid #e5e7eb', color: '#374151' }}>By test type</button>
            <button type="button" style={{ padding: '6px 10px', border: 'none', background: '#fff', fontSize: '12px', cursor: 'pointer', borderLeft: '1px solid #e5e7eb', color: '#374151' }}>List</button>
          </div>

          <button 
            type="button"
            className="btn btn-secondary" 
            onClick={() => window.dispatchEvent(new CustomEvent('sync-robot-tags'))}
            style={{ height: '34px', borderRadius: '6px', padding: '0 12px', fontSize: '13px', fontWeight: '500', background: '#fff', border: '1px solid #d1d5db' }}
          >
            Sync Robot tags
          </button>

          <button 
            type="button"
            className="btn btn-primary" 
            onClick={() => window.dispatchEvent(new CustomEvent('open-new-test-case-modal'))}
            style={{ height: '34px', borderRadius: '6px', padding: '0 14px', fontSize: '13px', fontWeight: '600', backgroundColor: '#1d4ed8' }}
          >
            + New test case
          </button>
        </div>
      )}

      {location.pathname === '/settings' && (
        <div className="top-bar-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#059669',
            background: '#ecfdf5',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #a7f3d0',
            fontWeight: '500'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            Cluster synced
          </div>
          <button 
            type="button"
            className="btn btn-secondary" 
            onClick={() => window.dispatchEvent(new CustomEvent('reset-settings-defaults'))}
            style={{ height: '34px', borderRadius: '6px', padding: '0 12px', fontSize: '13px', fontWeight: '500', background: '#fff', border: '1px solid #d1d5db' }}
          >
            Reset
          </button>
          <button 
            type="button"
            className="btn btn-primary" 
            onClick={() => window.dispatchEvent(new CustomEvent('save-workspace-settings'))}
            style={{ height: '34px', borderRadius: '6px', padding: '0 16px', fontSize: '13px', fontWeight: '600' }}
          >
            Save Changes
          </button>
        </div>
      )}

      {location.pathname === '/' && (
        <div className="top-bar-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Build</span>
          <select className="select-input" defaultValue="a16" style={{ height: '38px', borderRadius: '8px', padding: '6px 12px' }}>
            <option value="a16">A16 · 2.4.0 (0926) · latest</option>
          </select>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Model</span>
          <select className="select-input" defaultValue="all" style={{ height: '38px', borderRadius: '8px', padding: '6px 12px' }}>
            <option value="all">All models</option>
          </select>
          
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4b5563' }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <div style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#b91c1c',
              color: 'white',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '700',
              minWidth: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              lineHeight: 1
            }}>4</div>
          </div>

          <button className="btn btn-primary" style={{ height: '38px', borderRadius: '8px', padding: '0 16px', fontWeight: '600' }}>
            + New Test Run
          </button>
          
          <div style={{
            background: '#dbeafe',
            color: '#1d4ed8',
            borderRadius: '50%',
            fontWeight: '600',
            fontSize: '14px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>SS</div>
        </div>
      )}

      {location.pathname.startsWith('/test-plans') && (
        <div className="top-bar-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#6b7280', marginRight: '6px' }}>Draft · autosaved 02:38</span>
          <button className="btn btn-secondary" style={{ height: '36px', borderRadius: '8px', padding: '0 14px', fontSize: '13px', fontWeight: '500' }}>Save as template</button>
          <button className="btn btn-secondary" style={{ height: '36px', borderRadius: '8px', padding: '0 14px', fontSize: '13px', fontWeight: '500' }}>Schedule...</button>
          <button className="btn btn-primary" style={{ height: '36px', borderRadius: '8px', padding: '0 18px', fontSize: '13px', fontWeight: '600', backgroundColor: '#1d4ed8' }}>Run now</button>
        </div>
      )}

      {location.pathname === '/schedules' && (
        <div className="top-bar-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>All times Asia/Kolkata (IST)</span>
          <button 
            className="btn btn-primary" 
            onClick={() => window.dispatchEvent(new CustomEvent('open-new-schedule-modal'))}
            style={{ height: '36px', borderRadius: '8px', padding: '0 16px', fontWeight: '600', backgroundColor: '#1d4ed8' }}
          >
            + New schedule
          </button>
        </div>
      )}
    </div>
  );
};

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <TopBar />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
