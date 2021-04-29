using Entities;
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
    public class DHUOverviewController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public DHUOverviewController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }

        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> topFiveDHUOverviewViewModels = new List<ProductionViewModel>();
            List<ProductionViewModel> defectFirstReason1 = new List<ProductionViewModel>();
            List<ProductionViewModel> defectFirstReason2 = new List<ProductionViewModel>();
            List<ProductionViewModel> defectFirstReason3 = new List<ProductionViewModel>();
            List<ProductionViewModel> defectFirstReason4 = new List<ProductionViewModel>();
            List<ProductionViewModel> defectFirstReason5 = new List<ProductionViewModel>();
            List<ProductionViewModel> dhuOverviewViewModels = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                topFiveDHUOverviewViewModels = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.AlterationReason1, x.AlterationReason2, x.AlterationReason3, x.AlterationReason4, x.AlterationReason5 }).Select(grp => new ProductionViewModel
                {
                    //OperatorName = grp.Key.Name,
                    ProdData = grp.Average(x => x.Production),
                    DefectReason1 = grp.Key.AlterationReason1,
                    DefectCount1Data = grp.Sum(x => Convert.ToDouble(x.DefectCount1)),
                    DefectivePcs1Data = grp.Sum(x => Convert.ToDouble(x.DefectivePcs_1)),
                    DefectReason2 = grp.Key.AlterationReason2,
                    DefectCount2Data = grp.Sum(x => Convert.ToDouble(x.DefectCount2)),
                    DefectivePcs2Data = grp.Sum(x => Convert.ToDouble(x.DefectivePcs_2)),
                    DefectReason3 = grp.Key.AlterationReason3,
                    DefectCount3Data = grp.Sum(x => Convert.ToDouble(x.DefectCount3)),
                    DefectivePcs3Data = grp.Sum(x => Convert.ToDouble(x.DefectivePcs_3)),
                    DefectReason4 = grp.Key.AlterationReason4,
                    DefectCount4Data = grp.Sum(x => Convert.ToDouble(x.DefectCount4)),
                    DefectivePcs4Data = grp.Sum(x => Convert.ToDouble(x.DefectivePcs_4)),
                    DefectReason5 = grp.Key.AlterationReason5,
                    DefectCount5Data = grp.Sum(x => Convert.ToDouble(x.DefectCount5)),
                    DefectivePcs5Data = grp.Sum(x => Convert.ToDouble(x.DefectivePcs_5)),
                }).ToList();

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

                dhuOverviewViewModels = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Name }).Select(grp => new ProductionViewModel { 
                    SumProduction = grp.Sum(x=> x.Production),
                    SumDefectCount = grp.Sum(x=> x.DefectCount)
                }).ToList();

                
            }
            List<DefectViewModel> defectViewModels = new List<DefectViewModel>();
            List<DefectViewModel> filteredDefectViewModels = new List<DefectViewModel>();

            foreach(var element in defectFirstReason1)
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

            //foreach (var element in topFiveDHUOverviewViewModels)
            //{
            //    defectViewModels.Add(new DefectViewModel
            //    {
            //        DefectCount = element.DefectCount1Data,
            //        DefectName = element.DefectReason1,
            //        ProductionData = element.ProdData,
            //        DefectPcsCount = element.DefectivePcs1Data
            //    });
            //    defectViewModels.Add(new DefectViewModel
            //    {
            //        DefectCount = element.DefectCount2Data,
            //        DefectName = element.DefectReason2,
            //        DefectPcsCount = element.DefectivePcs2Data
            //    });
            //    defectViewModels.Add(new DefectViewModel
            //    {
            //        DefectCount = element.DefectCount3Data,
            //        DefectName = element.DefectReason3,
            //        DefectPcsCount = element.DefectivePcs3Data
            //    });
            //    defectViewModels.Add(new DefectViewModel
            //    {
            //        DefectCount = element.DefectCount4Data,
            //        DefectName = element.DefectReason4,
            //        DefectPcsCount = element.DefectivePcs4Data
            //    });
            //    defectViewModels.Add(new DefectViewModel
            //    {
            //        DefectCount = element.DefectCount5Data,
            //        DefectName = element.DefectReason5,
            //        DefectPcsCount = element.DefectivePcs5Data
            //    });
            //}

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
            var totalDefectCount = Math.Round(filteredDefectViewModels.Select(x => x.DefectCount).Sum());
            filteredDefectViewModels.Sort((x, y) => x.DefectCount.CompareTo(y.DefectCount));

            var orderedDefectViewModel = filteredDefectViewModels.OrderByDescending(x => x.DefectCount).Take(5).OrderByDescending(x=> x.DefectCount).ToList();
            DHUPieChartViewModel dHUPieChartViewModel = new DHUPieChartViewModel();
            List<DHUPieChartDataPoint> dHUPieChartDataSet = new List<DHUPieChartDataPoint>();
            double topFiveDefectsCount = 0;
            foreach(var element in orderedDefectViewModel)
            {
                topFiveDefectsCount += element.DefectCount;
                DHUPieChartDataPoint chartDataPoint = new DHUPieChartDataPoint();
                chartDataPoint.y = Math.Round((element.DefectCount*100)/ totalDefectCount,2);
                chartDataPoint.name = element.DefectName;
                dHUPieChartDataSet.Add(chartDataPoint);
            }

            DHUPieChartDataPoint chartDataPointOthers = new DHUPieChartDataPoint();
            chartDataPointOthers.y = Math.Round(((totalDefectCount-topFiveDefectsCount) * 100) / totalDefectCount, 2);
            chartDataPointOthers.name = "Others";
            dHUPieChartDataSet.Add(chartDataPointOthers);

            dHUPieChartViewModel.data = dHUPieChartDataSet;
            dHUPieChartViewModel.name = "Top defects";
            dHUPieChartViewModel.colorByPoint = true;

            //List<RejectionStyleDataModel> dhuViewModel = new List<RejectionStyleDataModel>();
            //List<string> categories = new List<string>();
            //foreach(var element in orderedDefectViewModel)
            //{
            //    if(element.ProductionData != 0)
            //    {
            //        categories.Add(element.DefectName);
            //        var dhuValue = Math.Round((element.DefectCount / element.ProductionData) * 100);
            //        string color = "";
            //        if (dhuValue < 6)
            //        {
            //            color = "#175d2d";
            //        }
            //        else if (dhuValue >= 6 && dhuValue <= 9)
            //        {
            //            color = "#ffb600";
            //        }
            //        else
            //        {
            //            color = "#e0301e";
            //        }
            //        dhuViewModel.Add(new RejectionStyleDataModel
            //        {
            //            y = dhuValue,
            //            color = color
            //        });
            //    }

            //}

            //double totalSumProduction = 0;
            //double totalSumDefectCount = 0;
            //foreach (var element in dhuOverviewViewModels)
            //{
            //    totalSumDefectCount += element.SumDefectCount;
            //    totalSumProduction += element.SumProduction;
            //}

            //double overDHUValue = Math.Round((totalSumDefectCount / totalSumProduction) * 100);
            //string overAllDHUColor = "";
            //if (overDHUValue < 6)
            //{
            //    overAllDHUColor = "#175d2d";
            //}
            //else if (overDHUValue >= 6 && overDHUValue <= 9)
            //{
            //    overAllDHUColor = "#ffb600";
            //}
            //else
            //{
            //    overAllDHUColor = "#e0301e";
            //}
            //dhuViewModel = dhuViewModel.OrderByDescending(x => x.y).ToList();
            return Json(new{
                data = dHUPieChartViewModel,
                //overallDHU = overDHUValue,
                //overAllDHUColor = overAllDHUColor,
                //categories = categories
            });
        }
    }
}
