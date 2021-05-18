// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


//locally running
// export const environment = {
//   production: false,
//   backendUrl : "http://localhost:53327/api/",
//   sewingKPIHeaderText: "Sewing Department KPI Analysis",
//   sewingHistKPIHeaderText: "Historical KPI Analysis",
//   efficiencyHeaderText : "Average efficiency",
//   capacityUtilizationHeaderText : "Average utilisation",
//   absenteeismHeaderText : "Average absenteeism",
//   defectHeaderText : "Average defect%",
//   rejectionHeaderText : "Overview of Rejection",
//   processOverviewHeaderText : "Overview of Process",
//   moduleOverviewHeaderText : "Overview of Factory",
//   moduleHistOverviewHeaderText : "Historical Factory Analysis",
//   dhuOverviewHeaderText : "Top DHU Overview",
//   inlineOverViewHeaderText: "Inline WIP Overview",
//   inlineWIPOperatorHeaderText: "Efficiency vs Quality Mapping",
//   operatorEfficiencyWIPHeaderText : "Efficiency and Defect Count of Operators",
//   downtimeHistoricalHeaderText: "Overview of Downtime",
//   downtimeOverviewHeaderText: "Overview of Machine Downtime",
//   defectHistoricalOverviewHeaderText : "Historical Overview of Top Defects"
// };

export const environment = {
  production: true,
  backendUrl : "https://rmg-web-api.azurewebsites.net/api/",
  sewingKPIHeaderText: "Sewing Department KPI Analysis",
  sewingHistKPIHeaderText: "Historical KPI Analysis",
  efficiencyHeaderText : "Average efficiency",
  capacityUtilizationHeaderText : "Average utilisation",
  absenteeismHeaderText : "Average absenteeism",
  defectHeaderText : "Average defect%",
  rejectionHeaderText : "Overview of Rejection",
  processOverviewHeaderText : "Overview of Process",
  moduleOverviewHeaderText : "Overview of Factory",
  moduleHistOverviewHeaderText : "Historical Factory Analysis",
  dhuOverviewHeaderText : "Top DHU Overview",
  inlineOverViewHeaderText: "Inline WIP Overview",
  inlineWIPOperatorHeaderText: "Efficiency vs Quality Mapping",
  operatorEfficiencyWIPHeaderText : "Efficiency and Defect Count of Operators",
  downtimeHistoricalHeaderText: "Overview of Downtime",
  downtimeOverviewHeaderText: "Overview of Machine Downtime",
  defectHistoricalOverviewHeaderText : "Historical Overview of Top Defects"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
