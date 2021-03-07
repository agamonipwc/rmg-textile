using Entities;
using Microsoft.AspNetCore.Mvc;
using RMGWebApi.Utility;
using RMGWebApi.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KPICalculationController : Controller
    {
        private readonly  RepositoryContext _rmgDbContext;
        CustomResponse customResponse = new CustomResponse();
        List<string> lineChartColors = new List<string>() { "#eb8c00", "#d04a02", "#6e2a35", "#003dab", "#db536a" };
        List<string> columnChartColor = new List<string>() { "#0089eb", "#175c2c", "#a43e50", "#deb8ff", "#eb8c00" };
        DateTime? date = Convert.ToDateTime("2021-01-31 00:00:00.000");
        public KPICalculationController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        public JsonResult Get()
        {
            try
            {
                
                var linesData = _rmgDbContext.Line.ToList();
                var unitData = _rmgDbContext.Unit.ToList();
                var locationData = _rmgDbContext.Location.ToList();
                dynamic data = new { lineMasterData = linesData , unitMasterData = unitData, locationMasterData = locationData };
                return Json(new
                {
                    responseData = data,
                    statusCode = 200
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    responseData = ex.Message,
                    statusCode = 500
                });
            }

        }

        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            
            var kpiResults = new {
                CapaCityCalculation = CapacityCalculation(kpiViewModel),
                Efficiency = CalculateEfficiency(kpiViewModel),
                //DefectRejectDHUPercentage = CalculateDHUDefectRejection(kpiViewModel),
                MMRWIPInline= CalculateMMRInlineWIP(kpiViewModel),
                StatusCode = 200
            };
            return Json(kpiResults);
        }

        private JsonResult CapacityCalculation(KPIViewModel kpiViewModel)
        {
            //double sumofProductionDataLineWise = 0;
            //double sumofStyleDataLineWise = 0;
            var styleData = _rmgDbContext.StyleData.Average(x => x.SewingSAM);
            var productionData = _rmgDbContext.Production.Where(x => x.Date == date).Average(x => x.Data);
            //var productionDataByYearGroup = _rmgDbContext.Production.Where(x =>
            //    kpiViewModel.Year.Contains(x.Date.Year) &&
            //    kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line, x.Date.Month, x.Date.Year })
            //    .Select(grp => new ProductionViewModel { ProdData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            //var styleDataByLineWise = _rmgDbContext.StyleData.Where(x =>
            //    kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line })
            //    .Select(grp => new StyleDataViewModel{ StyleData = grp.Average(c => c.PlannedProductionpcs), Line = grp.Key.Line }).ToList();

            //for (int index = 0; index < productionDataByYearGroup.Count; index++)
            //{
            //    sumofProductionDataLineWise += productionDataByYearGroup[index].ProdData;
            //}

            //for (int index = 0; index < styleDataByLineWise.Count; index++)
            //{
            //    sumofStyleDataLineWise += styleDataByLineWise[index].StyleData;
            //}

            var capacityUtilized = Math.Round((productionData / styleData));
            //var capacityNonUtilized = Math.Round(100 - capacityUtilized);

            //var productionDataByLineGroup = _rmgDbContext.Production.Where(x =>
            //    kpiViewModel.Year.Contains(x.Date.Year) &&
            //    kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line})
            //    .Select(grp => new { ProdData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            //CapacityUtilizationNested capacityUtilizationNested = new CapacityUtilizationNested();
            //List<int> dataList = new List<int>();
            //var query = (from s in productionDataByLineGroup
            //             join cs in styleDataByLineWise on new { s.Line } equals new { cs.Line }
            //             select new CapacityUtilizationParameter
            //             {
            //                 parameterValue = Convert.ToInt32( Math.Round((s.ProdData / cs.StyleData) * 100)),
            //                 line = s.Line.ToString()
            //            }).ToList();

            //foreach(var element in query)
            //{
            //    dataList.Add(element.parameterValue);
            //    //capacityUtilizationNested.data.Add(element.parameterValue);
            //}
            //capacityUtilizationNested.nestedData = dataList;
            //capacityUtilizationNested.id = "utilized";
            //capacityUtilizationNested.type = "column";

            //CapacityUtilizationSeries capacityUtilizationSeries = new CapacityUtilizationSeries();
            //List<CapacityUtilizationDrilldown> capacityUtilizationDrilldowns = new List<CapacityUtilizationDrilldown>();
            //capacityUtilizationDrilldowns.Add(new CapacityUtilizationDrilldown
            //{
            //    drilldown = "utilized",
            //    y = Convert.ToInt32(capacityUtilized), 
            //    name = "Utilized"
            //});
            //capacityUtilizationDrilldowns.Add(new CapacityUtilizationDrilldown
            //{
            //    drilldown = "",
            //    y = Convert.ToInt32(capacityNonUtilized),
            //    name = "Non-Utilized"
            //});
            //capacityUtilizationSeries.data = capacityUtilizationDrilldowns;
            //capacityUtilizationSeries.colorByPoint = true;
            //capacityUtilizationSeries.name = "Capacity";
            #region weightage calculation
            int gainedWeightage = 0;
            if (capacityUtilized == 0)
            {
                gainedWeightage = 0;
            }
            else if (capacityUtilized > 0 && capacityUtilized <= 25)
            {
                gainedWeightage = 1;
            }
            else if (capacityUtilized >= 26 && capacityUtilized <= 50)
            {
                gainedWeightage = 2;
            }
            else if (capacityUtilized >= 51 && capacityUtilized <= 80)
            {
                gainedWeightage = 3;
            }
            else if (capacityUtilized >= 81 && capacityUtilized <= 90)
            {
                gainedWeightage = 4;
            }
            else
            {
                gainedWeightage = 5;
            }
            #endregion
            var weitageCalculation = Math.Round(gainedWeightage * 0.10, 2);
            #region color code calculation
            string colorCode = "";
            if (weitageCalculation < 0.16)
            {
                colorCode = "#e0301e";
            }
            else if (weitageCalculation >= 0.16 && weitageCalculation < 0.32)
            {
                colorCode = "#ffb600";
            }
            else
            {
                colorCode = "#175d2d";
            }
            #endregion

            object[] objectArray = new object[2];
            objectArray[0] = date.Value.Date.ToString("dd/MM/yyyy");
            objectArray[1] = gainedWeightage;
            return Json(new
            {
                capacityUtilizationResponse = objectArray,
                colorCode = colorCode
            });
        }

        private JsonResult CalculateEfficiency(KPIViewModel kpiViewModel)
        {
            var styleData = _rmgDbContext.StyleData.Average(x => x.SewingSAM);
            var workingHoursData = _rmgDbContext.WorkingHrs.Where(x => x.Date == date).Average(x => x.Data);
            var operatorNosData= _rmgDbContext.OperatorNos.Where(x=> x.Date == date).Average(x => x.Data);
            var helpersData = _rmgDbContext.Helpers.Where(x => x.Date == date).Average(x => x.Data);
            var productionData = _rmgDbContext.Production.Where(x => x.Date == date).Average(x => x.Data);
            var efficiency = (Math.Round((productionData * styleData) / (workingHoursData * (operatorNosData + helpersData)), 2)) * 100;

            //var styleDataByLineWise = _rmgDbContext.StyleData.Where(x =>
            //    kpiViewModel.Line.Contains(x.Line)).GroupBy(x=> new { x.Line })
            //    .Select(grp => new StyleDataViewModel{ StyleData = grp.Average(x=> x.SewingSAM), Line = grp.Key.Line }).ToList();

            //var workingHoursByLineWise = _rmgDbContext.WorkingHrs.Where(x =>
            //    kpiViewModel.Year.Contains(x.Date.Year) &&
            //    kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line})
            //    .Select(grp => new WorkingHoursViewModel { WorkingHrsData = grp.Average(c => c.Data), Line = grp.Key.Line}).ToList();

            //var operatorNosByLineWise = _rmgDbContext.OperatorNos.Where(x =>
            //    kpiViewModel.Year.Contains(x.Date.Year) &&
            //    kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
            //    .Select(grp => new OperatorViewModel { OperatorData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            //var helpersByLineWise = _rmgDbContext.Helpers.Where(x =>
            //    kpiViewModel.Year.Contains(x.Date.Year) &&
            //    kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line})
            //    .Select(grp => new HelpersViewModel { HelperData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            //var productionDataByYearGroup = _rmgDbContext.Production.Where(x =>
            //    kpiViewModel.Year.Contains(x.Date.Year) &&
            //    kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line})
            //    .Select(grp => new ProductionViewModel { ProdData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            //List<EfficiencyViewModel> efficiencyViews = new List<EfficiencyViewModel>();
            //List<EfficiencyWeitageViewModel> efficiencyWeitageViewModels = new List<EfficiencyWeitageViewModel>();
            //List<string> monthCategory = new List<string>();
            //foreach(var element in kpiViewModel.Line)
            //{
            //    switch (element)
            //    {
            //        case 1:
            //            monthCategory.Add("Line1");
            //            break;
            //        case 2:
            //            monthCategory.Add("Line2");
            //            break;
            //        case 3:
            //            monthCategory.Add("Line3");
            //            break;
            //        case 4:
            //            monthCategory.Add("Line4");
            //            break;
            //        case 5:
            //            monthCategory.Add("Line5");
            //            break;
            //    }
            //}

            //List<double> efficiencyPercentageValues = new List<double>();
            //var query = (from s in workingHoursData
            //             join cs in operatorNosData on new { s.Line } equals new { cs.Line }
            //             join os in helpersData on new { s.Line } equals new { os.Line }
            //             join x in productionDataByYearGroup on new { s.Line } equals new { x.Line }
            //             join style in styleData on new {s.Line} equals new {style.Line}
            //             select new EfficiencyParameters
            //             {
            //                 efficiency = (Math.Round((x.ProdData * style.StyleData) / (s.WorkingHrsData * (cs.OperatorData + os.HelperData)), 2))*100,
            //                 Month = s.Line.ToString(),
            //                 //Year = s.Year.ToString(),
            //             }).ToList();

            //foreach (var queryElement in query)
            //{
            //    efficiencyPercentageValues.Add(queryElement.efficiency);
            //}
            //EfficiencyWeitageViewModel viewModel = new EfficiencyWeitageViewModel();
            //efficiencyWeitageViewModels.Add(new EfficiencyWeitageViewModel
            //{
            //    name = string.Join(' ', "Efficiency on ", kpiViewModel.Year[0].ToString()),
            //    data = efficiencyPercentageValues,
            //    type = "spline",
            //    color = lineChartColors[0],
            //    tooltip = new { valueSuffix = "%" }
            //});
            double weightageScore = 0;
            int scoreCard = 0;
            #region calculate weightage
            if(efficiency == 0)
            {
                weightageScore = efficiency * 0;
                scoreCard = 0;
            }
            else if (efficiency > 0 && efficiency <= 25)
            {
                weightageScore = efficiency * 1;
                scoreCard = 1;
            }
            else if (efficiency >= 26 && efficiency <= 50)
            {
                weightageScore = efficiency * 2;
                scoreCard = 2;
            }
            else if (efficiency >= 51 && efficiency <= 80)
            {
                weightageScore = efficiency * 3;
                scoreCard = 3;
            }
            else if (efficiency >= 81 && efficiency <=90)
            {
                weightageScore = efficiency * 4;
                scoreCard = 4;
            }
            else
            {
                weightageScore = efficiency * 5;
                scoreCard = 5;
            }
            #endregion
            #region Calculate color code
            string colorCode = "";
            if(weightageScore < 0.25)
            {
                colorCode = "#e0301e";
            }
            else if (weightageScore >= 0.25 && weightageScore < 0.5)
            {
                colorCode = "#ffb600";
            }
            else
            {
                colorCode = "#175d2d";
            }
            #endregion
            object[] objectArray = new object[2];
            objectArray[0] = date.Value.Date.ToString("dd/MM/yyyy");
            objectArray[1] = scoreCard;
            return Json(new
            {
                efficiencyResponse = objectArray,
                colorCode = colorCode
            });


        }

        private JsonResult CalculateDHUDefectRejection(KPIViewModel kpiViewModel)
        {
            double avgProductionDataByYearGroup = 0;
            var productionData = _rmgDbContext.Production.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
                .Select(grp => new ProductionViewModel { ProdData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            if(productionData.Count > 0)
            {
                avgProductionDataByYearGroup = productionData.Average(x => x.ProdData);
            }

            var rejectionData = _rmgDbContext.Rejection.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
                .Select(grp => new RejectionViewModel { RejectionData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            double avgRejectionDataByYearGroup = 0;
            if(rejectionData.Count > 0)
            {
                avgRejectionDataByYearGroup = rejectionData.Average(x => x.RejectionData);
            }

            var alterationData = _rmgDbContext.Rejection.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line})
                .Select(grp => new AlterationViewModel { AlterationData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();
            
            double avgAlterationDataByYearGroup = 0;
            if(alterationData.Count > 0)
            {
                avgAlterationDataByYearGroup = alterationData.Average(x => x.AlterationData);
            }
            List<DHURejectDefect> seriesData = new List<DHURejectDefect>();
            if (avgProductionDataByYearGroup > 0)
            {
                //var percentageDefection = Math.Round(((avgRejectionDataByYearGroup + avgAlterationDataByYearGroup) / avgProductionDataByYearGroup), 2);
                //var percentageRejection = Math.Round((avgRejectionDataByYearGroup / avgProductionDataByYearGroup), 2);

                var percentageDefection = 0.07;
                var percentageRejection = 0.03;


                double defectionWeightage = 0;
                if(percentageDefection >=0 && percentageDefection <= 5)
                {
                    defectionWeightage = 0.1 * 3;
                }
                else if (percentageDefection >= 6 && percentageDefection <= 20)
                {
                    defectionWeightage = 0.1 * 2;
                }
                else
                {
                    defectionWeightage = 0.1 * 1;
                }
                double rejectionWeitage = 0;
                if (rejectionWeitage >= 0 && percentageDefection <= 1)
                {
                    defectionWeightage = 0.1 * 3;
                }
                else if (percentageDefection >= 2 && percentageDefection <= 5)
                {
                    defectionWeightage = 0.1 * 2;
                }
                else
                {
                    defectionWeightage = 0.1 * 1;
                }

                double percentageDHU = 9.9;
                string dhuColor = "";
                string dhuTextColor = "";
                string defectColor = "";
                string defectTextColor = "";
                string rejectColor = "";
                string rejectTextColor = "";
                var dhuData = _rmgDbContext.DHU.Where(x =>
                    kpiViewModel.Year.Contains(x.Date.Year) &&
                    kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Date.Month, x.Date.Year })
                    .Select(grp => new DHUViewModel { DHUData = grp.Average(c => c.Data), Year = grp.Key.Year, Month = grp.Key.Month }).ToList();
                if(dhuData.Count > 0)
                {
                    //percentageDHU = Math.Round(dhuData.Average(x => x.DHUData),2);
                    double weightagetage = 0;
                    if (percentageDHU > 11)
                    {
                        weightagetage = (0 * 0.05);
                    }
                    else if (percentageDHU <= 11 && percentageDHU > 10)
                    {
                        weightagetage = 1 * 0.05;
                    }
                    else if (percentageDHU <= 10 && percentageDHU > 9)
                    {
                        weightagetage = 2 * 0.05;
                    }
                    else if (percentageDHU <= 9 && percentageDHU > 8)
                    {
                        weightagetage = 3 * 0.05;
                    }
                    else if (percentageDHU <= 8 && percentageDHU > 6)
                    {
                        weightagetage = 4 * 0.05;
                    }
                    else
                    {
                        weightagetage = 5 * 0.05;
                    }

                    if(weightagetage < 0.08)
                    {
                        dhuColor = "#175d2d";
                    }
                    else if(weightagetage >=0.08 && weightagetage < 0.16)
                    {
                        dhuColor = "#ffb600";
                    }
                    else
                    {
                        dhuColor = "#e0301e";
                    }
                }
                var acceptedPercentage = (Math.Round((100 - (percentageDHU + percentageRejection + percentageDefection)), 2));
                #region Color code calculation of defect
                if (defectionWeightage < 0.1)
                {
                    defectColor = "#175d2d";
                    defectTextColor = "#ffffff";
                }
                else if (defectionWeightage > 0.1 && defectionWeightage <= 0.2)
                {
                    defectColor = "#ffb600";
                    defectTextColor = "#ffffff";
                }
                else
                {
                    defectColor = "#e0301e";
                    defectTextColor = "#000000";
                }
                #endregion

                #region Color code calculation of reject
                if (rejectionWeitage < 0.1)
                {
                    rejectColor = "#175d2d";
                    rejectTextColor = "#ffffff";
                }
                else if (defectionWeightage > 0.1 && defectionWeightage <= 0.2)
                {
                    rejectColor = "#ffb600";
                    rejectTextColor = "#ffffff";
                }
                else
                {
                    rejectColor = "#e0301e";
                    rejectTextColor = "#000000";
                }
                #endregion

                #region Adding calculated data into json response
                seriesData.Add(new DHURejectDefect
                {
                    name = "D.H.U",
                    y = percentageDHU,
                    colorCode = "rgb(255, 182, 0)",
                    PercentageValue = Convert.ToInt32(Math.Round(percentageDHU))
                });
                seriesData.Add(new DHURejectDefect
                {
                    name = "Defect",
                    y = percentageDefection,
                    colorCode = defectColor,
                    PercentageValue = Convert.ToInt32(Math.Round(percentageDefection)),
                    textColor = defectTextColor
                });
                seriesData.Add(new DHURejectDefect
                {
                    name = "Reject",
                    y = percentageRejection,
                    colorCode = rejectColor,
                    PercentageValue = Convert.ToInt32(Math.Round(percentageRejection)),
                    textColor = rejectTextColor
                });
                seriesData.Add(new DHURejectDefect
                {
                    name = "Accept",
                    y = acceptedPercentage
                });
                #endregion
            }
            return Json(seriesData);
        }

        private JsonResult CalculateMMRInlineWIP(KPIViewModel kpiViewModel)
        {
            var operatorNosData = _rmgDbContext.OperatorNos.Where(x => x.Date == date).Average(x => x.Data);
            var workingHoursData = _rmgDbContext.WorkingHrs.Where(x => x.Date == date).Average(x => x.Data);
            var checkersData = _rmgDbContext.Checkers.Where(x => x.Date == date).Average(x => x.Data);
            var helpersData = _rmgDbContext.Helpers.Where(x => x.Date == date).Average(x => x.Data);
            var machineryData = _rmgDbContext.Machinery.Where(x => x.Date == date).Average(x => x.Data);
            var productionData = _rmgDbContext.Production.Where(x => x.Date == date).Average(x => x.Data);
            var wipData = _rmgDbContext.WIP.Where(x => x.Date == date).Average(x => x.Data);
            var miscData = _rmgDbContext.Misc.Select(x => x.Data).FirstOrDefault();
            var unplnnedDowntimeData = _rmgDbContext.UnplannedDowntime.Where(x => x.Date == date).Average(x => x.Data);
            #region Inline WIP
            var inlineWIPLevel = Math.Round((wipData / productionData),2);
            int scoreCardWIP = 0;
            #region Calculate weightage
            double weightage = 0;
            if(inlineWIPLevel >= 0.8 && inlineWIPLevel <= 1)
            {
                weightage = 0.10 * 3;
                scoreCardWIP = 3;
            }
            if (inlineWIPLevel > 1 && inlineWIPLevel <= 1.5)
            {
                weightage = 0.10 * 2;
                scoreCardWIP = 2;
            }
            if (inlineWIPLevel >= 1.6 && inlineWIPLevel <= 2)
            {
                weightage = 0.10 * 1;
                scoreCardWIP = 2;
            }
            #endregion
            #region Calculate color code
            string wipColorCode = "";
            if (weightage < 0.1)
            {
                wipColorCode = "#e0301e";
            }
            else if (weightage >= 0.1 && weightage <= 0.2)
            {
                wipColorCode = "#ffb600";
            }
            else if(weightage > 0.2 && weightage <= 0.3)
            {
                wipColorCode = "#175d2d";
            }
            #endregion
            object[] wipObjectArray = new object[2];
            wipObjectArray[0] = date.Value.Date.ToString("dd/MM/yyyy");
            wipObjectArray[1] = scoreCardWIP;
            #endregion

            #region MMR
            var mmrLevel = Math.Round(((operatorNosData + helpersData + checkersData)/machineryData), 2);
            #region Calculate weightage
            double mmrweightage = 0;
            int scoreCardMMR = 3;
            if (mmrLevel == 1)
            {
                mmrweightage = 0.15 * 3;
                scoreCardMMR = 3;
            }
            if (mmrLevel > 1 && mmrLevel <= 1.5)
            {
                mmrweightage = 0.15 * 2;
                scoreCardMMR = 2;
            }
            if (mmrLevel >= 1.6)
            {
                mmrweightage = 0.15 * 1;
                scoreCardMMR = 1;
            }
            #endregion
            #region Calculate color code
            string mmrColorCode = "";
            if (mmrweightage < 0.15)
            {
                mmrColorCode = "#e0301e";
            }
            else if (mmrweightage >= 0.15 && mmrweightage <= 0.3)
            {
                mmrColorCode = "#ffb600";
            }
            else if (weightage > 0.3 && weightage <= 0.45)
            {
                mmrColorCode = "#175d2d";
            }
            #endregion
            object[] mmrObjectArray = new object[2];
            mmrObjectArray[0] = date.Value.Date.ToString("dd/MM/yyyy");
            mmrObjectArray[1] = scoreCardMMR;
            #endregion

            #region Machine Downtime
            var machineDowntime = Math.Round((((miscData + unplnnedDowntimeData) / workingHoursData)*100));
            #region weightage calculation
            double machineDowntimeWeitage = 0;
            int machineDowntimeScoreCard = 0;
            if(machineDowntime>= 0 && machineDowntime <= 5)
            {
                machineDowntimeWeitage = 0.10 * 3;
                machineDowntimeScoreCard = 3;
            }
            else if (machineDowntime >= 6 && machineDowntime <= 10)
            {
                machineDowntimeWeitage = 0.10 * 2;
                machineDowntimeScoreCard = 2;
            }
            else
            {
                machineDowntimeWeitage = 0.10 * 1;
                machineDowntimeScoreCard = 2;
            }
            #endregion
            #region colorcode calculation
            string machineDowntimeColorCode = "";
            if (machineDowntimeWeitage < 0.1)
            {
                machineDowntimeColorCode = "#e0301e";
            }
            else if (machineDowntimeWeitage >= 0.1 && machineDowntimeWeitage <= 0.2)
            {
                machineDowntimeColorCode = "#ffb600";
            }
            else if (machineDowntimeWeitage > 0.2 && weightage <= 0.3)
            {
                machineDowntimeColorCode = "#175d2d";
            }
            object[] machineDowntimeObject = new object[2];
            machineDowntimeObject[0] = date.Value.Date.ToString("dd/MM/yyyy");
            machineDowntimeObject[1] = machineDowntimeScoreCard;
            #endregion
            #endregion
            return Json(new
            {
                inlineWIPResponse = wipObjectArray,
                wipColorCode = wipColorCode,
                mmrResponse = mmrObjectArray,
                mmrColorCode = mmrColorCode,
                machineDowntimeRespponse = machineDowntimeObject,
                machineDowntimeColorCode = machineDowntimeColorCode
            });
            //var operatorNosByLineWise = _rmgDbContext.OperatorNos.Where(x =>
            //    kpiViewModel.Year.Contains(x.Date.Year) &&
            //    kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
            //    .Select(grp => new OperatorViewModel { OperatorData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            //var helpersByLineWise = _rmgDbContext.Helpers.Where(x =>
            //    kpiViewModel.Year.Contains(x.Date.Year) &&
            //    kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
            //    .Select(grp => new HelpersViewModel { HelperData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            //var checkersByLineWise = _rmgDbContext.Helpers.Where(x =>
            //   kpiViewModel.Year.Contains(x.Date.Year) &&
            //   kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
            //   .Select(grp => new CheckersViewModel { CheckersData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            //var machineryByLineWise = _rmgDbContext.Helpers.Where(x =>
            //   kpiViewModel.Year.Contains(x.Date.Year) &&
            //   kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
            //   .Select(grp => new MachineryViewModel { MechineryData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            //var productionDataByYearGroup = _rmgDbContext.Production.Where(x =>
            //    kpiViewModel.Year.Contains(x.Date.Year) &&
            //    kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
            //    .Select(grp => new ProductionViewModel { ProdData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            //var wipDataByYearGroup = _rmgDbContext.Production.Where(x =>
            //    kpiViewModel.Year.Contains(x.Date.Year) &&
            //    kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
            //    .Select(grp => new WIPViewModel { WIPData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            //List<string> monthCategory = new List<string>();
            //foreach (var element in kpiViewModel.Line)
            //{
            //    switch (element)
            //    {
            //        case 1:
            //            monthCategory.Add("Line1");
            //            break;
            //        case 2:
            //            monthCategory.Add("Line2");
            //            break;
            //        case 3:
            //            monthCategory.Add("Line3");
            //            break;
            //        case 4:
            //            monthCategory.Add("Line4");
            //            break;
            //        case 5:
            //            monthCategory.Add("Line5");
            //            break;
            //        //case 6:
            //        //    monthCategory.Add("Jun");
            //        //    break;
            //        //case 7:
            //        //    monthCategory.Add("July");
            //        //    break;
            //        //case 8:
            //        //    monthCategory.Add("Aug");
            //        //    break;
            //        //case 9:
            //        //    monthCategory.Add("Sep");
            //        //    break;
            //        //case 10:
            //        //    monthCategory.Add("Oct");
            //        //    break;
            //        //case 11:
            //        //    monthCategory.Add("Nov");
            //        //    break;
            //        //case 12:
            //        //    monthCategory.Add("Dec");
            //        //    break;
            //    }
            //}
            //List<MMRInlineMonthlyViewModel> mmRMonthlyViewModels = new List<MMRInlineMonthlyViewModel>();
            //List<double> wipYearWiseWeitageValues = new List<double>();

            //for (int index = 0; index < kpiViewModel.Year.Count; index++)
            //{
            //    List<double> mmrYearWiseWeightageValues = new List<double>();
            //    List<double> wipYearWiseWeitageValues = new List<double>();

            //}
            //var query = (from op in operatorNosByLineWise
            //             join he in helpersByLineWise on new { op.Line } equals new { he.Line }
            //             join ch in checkersByLineWise on new { op.Line } equals new { ch.Line }
            //             join prod in productionDataByYearGroup on new { op.Line } equals new { prod.Line }
            //             join m in machineryByLineWise on new { op.Line } equals new { m.Line }
            //             join wp in wipDataByYearGroup on new { op.Line } equals new { wp.Line }
            //             select new MMRInlineWIPParameter
            //             {
            //                 //mmrValue = ((op.OperatorData + he.HelperData + ch.CheckerData) / prod.ProdData),
            //                 Month = op.Line.ToString(),
            //                 //Year = op.Year.ToString(),
            //                 wipValue = Math.Round((wp.WIPData / prod.ProdData),2)
            //             }).ToList();

            //foreach (var queryElement in query)
            //{
            //    //double mmrweightage = 0;
            //    //double wipweightage = 0;
            //    //if(queryElement.mmrValue > 0)
            //    //{
            //    //    if ((queryElement.mmrValue >= 0.8 && queryElement.mmrValue <= 1))
            //    //    {
            //    //        mmrweightage = 0.15 * 3;
            //    //    }
            //    //    else if (queryElement.mmrValue >= 1.1 && queryElement.mmrValue <= 1.5)
            //    //    {
            //    //        mmrweightage = 0.15 * 2;
            //    //    }
            //    //    else
            //    //    {
            //    //        mmrweightage = 0.15 * 1;
            //    //    }
            //    //}
            //    //if (queryElement.wipValue > 0)
            //    //{
            //    //    if ((queryElement.wipValue >= 0.8 && queryElement.wipValue <= 1))
            //    //    {
            //    //        wipweightage = 0.15 * 3;
            //    //    }
            //    //    else if (queryElement.wipValue >= 1.1 && queryElement.wipValue <= 1.5)
            //    //    {
            //    //        wipweightage = 0.15 * 2;
            //    //    }
            //    //    else
            //    //    {
            //    //        wipweightage = 0.15 * 1;
            //    //    }
            //    //}

            //    wipYearWiseWeitageValues.Add(queryElement.wipValue);
            //}
            //List<MMRWIPChartData> chartDatas = new List<MMRWIPChartData>();
            //if (mmRMonthlyViewModels.Count > 0)
            //{
            //    var groupByMonthMMRInline = mmRMonthlyViewModels.GroupBy(x => x.month).Select(grp => new MMRInlineMonthlyViewModel
            //    {
            //        mmrdata = grp.Average(c => c.mmrdata),
            //        wipdata = grp.Average(c => c.wipdata),
            //        month = grp.Key
            //    }).ToList();
            //    List<double> mmrStackData = new List<double>();
            //    List<double> wipStackData = new List<double>();
            //    foreach (var element in groupByMonthMMRInline)
            //    {
            //        mmrStackData.Add(Math.Round(element.mmrdata, 3));
            //        wipStackData.Add(Math.Round(element.wipdata, 3));
            //    }
            //    chartDatas.Add(new MMRWIPChartData
            //    {
            //        name = "MMR",
            //        data = mmrStackData
            //    });
            //    chartDatas.Add(new MMRWIPChartData
            //    {
            //        name = "WIP",
            //        data = wipStackData
            //    });
            //}
            //return Json(new {
            //    chartDatas = wipYearWiseWeitageValues,
            //    monthCategory = monthCategory,
            //    name = "Inline WIP"
            //});
        }

    }
}
