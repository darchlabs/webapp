import type { GroupReport } from "@routes/examples";

export type ServiceInsigths = {
  dateWorkingState: number[];
  totalInstances: number[];
  totalErrors: number[];
};

export function getServiceInsights(serviceGroup: GroupReport[] | undefined, dateArrayLen: number): ServiceInsigths {
  // Declare errors
  let totalErrors: number[] = [];
  let totalInstances: number[] = [];

  // Initialize working percentage array with all values in -1, meaning that there are no values
  // The length of this array also represents the date. For example each index is the hour
  const workingPercentages: number[] = [];
  for (let i = 0; i < dateArrayLen; i++) {
    workingPercentages.push(0);
    totalInstances.push(0);
    totalErrors.push(0);
  }
  // If the service is undefined, then return the data with zero values
  if (!serviceGroup) {
    return {
      dateWorkingState: workingPercentages,
      totalErrors,
      totalInstances,
    };
  }

  // get the working state and the total errors of the group using the elements of the given date array
  serviceGroup.forEach((service) => {
    let errors = 0;
    const serviceReports = service.reports;
    const instances = serviceReports.length;
    const reportHour = new Date(service.createdAt).getHours();

    // If the report hour doesn't match the working
    if (reportHour > workingPercentages.length) {
      return;
    }

    serviceReports.forEach((service) => {
      // Check if the report is in the hour range
      if (service.status !== "running" && service.status !== "stopped") {
        // If it matches the hour range, and is not running or stopped, then add the error
        errors += 1;
      }
    });

    // Calc the running percentage
    const errorsPercentage = (errors * 100) / instances;
    const runningPercentage = 100 - errorsPercentage;
    // Update the working percentage array on the given index that matches the hour
    workingPercentages.splice(reportHour, 1, runningPercentage);
    totalInstances.splice(reportHour, 1, instances);
    totalErrors.splice(reportHour, 1, errors);
  });

  return {
    dateWorkingState: workingPercentages,
    totalErrors,
    totalInstances,
  };
}

export function getAllServicesInsight(
  periodArr: any[],
  syncServiceInfo: ServiceInsigths,
  jobsServiceInfo: ServiceInsigths,
  nodesServiceInfo: ServiceInsigths
): number[] {
  const allServicesState: number[] = [];

  periodArr.forEach((_, index) => {
    const totalInstances =
      syncServiceInfo.totalInstances[index] +
      jobsServiceInfo.totalInstances[index] +
      nodesServiceInfo.totalInstances[index];

    const totalErrors =
      syncServiceInfo.totalErrors[index] + jobsServiceInfo.totalErrors[index] + nodesServiceInfo.totalErrors[index];

    const workingInstances = totalInstances - totalErrors;

    const totalServicesInstances = (workingInstances * 100) / totalInstances;

    allServicesState.push(totalServicesInstances);
  });

  return allServicesState;
}
