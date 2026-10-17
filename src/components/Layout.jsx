import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  Settings,
  Search,
  Bell,
  Cpu,
  Radio,
  Terminal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 fixed top-0 bottom-0 left-0 bg-[#090d16] border-r border-[#182236] text-slate-400 flex flex-col z-40 overflow-y-auto select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-[#182236] bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="size-8.5 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-blue-600/30 border border-white/20">
          R
        </div>
        <div>
          <div className="text-sm font-bold text-slate-100 tracking-tight">Relay Embedded</div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Hardware Test OS 2.4</div>
        </div>
      </div>

      {/* Nav List */}
      <div className="p-3 space-y-4 flex-1">
        {/* Section: Control Plane */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Control Plane</div>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`
            }
          >
            <LayoutDashboard className="size-4 shrink-0" />
            <span>Dashboard</span>
          </NavLink>
        </div>

        {/* Section: Execute */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Execute</div>
          <div className="space-y-0.5">
            <NavLink
              to="/test-plans"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <ListTodo className="size-4 shrink-0" />
              <span>Test Plans</span>
            </NavLink>
            <NavLink
              to="/runs"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Play className="size-4 shrink-0" />
              <span>Runs</span>
            </NavLink>
            <NavLink
              to="/schedules"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Calendar className="size-4 shrink-0" />
              <span>Schedules</span>
            </NavLink>
          </div>
        </div>

        {/* Section: Hardware Fleet */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Hardware Fleet</div>
          <div className="space-y-0.5">
            <NavLink
              to="/devices"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Smartphone className="size-4 shrink-0" />
              <span>Devices</span>
            </NavLink>
            <NavLink
              to="/monitoring"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Activity className="size-4 shrink-0" />
              <span>Telemetry</span>
            </NavLink>
          </div>
        </div>

        {/* Section: Intelligence */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Intelligence</div>
          <div className="space-y-0.5">
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <FileText className="size-4 shrink-0" />
              <span>Reports & Regressions</span>
            </NavLink>
            <NavLink
              to="/builds"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Box className="size-4 shrink-0" />
              <span>Firmware & Builds</span>
            </NavLink>
          </div>
        </div>

        {/* Section: Test Suites */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Test Suites</div>
          <NavLink
            to="/test-catalog"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`
            }
          >
            <Library className="size-4 shrink-0" />
            <span>Test Catalog</span>
          </NavLink>
        </div>

        {/* Live Lab Fleet Bench Telemetry Card in Sidebar */}
        <div className="mt-4 p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold font-mono text-[11px]">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Lab Rig Bay A
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              99.8% OK
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10.5px] font-mono text-slate-400">
            <div className="p-1.5 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-1.5">
              <Cpu className="size-3 text-sky-400" />
              <span>4/5 Online</span>
            </div>
            <div className="p-1.5 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-1.5">
              <Zap className="size-3 text-amber-400" />
              <span>1 In Soak</span>
            </div>
            <div className="p-1.5 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-1.5">
              <Radio className="size-3 text-emerald-400" />
              <span>24.1V Bus</span>
            </div>
            <div className="p-1.5 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-1.5">
              <Activity className="size-3 text-slate-400" />
              <span>34.2°C Avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-[#182236]">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
              isActive
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`
          }
        >
          <Settings className="size-4 shrink-0" />
          <span>Settings & Config</span>
        </NavLink>
      </div>
    </aside>
  );
};

const TopBar = ({ onOpenSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const getPageTitle = () => {
    if (location.pathname === '/') return { label: 'System Overview', title: 'Mission Control Dashboard' };
    if (location.pathname.startsWith('/test-plans')) return { label: 'Execution Engine', title: 'Test Plan Orchestrator · Nightly Regression' };
    if (location.pathname === '/runs') return { label: 'Execution Engine', title: 'Test Execution Pipeline' };
    if (location.pathname === '/schedules') return { label: 'Execution Engine', title: 'Automated CI & Bench Schedules' };
    if (location.pathname === '/devices') return { label: 'Fleet Management', title: 'Physical Hardware Lab Devices' };
    if (location.pathname === '/monitoring') return { label: 'Hardware Telemetry', title: 'Relay X-002 · 7-Day Soak Telemetry' };
    if (location.pathname === '/reports') return { label: 'Analysis & Quality', title: 'Execution Reports & Regressions' };
    if (location.pathname === '/builds') return { label: 'Artifact Repository', title: 'Firmware Builds & Release Packages' };
    if (location.pathname === '/test-catalog') return { label: 'Quality Assurance', title: 'Comprehensive Test Case Matrix' };
    if (location.pathname === '/settings') return { label: 'Infrastructure', title: 'Cluster & Daemon Configuration' };
    return { label: 'Relay Automation', title: 'Control Console' };
  };

  const { label, title } = getPageTitle();

  return (
    <header className="h-16 px-6 bg-[#090d16]/90 backdrop-blur-md border-b border-[#182236] flex items-center justify-between sticky top-0 z-30">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold">{label}</span>
          <span className="text-slate-700">/</span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
            US-WEST RIG ALPHA · 14ms
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <h1 className="text-sm font-bold text-slate-100 tracking-tight">{title}</h1>
          {location.pathname === '/monitoring' && (
            <span className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              SOAK CYCLE: DAY 3 OF 7
            </span>
          )}
          {location.pathname === '/test-catalog' && (
            <span className="text-xs text-slate-400 font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
              345 automated · 135 planned
            </span>
          )}
        </div>
      </div>
      
      {/* Universal Search & Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Search Bar trigger */}
        <button 
          onClick={onOpenSearch}
          type="button"
          className="flex items-center gap-2 h-9 px-3 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
          title="Search test plans, hardware nodes, build artifacts (⌘K)"
        >
          <Search className="size-3.5 text-slate-500" />
          <span className="hidden sm:inline">Quick search...</span>
          <kbd className="hidden sm:inline-block bg-slate-800 border border-slate-700 rounded px-1.5 py-0.2 text-[10px] text-slate-300">
            ⌘K
          </kbd>
        </button>

        {/* Page Specific Actions */}
        {location.pathname === '/schedules' && (
          <button 
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-new-schedule-modal'))}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm"
          >
            + New Schedule
          </button>
        )}

        {location.pathname === '/' && (
          <button 
            type="button"
            onClick={() => navigate('/runs')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Play className="size-3" /> Trigger Run
          </button>
        )}

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative size-9 flex items-center justify-center bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 transition-colors"
            title="Telemetry alerts and notifications"
          >
            <Bell className="size-4" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full text-[9px] font-mono font-bold size-4 flex items-center justify-center shadow-lg shadow-rose-500/50">
              2
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-[#0d1322] border border-slate-800 rounded-xl p-3.5 shadow-2xl z-50 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-[11px] font-mono font-bold text-slate-200 uppercase tracking-wider">Hardware Alerts</span>
                <span className="text-[10.5px] text-blue-400 hover:text-blue-300 cursor-pointer" onClick={() => setShowNotifications(false)}>
                  Dismiss all
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-amber-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <AlertTriangle className="size-3.5" /> Thermal Peak on X-002
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    Sensor exceeded 45.0°C during PTT soak load. Mitigation throttled CPU to 1.6GHz.
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">12m ago · Chamber B</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-rose-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                    <AlertTriangle className="size-3.5" /> Watchdog Bark in Run #1045
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    CPU3 soft lockup for 26s in PttAudioEngine. Kernel panic trace saved.
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">1h ago · Bench A14</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Operator Profile Badge */}
        <div className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 bg-slate-900 border border-slate-800 rounded-full">
          <div className="size-6 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white font-mono font-bold text-[10.5px] flex items-center justify-center">
            CS
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-semibold text-slate-200 leading-tight">Chaitanya</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Lead Test Eng</span>
          </div>
        </div>
      </div>
    </header>
  );
};

/* Global Command Palette Modal (Cmd+K) */
const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const quickLinks = [
    { title: 'Nightly Regression Run #1047', category: 'Runs', path: '/runs', hint: '345/350 passed' },
    { title: 'PTT Audio Latency & Jitter Soak', category: 'Runs', path: '/runs', hint: 'Running on X-002' },
    { title: 'Relay Hub X-001 (Bench Bay A)', category: 'Devices', path: '/devices', hint: '192.168.10.42 · Online' },
    { title: 'Relay Hub X-002 (Soak Chamber)', category: 'Devices', path: '/devices', hint: 'In 7d Soak · 42.1°C' },
    { title: 'Relay Micro M-002 (CAN Jig)', category: 'Devices', path: '/devices', hint: 'FreeRTOS · Idle' },
    { title: 'RelayOS-v2.4.1-rc3 (Build 0926)', category: 'Firmware', path: '/builds', hint: 'Fastboot binary · 84MB' },
    { title: 'Kernel & Driver Stress Suite', category: 'Catalog', path: '/test-catalog', hint: '142 test cases' },
    { title: '7-Day Memory Leak Soak Telemetry', category: 'Telemetry', path: '/monitoring', hint: 'Day 3 of 7' },
    { title: 'Automated CI Schedules & Jenkins', category: 'Schedules', path: '/schedules', hint: '4 active schedules' },
    { title: 'Cluster Hardware Rig Settings', category: 'Settings', path: '/settings', hint: 'US-West Bay A' }
  ];

  const filtered = quickLinks.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase()) ||
    item.hint.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => onClose(false)}>
      <div 
        className="w-full max-w-xl bg-[#0a0f1b] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-[#0d1424]">
          <Search className="size-4 text-sky-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search fleet nodes, test plans, active runs, firmware binaries..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button 
            onClick={() => onClose(false)}
            className="text-slate-500 hover:text-slate-300"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No matching hardware or test resources found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  navigate(item.path);
                  onClose(false);
                }}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-900/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[9.5px] font-mono uppercase tracking-wider shrink-0">
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 truncate">{item.title}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 shrink-0">
                  <span>{item.hint}</span>
                  <ArrowRight className="size-3 text-slate-600" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 bg-[#090e18] border-t border-slate-800 flex justify-between items-center text-[11px] font-mono text-slate-500">
          <span>Navigate with click or arrow keys</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};

const Layout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex relative">
      <Sidebar />
      <div className="flex-1 ml-64 min-w-0 flex flex-col min-h-screen">
        <TopBar onOpenSearch={() => setIsSearchOpen(true)} />
        <main className="p-6 flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <CommandPalette isOpen={isSearchOpen} onClose={setIsSearchOpen} />
    </div>
  );
};

export default Layout;
