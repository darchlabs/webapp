import type { GroupReport } from "~/routes/admin/index";

export type ServiceInsigths = {
  dateWorkingState: number[];
  totalInstances: number;
  totalErrors: number;
};

export default function getServiceInsights(
  serviceGroup: GroupReport[] | undefined,
  dateArrayLen: number
): ServiceInsigths {
  // Declare errors
  let errors = 0;
  let totalInstances = 0;

  // Initialize working percentage array with all values in 0
  // The length of this array also represents the date. For example each index is the hour
  const workingPercentages: number[] = [];
  for (let i = 0; i < dateArrayLen; i++) {
    workingPercentages.push(0);
  }
  // If the service is undefined, then return the data with zero values
  if (!serviceGroup) {
    return {
      dateWorkingState: workingPercentages,
      totalErrors: errors,
      totalInstances: totalInstances,
    };
  }
  console.log("serviceGroup[0].type: ", serviceGroup[0].type);

  // get the working state and the total errors of the group using the elements of the given date array
  serviceGroup.forEach((service) => {
    errors = 0;
    const serviceReports = service.reports;
    totalInstances = serviceReports.length;
    const reportHour = new Date(service.createdAt).getHours();

    // If the report hour doesn't match the working
    if (reportHour > workingPercentages.length) {
      return;
    }

    serviceReports.forEach((service) => {
      console.log("service.status: ", service.status);
      // Check if the report is in the hour range
      if (service.status !== "running" && service.status !== "stopped") {
        // If it matches the hour range, and is not running or stopped, then add the error
        errors += 1;
      }
    });

    // Calc the running percentage
    const errorsPercentage = (errors * 100) / totalInstances;
    const runningPercentage = 100 - errorsPercentage;
    // Update the working percentage array on the given index that matches the hour
    workingPercentages.splice(reportHour, 1, runningPercentage);
  });

  return {
    dateWorkingState: workingPercentages,
    totalErrors: errors,
    totalInstances,
  };
}
