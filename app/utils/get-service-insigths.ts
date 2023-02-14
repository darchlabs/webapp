import type { GroupReport } from "~/routes/admin/index";

export type ServiceInsigths = {
  dateWorkingState: number[];
  totalInstances: number;
  totalErrors: number;
};

export default function getServiceInsights(
  serviceGroup: GroupReport[],
  dateArrayLen: number
): ServiceInsigths {
  // Declare errors
  let errors = 0;
  let totalJobs = 0;

  // Initialize working percentage array with all values in 0
  // The length of this array also represents the date. For example each index is the hour
  const workingPercentages: number[] = [];
  for (let i = 0; i < dateArrayLen; i++) {
    workingPercentages.push(0);
  }

  // get the working state and the total errors of the group using the elements of the given date array
  serviceGroup.forEach((service) => {
    errors = 0;
    const jobsReports = service.reports;
    totalJobs = jobsReports.length;
    const reportHour = new Date(service.createdAt).getHours();

    // If the report hour doesn't match the working
    if (reportHour > workingPercentages.length) {
      return;
    }

    jobsReports.forEach((job) => {
      // Check if the report is in the hour range
      if (job.status !== ("running" || "stopped")) {
        // If it matches the hour range, and is not running or stopped, then add the error
        errors += 1;
      }
    });

    // Calc the running percentage
    const errorsPercentage = (errors * 100) / totalJobs;
    const runningPercentage = 100 - errorsPercentage;
    // Update the working percentage array on the given index that matches the hour
    workingPercentages.splice(reportHour, 1, runningPercentage);
  });

  return {
    dateWorkingState: workingPercentages,
    totalInstances: totalJobs,
    totalErrors: errors,
  };
}
