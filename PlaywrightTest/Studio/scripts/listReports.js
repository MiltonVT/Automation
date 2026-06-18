#!/usr/bin/env node

/**
 * List all saved test reports with their details
 */

const fs = require('fs');
const path = require('path');

function listReports() {
  const reportsArchiveDir = path.join(__dirname, '..', 'reports-archive');
  
  if (!fs.existsSync(reportsArchiveDir)) {
    console.log('📁 No reports archive directory found yet.');
    console.log('💡 Run a test with npm run test:*:report to create reports.\n');
    return;
  }
  
  const reports = fs.readdirSync(reportsArchiveDir)
    .filter(file => fs.statSync(path.join(reportsArchiveDir, file)).isDirectory())
    .sort()
    .reverse();
  
  if (reports.length === 0) {
    console.log('📁 No reports found in reports-archive directory.\n');
    return;
  }
  
  console.log(`📊 Found ${reports.length} test report(s):\n`);
  
  reports.forEach((report, index) => {
    const reportPath = path.join(reportsArchiveDir, report);
    const stats = fs.statSync(reportPath);
    const htmlPath = path.join(reportPath, 'html-report', 'index.html');
    const hasHtmlReport = fs.existsSync(htmlPath);
    
    console.log(`${index + 1}. 📁 ${report}`);
    console.log(`   📅 Created: ${stats.mtime.toLocaleString()}`);
    console.log(`   📄 Has HTML Report: ${hasHtmlReport ? '✅' : '❌'}`);
    console.log(`   📍 Path: ${reportPath}`);
    console.log();
  });
  
  console.log(`💡 To view a specific report, open: ${path.join(reportsArchiveDir, reports[0], 'html-report', 'index.html')}`);
}

listReports();
