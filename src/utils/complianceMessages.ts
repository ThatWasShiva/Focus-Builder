import type { ComplianceReport } from '../hooks/useComplianceTracker';

export const getComplianceFeedback = (report: ComplianceReport, mode: 'free' | 'task', baseSeconds: number) => {
  let message = "";
  let streakImpact = false;
  let multiplier = 1.0;
  let color = "border-l-primary"; // fallback

  if (report.complianceLevel === 'full') {
    message = mode === 'free' 
      ? "Excellent. You stayed focused." 
      : "Well done. Constraint fulfilled perfectly.";
    streakImpact = true;
    multiplier = 1.0;
    color = "border-l-green-500/80";
  } else if (report.complianceLevel === 'partial') {
    message = `Good effort. You peeked ${report.totalViolations} time${report.totalViolations > 1 ? 's' : ''}, but you came back. Progress over perfection.`;
    streakImpact = true;
    multiplier = 0.75;
    color = "border-l-yellow-500/80";
  } else {
    message = "That session didn't go as planned. The urge is strong. Let's try again when you're ready.";
    streakImpact = false;
    multiplier = 0.0;
    color = "border-l-red-500/80";
  }

  // Original formula is baseSeconds * 0.5 per foot. Apply multiplier for partial/none.
  const finalFeet = (baseSeconds * 0.5) * multiplier;

  return {
    message,
    streakImpact,
    feetSavedToAdd: finalFeet,
    colorStyle: color
  };
};
