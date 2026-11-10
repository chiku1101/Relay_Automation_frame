import React from 'react';
import Ballpit from './Ballpit';

const Devices = () => {
  return (
    <div 
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        height: 'calc(100vh - 112px)', 
        minHeight: '500px', 
        width: '100%',
        borderRadius: '12px',
        border: '1px solid #1a253c',
        background: '#070b13'
      }}
    >
      <Ballpit
        count={200}
        colors={["#ffffff"]}
        material="satin"
        gravity={0}
        drift={0.4}
        followCursor
        grab
        clickEffect="burst"
        minSize={0.5}
        maxSize={1}
        friction={0.9975}
        wallBounce={0.95}
        bounce={0.85}
        depth={2}
        cursorSize={1}
        lightColor="#ffffff"
        lightIntensity={1}
        exposure={1}
        shadows={0.6}
        intro
      />
    </div>
  );
};

export default Devices;
