import React, { useState } from 'react';
import { 
  Box, 
  Upload, 
  Terminal, 
  Search, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  GitBranch, 
  GitCommit, 
  FileCode, 
  Zap, 
  ShieldCheck, 
  X, 
  RefreshCw,
  Copy,
  Check,
  Layers,
  Database
} from 'lucide-react';
import { Badge, SearchInput, StatCard, Tabs, Modal, Button } from '../components/ui';

const INITIAL_BUILDS = [
  {
    id: 'b-4812',
    name: 'relay-os-v2.4.1-rc3.bin',
    version: '2.4.1-rc3 (Build 0926)',
    channel: 'release-candidate',
    branch: 'release/v2.4',
    commit: 'd9a1f4b',
    commitMsg: 'Fix PTT audio buffer underrun in idle sleep state',
    verification: 'Verified (95.1%)',
    verificationStatus: 'warning',
    size: '84.2 MB',
    sha256: '7f1e49c812a0d9e8b7c6145a901e4cb8',
    timestamp: 'Today · 01:24 UTC',
    ciSource: 'Jenkins · #4812',
    author: 'C. Sonar'
  },
  {
    id: 'b-4790',
    name: 'relay-os-v2.4.0-release.bin',
    version: '2.4.0 (Build 0919)',
    channel: 'stable',
    branch: 'main',
    commit: 'c8e0291',
    commitMsg: 'Promote 2.4.0 RC to production golden release',
    verification: 'Golden Verified (100%)',
    verificationStatus: 'success',
    size: '82.8 MB',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb924',
    timestamp: 'Sep 19 · 04:00 UTC',
    ciSource: 'Jenkins · #4790',
    author: 'Relay Release Bot'
  },
  {
    id: 'b-4815',
    name: 'relay-ptt-service-v4.18.2.apk',
    version: '4.18.2 (41820)',
    channel: 'stable',
    branch: 'main',
    commit: '99a21e0',
    commitMsg: 'Low-latency Opus jitter buffer & hardware PTT key debouncing',
    verification: 'Passed Smoke (100%)',
    verificationStatus: 'success',
    size: '18.4 MB',
    sha256: 'a91f40d18e4726b1c8f49a0e71c989b2',
    timestamp: 'Sep 18 · 22:15 UTC',
    ciSource: 'GitHub Actions · #842',
    author: 'Audio Lead'
  },
  {
    id: 'b-4810',
    name: 'bootloader-fastboot-signed.mbn',
    version: '2.4.1-rc3 (0925)',
    channel: 'release-candidate',
    branch: 'release/v2.4',
    commit: 'd9a1f4b',
    commitMsg: 'Qualcomm ABL bootloader signed with production HSM key',
    verification: 'HSM Signature Valid',
    verificationStatus: 'success',
    size: '4.2 MB',
    sha256: '61d8a90ec44298fc1c149afbf4c8996f',
    timestamp: 'Sep 25 · 18:30 UTC',
    ciSource: 'Jenkins · #4810',
    author: 'Security Daemon'
  },
  {
    id: 'b-4780',
    name: 'firmware-m002-freertos-v1.12.4.hex',
    version: '1.12.4',
    channel: 'stable',
    branch: 'main',
    commit: 'b4198cc',
    commitMsg: 'ESP32-S3 CAN bus frame filter for peripheral telemetry',
    verification: 'Verified Bench Pass',
    verificationStatus: 'success',
    size: '2.1 MB',
    sha256: '89cb2fa018e4726b1c8f49a0e71c989b',
    timestamp: 'Sep 14 · 11:20 UTC',
    ciSource: 'GitLab CI · #209',
    author: 'Firmware Eng'
  },
  {
    id: 'b-4795',
    name: 'ota-delta-2.3.9-to-2.4.0.zip',
    version: 'OTA Delta 2.3.9 → 2.4.0',
    channel: 'stable',
    branch: 'release/v2.3',
    commit: '8891ac3',
    commitMsg: 'Payload delta block map generated & verified',
    verification: 'Recovery Verified (24/24)',
    verificationStatus: 'success',
    size: '24.6 MB',
    sha256: '318cbe890ec44298fc1c149afbf4c899',
    timestamp: 'Sep 20 · 09:15 UTC',
    ciSource: 'Jenkins · #4795',
    author: 'OTA Pipeline'
  },
  {
    id: 'b-4822',
    name: 'relay-os-nightly-0926.img',
    version: '2.5.0-dev (Nightly 0926)',
    channel: 'nightly',
    branch: 'main',
    commit: '71b40fe',
    commitMsg: 'Experimental Android 16 QPR1 kernel 5.10.149 backports',
    verification: 'Nightly Soak Pending',
    verificationStatus: 'warning',
    size: '118.4 MB',
    sha256: '9fa0182bc44298fc1c149afbf4c8996f',
    timestamp: 'Today · 03:00 UTC',
    ciSource: 'Cron Automated',
    author: 'Auto Builder'
  }
];

const Builds = () => {
  const [channel, setChannel] = useState('all');
  const [search, setSearch] = useState('');
  const [copiedSha, setCopiedSha] = useState(null);
  const [selectedBuildForFlash, setSelectedBuildForFlash] = useState(null);
  const [flashTargetDevice, setFlashTargetDevice] = useState('x001');
  const [flashStatus, setFlashStatus] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredBuilds = INITIAL_BUILDS.filter(b => {
    const matchesChannel = channel === 'all' || b.channel === channel;
    const matchesSearch = 
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.version.toLowerCase().includes(search.toLowerCase()) ||
      b.commit.toLowerCase().includes(search.toLowerCase()) ||
      b.branch.toLowerCase().includes(search.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  const handleCopySha = (sha, id) => {
    navigator.clipboard?.writeText(sha);
    setCopiedSha(id);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  const handleSimulateFlash = () => {
    setFlashStatus('connecting');
    setTimeout(() => {
      setFlashStatus('fastboot-flashing');
      setTimeout(() => {
        setFlashStatus('rebooting');
        setTimeout(() => {
          setFlashStatus('success');
        }, 1500);
      }, 1500);
    }, 1000);
  };

  const tabsConfig = [
    { id: 'all', label: 'All Artifacts', count: INITIAL_BUILDS.length },
    { id: 'stable', label: 'Stable', count: INITIAL_BUILDS.filter(b => b.channel === 'stable').length },
    { id: 'release-candidate', label: 'Release Candidate', count: INITIAL_BUILDS.filter(b => b.channel === 'release-candidate').length },
    { id: 'nightly', label: 'Nightly', count: INITIAL_BUILDS.filter(b => b.channel === 'nightly').length }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Origin UI Inspired Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <StatCard
          label="Active Production Release"
          value="v2.4.0 (0919)"
          description="Golden Verified · 100% soak pass"
          icon={ShieldCheck}
          accentColor="#34d399"
          trend={{ type: 'up', text: 'STABLE' }}
        />
        <StatCard
          label="Release Candidate"
          value="v2.4.1-rc3"
          description="Build 0926 · 95.1% pass (17 bugs)"
          icon={Box}
          accentColor="#38bdf8"
          trend={{ type: 'neutral', text: 'RC-3' }}
        />
        <StatCard
          label="CI Verification Rate"
          value="98.4%"
          description="48/49 automated gates passed"
          icon={Zap}
          accentColor="#38bdf8"
          trend={{ type: 'up', text: '+2.1%' }}
        />
        <StatCard
          label="Artifact Repository"
          value={`${INITIAL_BUILDS.length} Binaries`}
          description="348.7 MB total · Cached on Artifactory"
          icon={Database}
          accentColor="#c084fc"
        />
      </div>

      {/* Origin UI Inspired Filter and Search Bar */}
      <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <Tabs
          tabs={tabsConfig}
          activeTab={channel}
          onChange={setChannel}
          variant="segmented"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search version, branch, commit..."
            shortcut="⌘F"
            width="280px"
          />
          <Button 
            variant="secondary"
            size="md"
            icon={Terminal}
            onClick={() => window.open('https://jenkins.internal/job/relay-a16', '_blank')}
          >
            CI Webhook Logs
          </Button>
          <Button 
            variant="primary"
            size="md"
            icon={Upload}
            onClick={() => setShowUploadModal(true)}
          >
            Upload Artifact
          </Button>
        </div>
      </div>

      {/* Artifacts Table with Origin UI Badges */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 20px' }}>ARTIFACT & VERSION</th>
              <th style={{ padding: '12px 20px' }}>CHANNEL</th>
              <th style={{ padding: '12px 20px' }}>BRANCH & COMMIT</th>
              <th style={{ padding: '12px 20px' }}>CI VERIFICATION</th>
              <th style={{ padding: '12px 20px' }}>SIZE & CHECKSUM</th>
              <th style={{ padding: '12px 20px' }}>BUILD TIME & SOURCE</th>
              <th style={{ padding: '12px 20px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuilds.map((build) => (
              <tr key={build.id}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8'
                    }}>
                      <Box size={16} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9', fontFamily: 'var(--font-mono)' }}>
                        {build.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#8896b3' }}>
                        {build.version}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <Badge 
                    variant={build.channel === 'stable' ? 'success' : build.channel === 'release-candidate' ? 'primary' : 'warning'}
                    size="sm"
                  >
                    {build.channel.replace('-', ' ')}
                  </Badge>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#cbd5e1' }}>
                      <GitBranch size={13} color="#60a5fa" />
                      <span style={{ fontWeight: '600' }}>{build.branch}</span>
                      <span style={{ color: '#64748b' }}>@</span>
                      <code style={{ background: '#090e18', padding: '1px 5px', borderRadius: '3px', fontSize: '11px', color: '#38bdf8', border: '1px solid #1a253c' }}>{build.commit}</code>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={build.commitMsg}>
                      {build.commitMsg}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <Badge 
                    variant={build.verificationStatus === 'success' ? 'success' : 'warning'}
                    pulse={build.verificationStatus !== 'success'}
                    size="sm"
                  >
                    {build.verification}
                  </Badge>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#f1f5f9', fontFamily: 'var(--font-mono)' }}>
                      {build.size}
                    </span>
                    <button 
                      onClick={() => handleCopySha(build.sha256, build.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10.5px',
                        color: copiedSha === build.id ? '#34d399' : '#64748b',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)'
                      }}
                      title="Click to copy SHA-256 fingerprint"
                    >
                      {copiedSha === build.id ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copiedSha === build.id ? 'Copied SHA!' : `${build.sha256.substring(0, 10)}...`}</span>
                    </button>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: '#cbd5e1' }}>{build.timestamp}</span>
                    <span style={{ color: '#64748b' }}>{build.ciSource} · {build.author}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button 
                      variant="secondary"
                      size="sm"
                      icon={Zap}
                      onClick={() => {
                        setSelectedBuildForFlash(build);
                        setFlashStatus(null);
                      }}
                    >
                      Flash to Bench
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      icon={Download}
                      onClick={() => alert(`Starting authenticated download of ${build.name}...`)}
                      style={{ padding: '0 8px' }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Origin UI Modal for Fastboot Flashing */}
      {selectedBuildForFlash && (
        <Modal
          isOpen={!!selectedBuildForFlash}
          onClose={() => setSelectedBuildForFlash(null)}
          title="Flash Firmware to Bench Hardware"
          description={`Direct Fastboot transport flash to hardware rig: ${selectedBuildForFlash.name}`}
          icon={Zap}
          iconColor="#38bdf8"
          maxWidth="560px"
          footer={
            <>
              <Button variant="outline" size="md" onClick={() => setSelectedBuildForFlash(null)}>
                Cancel
              </Button>
              {flashStatus !== 'success' ? (
                <Button 
                  variant="primary" 
                  size="md" 
                  icon={Zap}
                  loading={flashStatus && flashStatus !== 'connecting'}
                  onClick={handleSimulateFlash}
                >
                  Start Fastboot Flash
                </Button>
              ) : (
                <Button variant="primary" size="md" onClick={() => setSelectedBuildForFlash(null)}>
                  Flashing Complete
                </Button>
              )}
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#080d18', border: '1px solid #1a253c', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Target Package</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {selectedBuildForFlash.name}
              </div>
              <div style={{ fontSize: '11.5px', color: '#38bdf8', marginTop: '2px' }}>
                {selectedBuildForFlash.version} · {selectedBuildForFlash.size}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Target Fleet Node
              </label>
              <select 
                className="select-input" 
                value={flashTargetDevice}
                onChange={e => setFlashTargetDevice(e.target.value)}
                style={{ width: '100%', height: '38px' }}
              >
                <option value="x001">Relay Hub X-001 (Bench Bay A · USB-Fastboot ready)</option>
                <option value="x002">Relay Hub X-002 (Soak Chamber B · Warning: Soak active)</option>
                <option value="m002">Relay Micro M-002 (CAN Jig · Serial DFU ready)</option>
              </select>
            </div>

            {flashStatus && (
              <div style={{
                background: '#050811',
                border: '1px solid #1a243a',
                borderRadius: '6px',
                padding: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                lineHeight: '1.6',
                color: '#cbd5e1'
              }}>
                {flashStatus === 'connecting' && <div style={{ color: '#38bdf8' }}>&gt; fastboot devices -s RX1A0231... CONNECTED</div>}
                {flashStatus === 'fastboot-flashing' && (
                  <>
                    <div style={{ color: '#38bdf8' }}>&gt; fastboot flash boot boot.img (84 MB)...</div>
                    <div style={{ color: '#34d399' }}>&gt; [OKAY] 100% written in 4.2s (20.0 MB/s)</div>
                    <div style={{ color: '#fbbf24' }}>&gt; Verifying SHA-256 integrity hash...</div>
                  </>
                )}
                {flashStatus === 'rebooting' && (
                  <>
                    <div style={{ color: '#34d399' }}>&gt; [OKAY] Hash verified.</div>
                    <div style={{ color: '#38bdf8' }}>&gt; fastboot reboot... Waiting for adb online...</div>
                  </>
                )}
                {flashStatus === 'success' && (
                  <div style={{ color: '#34d399', fontWeight: '700' }}>
                    &gt; Device rebooted successfully! RelayOS 2.4.1 online (Uptime 0m 12s).
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Origin UI Modal for Upload */}
      {showUploadModal && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload Firmware Binary Artifact"
          description="Index new firmware binaries on Artifactory with cryptographic verification"
          icon={Upload}
          iconColor="#38bdf8"
          maxWidth="520px"
          footer={
            <>
              <Button variant="outline" size="md" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="md"
                onClick={() => {
                  alert('Firmware artifact uploaded and indexed on Artifactory.');
                  setShowUploadModal(false);
                }}
              >
                Upload & Verify Hash
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              border: '2px dashed #233452',
              borderRadius: '8px',
              padding: '28px 20px',
              textAlign: 'center',
              backgroundColor: '#0a0f1c',
              cursor: 'pointer'
            }}>
              <Upload size={26} color="#38bdf8" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>Drag & drop compiled firmware package</div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>Supports .bin, .img, .apk, .hex, or .tar.gz (up to 2 GB)</div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Release Channel</label>
              <select className="select-input" style={{ width: '100%', height: '36px' }}>
                <option value="rc">Release Candidate (RC)</option>
                <option value="stable">Production Stable</option>
                <option value="nightly">Nightly Engineering Build</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Target Branch & Commit SHA</label>
              <input 
                type="text" 
                className="search-input" 
                placeholder="e.g. main @ a7f43e1" 
                style={{ width: '100%', height: '36px', padding: '0 10px', fontSize: '12.5px' }} 
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Builds;
