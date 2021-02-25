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
                DefectRejectDHUPercentage = CalculateDHUDefectRejection(kpiViewModel),
                MMRWIPInline= CalculateMMRInlineWIP(kpiViewModel),
                StatusCode = 200
            };
            return Json(kpiResults);
        }

        private JsonResult CapacityCalculation(KPIViewModel kpiViewModel)
        {
            double sumofProductionDataLineWise = 0;
            double sumofStyleDataLineWise = 0;
            var productionDataByYearGroup = _rmgDbContext.Production.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line, x.Date.Month, x.Date.Year })
                .Select(grp => new ProductionViewModel { ProdData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();
           
            var styleDataByLineWise = _rmgDbContext.StyleData.Where(x =>
                kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line })
                .Select(grp => new StyleDataViewModel{ StyleData = grp.Average(c => c.PlannedProductionpcs), Line = grp.Key.Line }).ToList();
            
            for (int index = 0; index < productionDataByYearGroup.Count; index++)
            {
                sumofProductionDataLineWise += productionDataByYearGroup[index].ProdData;
            }

            for (int index = 0; index < styleDataByLineWise.Count; index++)
            {
                sumofStyleDataLineWise += styleDataByLineWise[index].StyleData;
            }

            var capacityUtilized = Math.Round((sumofProductionDataLineWise / sumofStyleDataLineWise)*100);
            var capacityNonUtilized = Math.Round(100 - capacityUtilized);

            var productionDataByLineGroup = _rmgDbContext.Production.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line})
                .Select(grp => new { ProdData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            CapacityUtilizationNested capacityUtilizationNested = new CapacityUtilizationNested();
            List<int> dataList = new List<int>();
            var query = (from s in productionDataByLineGroup
                         join cs in styleDataByLineWise on new { s.Line } equals new { cs.Line }
                         select new CapacityUtilizationParameter
                         {
                             parameterValue = Convert.ToInt32( Math.Round((s.ProdData / cs.StyleData) * 100)),
                             line = s.Line.ToString()
                        }).ToList();
            
            foreach(var element in query)
            {
                dataList.Add(element.parameterValue);
                //capacityUtilizationNested.data.Add(element.parameterValue);
            }
            capacityUtilizationNested.nestedData = dataList;
            capacityUtilizationNested.id = "utilized";
            capacityUtilizationNested.type = "column";

            CapacityUtilizationSeries capacityUtilizationSeries = new CapacityUtilizationSeries();
            List<CapacityUtilizationDrilldown> capacityUtilizationDrilldowns = new List<CapacityUtilizationDrilldown>();
            capacityUtilizationDrilldowns.Add(new CapacityUtilizationDrilldown
            {
                drilldown = "utilized",
                y = Convert.ToInt32(capacityUtilized), 
                name = "Utilized"
            });
            capacityUtilizationDrilldowns.Add(new CapacityUtilizationDrilldown
            {
                drilldown = "",
                y = Convert.ToInt32(capacityNonUtilized),
                name = "Non-Utilized"
            });
            capacityUtilizationSeries.data = capacityUtilizationDrilldowns;
            capacityUtilizationSeries.colorByPoint = true;
            capacityUtilizationSeries.name = "Capacity";
            //int gainedWeightage = 0;
            //if(capacityCalculation == 0)
            //{
            //    gainedWeightage = 0;
            //}
            //else if(capacityCalculation > 0 && capacityCalculation<=25){
            //    gainedWeightage = 1;
            //}
            //else if (capacityCalculation >= 26 && capacityCalculation <= 50)
            //{
            //    gainedWeightage = 2;
            //}
            //else if (capacityCalculation >= 51 && capacityCalculation <= 80)
            //{
            //    gainedWeightage = 3;
            //}
            //else if (capacityCalculation >= 81 && capacityCalculation <= 90)
            //{
            //    gainedWeightage = 4;
            //}
            //else
            //{
            //    gainedWeightage = 5;
            //}
            //var weitageCalculation = Math.Round(gainedWeightage * 0.10,2);
            //string colorCode = "";
            //if (weitageCalculation < 0.16)
            //{
            //    colorCode = "#e0301e";
            //}
            //else if(weitageCalculation >= 0.16 && weitageCalculation< 0.32)
            //{
            //    colorCode = "#ffb600";
            //}
            //else
            //{
            //    colorCode = "#175d2d";
            //}
            return Json(new
            {
                capacityUtilizationSeries = capacityUtilizationSeries,
                capacityUtilizationNested = capacityUtilizationNested
            });
        }

        private JsonResult CalculateEfficiency(KPIViewModel kpiViewModel)
        {
            var styleDataByLineWise = _rmgDbContext.StyleData.Where(x =>
                kpiViewModel.Line.Contains(x.Line)).GroupBy(x=> new { x.Line })
                .Select(grp => new StyleDataViewModel{ StyleData = grp.Average(x=> x.SewingSAM), Line = grp.Key.Line }).ToList();

            var workingHoursByLineWise = _rmgDbContext.WorkingHrs.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line})
                .Select(grp => new WorkingHoursViewModel { WorkingHrsData = grp.Average(c => c.Data), Line = grp.Key.Line}).ToList();

            var operatorNosByLineWise = _rmgDbContext.OperatorNos.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
                .Select(grp => new OperatorViewModel { OperatorData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            var helpersByLineWise = _rmgDbContext.Helpers.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line})
                .Select(grp => new HelpersViewModel { HelperData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            var productionDataByYearGroup = _rmgDbContext.Production.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line})
                .Select(grp => new ProductionViewModel { ProdData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            List<EfficiencyViewModel> efficiencyViews = new List<EfficiencyViewModel>();
            List<EfficiencyWeitageViewModel> efficiencyWeitageViewModels = new List<EfficiencyWeitageViewModel>();
            List<string> monthCategory = new List<string>();
            foreach(var element in kpiViewModel.Line)
            {
                switch (element)
                {
                    case 1:
                        monthCategory.Add("Line1");
                        break;
                    case 2:
                        monthCategory.Add("Line2");
                        break;
                    case 3:
                        monthCategory.Add("Line3");
                        break;
                    case 4:
                        monthCategory.Add("Line4");
                        break;
                    case 5:
                        monthCategory.Add("Line5");
                        break;
                    //case 6:
                    //    monthCategory.Add("Jun");
                    //    break;
                    //case 7:
                    //    monthCategory.Add("July");
                    //    break;
                    //case 8:
                    //    monthCategory.Add("Aug");
                    //    break;
                    //case 9:
                    //    monthCategory.Add("Sep");
                    //    break;
                    //case 10:
                    //    monthCategory.Add("Oct");
                    //    break;
                    //case 11:
                    //    monthCategory.Add("Nov");
                    //    break;
                    //case 12:
                    //    monthCategory.Add("Dec");
                    //    break;
                }
            }

            List<double> efficiencyPercentageValues = new List<double>();
            //List<double> efficiencyWeitageValues = new List<double>();
            var query = (from s in workingHoursByLineWise
                         join cs in operatorNosByLineWise on new { s.Line } equals new { cs.Line }
                         join os in helpersByLineWise on new { s.Line } equals new { os.Line }
                         join x in productionDataByYearGroup on new { s.Line } equals new { x.Line }
                         join style in styleDataByLineWise on new {s.Line} equals new {style.Line}
                         select new EfficiencyParameters
                         {
                             efficiency = (Math.Round((x.ProdData * style.StyleData) / (s.WorkingHrsData * (cs.OperatorData + os.HelperData)), 2))*100,
                             Month = s.Line.ToString(),
                             //Year = s.Year.ToString(),
                         }).ToList();

            foreach (var queryElement in query)
            {
                //double weightage = 0;
                //if (queryElement.efficiency == 0)
                //{
                //    weightage = 0.15 * 0;
                //}
                //else if (queryElement.efficiency > 0 && queryElement.efficiency <= 25)
                //{
                //    weightage = 0.15 * 1;
                //}
                //else if (queryElement.efficiency >= 26 && queryElement.efficiency <= 50)
                //{
                //    weightage = 0.15 * 2;
                //}
                //else if (queryElement.efficiency >= 51 && queryElement.efficiency <= 80)
                //{
                //    weightage = 0.15 * 3;
                //}
                //else if (queryElement.efficiency > 81 && queryElement.efficiency <= 90)
                //{
                //    weightage = 0.15 * 4;
                //}
                //else
                //{
                //    weightage = 0.15 * 5;
                //}
                efficiencyPercentageValues.Add(queryElement.efficiency);
                //efficiencyWeitageValues.Add(weightage);
            }
            efficiencyWeitageViewModels.Add(new EfficiencyWeitageViewModel
            {
                name = string.Join(' ', "Efficiency on ", kpiViewModel.Year[0].ToString()),
                data = efficiencyPercentageValues,
                type = "spline",
                color = lineChartColors[0],
                tooltip = new { valueSuffix = "%" }
            });
            return Json(new
            {
                efficiencyResponse = efficiencyViews,
                efficiencyWeitageResponse = efficiencyWeitageViewModels, 
                monthCategory = monthCategory
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
                var percentageDefection = Math.Round(((avgRejectionDataByYearGroup + avgAlterationDataByYearGroup) / avgProductionDataByYearGroup), 2);
                var percentageRejection = Math.Round((avgRejectionDataByYearGroup / avgProductionDataByYearGroup), 2);

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

                double percentageDHU = 0;
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
                    percentageDHU = Math.Round(dhuData.Average(x => x.DHUData),2);
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
                    colorCode = dhuColor,
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
            var operatorNosByLineWise = _rmgDbContext.OperatorNos.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
                .Select(grp => new OperatorViewModel { OperatorData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            var helpersByLineWise = _rmgDbContext.Helpers.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
                .Select(grp => new HelpersViewModel { HelperData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            var checkersByLineWise = _rmgDbContext.Helpers.Where(x =>
               kpiViewModel.Year.Contains(x.Date.Year) &&
               kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
               .Select(grp => new CheckersViewModel { CheckerData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            var machineryByLineWise = _rmgDbContext.Helpers.Where(x =>
               kpiViewModel.Year.Contains(x.Date.Year) &&
               kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
               .Select(grp => new MachineryViewModel { MechineryData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            var productionDataByYearGroup = _rmgDbContext.Production.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
                .Select(grp => new ProductionViewModel { ProdData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();

            var wipDataByYearGroup = _rmgDbContext.Production.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Line })
                .Select(grp => new WIPViewModel { WIPData = grp.Average(c => c.Data), Line = grp.Key.Line }).ToList();
            
            List<string> monthCategory = new List<string>();
            foreach (var element in kpiViewModel.Line)
            {
                switch (element)
                {
                    case 1:
                        monthCategory.Add("Line1");
                        break;
                    case 2:
                        monthCategory.Add("Line2");
                        break;
                    case 3:
                        monthCategory.Add("Line3");
                        break;
                    case 4:
                        monthCategory.Add("Line4");
                        break;
                    case 5:
                        monthCategory.Add("Line5");
                        break;
                    //case 6:
                    //    monthCategory.Add("Jun");
                    //    break;
                    //case 7:
                    //    monthCategory.Add("July");
                    //    break;
                    //case 8:
                    //    monthCategory.Add("Aug");
                    //    break;
                    //case 9:
                    //    monthCategory.Add("Sep");
                    //    break;
                    //case 10:
                    //    monthCategory.Add("Oct");
                    //    break;
                    //case 11:
                    //    monthCategory.Add("Nov");
                    //    break;
                    //case 12:
                    //    monthCategory.Add("Dec");
                    //    break;
                }
            }
            //List<MMRInlineMonthlyViewModel> mmRMonthlyViewModels = new List<MMRInlineMonthlyViewModel>();
            List<double> wipYearWiseWeitageValues = new List<double>();

            //for (int index = 0; index < kpiViewModel.Year.Count; index++)
            //{
            //    List<double> mmrYearWiseWeightageValues = new List<double>();
            //    List<double> wipYearWiseWeitageValues = new List<double>();

            //}
            var query = (from op in operatorNosByLineWise
                         join he in helpersByLineWise on new { op.Line } equals new { he.Line }
                         join ch in checkersByLineWise on new { op.Line } equals new { ch.Line }
                         join prod in productionDataByYearGroup on new { op.Line } equals new { prod.Line }
                         join m in machineryByLineWise on new { op.Line } equals new { m.Line }
                         join wp in wipDataByYearGroup on new { op.Line } equals new { wp.Line }
                         select new MMRInlineWIPParameter
                         {
                             //mmrValue = ((op.OperatorData + he.HelperData + ch.CheckerData) / prod.ProdData),
                             Month = op.Line.ToString(),
                             //Year = op.Year.ToString(),
                             wipValue = Math.Round((wp.WIPData / prod.ProdData),2)
                         }).ToList();

            foreach (var queryElement in query)
            {
                //double mmrweightage = 0;
                //double wipweightage = 0;
                //if(queryElement.mmrValue > 0)
                //{
                //    if ((queryElement.mmrValue >= 0.8 && queryElement.mmrValue <= 1))
                //    {
                //        mmrweightage = 0.15 * 3;
                //    }
                //    else if (queryElement.mmrValue >= 1.1 && queryElement.mmrValue <= 1.5)
                //    {
                //        mmrweightage = 0.15 * 2;
                //    }
                //    else
                //    {
                //        mmrweightage = 0.15 * 1;
                //    }
                //}
                //if (queryElement.wipValue > 0)
                //{
                //    if ((queryElement.wipValue >= 0.8 && queryElement.wipValue <= 1))
                //    {
                //        wipweightage = 0.15 * 3;
                //    }
                //    else if (queryElement.wipValue >= 1.1 && queryElement.wipValue <= 1.5)
                //    {
                //        wipweightage = 0.15 * 2;
                //    }
                //    else
                //    {
                //        wipweightage = 0.15 * 1;
                //    }
                //}

                wipYearWiseWeitageValues.Add(queryElement.wipValue);
            }
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
            return Json(new {
                chartDatas = wipYearWiseWeitageValues,
                monthCategory = monthCategory,
                name = "Inline WIP"
            });
        }

        //private CustomResponse CalculateEfficiency(KPIViewModel kpiViewModel)
        //{
        //    string backgroundColor = "";
        //    string prodDataColumnName = string.Join("", "ProductionL", kpiViewModel.lineNo);
        //    string operatorDataColumnName = string.Join("", "OperatorsL", kpiViewModel.lineNo);
        //    string helpersDataColumnName = string.Join("", "HelpersL", kpiViewModel.lineNo);
        //    string chekersDataColumnName = string.Join("", "CheckersL", kpiViewModel.lineNo);
        //    string workinghrsDataColumnName = string.Join("", "WorkingL", kpiViewModel.lineNo);

        //    CustomResponse response = new CustomResponse();
        //    double lineNo = Convert.ToDouble(kpiViewModel.lineNo);
        //    response.statusCode = 403;
        //    try
        //    {
        //        var linewiseProdDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(prodDataColumnName).GetValue(x)).ToList();
        //        var linewiseStyleDataList = _appEnsureDbContext.Style.Where(x => x.Line == lineNo).Select(x => x.GetType().GetProperty("SewingSAM").GetValue(x)).ToList();
        //        var linewiseOperatorDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(operatorDataColumnName).GetValue(x)).ToList();
        //        var linewiseHelpersDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(helpersDataColumnName).GetValue(x)).ToList();
        //        var linewiseChekersDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(chekersDataColumnName).GetValue(x)).ToList();
        //        var linewiseWorkingHrsDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(workinghrsDataColumnName).GetValue(x)).ToList();

        //        double sumOfProductionPerLinePerMonth = 0;
        //        double avgOfProductionPerLinePerMonth = 0;
        //        double sumOfStylePerLinePerMonth = 0;
        //        double avgOfStylePerLinePerMonth = 0;
        //        double sumOfOperatorPerLinePerMonth = 0;
        //        double avgOfOperatorPerLinePerMonth = 0;
        //        double sumOfHelpersPerLinePerMonth = 0;
        //        double avgOfHelpersPerLinePerMonth = 0;
        //        double sumOfCheckersPerLinePerMonth = 0;
        //        double avgOfCheckersPerLinePerMonth = 0;
        //        double sumOfWorkingHrsPerLinePerMonth = 0;
        //        double avgOfWorkingHrsPerLinePerMonth = 0;

        //        //int days = DateTime.DaysInMonth(efficiencyView.year, efficiencyView.month);
        //        foreach (var element in linewiseProdDataList)
        //        {
        //            sumOfProductionPerLinePerMonth += Convert.ToDouble(element);
        //        }
        //        foreach (var element in linewiseStyleDataList)
        //        {
        //            sumOfStylePerLinePerMonth += Convert.ToDouble(element);
        //        }
        //        foreach (var element in linewiseOperatorDataList)
        //        {
        //            sumOfOperatorPerLinePerMonth += Convert.ToDouble(element);
        //        }
        //        foreach (var element in linewiseHelpersDataList)
        //        {
        //            sumOfHelpersPerLinePerMonth += Convert.ToDouble(element);
        //        }
        //        foreach (var element in linewiseChekersDataList)
        //        {
        //            sumOfCheckersPerLinePerMonth += Convert.ToDouble(element);
        //        }
        //        foreach (var element in linewiseWorkingHrsDataList)
        //        {
        //            sumOfWorkingHrsPerLinePerMonth += Convert.ToDouble(element);
        //        }

        //        avgOfOperatorPerLinePerMonth = sumOfOperatorPerLinePerMonth / linewiseOperatorDataList.Count;
        //        avgOfStylePerLinePerMonth = sumOfStylePerLinePerMonth / linewiseStyleDataList.Count;
        //        avgOfProductionPerLinePerMonth = sumOfProductionPerLinePerMonth / linewiseProdDataList.Count;
        //        avgOfHelpersPerLinePerMonth = sumOfHelpersPerLinePerMonth / linewiseHelpersDataList.Count;
        //        avgOfCheckersPerLinePerMonth = sumOfCheckersPerLinePerMonth / linewiseOperatorDataList.Count;
        //        avgOfWorkingHrsPerLinePerMonth = sumOfWorkingHrsPerLinePerMonth / linewiseWorkingHrsDataList.Count;
        //        var efficiency = Math.Round((avgOfProductionPerLinePerMonth * avgOfStylePerLinePerMonth) / ((avgOfOperatorPerLinePerMonth + avgOfHelpersPerLinePerMonth + avgOfCheckersPerLinePerMonth) * avgOfWorkingHrsPerLinePerMonth) * 100);
        //        double scoreCard = 0;
        //        string status = "";
        //        //calculate weightage;
        //        if (efficiency == 0)
        //        {
        //            scoreCard = 0;
        //        }
        //        else if (efficiency > 0 && efficiency <= 25)
        //        {
        //            scoreCard = 1 * 0.15;
        //        }
        //        else if (efficiency > 25 && efficiency <= 50)
        //        {
        //            scoreCard = 2 * 0.15;
        //        }
        //        else if (efficiency > 50 && efficiency <= 80)
        //        {
        //            scoreCard = 3 * 0.15;
        //        }
        //        else if (efficiency > 80 && efficiency <= 90)
        //        {
        //            scoreCard = 4 * 0.15;
        //        }
        //        else
        //        {
        //            scoreCard = 5 * 0.15;
        //        }
        //        //calculate status
        //        if (scoreCard < 0.25)
        //        {
        //            status = "Red";
        //            backgroundColor = "#e0301e";
        //        }
        //        else if (scoreCard >= 0.25 && scoreCard <= 0.5)
        //        {
        //            status = "Amber";
        //            backgroundColor = "#ffb600";
        //        }
        //        else if (scoreCard >= 0.5 && scoreCard <= 0.75)
        //        {
        //            status = "Green";
        //            backgroundColor = "#175d2d";
        //        }
        //        response.statusCode = 200;
        //        response.message = "Data is retrieved successfully.";
        //        response.data = Json(new
        //        {
        //            weightageScore = scoreCard,
        //            status = status,
        //            kpiname = "Efficiency",
        //            backgroundColor = backgroundColor
        //        });
        //        return response;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.message = ex.Message;
        //        response.statusCode = 500;
        //        return response;
        //    }
        //}

        //private CustomResponse CalculateDefectsPerHundredUnits(KPIViewModel kpiViewModel)
        //{
        //    string backgroundColor = "#e0301e";
        //    string defectsPerHundredUnitsDataColumnName = string.Join("", "DefectsPerHundredUnitL", kpiViewModel.lineNo);
        //    CustomResponse response = new CustomResponse();
        //    double lineNo = Convert.ToDouble(kpiViewModel.lineNo);
        //    response.statusCode = 403;
        //    try
        //    {
        //        var linewiseDefectsPerHundredUnitsDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(defectsPerHundredUnitsDataColumnName).GetValue(x)).ToList();
        //        double sumOfDefectsPerHundredUnitsPerLinePerMonth = 0;
        //        double avgOfDefectsPerHundredUnitsPerLinePerMonth = 0;
        //        foreach (var element in linewiseDefectsPerHundredUnitsDataList)
        //        {
        //            sumOfDefectsPerHundredUnitsPerLinePerMonth += Convert.ToDouble(element);
        //        }
        //        avgOfDefectsPerHundredUnitsPerLinePerMonth = sumOfDefectsPerHundredUnitsPerLinePerMonth / linewiseDefectsPerHundredUnitsDataList.Count;
        //        double scoreCard = 0;
        //        string status = "";
        //        //calculate weightage;
        //        if (avgOfDefectsPerHundredUnitsPerLinePerMonth > 11)
        //        {
        //            scoreCard = 0;
        //        }
        //        else if (avgOfDefectsPerHundredUnitsPerLinePerMonth <= 11 && avgOfDefectsPerHundredUnitsPerLinePerMonth > 10)
        //        {
        //            scoreCard = 1 * 0.05;
        //        }
        //        else if (avgOfDefectsPerHundredUnitsPerLinePerMonth <= 10 && avgOfDefectsPerHundredUnitsPerLinePerMonth > 9)
        //        {
        //            avgOfDefectsPerHundredUnitsPerLinePerMonth = 2 * 0.05;
        //        }
        //        else if (avgOfDefectsPerHundredUnitsPerLinePerMonth <= 9 && avgOfDefectsPerHundredUnitsPerLinePerMonth > 8)
        //        {
        //            scoreCard = 3 * 0.05;
        //        }
        //        else if (avgOfDefectsPerHundredUnitsPerLinePerMonth <= 8 && avgOfDefectsPerHundredUnitsPerLinePerMonth > 6)
        //        {
        //            scoreCard = 4 * 0.05;
        //        }
        //        else
        //        {
        //            scoreCard = 5 * 0.05;
        //        }
        //        //calculate status
        //        if (scoreCard < 0.08)
        //        {
        //            status = "Red";
        //            backgroundColor = "#e0301e";
        //        }
        //        else if (scoreCard >= 0.08 && scoreCard <= 0.16)
        //        {
        //            status = "Amber";
        //            backgroundColor = "#ffb600";
        //        }
        //        else if (scoreCard >= 0.16 && scoreCard <= 0.25)
        //        {
        //            status = "Green";
        //            backgroundColor = "#175d2d";
        //        }
        //        response.statusCode = 200;
        //        response.message = "Data is retrieved successfully.";
        //        response.data = Json(new
        //        {
        //            weightageScore = scoreCard,
        //            status = status,
        //            kpiname = "Defects Per Hundred Units (D.H.U.)",
        //            backgroundColor = backgroundColor
        //        });
        //        return response;
        //    }
        //    catch(Exception ex)
        //    {
        //        response.message = ex.Message;
        //        response.statusCode = 500;
        //        return response;
        //    }
        //}

        //private CustomResponse CalculateDefectPercentage(KPIViewModel kpiViewModel)
        //{
        //    string backgroundColor = "#175d2d";
        //    string alterationDataColumnName = string.Join("", "AlterationsL", kpiViewModel.lineNo);
        //    string prodDataColumnName = string.Join("", "ProductionL", kpiViewModel.lineNo);
        //    CustomResponse response = new CustomResponse();
        //    double lineNo = Convert.ToDouble(kpiViewModel.lineNo);
        //    response.statusCode = 403;
        //    try
        //    {
        //        var linewiseProdDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(prodDataColumnName).GetValue(x)).ToList();
        //        var linewiseAlterationsDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(alterationDataColumnName).GetValue(x)).ToList();
        //        double sumOfAlterationsPerLinePerMonth = 0;
        //        double avgOfAlterationsPerLinePerMonth = 0;
        //        double sumOfProductionPerLinePerMonth = 0;
        //        double avgOfProductionPerLinePerMonth = 0;
        //        foreach (var element in linewiseProdDataList)
        //        {
        //            sumOfProductionPerLinePerMonth += Convert.ToDouble(element);
        //        }
        //        foreach (var element in linewiseAlterationsDataList)
        //        {
        //            sumOfAlterationsPerLinePerMonth += Convert.ToDouble(element);
        //        }
        //        avgOfAlterationsPerLinePerMonth = sumOfAlterationsPerLinePerMonth / linewiseAlterationsDataList.Count;
        //        avgOfProductionPerLinePerMonth = sumOfProductionPerLinePerMonth / linewiseProdDataList.Count;
        //        var defectPercentage = Math.Round((avgOfAlterationsPerLinePerMonth / avgOfProductionPerLinePerMonth) * 100);
        //        double scoreCard = 0;
        //        string status = "";
        //        //calculate weightage;
        //        if (defectPercentage >= 0 && defectPercentage <= 5)
        //        {
        //            scoreCard = 3 * 0.10;
        //        }
        //        else if (defectPercentage >= 6 && defectPercentage <= 20)
        //        {
        //            scoreCard = 2 * 0.10;
        //        }
        //        else
        //        {
        //            scoreCard = 1 * 0.10;
        //        }
        //        scoreCard = Math.Round(scoreCard, 3);
        //        //calculate status
        //        if (scoreCard < 0.1)
        //        {
        //            status = "Red";
        //            backgroundColor = "#e0301e";
        //        }
        //        else if (scoreCard >= 0.10 && scoreCard <= 0.20)
        //        {
        //            status = "Amber";
        //            backgroundColor = "#ffb600";
        //        }
        //        else if (scoreCard > 0.20 && scoreCard <= 0.30)
        //        {
        //            status = "Green";
        //            backgroundColor = "#175d2d";
        //        }
        //        response.statusCode = 200;
        //        response.message = "Data is retrieved successfully.";
        //        response.data = Json(new
        //        {
        //            weightageScore = scoreCard,
        //            status = status,
        //            kpiname = "Defect %",
        //            backgroundColor = backgroundColor
        //        });
        //        return response;
        //    }
        //    catch(Exception ex)
        //    {
        //        response.message = ex.Message;
        //        response.statusCode = 500;
        //        return response;
        //    }
        //}

        //private CustomResponse CalculateRejectionPercentage(KPIViewModel kpiViewModel)
        //{
        //    string backgroundColor = "#e0301e";
        //    string rejectionDataColumnName = string.Join("", "RejectionL", kpiViewModel.lineNo);
        //    string prodDataColumnName = string.Join("", "ProductionL", kpiViewModel.lineNo);
        //    CustomResponse response = new CustomResponse();
        //    double lineNo = Convert.ToDouble(kpiViewModel.lineNo);
        //    response.statusCode = 403;
        //    try
        //    {
        //        var linewiseProdDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(prodDataColumnName).GetValue(x)).ToList();
        //        var linewiseRejectionsDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(rejectionDataColumnName).GetValue(x)).ToList();
        //        double sumOfRejectionsPerLinePerMonth = 0;
        //        double avgOfRejectionsPerLinePerMonth = 0;
        //        double sumOfProductionPerLinePerMonth = 0;
        //        double avgOfProductionPerLinePerMonth = 0;
        //        foreach (var element in linewiseProdDataList)
        //        {
        //            sumOfProductionPerLinePerMonth += Convert.ToDouble(element);
        //        }
        //        foreach (var element in linewiseRejectionsDataList)
        //        {
        //            sumOfRejectionsPerLinePerMonth += Convert.ToDouble(element);
        //        }
        //        avgOfRejectionsPerLinePerMonth = sumOfRejectionsPerLinePerMonth / linewiseRejectionsDataList.Count;
        //        avgOfProductionPerLinePerMonth = sumOfProductionPerLinePerMonth / linewiseProdDataList.Count;
        //        var defectPercentage = Math.Round((avgOfRejectionsPerLinePerMonth / avgOfProductionPerLinePerMonth) * 100);
        //        double scoreCard = 0;
        //        string status = "";
        //        //calculate weightage;
        //        if (defectPercentage >= 0 && defectPercentage <= 1)
        //        {
        //            scoreCard = 3 * 0.10;
        //        }
        //        else if (defectPercentage > 1 && defectPercentage <= 5)
        //        {
        //            scoreCard = 2 * 0.10;
        //        }
        //        else
        //        {
        //            scoreCard = 1 * 0.10;
        //        }
        //        scoreCard = Math.Round(scoreCard, 3);
        //        //calculate status
        //        if (scoreCard < 0.1)
        //        {
        //            status = "Red";
        //            backgroundColor = "#e0301e";
        //        }
        //        else if (scoreCard >= 0.10 && scoreCard <= 0.20)
        //        {
        //            status = "Amber";
        //            backgroundColor = "#ffb600";
        //        }
        //        else if (scoreCard > 0.20 && scoreCard <= 0.30)
        //        {
        //            status = "Green";
        //            backgroundColor = "#175d2d";
        //        }
        //        response.statusCode = 200;
        //        response.message = "Data is retrieved successfully.";
        //        response.data = Json(new
        //        {
        //            weightageScore = scoreCard,
        //            status = status,
        //            kpiname = "Rejection %",
        //            backgroundColor = backgroundColor
        //        });
        //        return response;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.message = ex.Message;
        //        response.statusCode = 500;
        //        return response;
        //    }
        //}
    }
}
