using Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RMGWebApi.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperatorEfficiencyController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public OperatorEfficiencyController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            List<OperatorEfficiency> operatorViewModels = new List<OperatorEfficiency>();
            if(kpiViewModel.Location.Count == 0 && kpiViewModel.Line.Count == 0 && kpiViewModel.Unit.Count == 0)
            {
                operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp=> new { grp.Name, grp.OperationIndex }).Select(ope => new OperatorEfficiency
                {
                    OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                    OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                    Efficiency = Math.Round((ope.Average(c=> c.Production) * (_rmgDbContext.TimeStudy.Where(x => x.SlNo == ope.Key.OperationIndex).Select(x => x.SAM).FirstOrDefault()) / ope.Average(c=> c.WorkingMins * 1) * 100))
                }).ToList();
            }
            else
            {
                if(kpiViewModel.Location.Count > 0)
                {
                    operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Location.Contains(efficiencyworker.Location)).Where(efficiencyworker => efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name, grp.OperationIndex }).Select(ope => new OperatorEfficiency
                    {
                        OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                        OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                        Efficiency = Math.Round((ope.Average(c => c.Production) * (_rmgDbContext.TimeStudy.Where(x => x.SlNo == ope.Key.OperationIndex).Select(x => x.SAM).FirstOrDefault()) / ope.Average(c => c.WorkingMins * 1) * 100))
                    }).ToList();
                }
                else
                {
                    if(kpiViewModel.Unit.Count > 0)
                    {
                        operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Unit.Contains(efficiencyworker.Unit) && efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name, grp.OperationIndex }).Select(ope => new OperatorEfficiency
                        {
                            OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                            OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                            Efficiency = Math.Round((ope.Average(c => c.Production) * (_rmgDbContext.TimeStudy.Where(x => x.SlNo == ope.Key.OperationIndex).Select(x => x.SAM).FirstOrDefault()) / ope.Average(c => c.WorkingMins * 1) * 100))
                        }).ToList();
                    }
                    else
                    {
                        operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Line.Contains(efficiencyworker.Line) && efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name, grp.OperationIndex }).Select(ope => new OperatorEfficiency
                        {
                            OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                            OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                            Efficiency = Math.Round((ope.Average(c => c.Production) * (_rmgDbContext.TimeStudy.Where(x => x.SlNo == ope.Key.OperationIndex).Select(x => x.SAM).FirstOrDefault()) / ope.Average(c => c.WorkingMins * 1) * 100))
                        }).ToList();
                    }
                }
            }
            List<EfficiencyViewModel> seriesData = new List<EfficiencyViewModel>();
            foreach(var element in operatorViewModels)
            {
                object[] objectArray = new object[2];
                string color = "";
                if(element.Efficiency>=0 && element.Efficiency <= 50)
                {
                    color = "#e0301e";
                }
                else if(element.Efficiency>=51 && element.Efficiency <= 75)
                {
                    color = "#ffb600";
                }
                else
                {
                    color = "#175d2d";
                }
                objectArray[0] = element.OperatorIndex;
                objectArray[1] = element.Efficiency;
                seriesData.Add(new EfficiencyViewModel
                {
                    name = "Op",
                    showInLegend = false,
                    color = color,
                    data = new List<object[]> {objectArray }
                });
            }
            return Json(new
            {
                data = seriesData,
                statusCode = 200
            });
        }
    }
}
