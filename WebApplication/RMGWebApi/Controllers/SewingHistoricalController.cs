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
        double totalDefectCount = 0;
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
                //TopFiveDHUHistoricalCalculation= TopDefectsHistoricalCalculation(kpiViewModel),
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
                }).GroupBy(grp => new { grp.Date, grp.OperationDescription }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    ProdData = grp.Average(x => x.ProdData),
                    OperationDescription = grp.Key.OperationDescription
                }).ToList();
            }
            var timeStudyData = _rmgDbContext.TimeStudy.Where(x => x.OperationDescription == "Checking").Select(x => new TimeStudyData
            {
                PlannedProduction = x.PlannedProduction,
                OperationDesc = x.OperationDescription
            });
            var timeStudyCheckerData = timeStudyData.Select(x => x.PlannedProduction).Sum()*8;
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
                dates.Add(element.Dailydate);
                efficiencyDataList.Add(element.efficiency);
            }
            var averageDataValue = Math.Round(efficiencyDataList.Average(),2);
            return Json(new
            {
                data = efficiencyDataList,
                categories = dates,
                averageDataValue = averageDataValue
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
            var averageDataValue = Math.Round(efficiencyDataList.Average(), 2);
            return Json(new
            {
                data = efficiencyDataList,
                categories = dates,
                averageDataValue = averageDataValue
            });
        }

        private JsonResult InlineWIPHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> productionsDataList = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                productionsDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date, x.Line, x.Location, x.Unit }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    Line = grp.Key.Line,
                    Location = grp.Key.Location,
                    Unit = grp.Key.Unit,
                    ProdData = grp.Where(x=> x.Operation == "Checking").Sum(x => x.Production),
                    WIPData = grp.Sum(x=> x.WIP)
                }).GroupBy(grp => new { grp.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    ProdData = grp.Average(x => x.ProdData),
                    WIPData = grp.Average(x=> x.WIPData)
                }).ToList();
            }
            List<double> efficiencyDataList = new List<double>();
            int countOperations = _rmgDbContext.TimeStudy.Count();
            List<string> dates = new List<string>();
            var query = (from x in productionsDataList
                         select new EfficiencyParameters
                         {
                             efficiency = Math.Round((x.WIPData)/x.ProdData, 2),
                             Dailydate = x.Date.ToString("dd-MMM-yyyy")
                         }).ToList();
            foreach (var element in query)
            {
                dates.Add(element.Dailydate);
                efficiencyDataList.Add(element.efficiency);
            }
            var averageDataValue = Math.Round(efficiencyDataList.Average(), 2);
            return Json(new
            {
                data = efficiencyDataList,
                categories = dates,
                averageDataValue = averageDataValue
            });
        }

        private JsonResult MachineDowntimeHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            List<MachineDowntimeViewModel> machineDowntimeHistoricalDataLists = new List<MachineDowntimeViewModel>();
            List<DHUTopFiveDefects> groupedMachineDowntimeViewModels = new List<DHUTopFiveDefects>();
            List<string> categories = new List<string>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                machineDowntimeHistoricalDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date, x.Line, x.Location, x.Unit }).Select(grp => new MachineDowntimeViewModel
                {
                    Date = grp.Key.Date,
                    Line = grp.Key.Line,
                    Location = grp.Key.Location,
                    Unit = grp.Key.Unit,
                    MachineDownTime = Math.Round((grp.Sum(x => x.MachineDowntime) * 100) / (480 * grp.Count()), 2),
                }).GroupBy(grp => new { grp.Date }).Select(grp => new MachineDowntimeViewModel
                {
                    Date = grp.Key.Date,
                    MachineDownTime = grp.Average(x=> x.MachineDownTime)
                }).ToList();
            }
            List<double> efficiencyDataList = new List<double>();
            List<string> dates = new List<string>();
            var query = (from x in machineDowntimeHistoricalDataLists
                         select new EfficiencyParameters
                         {
                             efficiency = Math.Round(x.MachineDownTime,2),
                             Dailydate = x.Date.ToString("dd-MMM-yyyy")
                         }).ToList();
            foreach (var element in query)
            {
                dates.Add(element.Dailydate);
                efficiencyDataList.Add(element.efficiency);
            }
            var averageDataValue = Math.Round(efficiencyDataList.Average(), 2);
            return Json(new
            {
                data = efficiencyDataList,
                categories = dates,
                averageDataValue = averageDataValue
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
            var averageDataValue = Math.Round(efficiencyDataList.Average(), 2);
            return Json(new
            {
                data = efficiencyDataList,
                categories = dates,
                averageDataValue = averageDataValue
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
            var averageDataValue = Math.Round(efficiencyDataList.Average(), 2);
            return Json(new
            {
                data = efficiencyDataList,
                categories = dates,
                averageDataValue = averageDataValue
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
            var averageDataValue = Math.Round(efficiencyDataList.Average(), 2);
            return Json(new
            {
                data = efficiencyDataList,
                categories = dates,
                averageDataValue = averageDataValue
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
            var averageDataValue = Math.Round(efficiencyDataList.Average(), 2);
            return Json(new
            {
                data = efficiencyDataList,
                categories = dates,
                averageDataValue = averageDataValue
            });
        }

        private JsonResult TopFiveDHUHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> topFiveDHUHistoricViewModels = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            List<string> allAlternativeReason = new List<string>();
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                topFiveDHUHistoricViewModels = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date, x.AlterationReason1, x.AlterationReason2, x.AlterationReason3, x.AlterationReason4, x.AlterationReason5 }).Select(grp => new ProductionViewModel
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
                        allAlternativeReason.Add(innerElement.DefectReason1);
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason2,
                            DefectCount = innerElement.DefectCount2Data,
                            ProductionData = innerElement.ProdData,
                            DailyDate = innerElement.Date
                        });
                        allAlternativeReason.Add(innerElement.DefectReason2);
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason3,
                            DefectCount = innerElement.DefectCount3Data,
                            ProductionData = innerElement.ProdData,
                            DailyDate = innerElement.Date
                        });
                        allAlternativeReason.Add(innerElement.DefectReason3);
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason4,
                            DefectCount = innerElement.DefectCount4Data,
                            ProductionData = innerElement.ProdData,
                            DailyDate = innerElement.Date
                        });
                        allAlternativeReason.Add(innerElement.DefectReason4);
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason5,
                            DefectCount = innerElement.DefectCount5Data,
                            ProductionData = innerElement.ProdData,
                            DailyDate = innerElement.Date
                        });
                        allAlternativeReason.Add(innerElement.DefectReason5);
                    }
                }
            }
            groupedDefectViewModels.Sort((x, y) => x.DefectCount.CompareTo(y.DefectCount));
            
            List<DHUTopFiveDefects> dhuTopFiveDefects = new List<DHUTopFiveDefects>();

            //var groupedDefectCountViewModel = groupedDefectViewModels.GroupBy(x => new { x.DefectName}).Select(c => new DefectViewModel
            //{
            //    DefectName = c.Key.DefectName,
            //    DefectCount = c.Average(x => x.DefectCount),
            //    ProductionData = c.Average(x => x.ProductionData),
            //    //DailyDate = c.Key.DailyDate
            //}).ToList();

            //var orderedDefectViewModel = groupedDefectViewModels.OrderByDescending(x=> x.DailyDate).OrderByDescending(x => x.DefectCount).Take(5).ToList();
            //var orderedDefectViewModel = groupedDefectCountViewModel.OrderByDescending(x => x.DailyDate).OrderByDescending(x => x.DefectCount).Take(5).ToList();
            var orderedDefectViewModel = TopDefectsHistoricalCalculation(kpiViewModel);
            var dHUPieChartViewModel = TopDefectsPieChartAnalysis(kpiViewModel);
            var lineWiseDefectChartViewModel = LineWiseDefectDistribution(kpiViewModel);

            List<DateTime> dailyDates = new List<DateTime>();
            List<string> categories = new List<string>();
            List<string> defectsName = new List<string>();
            List<RejectionStyleDataModel> dhuViewModel = new List<RejectionStyleDataModel>();
            
            
            for (DateTime date = startDate.Value; date<= endDate.Value; date= date.AddDays(1))
            {
                dailyDates.Add(date);
                var dateString = date.ToString("MMM dd, yy");
                categories.Add(dateString);
            }
            List<double> allDefectOccuranceCounts = new List<double>();
            for (int outerIndex = 0; outerIndex< orderedDefectViewModel.Count; outerIndex++)
            {
                defectsName.Add(orderedDefectViewModel[outerIndex].DefectName);
                string color = "";
                if (outerIndex == 0)
                {
                    color = "#175d2d";
                }
                if (outerIndex == 1)
                {
                    color = "#ffb600";
                }
                if (outerIndex == 2)
                {
                    color = "#e0301e";
                }
                if (outerIndex == 3)
                {
                    color = "#933401";
                }
                if (outerIndex == 4)
                {
                    color = "#ae6800";
                }
                List<double> calculatedDHUList = new List<double>();
                string defectName = orderedDefectViewModel[outerIndex].DefectName;
                for (int innerIndex = 0; innerIndex<dailyDates.Count; innerIndex++)
                {
                    double occurance = 0;
                    occurance = groupedDefectViewModels.Where(x => x.DefectName == defectName && x.DailyDate == dailyDates[innerIndex]).Count();
                    calculatedDHUList.Add(occurance);
                    allDefectOccuranceCounts.Add(occurance);
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
                    y = Math.Round(averageDHU, 2)
                });
                dhuTopFiveDefects.Add(new DHUTopFiveDefects
                {
                    data = calculatedDHUList,
                    color = color,
                    name = defectName
                });
            }

            //for (int index =0; index < orderedDefectViewModel.Count; index++)
            //{
            //    defectsName.Add(orderedDefectViewModel[index].DefectName);
            //    string color = "";
            //    if (index == 0)
            //    {
            //        color = "#175d2d";
            //    }
            //    if(index == 1)
            //    {
            //        color = "#ffb600";
            //    }
            //    if (index == 2)
            //    {
            //        color = "#e0301e";
            //    }
            //    if (index == 3)
            //    {
            //        color = "#933401";
            //    }
            //    if (index == 4)
            //    {
            //        color = "#ae6800";
            //    }
            //    List<double> calculatedDHUList = new List<double>();
            //    string defectName = orderedDefectViewModel[index].DefectName;

            //    foreach (var date in dailyDates)
            //    {
            //        double dhuValue = 0;
            //        if(orderedDefectViewModel[index].DailyDate == date)
            //        {
            //            dhuValue = groupedDefectViewModels.Where(x => x.DefectName == defectName && x.DailyDate == date).Count();
            //            //dhuValue = Math.Round((orderedDefectViewModel[index].DefectCount / orderedDefectViewModel[index].ProductionData) * 100, 2);
            //        }
            //        calculatedDHUList.Add(dhuValue);
            //    }
            //    var averageDHU = calculatedDHUList.Average();
            //    string avgDHUColor = "";
            //    if (averageDHU < 6)
            //    {
            //        avgDHUColor = "#175d2d";
            //    }
            //    else if (averageDHU >= 6 && averageDHU <= 9)
            //    {
            //        avgDHUColor = "#ffb600";
            //    }
            //    else
            //    {
            //        avgDHUColor = "#e0301e";
            //    }
            //    dhuViewModel.Add(new RejectionStyleDataModel
            //    {
            //        color = avgDHUColor,
            //        y = Math.Round(averageDHU,2)
            //    });
            //    dhuTopFiveDefects.Add(new DHUTopFiveDefects
            //    {
            //        data = calculatedDHUList,
            //        color = color,
            //        name = defectName
            //    });
            //}
            var maxOccurance = allDefectOccuranceCounts.Max();
            return Json(new { 
                data = dhuTopFiveDefects,
                categories = categories,
                avgDefectCategories = defectsName,
                avgDefects = dhuViewModel,
                pieChartViewModel = dHUPieChartViewModel,
                maxOccurance = maxOccurance,
                lineWiseDefectChartViewModel = lineWiseDefectChartViewModel
            });
        }

        private List<DefectViewModel> TopDefectsHistoricalCalculation(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> defectFirstReason1 = new List<ProductionViewModel>();
            List<ProductionViewModel> defectFirstReason2 = new List<ProductionViewModel>();
            List<ProductionViewModel> defectFirstReason3 = new List<ProductionViewModel>();
            List<ProductionViewModel> defectFirstReason4 = new List<ProductionViewModel>();
            List<ProductionViewModel> defectFirstReason5 = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            defectFirstReason1 = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.AlterationReason1 }).Select(grp => new ProductionViewModel
            {
                DefectReason1 = grp.Key.AlterationReason1,
                DefectCount1Data = grp.Sum(x => Convert.ToDouble(x.DefectCount1)),
                DefectivePcs1Data = grp.Sum(x => Convert.ToDouble(x.DefectivePcs_1)),
            }).ToList();
            defectFirstReason2 = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.AlterationReason2 }).Select(grp => new ProductionViewModel
            {
                DefectReason1 = grp.Key.AlterationReason2,
                DefectCount2Data = grp.Sum(x => Convert.ToDouble(x.DefectCount2)),
                DefectivePcs2Data = grp.Sum(x => Convert.ToDouble(x.DefectivePcs_2)),
            }).ToList();
            defectFirstReason3 = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.AlterationReason3 }).Select(grp => new ProductionViewModel
            {
                DefectReason3 = grp.Key.AlterationReason3,
                DefectCount3Data = grp.Sum(x => Convert.ToDouble(x.DefectCount3)),
                DefectivePcs3Data = grp.Sum(x => Convert.ToDouble(x.DefectivePcs_3)),
            }).ToList();
            defectFirstReason4 = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.AlterationReason4 }).Select(grp => new ProductionViewModel
            {
                DefectReason4 = grp.Key.AlterationReason4,
                DefectCount4Data = grp.Sum(x => Convert.ToDouble(x.DefectCount4)),
                DefectivePcs4Data = grp.Sum(x => Convert.ToDouble(x.DefectivePcs_4)),
            }).ToList();
            defectFirstReason5 = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.AlterationReason5 }).Select(grp => new ProductionViewModel
            {
                DefectReason5 = grp.Key.AlterationReason5,
                DefectCount5Data = grp.Sum(x => Convert.ToDouble(x.DefectCount5)),
                DefectivePcs5Data = grp.Sum(x => Convert.ToDouble(x.DefectivePcs_5)),
            }).ToList();
            List<DefectViewModel> defectViewModels = new List<DefectViewModel>();
            foreach (var element in defectFirstReason1)
            {
                defectViewModels.Add(new DefectViewModel
                {
                    DefectCount = element.DefectCount1Data,
                    DefectName = element.DefectReason1,
                    DefectPcsCount = element.DefectivePcs1Data
                });
            }

            foreach (var element in defectFirstReason2)
            {
                defectViewModels.Add(new DefectViewModel
                {
                    DefectCount = element.DefectCount2Data,
                    DefectName = element.DefectReason2,
                    DefectPcsCount = element.DefectivePcs2Data
                });
            }

            foreach (var element in defectFirstReason3)
            {
                defectViewModels.Add(new DefectViewModel
                {
                    DefectCount = element.DefectCount3Data,
                    DefectName = element.DefectReason3,
                    DefectPcsCount = element.DefectivePcs3Data
                });
            }

            foreach (var element in defectFirstReason4)
            {
                defectViewModels.Add(new DefectViewModel
                {
                    DefectCount = element.DefectCount4Data,
                    DefectName = element.DefectReason4,
                    DefectPcsCount = element.DefectivePcs4Data
                });
            }

            foreach (var element in defectFirstReason5)
            {
                defectViewModels.Add(new DefectViewModel
                {
                    DefectCount = element.DefectCount5Data,
                    DefectName = element.DefectReason5,
                    DefectPcsCount = element.DefectivePcs5Data
                });
            }
            List<DefectViewModel> filteredDefectViewModels = new List<DefectViewModel>();
            foreach (var element in defectViewModels)
            {
                //if(element.ProductionData != 0)
                //{
                filteredDefectViewModels.Add(new DefectViewModel
                {
                    DefectCount = element.DefectCount,
                    DefectName = element.DefectName,
                    ProductionData = element.ProductionData,
                    DefectPcsCount = element.DefectPcsCount
                });
                //}
            }
            filteredDefectViewModels.Sort((x, y) => x.DefectCount.CompareTo(y.DefectCount));
            totalDefectCount = Math.Round(filteredDefectViewModels.Select(x => x.DefectCount).Sum());
            var groupedDefectCountViewModel = filteredDefectViewModels.GroupBy(x => x.DefectName).Select(c => new DefectViewModel
            {
                DefectName = c.Key,
                DefectCount = c.Average(x => x.DefectCount),
                ProductionData = c.Average(x => x.ProductionData)
            }).ToList();

            var orderedDefectViewModel = groupedDefectCountViewModel.OrderByDescending(x => x.DefectCount).Take(5).OrderByDescending(x => x.DefectCount).ToList();
            
            return orderedDefectViewModel;
        }

        private DHUPieChartViewModel TopDefectsPieChartAnalysis(KPIViewModel kpiViewModel)
        {
            var orderedDefectViewModel = TopDefectsHistoricalCalculation(kpiViewModel);
            DHUPieChartViewModel dHUPieChartViewModel = new DHUPieChartViewModel();
            List<DHUPieChartDataPoint> dHUPieChartDataSet = new List<DHUPieChartDataPoint>();
            double topFiveDefectsCount = 0;
            foreach (var element in orderedDefectViewModel)
            {
                topFiveDefectsCount += element.DefectCount;
                DHUPieChartDataPoint chartDataPoint = new DHUPieChartDataPoint();
                chartDataPoint.y = Math.Round((element.DefectCount * 100) / totalDefectCount, 2);
                chartDataPoint.name = element.DefectName;
                dHUPieChartDataSet.Add(chartDataPoint);
            }

            DHUPieChartDataPoint chartDataPointOthers = new DHUPieChartDataPoint();
            chartDataPointOthers.y = Math.Round(((totalDefectCount - topFiveDefectsCount) * 100) / totalDefectCount, 2);
            chartDataPointOthers.name = "Others";
            dHUPieChartDataSet.Add(chartDataPointOthers);

            dHUPieChartViewModel.data = dHUPieChartDataSet;
            dHUPieChartViewModel.name = "Top defects";
            dHUPieChartViewModel.colorByPoint = true;

            return dHUPieChartViewModel;
        }

        private JsonResult LineWiseDefectDistribution(KPIViewModel kpiViewModel)
        {
            var orderedDefectViewModel = TopDefectsHistoricalCalculation(kpiViewModel).Select(x=> x.DefectName).ToList();
            List<ProductionViewModel> topFiveDHUHistoricViewModels = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                topFiveDHUHistoricViewModels = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line, x.Unit, x.AlterationReason1, x.AlterationReason2, x.AlterationReason3, x.AlterationReason4, x.AlterationReason5 }).Select(grp => new ProductionViewModel
                {
                    Line = grp.Key.Line,
                    Unit = grp.Key.Unit,
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
            var groupedTopFiveDHUHistoricList = topFiveDHUHistoricViewModels.GroupBy(u => new { u.Line, u.Unit }).Select(grp => grp.ToList()).ToList();
            List<DefectViewModel> groupedDefectViewModels = new List<DefectViewModel>();
            foreach (var element in groupedTopFiveDHUHistoricList)
            {
                foreach (var innerElement in element)
                {
                    if (innerElement.ProdData != 0)
                    {
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason1,
                            DefectCount = innerElement.DefectCount1Data,
                            ProductionData = innerElement.ProdData,
                            LineName = string.Join("","Line",innerElement.Line,"Unit", innerElement.Unit)
                        });
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason2,
                            DefectCount = innerElement.DefectCount2Data,
                            ProductionData = innerElement.ProdData,
                            LineName = string.Join("", "Line", innerElement.Line, "Unit", innerElement.Unit)
                        });
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason3,
                            DefectCount = innerElement.DefectCount3Data,
                            ProductionData = innerElement.ProdData,
                            LineName = string.Join("", "Line", innerElement.Line, "Unit", innerElement.Unit)
                        });
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason4,
                            DefectCount = innerElement.DefectCount4Data,
                            ProductionData = innerElement.ProdData,
                            LineName = string.Join("", "Line", innerElement.Line, "Unit", innerElement.Unit)
                        });
                        groupedDefectViewModels.Add(new DefectViewModel
                        {
                            DefectName = innerElement.DefectReason5,
                            DefectCount = innerElement.DefectCount5Data,
                            ProductionData = innerElement.ProdData,
                            LineName = string.Join("", "Line", innerElement.Line, "Unit", innerElement.Unit)
                        });
                    }
                }
            }

            var newgroupedDefectViewModels = groupedDefectViewModels.Where(x => orderedDefectViewModel.Contains(x.DefectName)).GroupBy(x=> new{ x.DefectName, x.LineName}).Select(grp=> new DefectViewModel { 
                DefectName = grp.Key.DefectName,
                DefectCount = grp.Sum(x=> x.DefectCount),
                LineName = grp.Key.LineName
            }).ToList();

            List<string> lineCategories = new List<string>();
            lineCategories = groupedDefectViewModels.Select(x => x.LineName).Distinct().ToList();
            List<LineWiseDefectViewModel> lineWiseDefectViews = new List<LineWiseDefectViewModel>();
            for(int outerIndex = 0; outerIndex< lineCategories.Count; outerIndex++)
            {
                List<double> dataset = new List<double>();
                for(int innerIndex = 0; innerIndex< newgroupedDefectViewModels.Count; innerIndex++)
                {
                    //var defectName = orderedDefectViewModel.Where(x => x.DefectName == groupedDefectViewModels[innerIndex].DefectName).Select(x => x.DefectName).FirstOrDefault();
                    double defectCount = 0;
                    if (newgroupedDefectViewModels[innerIndex].LineName == lineCategories[outerIndex])
                    {
                        defectCount += groupedDefectViewModels[innerIndex].DefectCount;
                        dataset.Add(defectCount);
                    }
                    
                }
                lineWiseDefectViews.Add(new LineWiseDefectViewModel
                {
                    name = lineCategories[outerIndex],
                    data = dataset
                });
            }
            return Json(new {
                lineWiseDefectViews = lineWiseDefectViews,
                categories = orderedDefectViewModel
            });
        }

        private class LineWiseDefectViewModel
        {
            public string name { get; set; }
            public List<double> data { get; set; }
        }
    }
}
