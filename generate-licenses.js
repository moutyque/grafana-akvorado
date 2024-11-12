const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the list of production dependencies in JSON format
const listedPackagesJson = execSync('npm list -prod -depth 0 --json')
  .toString();

// Parse the JSON to extract the package names and versions
const listedPackages = Object.entries(JSON.parse(listedPackagesJson).dependencies)
  .map(([key, value]) => `${key}@${value.version}`)
  .join(';');

let cmd = `license-checker --json --packages '${listedPackages}' > licenses.json`;
console.log(cmd);

// Run license-checker on the listed packages and output to licenses.json
execSync(cmd, { stdio: 'inherit' });

// Read the licenses.json file
const licensesFilePath = path.join(__dirname, 'licenses.json');
const licensesData = JSON.parse(fs.readFileSync(licensesFilePath, 'utf8'));

// Extract unique licenses and packages
const licensesSet = new Set();
const packages = [];

for (const [packageName, licenseInfo] of Object.entries(licensesData)) {
  const license = licenseInfo.licenses || 'Unknown';
  licensesSet.add(license);
  packages.push({ name: packageName, license, licenseFile: licenseInfo.licenseFile });
}

// Convert sets to arrays and sort them
const licenses = Array.from(licensesSet).sort();
const sortedPackages = packages.sort((a, b) => a.name.localeCompare(b.name));

// Create directories and copy license files
const outputDir = path.join(__dirname, 'LICENSES');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

sortedPackages.forEach(({ name, license, licenseFile }) => {
  const packageDir = path.join(outputDir, name);
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
  }
  if (licenseFile) {
    const licensePath = path.resolve(licenseFile);

    if (fs.lstatSync(licensePath).isFile() && licensePath.endsWith('LICENSE')) {
      // If licenseFile is a file, copy it directly
      const destFilePath = path.join(packageDir, 'LICENSE');
      fs.copyFileSync(licensePath, destFilePath);
    } else  {
      // If licenseFile is a directory, search for LICENSE files
      const dir = path.dirname(licensePath)
      const files = fs.readdirSync(dir);
      const licenseFiles = files.filter(file => file.startsWith('LICENSE'));
      if (licenseFiles.length > 0) {
        licenseFiles.forEach(file => {
          const sourceFilePath = path.join(dir, file);
          const destFilePath = path.join(packageDir, 'LICENSE');
          fs.copyFileSync(sourceFilePath, destFilePath);
        });
      } else {
        // If no LICENSE file is found, write the license text to the file
        fs.writeFileSync(path.join(packageDir, 'LICENSE'), license, 'utf8');
      }
    }
  } else {
    // If no licenseFile is provided, write the license text to the file
    fs.writeFileSync(path.join(packageDir, 'LICENSE'), license, 'utf8');
  }
});

// Generate the output string for the summary file
const outputSummary = `Licences:\n${licenses.join('\n')}\n\nPackages:\n${sortedPackages
  .map(({ name, license }) => `${name}; ${license}`)
  .join('\n')}`;

// Write the output summary to a file
const outputSummaryFilePath = path.join(outputDir, 'LICENCES.txt');
fs.writeFileSync(outputSummaryFilePath, outputSummary, 'utf8');

console.log('License information has been written to LICENSES/LICENCES.txt');
