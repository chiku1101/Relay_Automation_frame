import React, { useState } from 'react';
import { 
  Smartphone, 
  Plus, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Wifi, 
  Battery, 
  Thermometer, 
  Radio, 
  Terminal, 
  Zap, 
  Lock, 
  Unlock, 
  X,
  Power,
  HardDrive
} from 'lucide-react';
import { Badge, SearchInput, StatCard, Tabs, Modal, Button } from '../components/ui';

const INITIAL_DEVICES = [
  {
    id: 'x001',
    name: 'Relay Hub X-001',
    serial: 'RX1A-0231',
    rev: 'Rev C3 (Golden Spec)',
    soc: 'Qualcomm QCS610 RB3 · 4GB RAM',
    bench: 'Bench Bay A · Slot 04',
    ip: '192.168.10.42:5555',
    status: 'online',
    statusText: 'Online & Ready',
    batterySoc: 92,
    batteryVoltage: '4.18V',
    batteryState: 'Discharging (Test Active)',
    temp: 34.2,
    tempStatus: 'normal',
    currentDraw: '420 mA',
    firmware: 'RelayOS 2.4.0 (0926)',
    kernel: 'Linux 5.10.149-android12-9',
    lockedBy: null
  },
  {
    id: 'x002',
    name: 'Relay Hub X-002',
    serial: 'RX1A-0232',
    rev: 'Rev C2 (Soak Unit)',
    soc: 'Qualcomm QCS610 RB3 · 4GB RAM',
    bench: 'Thermal Chamber B · Jig #2',
    ip: '192.168.10.43:5555',
    status: 'soak',
    statusText: 'In 7-Day Soak (Day 3/7)',
    batterySoc: 100,
    batteryVoltage: '4.35V',
    batteryState: 'AC Docked Continuous',
    temp: 42.1,
    tempStatus: 'warning',
    currentDraw: '890 mA',
    firmware: 'RelayOS 2.4.0 (0925)',
    kernel: 'Linux 5.10.149-android12-9',
    lockedBy: 'Soak #1045'
  },
  {
    id: 'm002',
    name: 'Relay Micro M-002',
    serial: 'RM1B-0412',
    rev: 'Rev B1 (CAN Node)',
    soc: 'ESP32-S3 Dual-Core · 8MB PSRAM',
    bench: 'Bench Bay A · CAN Jig #1',
    ip: '192.168.10.77:23',
    status: 'online',
    statusText: 'Online & Idle',
    batterySoc: 100,
    batteryVoltage: '12.0V DC',
    batteryState: 'Regulated Lab Bench VBUS',
    temp: 29.8,
    tempStatus: 'normal',
    currentDraw: '180 mA',
    firmware: 'FreeRTOS v1.12.4',
    kernel: 'ESP-IDF v5.1.2',
    lockedBy: null
  },
  {
    id: 'e008',
    name: 'Relay Edge E-008',
    serial: 'RE8-0012',
    rev: 'Rev A2 (Edge Inference)',
    soc: 'NVIDIA Jetson Orin Nano · 8GB',
    bench: 'Lab Central Rack C1 · Slot 02',
    ip: '192.168.10.15:22',
    status: 'online',
    statusText: 'Online & Ready',
    batterySoc: 100,
    batteryVoltage: '19.0V DC',
    batteryState: 'Mains AC Adapter',
    temp: 48.6,
    tempStatus: 'normal',
    currentDraw: '1,240 mA',
    firmware: 'Ubuntu 22.04-RT',
    kernel: 'Linux 5.15.136-rt72',
    lockedBy: null
  },
  {
    id: 'x003',
    name: 'Relay Hub X-003',
    serial: 'RX1A-0402',
    rev: 'Rev C3 (Field Testing)',
    soc: 'Qualcomm QCS610 RB3 · 4GB RAM',
    bench: 'Field Test Vehicle #3 Dock',
    ip: '10.42.0.88',
    status: 'offline',
    statusText: 'Offline · Low Battery Cutoff',
    batterySoc: 18,
    batteryVoltage: '3.42V',
    batteryState: 'Cutoff Disconnect',
    temp: 22.4,
    tempStatus: 'normal',
    currentDraw: '0 mA',
    firmware: 'RelayOS 2.3.9',
    kernel: 'Linux 5.10.149',
    lockedBy: null
  }
];

const Devices = () => {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState(null);
  const [selectedUartDevice, setSelectedUartDevice] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const filteredDevices = devices.filter(d => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'online' && d.status === 'online') ||
      (filter === 'soak' && d.status === 'soak') ||
      (filter === 'offline' && d.status === 'offline');
    const matchesSearch = 
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.serial.toLowerCase().includes(search.toLowerCase()) ||
      d.ip.toLowerCase().includes(search.toLowerCase()) ||
      d.bench.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handlePingFleet = () => {
    setPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setPinging(false);
      setPingResult('All 4 connected nodes replied · RTT 12.4ms avg (0% packet drop)');
      setTimeout(() => setPingResult(null), 5000);
    }, 1200);
  };

  const handleToggleLock = (deviceId) => {
    setDevices(devices.map(d => {
      if (d.id === deviceId) {
        return {
          ...d,
          lockedBy: d.lockedBy ? null : 'C. Sonar (Exclusive Test Lock)'
        };
      }
      return d;
    }));
  };

  const handleRebootDevice = (deviceId, name) => {
    if (confirm(`Send hard reboot command to hardware watchdog on ${name}?`)) {
      alert(`Reboot command dispatched to ${name} via lab relay controller.`);
    }
  };

  const tabsConfig = [
    { id: 'all', label: 'All Fleet', count: devices.length },
    { id: 'online', label: 'Online & Available', count: devices.filter(d => d.status === 'online').length },
    { id: 'soak', label: 'In Soak', count: devices.filter(d => d.status === 'soak').length },
    { id: 'offline', label: 'Offline', count: devices.filter(d => d.status === 'offline').length }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Origin UI Inspired Fleet Telemetry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <StatCard
          label="Total Fleet Hardware"
          value={`${devices.length} Nodes`}
          description="4 Active in Lab Bay A · 1 Field Unit"
          icon={HardDrive}
          accentColor="#38bdf8"
        />
        <StatCard
          label="Online & Ready"
          value="3 Nodes"
          description="Zero lock contention · Ready for plans"
          icon={CheckCircle2}
          accentColor="#34d399"
          trend={{ type: 'up', text: 'NOMINAL' }}
        />
        <StatCard
          label="Continuous Soak Units"
          value="1 Node"
          description="Relay X-002 · Day 3 of 7 in Chamber B"
          icon={Cpu}
          accentColor="#60a5fa"
          trend={{ type: 'neutral', text: 'SOAK #1045' }}
        />
        <StatCard
          label="Fleet Health Index"
          value="99.2%"
          description="Avg Temp: 34.2°C · 24.1V Bus Nominal"
          icon={Activity}
          accentColor="#38bdf8"
          trend={{ type: 'up', text: '99.2%' }}
        />
      </div>

      {/* Ping Banner Notification if active */}
      {pingResult && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '8px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#34d399',
          fontSize: '12.5px',
          fontFamily: 'var(--font-mono)'
        }}>
          <CheckCircle2 size={16} />
          <span>{pingResult}</span>
        </div>
      )}

      {/* Origin UI Filter and Search Bar */}
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
            placeholder="Filter serial, IP, bench slot..."
            shortcut="⌘F"
            width="280px"
          />
          <Button 
            variant="secondary"
            size="md"
            icon={RefreshCw}
            loading={pinging}
            onClick={handlePingFleet}
          >
            {pinging ? 'Pinging ICMP...' : 'Ping Fleet'}
          </Button>
          <Button 
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setShowRegisterModal(true)}
          >
            Register Node
          </Button>
        </div>
      </div>

      {/* Devices Hardware Matrix Table with Origin UI Badges */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 20px' }}>NODE & SERIAL</th>
              <th style={{ padding: '12px 20px' }}>BENCH LOCATION & RIG</th>
              <th style={{ padding: '12px 20px' }}>IP / ADB TRANSPORT</th>
              <th style={{ padding: '12px 20px' }}>STATUS & EXCLUSIVE LOCK</th>
              <th style={{ padding: '12px 20px' }}>BATTERY & CURRENT</th>
              <th style={{ padding: '12px 20px' }}>THERMAL SENSOR</th>
              <th style={{ padding: '12px 20px' }}>FIRMWARE VERSION</th>
              <th style={{ padding: '12px 20px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((dev) => (
              <tr key={dev.id}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '6px',
                      background: dev.status === 'online' ? 'rgba(16, 185, 129, 0.12)' : dev.status === 'soak' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                      border: `1px solid ${dev.status === 'online' ? 'rgba(16, 185, 129, 0.3)' : dev.status === 'soak' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: dev.status === 'online' ? '#34d399' : dev.status === 'soak' ? '#60a5fa' : '#f87171'
                    }}>
                      <Smartphone size={17} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9' }}>
                        {dev.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#8896b3', fontFamily: 'var(--font-mono)' }}>
                        {dev.serial} · {dev.rev}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12.5px', color: '#cbd5e1', fontWeight: '500' }}>
                      {dev.bench}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                      {dev.soc}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wifi size={13} color={dev.status !== 'offline' ? '#38bdf8' : '#64748b'} />
                    <code style={{ 
                      fontSize: '11.5px', 
                      fontFamily: 'var(--font-mono)', 
                      color: dev.status !== 'offline' ? '#38bdf8' : '#64748b',
                      background: '#090e18',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #1a253c'
                    }}>
                      {dev.ip}
                    </code>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Badge
                      variant={dev.status === 'online' ? 'success' : dev.status === 'soak' ? 'primary' : 'danger'}
                      pulse={dev.status === 'soak' || dev.status === 'online'}
                      size="sm"
                    >
                      {dev.statusText}
                    </Badge>
                    {dev.lockedBy ? (
                      <span style={{ fontSize: '10.5px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={10} /> Locked: {dev.lockedBy}
                      </span>
                    ) : (
                      <span style={{ fontSize: '10.5px', color: '#64748b' }}>Unlocked / Free</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontFamily: 'var(--font-mono)', fontSize: '11.5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: dev.batterySoc < 25 ? '#f87171' : '#34d399' }}>
                      <Battery size={13} />
                      <span style={{ fontWeight: '700' }}>{dev.batterySoc}%</span>
                      <span style={{ color: '#8896b3' }}>({dev.batteryVoltage})</span>
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>{dev.currentDraw}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Thermometer size={14} color={dev.temp > 40 ? '#fbbf24' : '#34d399'} />
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: '700', 
                      fontFamily: 'var(--font-mono)',
                      color: dev.temp > 40 ? '#fbbf24' : '#f1f5f9'
                    }}>
                      {dev.temp} °C
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: '#38bdf8', fontWeight: '600' }}>{dev.firmware}</span>
                    <span style={{ color: '#64748b', fontSize: '10px' }}>{dev.kernel}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <Button 
                      variant="secondary"
                      size="sm"
                      icon={Terminal}
                      onClick={() => setSelectedUartDevice(dev)}
                    >
                      UART
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      icon={dev.lockedBy ? Unlock : Lock}
                      style={{ padding: '0 8px', color: dev.lockedBy ? '#fbbf24' : '#94a3b8' }}
                      title={dev.lockedBy ? "Release Exclusive Lock" : "Acquire Exclusive Lock"}
                      onClick={() => handleToggleLock(dev.id)}
                    />
                    <Button 
                      variant="danger"
                      size="sm"
                      icon={Power}
                      style={{ padding: '0 8px' }}
                      title="Hard Reboot Hardware"
                      onClick={() => handleRebootDevice(dev.id, dev.name)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Origin UI Modal for UART Console */}
      {selectedUartDevice && (
        <Modal
          isOpen={!!selectedUartDevice}
          onClose={() => setSelectedUartDevice(null)}
          title={`Serial UART TTY · ${selectedUartDevice.name}`}
          description="FTDI USB-to-UART Adapter @ /dev/ttyUSB0 (115200 Baud, 8N1)"
          icon={Terminal}
          iconColor="#38bdf8"
          maxWidth="720px"
          footer={
            <>
              <Button variant="outline" size="md" onClick={() => setSelectedUartDevice(null)}>
                Close
              </Button>
              <Button 
                variant="primary" 
                size="md"
                onClick={() => alert(`Serial TTY session break signal sent for ${selectedUartDevice.name}.`)}
              >
                Send Break Signal (SysRq)
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <span style={{ color: '#8896b3' }}>Target: {selectedUartDevice.serial} ({selectedUartDevice.bench})</span>
              <Badge variant="success" pulse size="sm">RX/TX Streaming Active</Badge>
            </div>
            <div className="log-terminal" style={{ maxHeight: '300px' }}>
              <div>Format: Log Type - Time(s) - Message - Optional Info</div>
              <div>Log Code: 0x01140027</div>
              <div className="log-info">Subsystem: Qualcomm QCS610 RB3 RPM (Resource Power Manager)</div>
              <div>RPM Build: Nov 14 2025 04:12:00</div>
              <div>Core 0 freq: 1612800 KHz | Core 1: 1612800 KHz | Core 2: 1612800 KHz</div>
              <div>PMIC: PMI632 REV 1.1 | Battery gauge detected: BQ27Z561</div>
              <div>Voltage: 4182 mV | State of Charge: 92% | Current: -420 mA</div>
              <div>Wi-Fi Driver: QCA6174A initialized, MAC: 74:ac:b9:42:11:80</div>
              <div>fastboot: processing USB descriptors... complete</div>
              <div className="log-info">Android 16 init started: /init (pid 1)</div>
              <div>[init] Loading SELinux policy from /vendor/etc/selinux/precompiled_sepolicy</div>
              <div>[init] Starting service 'relay-hardware-daemon'...</div>
              <div className="log-info">[relay-hw] Hardware bench daemon v2.4.1 online, listening on port 5555</div>
            </div>
          </div>
        </Modal>
      )}

      {/* Origin UI Modal for Register Device */}
      {showRegisterModal && (
        <Modal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          title="Register Hardware Node in Fleet"
          description="Enumerate a physical hardware unit, assign bench slot, and verify ADB connectivity"
          icon={Plus}
          iconColor="#38bdf8"
          maxWidth="520px"
          footer={
            <>
              <Button variant="outline" size="md" onClick={() => setShowRegisterModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="md"
                onClick={() => {
                  alert('Hardware node registered and ping verified successfully.');
                  setShowRegisterModal(false);
                }}
              >
                Register & Verify Connection
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Hardware Identifier / Label
              </label>
              <input 
                type="text" 
                className="search-input" 
                placeholder="e.g. Relay Hub X-004" 
                style={{ width: '100%', height: '36px', padding: '0 10px', fontSize: '12.5px' }} 
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Hardware Serial Number & Model Revision
              </label>
              <input 
                type="text" 
                className="search-input" 
                placeholder="e.g. RX1A-0499 (Rev C3)" 
                style={{ width: '100%', height: '36px', padding: '0 10px', fontSize: '12.5px' }} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Lab Bench Location
                </label>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Bench Bay A · Slot 05" 
                  style={{ width: '100%', height: '36px', padding: '0 10px', fontSize: '12.5px' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  IP / ADB Address
                </label>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="192.168.10.45:5555" 
                  style={{ width: '100%', height: '36px', padding: '0 10px', fontSize: '12.5px' }} 
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Devices;
