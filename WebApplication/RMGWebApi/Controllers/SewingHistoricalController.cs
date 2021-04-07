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
                RejectionHistoricalCalculation = RejectionHistoricalCalculation(kpiViewModel),
                DHUHistoricalCalculation = DHUHistoricalCalculation(kpiViewModel),
                TopFiveDHUHistoricalCalculation = TopFiveDHUHistoricalCalculation(kpiViewModel),
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
            List<ProductionViewModel> productionsDataList = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
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
            }
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
                }).GroupBy(grp => new { grp.Date}).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    TotalOperatorsCount = grp.Sum(x=> x.TotalOperatorsCount),
                    PresentOperatorsCount = grp.Sum(x=> x.PresentOperatorsCount)
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

        private JsonResult RejectionHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> rejectionsDataList = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                rejectionsDataList = _rmgDbContext.RejectionStyle.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date, x.Line, x.Location, x.Unit }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    Line = grp.Key.Line,
                    Location = grp.Key.Location,
                    Unit = grp.Key.Unit,
                    SumProduction = grp.Sum(x=> x.Production),
                    SumRejection = grp.Sum(x=> x.Rejection)
                }).GroupBy(grp => new { grp.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    SumProduction = grp.Average(x => x.SumProduction),
                    SumRejection = grp.Average(x => x.SumRejection)
                }).ToList();
            }
            List<double> efficiencyDataList = new List<double>();
            int countOperations = _rmgDbContext.TimeStudy.Count();
            List<string> dates = new List<string>();
            var query = (from x in rejectionsDataList
                         select new EfficiencyParameters
                         {
                             efficiency = Math.Round(((x.SumRejection / x.SumProduction) * 100)),
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

        private JsonResult DHUHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> dhuDataList = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                dhuDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date, x.Line, x.Location, x.Unit }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    Line = grp.Key.Line,
                    Location = grp.Key.Location,
                    Unit = grp.Key.Unit,
                    SumDefectCount = grp.Sum(x => x.DefectCount),
                    SumProduction = grp.Sum(x=> x.Production)
                }).GroupBy(grp => new { grp.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    SumDefectCount = grp.Average(x => x.SumDefectCount),
                    SumProduction = grp.Average(x=> x.SumProduction)
                }).ToList();
            }
            List<double> efficiencyDataList = new List<double>();
            List<string> dates = new List<string>();
            var query = (from x in dhuDataList
                         select new EfficiencyParameters
                         {
                             efficiency = Math.Round((x.SumDefectCount / x.SumProduction) *100),
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

        private JsonResult TopFiveDHUHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> topFiveDHUHistoricViewModels = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                topFiveDHUHistoricViewModels = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date, x.AlterationReason1, x.AlterationReason2, x.AlterationReason3, x.AlterationReason4, x.AlterationReason5 }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    ProdData = grp.Sum(x => x.Production),
                    DefectReason1 = grp.Key.AlterationReason1,
                    DefectCount1Data = grp.Sum(x => Convert.ToDouble(x.DefectCount1)),
                    DefectReason2 = grp.Key.AlterationReason2,
                    DefectCount2Data = grp.Sum(x => Convert.ToDouble(x.DefectCount2)),
                    DefectReason3 = grp.Key.AlterationReason3,
                    DefectCount3Data = grp.Sum(x => Convert.ToDouble(x.DefectCount3)),
                    DefectReason4 = grp.Key.AlterationReason4,
                    DefectCount4Data = grp.Sum(x => Convert.ToDouble(x.DefectCount4)),
                    DefectReason5 = grp.Key.AlterationReason5,
                    DefectCount5Data = grp.Sum(x => Convert.ToDouble(x.DefectCount5)),
                }).ToList();
            }
            var groupedTopFiveDHUHistoricList = topFiveDHUHistoricViewModels.GroupBy(u => u.Date).Select(grp => grp.ToList()).ToList();
            List<DefectViewModel> groupedDefectViewModels = new List<DefectViewModel>();
            foreach (var element in groupedTopFiveDHUHistoricList)
            {
                foreach (var innerElement in element)
                {
                    if(innerElement.ProdData != 0)
                    {
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason1,
                            DefectCount = innerElement.DefectCount1Data,
                            ProductionData = innerElement.ProdData,
                            DailyDate = innerElement.Date
                        });
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason2,
                            DefectCount = innerElement.DefectCount2Data,
                            ProductionData = innerElement.ProdData,
                            DailyDate = innerElement.Date
                        });
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason3,
                            DefectCount = innerElement.DefectCount3Data,
                            ProductionData = innerElement.ProdData,
                            DailyDate = innerElement.Date
                        });
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason4,
                            DefectCount = innerElement.DefectCount4Data,
                            ProductionData = innerElement.ProdData,
                            DailyDate = innerElement.Date
                        });
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason5,
                            DefectCount = innerElement.DefectCount5Data,
                            ProductionData = innerElement.ProdData,
                            DailyDate = innerElement.Date
                        });
                    }
                }
            }
            groupedDefectViewModels.Sort((x, y) => x.DefectCount.CompareTo(y.DefectCount));
            List<DHUTopFiveDefects> dhuTopFiveDefects = new List<DHUTopFiveDefects>();
            var orderedDefectViewModel = groupedDefectViewModels.OrderByDescending(x=> x.DailyDate).OrderByDescending(x => x.DefectCount).Take(5).ToList();
            List<DateTime> dailyDates = new List<DateTime>();
            List<string> categories = new List<string>();
            List<string> defectsName = new List<string>();
            List<RejectionStyleDataModel> dhuViewModel = new List<RejectionStyleDataModel>();
            for (DateTime date = startDate.Value; date<= endDate.Value; date= date.AddDays(1))
            {
                dailyDates.Add(date);
                var dateString = date.ToString("dd-MMM-yyyy");
                categories.Add(dateString);
            }

            for (int index =0; index < orderedDefectViewModel.Count; index++)
            {
                defectsName.Add(orderedDefectViewModel[index].DefectName);
                string color = "";
                if (index == 0)
                {
                    color = "#175d2d";
                }
                if(index == 1)
                {
                    color = "#ffb600";
                }
                if (index == 2)
                {
                    color = "#e0301e";
                }
                if (index == 3)
                {
                    color = "#933401";
                }
                if (index == 4)
                {
                    color = "#ae6800";
                }
                List<int> calculatedDHUList = new List<int>();
                string defectName = orderedDefectViewModel[index].DefectName;
                
                foreach (var date in dailyDates)
                {
                    int dhuValue = 0;
                    if(orderedDefectViewModel[index].DailyDate == date)
                    {
                        dhuValue = Convert.ToInt32(Math.Round((orderedDefectViewModel[index].DefectCount / orderedDefectViewModel[index].ProductionData) * 100));
                    }
                    calculatedDHUList.Add(dhuValue);
                }
                var averageDHU = calculatedDHUList.Average();
                string avgDHUColor = "";
                if (averageDHU < 6)
                {
                    avgDHUColor = "#175d2d";
                }
                else if (averageDHU >= 6 && averageDHU <= 9)
                {
                    avgDHUColor = "#ffb600";
                }
                else
                {
                    avgDHUColor = "#e0301e";
                }
                dhuViewModel.Add(new RejectionStyleDataModel
                {
                    color = avgDHUColor,
                    y = Math.Round(averageDHU,2)
                });
                dhuTopFiveDefects.Add(new DHUTopFiveDefects
                {
                    data = calculatedDHUList,
                    color = color,
                    name = defectName
                });
            }
            return Json(new { 
                data = dhuTopFiveDefects,
                categories = categories,
                avgDefectCategories = defectsName,
                avgDefects = dhuViewModel
            });
        }
    }
}
