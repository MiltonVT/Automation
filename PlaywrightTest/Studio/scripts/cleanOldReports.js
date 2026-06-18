#!/usr/bin/env node

/**
 * Clean up old test reports (older than 7 days by default)
 * Usage: node scripts/cleanOldReports.js [days]
 * Example: node scripts/cleanOldReports.js 3  (removes reports older than 3 days)
 */

const fs = require('fs');
const path = require('path');

function cleanOldReports(daysOld = 7) {
  const reportsArchiveDir = path.join(__dirname, '..', 'reports-archive');
  
  if (!fs.existsSync(reportsArchiveDir)) {
    console.log('📁 No reports archive directory found.');
    return;
  }
  
  const reports = fs.readdirSync(reportsArchiveDir)
    .filter(file => fs.statSync(path.join(reportsArchiveDir, file)).isDirectory());
  
  if (reports.length === 0) {
    console.log('📁 No reports found to clean.');
    return;
  }
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  console.log(`🧹 Cleaning reports older than ${daysOld} days...`);
  console.log(`📅 Cutoff date: ${cutoffDate.toLocaleString()}\n`);
  
  let deletedCount = 0;
  
  reports.forEach((report) => {
    const reportPath = path.join(reportsArchiveDir, report);
    const stats = fs.statSync(reportPath);
    
    if (stats.mtime < cutoffDate) {
      try {
        fs.rmSync(reportPath, { recursive: true, force: true });
        console.log(`❌ Deleted: ${report}`);
        deletedCount++;
      } catch (err) {
        console.log(`⚠️  Failed to delete ${report}: ${err.message}`);
      }
    }
  });
  
  console.log(`\n✅ Cleanup complete! Deleted ${deletedCount} old report(s).`);
}

// Parse command line arguments
const daysOld = parseInt(process.argv[2]) || 7;

if (daysOld < 1) {
  console.log('❌ Days must be at least 1');
  process.exit(1);
}

cleanOldReports(daysOld);
