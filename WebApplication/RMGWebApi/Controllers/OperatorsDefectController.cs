using Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RMGWebApi.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperatorsDefectController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public OperatorsDefectController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            List<OperatorDefect> operatorViewModels = new List<OperatorDefect>();
            if (kpiViewModel.Location.Count == 0 && kpiViewModel.Line.Count == 0 && kpiViewModel.Unit.Count == 0)
            {
                operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name }).Select(ope => new OperatorDefect
                {
                    OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                    OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                    Defect = Math.Round((ope.Average(x => x.Alterations)/ ope.Average(x=> x.Production)) * 100)
                }).ToList();
            }
            else
            {
                if (kpiViewModel.Location.Count > 0)
                {
                    operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Location.Contains(efficiencyworker.Location)).Where(efficiencyworker => efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name }).Select(ope => new OperatorDefect
                    {
                        OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                        OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                        Defect = Math.Round((ope.Average(x => x.Alterations) / ope.Average(x => x.Production)) * 100)
                    }).ToList();
                }
                else
                {
                    if (kpiViewModel.Unit.Count > 0)
                    {
                        operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Unit.Contains(efficiencyworker.Unit) && efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name }).Select(ope => new OperatorDefect
                        {
                            OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                            OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                            Defect = Math.Round((ope.Average(x => x.Alterations) / ope.Average(x => x.Production)) * 100)
                        }).ToList();
                    }
                    else
                    {
                        operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Line.Contains(efficiencyworker.Line) && efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name }).Select(ope => new OperatorDefect
                        {
                            OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                            OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                            Defect = Math.Round((ope.Average(x => x.Alterations) / ope.Average(x => x.Production)) * 100)
                        }).ToList();
                    }
                }
            }
            //List<EfficiencyViewModel> seriesData = new List<EfficiencyViewModel>();
            //List<object[]> lowEfficiency = new List<object[]>();
            //List<object[]> moderateEfficiency = new List<object[]>();
            //List<object[]> highEfficiency = new List<object[]>();
            List<EfficiencyViewModel_New> seriesData = new List<EfficiencyViewModel_New>();
            List<ModifiedDataSet> lowEfficiency = new List<ModifiedDataSet>();
            List<ModifiedDataSet> moderateEfficiency = new List<ModifiedDataSet>();
            List<ModifiedDataSet> highEfficiency = new List<ModifiedDataSet>();
            foreach (var element in operatorViewModels)
            {
                if (element.Defect <= 100)
                {
                    //object[] objectArray = new object[2];
                    //string color = "";
                    ModifiedDataSet dataSet = new ModifiedDataSet();
                    if (element.Defect > 20)
                    {
                        dataSet.x = element.OperatorIndex;
                        dataSet.y = Convert.ToInt32(element.Defect);
                        dataSet.name = element.OperatorName;
                        lowEfficiency.Add(dataSet);
                        //objectArray[0] = element.OperatorIndex;
                        //objectArray[1] = element.Defect;
                        //lowEfficiency.Add(objectArray);
                        //color = "#e0301e";
                    }
                    else if (element.Defect >= 10 && element.Defect <= 20)
                    {
                        dataSet.x = element.OperatorIndex;
                        dataSet.y = Convert.ToInt32(element.Defect);
                        dataSet.name = element.OperatorName;
                        moderateEfficiency.Add(dataSet);
                        //color = "#ffb600";
                        //objectArray[0] = element.OperatorIndex;
                        //objectArray[1] = element.Defect;
                        //moderateEfficiency.Add(objectArray);
                    }
                    else if (element.Defect >= 0 && element.Defect < 10)
                    {
                        dataSet.x = element.OperatorIndex;
                        dataSet.y = Convert.ToInt32(element.Defect);
                        dataSet.name = element.OperatorName;
                        highEfficiency.Add(dataSet);
                        //color = "#175d2d";
                        //objectArray[0] = element.OperatorIndex;
                        //objectArray[1] = element.Defect;
                        //highEfficiency.Add(objectArray);
                    }
                }

            }
            //seriesData.Add(new EfficiencyViewModel
            //{
            //    name = "Low",
            //    showInLegend = false,
            //    color = "#e0301e",
            //    data = lowEfficiency
            //});
            //seriesData.Add(new EfficiencyViewModel
            //{
            //    name = "Moderate",
            //    showInLegend = false,
            //    color = "#ffb600",
            //    data = moderateEfficiency
            //});
            //seriesData.Add(new EfficiencyViewModel
            //{
            //    name = "High",
            //    showInLegend = false,
            //    color = "#175d2d",
            //    data = highEfficiency
            //});
            seriesData.Add(new EfficiencyViewModel_New
            {
                name = "Low",
                showInLegend = false,
                color = "#e0301e",
                data = lowEfficiency
            });
            seriesData.Add(new EfficiencyViewModel_New
            {
                name = "Moderate",
                showInLegend = false,
                color = "#ffb600",
                data = moderateEfficiency
            });
            seriesData.Add(new EfficiencyViewModel_New
            {
                name = "High",
                showInLegend = false,
                color = "#175d2d",
                data = highEfficiency
            });

            return Json(new
            {
                data = seriesData,
                statusCode = 200
            });
        }
    }
}
