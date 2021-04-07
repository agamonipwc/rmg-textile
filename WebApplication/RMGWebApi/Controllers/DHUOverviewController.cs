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
            List<ProductionViewModel> dhuOverviewViewModels = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                topFiveDHUOverviewViewModels = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Name, x.AlterationReason1, x.AlterationReason2, x.AlterationReason3, x.AlterationReason4, x.AlterationReason5 }).Select(grp => new ProductionViewModel
                {
                    OperatorName = grp.Key.Name,
                    ProdData = grp.Average(x=> x.Production),
                    DefectReason1 = grp.Key.AlterationReason1,
                    DefectCount1Data = grp.Average(x => Convert.ToDouble(x.DefectCount1)),
                    DefectReason2 = grp.Key.AlterationReason2,
                    DefectCount2Data = grp.Average(x => Convert.ToDouble(x.DefectCount2)),
                    DefectReason3 = grp.Key.AlterationReason3,
                    DefectCount3Data = grp.Average(x => Convert.ToDouble(x.DefectCount3)),
                    DefectReason4 = grp.Key.AlterationReason4,
                    DefectCount4Data = grp.Average(x => Convert.ToDouble(x.DefectCount4)),
                    DefectReason5 = grp.Key.AlterationReason5,
                    DefectCount5Data = grp.Average(x => Convert.ToDouble(x.DefectCount5)),
                }).ToList();

                dhuOverviewViewModels = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Name }).Select(grp => new ProductionViewModel { 
                    SumProduction = grp.Sum(x=> x.Production),
                    SumDefectCount = grp.Sum(x=> x.DefectCount)
                }).ToList();

                
            }
            List<DefectViewModel> defectViewModels = new List<DefectViewModel>();
            List<DefectViewModel> filteredDefectViewModels = new List<DefectViewModel>();
            foreach (var element in topFiveDHUOverviewViewModels)
            {
                defectViewModels.Add(new DefectViewModel
                {
                    DefectCount = element.DefectCount1Data,
                    DefectName = element.DefectReason1,
                    ProductionData = element.ProdData
                });
                defectViewModels.Add(new DefectViewModel
                {
                    DefectCount = element.DefectCount2Data,
                    DefectName = element.DefectReason2
                });
                defectViewModels.Add(new DefectViewModel
                {
                    DefectCount = element.DefectCount3Data,
                    DefectName = element.DefectReason3
                });
                defectViewModels.Add(new DefectViewModel
                {
                    DefectCount = element.DefectCount4Data,
                    DefectName = element.DefectReason4
                });
                defectViewModels.Add(new DefectViewModel
                {
                    DefectCount = element.DefectCount5Data,
                    DefectName = element.DefectReason5
                });
            }

            foreach(var element in defectViewModels)
            {
                if(element.ProductionData != 0)
                {
                    filteredDefectViewModels.Add(new DefectViewModel
                    {
                        DefectCount = element.DefectCount,
                        DefectName = element.DefectName,
                        ProductionData = element.ProductionData
                    });
                }
            }

            filteredDefectViewModels.Sort((x, y) => x.DefectCount.CompareTo(y.DefectCount));

            var orderedDefectViewModel = filteredDefectViewModels.OrderByDescending(x => x.DefectCount).Take(5).ToList();

            List<RejectionStyleDataModel> dhuViewModel = new List<RejectionStyleDataModel>();
            List<string> categories = new List<string>();
            foreach(var element in orderedDefectViewModel)
            {
                if(element.ProductionData != 0)
                {
                    categories.Add(element.DefectName);
                    var dhuValue = Math.Round((element.DefectCount / element.ProductionData) * 100);
                    string color = "";
                    if (dhuValue < 6)
                    {
                        color = "#175d2d";
                    }
                    else if (dhuValue >= 6 && dhuValue <= 9)
                    {
                        color = "#ffb600";
                    }
                    else
                    {
                        color = "#e0301e";
                    }
                    dhuViewModel.Add(new RejectionStyleDataModel
                    {
                        y = dhuValue,
                        color = color
                    });
                }
                
            }

            double totalSumProduction = 0;
            double totalSumDefectCount = 0;
            foreach (var element in dhuOverviewViewModels)
            {
                totalSumDefectCount += element.SumDefectCount;
                totalSumProduction += element.SumProduction;
            }

            double overDHUValue = Math.Round((totalSumDefectCount / totalSumProduction) * 100);
            string overAllDHUColor = "";
            if (overDHUValue < 6)
            {
                overAllDHUColor = "#175d2d";
            }
            else if (overDHUValue >= 6 && overDHUValue <= 9)
            {
                overAllDHUColor = "#ffb600";
            }
            else
            {
                overAllDHUColor = "#e0301e";
            }
            return Json(new{
                data = dhuViewModel,
                overallDHU = overDHUValue,
                overAllDHUColor = overAllDHUColor,
                categories = categories
            });
        }
    }
}
