const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, '../public/icon-192.png');
const imgBuffer = fs.readFileSync(imgPath);
const base64 = imgBuffer.toString('base64');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 64" fill="none" role="img" aria-label="Ekak Logo">
  <defs>
    <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#194db8" flood-opacity="0.18" />
    </filter>
  </defs>

  <!-- Emblem / Icon Group -->
  <g transform="translate(4, 4)" filter="url(#softShadow)">
    <image href="data:image/png;base64,${base64}" x="0" y="0" width="56" height="56" />
  </g>

  <!-- Brand Typography -->
  <text x="68" y="37" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" letter-spacing="-0.03em" fill="#194db8">
    EKAK
  </text>
  <text x="146" y="36" font-family="'Nirmala UI', 'Noto Sans Devanagari', sans-serif" font-size="16" font-weight="700" fill="#f59e0b">
    [एकक]
  </text>
  
  <!-- Subtitle -->
  <text x="70" y="51" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" letter-spacing="0.16em" text-transform="uppercase" fill="#475569">
    ACCESSIBILITY FOR EVERY ONE
  </text>
</svg>`;

const outPath = path.join(__dirname, '../public/ekak-logo.svg');
fs.writeFileSync(outPath, svgContent, 'utf8');
console.log('Successfully written to', outPath);

