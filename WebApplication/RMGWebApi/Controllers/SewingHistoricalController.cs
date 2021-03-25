using Entities;
using Entities.DataModels;
using Microsoft.AspNetCore.Http;
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
    public class SewingHistoricalController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public SewingHistoricalController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {

            var kpiResults = new
            {
                CapacityHistoricalCalculation = CapacityHistoricalCalculation(kpiViewModel),
                EfficiencyHistoricalCalculation = EfficiencyHistoricalCalculation(kpiViewModel),
                InlineWIPHistoricalCalculation = InlineWIPHistoricalCalculation(kpiViewModel),
                MachineDownTimeHistoricalCalculation = MachineDowntimeHistoricalCalculation(kpiViewModel),
                DefectPecentageHistoricalCalculation = DefectPecentageHistoricalCalculation(kpiViewModel),
                AbsentismHistoricalCalculation = AbsentismHistoricalCalculation(kpiViewModel),
                //ManMachineRatio = CalculateMMR(kpiViewModel),
                StatusCode = 200
            };
            return Json(kpiResults);
        }

        private JsonResult CapacityHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> productionsDataList = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                productionsDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date, x.Line, x.Location, x.Unit, x.Operation }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    Line = grp.Key.Line,
                    Location = grp.Key.Location,
                    Unit = grp.Key.Unit,
                    ProdData = grp.Sum(x => x.Production),
                    OperationDescription = grp.Key.Operation
                    //AlterationData = grp.Sum(x => x.Alterations)
                }).GroupBy(grp => new { grp.Date, grp.OperationDescription }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    ProdData = grp.Average(x => x.ProdData),
                    OperationDescription = grp.Key.OperationDescription
                    //AlterationData = grp.Average(x => x.AlterationData)
                }).ToList();
            }
            var timeStudyData = _rmgDbContext.TimeStudy.Where(x => x.OperationDescription == "Checking").Select(x => new TimeStudyData
            {
                PlannedProduction = (x.PlannedProduction * 8),
                OperationDesc = x.OperationDescription
            });
            var timeStudyCheckerData = timeStudyData.Select(x => x.PlannedProduction).Sum();
            //List<HistoricalDataViewModel> efficiencyDataList = new List<HistoricalDataViewModel>();
            List<double> efficiencyDataList = new List<double>();
            int countOperations = _rmgDbContext.TimeStudy.Count();
            List<string> dates = new List<string>();
            var query = (from x in productionsDataList
                         select new EfficiencyParameters
                         {
                             efficiency = Math.Round((x.ProdData/timeStudyCheckerData) * 100),
                             Dailydate = x.Date.ToString("dd-MMM-yyyy")
                         }).ToList();
            foreach (var element in query)
            {
                //if (element.efficiency >= 75)
                //{
                //    efficiencyDataList.Add(new HistoricalDataViewModel
                //    {
                //        y = element.efficiency,
                //        color = "#e0301e"
                //    });
                //}
                //else if (element.efficiency >= 51 && element.efficiency <= 74)
                //{
                //    efficiencyDataList.Add(new HistoricalDataViewModel
                //    {
                //        y = element.efficiency,
                //        color = "#ffb600"
                //    });
                //}
                //else
                //{
                //    efficiencyDataList.Add(new HistoricalDataViewModel
                //    {
                //        y = element.efficiency,
                //        color = "#175d2d"
                //    });
                //}
                dates.Add(element.Dailydate);
                efficiencyDataList.Add(element.efficiency);
            }
            return Json(new
            {
                data = efficiencyDataList,
                categories = dates
            });
        }

        private JsonResult EfficiencyHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            //double styleData = 0;
            List<ProductionViewModel> productionsDataList = new List<ProductionViewModel>();
            //List<WorkingHoursViewModel> workingHoursDataList = new List<WorkingHoursViewModel>();
            //List<OperatorViewModel> operatorNosDataList = new List<OperatorViewModel>();
            //List<HelpersViewModel> helpersDataList = new List<HelpersViewModel>();

            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                //styleData = _rmgDbContext.StyleData.Average(x => x.SewingSAM);
                productionsDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date, x.Line, x.Location, x.Unit}).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    Line = grp.Key.Line,
                    Location = grp.Key.Location,
                    Unit = grp.Key.Unit,
                    ProdData = grp.Sum(x=> x.Production)
                }).GroupBy(grp=> new {grp.Date }).Select(grp => new ProductionViewModel { 
                    Date = grp.Key.Date,
                    ProdData = grp.Average(x => x.ProdData)
                }).ToList();
                //workingHoursDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate).GroupBy(x => new { x.Date }).Select(grp => new WorkingHoursViewModel
                //{
                //    Date = grp.Key.Date,
                //    WorkingHrsData = grp.Average(c => c.Data)
                //}).ToList();
                //operatorNosDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate).GroupBy(x => new { x.Date }).Select(grp => new OperatorViewModel
                //{
                //    Date = grp.Key.Date,
                //    OperatorData = grp.Average(c => c.Data)
                //}).ToList();
                //helpersDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate).GroupBy(x => new { x.Date }).Select(grp => new HelpersViewModel
                //{
                //    Date = grp.Key.Date,
                //    HelperData = grp.Average(c => c.Data)
                //}).ToList();

            }
            //else
            //{
            //    if (kpiViewModel.Location.Count > 0)
            //    {
            //        var linesBasedOnLocations = _rmgDbContext.Line.Where(x => kpiViewModel.Location.Contains(x.LocationId)).Select(x => x.Id).ToList();
            //        var selectedLinesList = linesBasedOnLocations.ConvertAll<double>(delegate (int i) { return i; });
            //        styleData = _rmgDbContext.StyleData.Where(x => selectedLinesList.Contains(x.Line)).Average(x => x.SewingSAM);
            //        productionsDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
            //        {
            //            Date = grp.Key.Date,
            //            ProdData = grp.Average(c => c.Data)
            //        }).ToList();
            //        workingHoursDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location)).GroupBy(x => new { x.Date }).Select(grp => new WorkingHoursViewModel
            //        {
            //            Date = grp.Key.Date,
            //            WorkingHrsData = grp.Average(c => c.Data)
            //        }).ToList();
            //        operatorNosDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location)).GroupBy(x => new { x.Date }).Select(grp => new OperatorViewModel
            //        {
            //            Date = grp.Key.Date,
            //            OperatorData = grp.Average(c => c.Data)
            //        }).ToList();
            //        helpersDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location)).GroupBy(x => new { x.Date }).Select(grp => new HelpersViewModel
            //        {
            //            Date = grp.Key.Date,
            //            HelperData = grp.Average(c => c.Data)
            //        }).ToList();
            //    }
            //    else
            //    {
            //        if (kpiViewModel.Unit.Count > 0)
            //        {
            //            var linesBasedOnLocations = _rmgDbContext.Line.Where(x => kpiViewModel.Unit.Contains(x.UnitId)).Select(x => x.Id).ToList();
            //            var selectedLinesList = linesBasedOnLocations.ConvertAll<double>(delegate (int i) { return i; });
            //            styleData = _rmgDbContext.StyleData.Where(x => selectedLinesList.Contains(x.Line)).Average(x => x.SewingSAM);
            //            productionsDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Unit.Contains(x.Unit)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
            //            {
            //                Date = grp.Key.Date,
            //                ProdData = grp.Average(c => c.Data)
            //            }).ToList();
            //            workingHoursDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Unit.Contains(x.Unit)).GroupBy(x => new { x.Date }).Select(grp => new WorkingHoursViewModel
            //            {
            //                Date = grp.Key.Date,
            //                WorkingHrsData = grp.Average(c => c.Data)
            //            }).ToList();
            //            operatorNosDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Unit.Contains(x.Unit)).GroupBy(x => new { x.Date }).Select(grp => new OperatorViewModel
            //            {
            //                Date = grp.Key.Date,
            //                OperatorData = grp.Average(c => c.Data)
            //            }).ToList();
            //            helpersDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Unit.Contains(x.Unit)).GroupBy(x => new { x.Date }).Select(grp => new HelpersViewModel
            //            {
            //                Date = grp.Key.Date,
            //                HelperData = grp.Average(c => c.Data)
            //            }).ToList();
            //        }
            //        else
            //        {
            //            styleData = _rmgDbContext.StyleData.Where(x => kpiViewModel.Line.Contains(x.Line)).Average(x => x.SewingSAM);
            //            productionsDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
            //            {
            //                Date = grp.Key.Date,
            //                ProdData = grp.Average(c => c.Data)
            //            }).ToList();
            //            workingHoursDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new WorkingHoursViewModel
            //            {
            //                Date = grp.Key.Date,
            //                WorkingHrsData = grp.Average(c => c.Data)
            //            }).ToList();
            //            operatorNosDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new OperatorViewModel
            //            {
            //                Date = grp.Key.Date,
            //                OperatorData = grp.Average(c => c.Data)
            //            }).ToList();
            //            helpersDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new HelpersViewModel
            //            {
            //                Date = grp.Key.Date,
            //                HelperData = grp.Average(c => c.Data)
            //            }).ToList();
            //        }
            //    }
            //}
            
            List<double> efficiencyDataList = new List<double>();
            int countOperations = _rmgDbContext.TimeStudy.Count();
            List<string> dates = new List<string>();
            var query = (from x in productionsDataList 
                         select new EfficiencyParameters
                         {
                             efficiency = Math.Round(((x.ProdData * 16.72) / (480 * countOperations))*100),
                             Dailydate = x.Date.ToString("dd-MMM-yyyy")
                         }).ToList();
            foreach (var element in query)
            {
                dates.Add(element.Dailydate);
                efficiencyDataList.Add(element.efficiency);
            }
            return Json(new
            {
                data = efficiencyDataList,
                categories = dates
            });
        }

        private JsonResult InlineWIPHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> productionsDataList = new List<ProductionViewModel>();
            List<WIPViewModel> wipDataList = new List<WIPViewModel>();

            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count == 0 && kpiViewModel.Unit.Count == 0 && kpiViewModel.Line.Count == 0)
            {
                productionsDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    ProdData = grp.Average(c => c.Data)
                }).ToList();
                wipDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate).GroupBy(x => new { x.Date }).Select(grp => new WIPViewModel
                {
                    Date = grp.Key.Date,
                    WIPData = grp.Average(c => c.Data)
                }).ToList();
            }
            else
            {
                if (kpiViewModel.Location.Count > 0)
                {
                    productionsDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                    {
                        Date = grp.Key.Date,
                        ProdData = grp.Average(c => c.Data)
                    }).ToList();
                    wipDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location)).GroupBy(x => new { x.Date }).Select(grp => new WIPViewModel
                    {
                        Date = grp.Key.Date,
                        WIPData = grp.Average(c => c.Data)
                    }).ToList();
                }
                else
                {
                    if (kpiViewModel.Unit.Count > 0)
                    {
                        productionsDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Unit.Contains(x.Unit)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                        {
                            Date = grp.Key.Date,
                            ProdData = grp.Average(c => c.Data)
                        }).ToList();
                        wipDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Unit.Contains(x.Unit)).GroupBy(x => new { x.Date }).Select(grp => new WIPViewModel
                        {
                            Date = grp.Key.Date,
                            WIPData = grp.Average(c => c.Data)
                        }).ToList();
                    }
                    else
                    {
                        productionsDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                        {
                            Date = grp.Key.Date,
                            ProdData = grp.Average(c => c.Data)
                        }).ToList();
                        wipDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new WIPViewModel
                        {
                            Date = grp.Key.Date,
                            WIPData = grp.Average(c => c.Data)
                        }).ToList();
                    }
                }
            }

            List<double> inlineWIPDataList = new List<double>();
            List<string> dates = new List<string>();
            var query = (from s in wipDataList
                         join x in productionsDataList on new { s.Date } equals new { x.Date }
                         select new EfficiencyParameters
                         {
                             efficiency = Math.Round((s.WIPData / x.ProdData), 2),
                             Dailydate = s.Date.ToString("dd-MMM-yyyy")
                         }).ToList();
            foreach (var element in query)
            {
                dates.Add(element.Dailydate);
                inlineWIPDataList.Add(element.efficiency);
            }
            return Json(new
            {
                data = inlineWIPDataList,
                categories = dates
            });
        }

        private JsonResult MachineDowntimeHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            List<WorkingHoursViewModel> workingHoursDataList = new List<WorkingHoursViewModel>();
            List<UnplannedDowntime> unplnnedDowntimeDataList = new List<UnplannedDowntime>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            var miscData = _rmgDbContext.Misc.Select(x => x.Data).FirstOrDefault();

            if (kpiViewModel.Location.Count == 0 && kpiViewModel.Unit.Count == 0 && kpiViewModel.Line.Count == 0)
            {
                workingHoursDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate).GroupBy(x => new { x.Date }).Select(grp => new WorkingHoursViewModel
                {
                    Date = grp.Key.Date,
                    WorkingHrsData = grp.Average(c => c.Data)
                }).ToList();
                unplnnedDowntimeDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate).GroupBy(x => new { x.Date }).Select(grp => new UnplannedDowntime
                {
                    Date = grp.Key.Date,
                    Data = grp.Average(c => c.Data)
                }).ToList();
            }
            else
            {
                if (kpiViewModel.Location.Count > 0)
                {
                    workingHoursDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location)).GroupBy(x => new { x.Date }).Select(grp => new WorkingHoursViewModel
                    {
                        Date = grp.Key.Date,
                        WorkingHrsData = grp.Average(c => c.Data)
                    }).ToList();
                    unplnnedDowntimeDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location)).GroupBy(x => new { x.Date }).Select(grp => new UnplannedDowntime
                    {
                        Date = grp.Key.Date,
                        Data = grp.Average(c => c.Data)
                    }).ToList();
                }
                else
                {
                    if (kpiViewModel.Unit.Count > 0)
                    {
                        workingHoursDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Unit.Contains(x.Unit)).GroupBy(x => new { x.Date }).Select(grp => new WorkingHoursViewModel
                        {
                            Date = grp.Key.Date,
                            WorkingHrsData = grp.Average(c => c.Data)
                        }).ToList();
                        unplnnedDowntimeDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Unit.Contains(x.Unit)).GroupBy(x => new { x.Date }).Select(grp => new UnplannedDowntime
                        {
                            Date = grp.Key.Date,
                            Data = grp.Average(c => c.Data)
                        }).ToList();
                    }
                    else
                    {
                        workingHoursDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new WorkingHoursViewModel
                        {
                            Date = grp.Key.Date,
                            WorkingHrsData = grp.Average(c => c.Data)
                        }).ToList();
                        unplnnedDowntimeDataList = _rmgDbContext.Production.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new UnplannedDowntime
                        {
                            Date = grp.Key.Date,
                            Data = grp.Average(c => c.Data)
                        }).ToList();
                    }
                }
            }

            List<double> machineDowntimeDataList = new List<double>();
            List<string> dates = new List<string>();
            var query = (from s in workingHoursDataList
                         join x in unplnnedDowntimeDataList on new { s.Date } equals new { x.Date }
                         select new EfficiencyParameters
                         {
                             efficiency = Math.Round((((miscData + x.Data) / s.WorkingHrsData) * 100)),
                            Dailydate = s.Date.ToString("dd-MMM-yyyy")
                         }).ToList();
            foreach (var element in query)
            {
                dates.Add(element.Dailydate);
                machineDowntimeDataList.Add(element.efficiency);
            }
            return Json(new
            {
                data = machineDowntimeDataList,
                categories = dates
            });
        }

        private JsonResult DefectPecentageHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> productionsDataList = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                productionsDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date, x.Line, x.Location, x.Unit }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    Line = grp.Key.Line,
                    Location = grp.Key.Location,
                    Unit = grp.Key.Unit,
                    ProdData = grp.Sum(x => x.Production),
                    AlterationData = grp.Sum(x=> x.Alterations)
                }).GroupBy(grp => new { grp.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    ProdData = grp.Average(x => x.ProdData),
                    AlterationData = grp.Average(x=> x.AlterationData)
                }).ToList();
            }
            List<double> efficiencyDataList = new List<double>();
            int countOperations = _rmgDbContext.TimeStudy.Count();
            List<string> dates = new List<string>();
            var query = (from x in productionsDataList
                         select new EfficiencyParameters
                         {
                             efficiency = Math.Round(((x.AlterationData/x.ProdData)*100)),
                             Dailydate = x.Date.ToString("dd-MMM-yyyy")
                         }).ToList();
            foreach (var element in query)
            {
                dates.Add(element.Dailydate);
                efficiencyDataList.Add(element.efficiency);
            }
            return Json(new
            {
                data = efficiencyDataList,
                categories = dates
            });
        }

        private JsonResult AbsentismHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> productionsDataList = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                productionsDataList = _rmgDbContext.Attendance.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date, x.Line, x.Location, x.Unit }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    Line = grp.Key.Line,
                    Location = grp.Key.Location,
                    Unit = grp.Key.Unit,
                    TotalOperatorsCount = grp.Where(x=> x.Name != "").Count(),
                    PresentOperatorsCount = grp.Where(x => x.Attendence != "Yes").Count(),
                    //ProdData = grp.Sum(x => x.Production),
                    //AlterationData = grp.Sum(x => x.Alterations)
                }).GroupBy(grp => new { grp.Date}).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    TotalOperatorsCount = grp.Sum(x=> x.TotalOperatorsCount),
                    PresentOperatorsCount = grp.Sum(x=> x.PresentOperatorsCount)
                    //ProdData = grp.Average(x => x.ProdData),
                    //AlterationData = grp.Average(x => x.AlterationData)
                }).ToList();
            }
            List<double> efficiencyDataList = new List<double>();
            int countOperations = _rmgDbContext.TimeStudy.Count();
            List<string> dates = new List<string>();
            var query = (from x in productionsDataList
                         select new EfficiencyParameters
                         {
                             efficiency = Math.Round((x.PresentOperatorsCount / x.TotalOperatorsCount)*100),
                             Dailydate = x.Date.ToString("dd-MMM-yyyy")
                         }).ToList();
            foreach (var element in query)
            {
                dates.Add(element.Dailydate);
                efficiencyDataList.Add(element.efficiency);
            }
            return Json(new
            {
                data = efficiencyDataList,
                categories = dates
            });
        }

    }
}
