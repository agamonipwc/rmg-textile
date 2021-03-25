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
    public class OperatorsCapacityUtilizationController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public OperatorsCapacityUtilizationController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            List<OperatorCapacityUtilization> actualProductionViewModels = new List<OperatorCapacityUtilization>();
            if (kpiViewModel.Location.Count == 0 && kpiViewModel.Line.Count == 0 && kpiViewModel.Unit.Count == 0)
            {
                actualProductionViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name, grp.Operation}).Select(ope => new OperatorCapacityUtilization
                {
                    OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                    OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                    ProductionData = ope.Average(x=> x.Production),
                    OperationName = ope.Key.Operation
                    //CapapcityUtilization = Math.Round(ope.Average(x=> x.Production) / ((_rmgDbContext.TimeStudy.Where(x=> x.OperationDescription == ope.Key.Operation).Average(x=>x.PlannedProduction)) * 8)*100)
                }).ToList();
            }
            else
            {
                if (kpiViewModel.Location.Count > 0)
                {
                    actualProductionViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Location.Contains(efficiencyworker.Location)).Where(efficiencyworker => efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name, grp.Operation }).Select(ope => new OperatorCapacityUtilization
                    {
                        OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                        OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                        ProductionData = ope.Average(x => x.Production),
                        OperationName = ope.Key.Operation
                    }).ToList();
                }
                else
                {
                    if (kpiViewModel.Unit.Count > 0)
                    {
                        actualProductionViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Unit.Contains(efficiencyworker.Unit) && efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name, grp.Operation }).Select(ope => new OperatorCapacityUtilization
                        {
                            OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                            OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                            ProductionData = ope.Average(x => x.Production),
                            OperationName = ope.Key.Operation
                        }).ToList();
                    }
                    else
                    {
                        actualProductionViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Line.Contains(efficiencyworker.Line) && efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name, grp.Operation }).Select(ope => new OperatorCapacityUtilization
                        {
                            OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                            OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                            ProductionData = ope.Average(x => x.Production),
                            OperationName = ope.Key.Operation
                        }).ToList();
                    }
                }
            }

            var timeStudyData = _rmgDbContext.TimeStudy.Select(x=> new TimeStudyData { 
                PlannedProduction = (x.PlannedProduction*8),
                OperationDesc = x.OperationDescription
            }).ToList();

            var resultDataSet = (from s in actualProductionViewModels
                         join cs in timeStudyData on s.OperationName equals cs.OperationDesc
                         select new OperatorCapacityUtilization
                         {
                             OperationName = s.OperationName,
                             OperatorIndex = s.OperatorIndex,
                             CapapcityUtilization = Math.Round((s.ProductionData / cs.PlannedProduction)  * 100)
                         }).ToList();



            List<EfficiencyViewModel> seriesData = new List<EfficiencyViewModel>();
            List<object[]> lowCapapcityUtilization = new List<object[]>();
            List<object[]> moderateCapapcityUtilization = new List<object[]>();
            List<object[]> highCapapcityUtilization = new List<object[]>();
            foreach (var element in resultDataSet)
            {
                if (element.CapapcityUtilization <= 100)
                {
                    object[] objectArray = new object[2];
                    //string color = "";
                    if (element.CapapcityUtilization >= 75)
                    {
                        objectArray[0] = element.OperatorIndex;
                        objectArray[1] = element.CapapcityUtilization;
                        highCapapcityUtilization.Add(objectArray);
                        //color = "#e0301e";
                    }
                    else if (element.CapapcityUtilization >= 51 && element.CapapcityUtilization <= 74)
                    {
                        //color = "#ffb600";
                        objectArray[0] = element.OperatorIndex;
                        objectArray[1] = element.CapapcityUtilization;
                        moderateCapapcityUtilization.Add(objectArray);
                    }
                    else if (element.CapapcityUtilization >= 0 && element.CapapcityUtilization <=50 )
                    {
                        //color = "#175d2d";
                        objectArray[0] = element.OperatorIndex;
                        objectArray[1] = element.CapapcityUtilization;
                        lowCapapcityUtilization.Add(objectArray);
                    }
                }

            }
            seriesData.Add(new EfficiencyViewModel
            {
                name = "Low",
                showInLegend = false,
                color = "#e0301e",
                data = lowCapapcityUtilization
            });
            seriesData.Add(new EfficiencyViewModel
            {
                name = "Moderate",
                showInLegend = false,
                color = "#ffb600",
                data = moderateCapapcityUtilization
            });
            seriesData.Add(new EfficiencyViewModel
            {
                name = "High",
                showInLegend = false,
                color = "#175d2d",
                data = highCapapcityUtilization
            });
            return Json(new
            {
                data = seriesData,
                statusCode = 200
            });
        }
    }
}
