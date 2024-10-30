const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run license-checker to generate a JSON file
execSync('license-checker --json --production > licenses.json', { stdio: 'inherit' });

// Read the licenses.json file
const licensesFilePath = path.join(__dirname, 'licenses.json');
const licensesData = JSON.parse(fs.readFileSync(licensesFilePath, 'utf8'));

// Extract unique licenses and packages
const licensesSet = new Set();
const packages = [];

for (const [packageName, licenseInfo] of Object.entries(licensesData)) {
    const license = licenseInfo.licenses || 'Unknown';
    licensesSet.add(license);
    packages.push(`${packageName}; ${license}`);
}

// Convert sets to arrays and sort them
const licenses = Array.from(licensesSet).sort();
const sortedPackages = packages.sort();

// Generate the output string
const output = `Licences:\n${licenses.join('\n')}\n\nPackages:\n${sortedPackages.join('\n')}`;

// Write the output to a file
const outputFilePath = path.join(__dirname, 'dist/LICENCES.txt');
fs.writeFileSync(outputFilePath, output, 'utf8');

console.log('License information has been written to licenses-output.txt');
