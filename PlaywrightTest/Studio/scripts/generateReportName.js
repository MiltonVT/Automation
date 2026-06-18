#!/usr/bin/env node

/**
 * Generate a unique report directory name based on timestamp and test name
 * Format: YYYY-MM-DD_HH-MM-SS_test-short-name
 */

const fs = require('fs');
const path = require('path');

function generateReportName(testName = 'all-tests') {
  // Get current date and time
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  // Create short test name (lowercase, replace spaces and special chars)
  const shortTestName = testName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 40); // Limit length
  
  // Generate final report name
  const reportName = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}_${shortTestName}`;
  
  return reportName;
}

function ensureReportsArchiveDir() {
  const reportsArchiveDir = path.join(__dirname, '..', 'reports-archive');
  
  if (!fs.existsSync(reportsArchiveDir)) {
    fs.mkdirSync(reportsArchiveDir, { recursive: true });
    console.log(`✅ Created reports archive directory: ${reportsArchiveDir}`);
  }
  
  return reportsArchiveDir;
}

function getReportPath(testName = 'all-tests') {
  const reportsArchiveDir = ensureReportsArchiveDir();
  const reportName = generateReportName(testName);
  const reportPath = path.join(reportsArchiveDir, reportName);
  
  return reportPath;
}

// Export functions for use in other scripts
module.exports = {
  generateReportName,
  ensureReportsArchiveDir,
  getReportPath,
};

// If run directly from command line
if (require.main === module) {
  const testName = process.argv[2] || 'all-tests';
  const reportPath = getReportPath(testName);
  console.log(reportPath);
}
