const fs = require('fs');
const path = require('path');

const colorMap = {
  '#fcfaf7': '#FDFCF8',
  '#f8ede5': '#F2EDE4',
  '#f4ebe1': '#E0D8CC',
  '#f4ebd0': '#F2EDE4',
  '#faf4ef': '#FDFCF8',
  '#faf6f2': '#FDFCF8',
  '#ebdcd0': '#E0D8CC',
  '#e2cca4': '#E0D8CC',
  '#e8d9cc': '#E0D8CC',
  '#3b2319': '#2D3047',
  '#422216': '#2D3047',
  '#2c221e': '#2D3047',
  '#523326': '#2D3047',
  '#8c6b5d': '#64748b',
  '#a88273': '#94a3b8',
  '#703b28': '#2D3047',
  '#6e5347': '#64748b',
  '#8c4a32': '#D46A43',
  '#b86142': '#c05a38',
  '#d97706': '#F2C94C',
  '#753c28': '#c05a38',
  '#a05236': '#c05a38',
  '#27150e': '#1e2030',
  '#92400e': '#2D3047',
  '#fef3c7': '#F2C94C',
  '#fde68a': '#F2C94C',
  '#fef08a': '#F2C94C',
  '#e8d2c4': '#F2EDE4',
  '#f3e3d3': '#E0D8CC',
  '#f3e9e0': '#E0D8CC',
  '#eedfc0': '#E0D8CC',
  '#e6d3c5': '#E0D8CC',
  '#f2e6dc': '#F2EDE4',
  '#f5ece3': '#F2EDE4',
  '#e2d5c7': '#E0D8CC',
  '#f2e3d5': '#F2EDE4',
  '#6e4635': '#64748b',
  '#a88273': '#94a3b8',
  '#522518': '#2D3047',
  '#d6c4b8': '#E0D8CC',
  '#c87d53': '#D46A43',
  '#e8bfa0': '#F2EDE4',
  '#dc2626': '#D46A43',
  '#e6d3b0': '#E0D8CC',
  '#f5ece3': '#F2EDE4',
  '#e2d5c7': '#E0D8CC'
};

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css'));
files.push('./index.html');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  Object.keys(colorMap).forEach(oldColor => {
    const regex = new RegExp(oldColor, 'gi');
    if (regex.test(content)) {
      content = content.replace(regex, colorMap[oldColor]);
      changed = true;
    }
  });
  
  if (content.includes('font-display')) {
    content = content.replace(/font-display/g, 'font-serif italic');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
