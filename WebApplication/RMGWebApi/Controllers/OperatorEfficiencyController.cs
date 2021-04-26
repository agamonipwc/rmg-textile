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
                operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp=> new { grp.Name}).Select(ope => new OperatorEfficiency
                {
                    OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                    OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                    Efficiency = Math.Round((ope.Average(x=> x.Efficiency))*100)
                }).ToList();
            }
            else
            {
                if(kpiViewModel.Location.Count > 0)
                {
                    operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Location.Contains(efficiencyworker.Location)).Where(efficiencyworker => efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name }).Select(ope => new OperatorEfficiency
                    {
                        OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                        OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                        Efficiency = Math.Round((ope.Average(x => x.Efficiency)) * 100)
                    }).ToList();
                }
                else
                {
                    if(kpiViewModel.Unit.Count > 0)
                    {
                        operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Unit.Contains(efficiencyworker.Unit) && efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name }).Select(ope => new OperatorEfficiency
                        {
                            OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                            OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                            Efficiency = Math.Round((ope.Average(x => x.Efficiency)) * 100)
                        }).ToList();
                    }
                    else
                    {
                        operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Line.Contains(efficiencyworker.Line) && efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name }).Select(ope => new OperatorEfficiency
                        {
                            OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                            OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                            Efficiency = Math.Round((ope.Average(x => x.Efficiency)) * 100)
                        }).ToList();
                    }
                }
            }
            //List<EfficiencyViewModel> seriesData = new List<EfficiencyViewModel>();
            List<EfficiencyViewModel_New> seriesData = new List<EfficiencyViewModel_New>();
            //List<object[]> lowEfficiency = new List<object[]>();
            //List<object[]> moderateEfficiency = new List<object[]>();
            //List<object[]> highEfficiency = new List<object[]>();

            List<ModifiedDataSet> lowEfficiency = new List<ModifiedDataSet>();
            List<ModifiedDataSet> moderateEfficiency = new List<ModifiedDataSet>();
            List<ModifiedDataSet> highEfficiency = new List<ModifiedDataSet>();

            foreach (var element in operatorViewModels)
            {
                if(element.Efficiency <= 100)
                {
                    ModifiedDataSet dataSet = new ModifiedDataSet();
                    if (element.Efficiency >= 0 && element.Efficiency <= 50)
                    {
                        dataSet.x = element.OperatorIndex;
                        dataSet.y = Convert.ToInt32(element.Efficiency);
                        dataSet.name = element.OperatorName;
                        lowEfficiency.Add(dataSet);
                    }
                    else if (element.Efficiency >= 51 && element.Efficiency <= 75)
                    {
                        dataSet.x = element.OperatorIndex;
                        dataSet.y = Convert.ToInt32(element.Efficiency);
                        dataSet.name = element.OperatorName;
                        moderateEfficiency.Add(dataSet);
                    }
                    else if (element.Efficiency >= 76 && element.Efficiency <= 100)
                    {
                        dataSet.x = element.OperatorIndex;
                        dataSet.y = Convert.ToInt32(element.Efficiency);
                        dataSet.name = element.OperatorName;
                        highEfficiency.Add(dataSet);
                    }


                    //object[] objectArray = new object[2];
                    //if (element.Efficiency >= 0 && element.Efficiency <= 50)
                    //{
                    //    objectArray[0] = element.OperatorIndex;
                    //    objectArray[1] = element.Efficiency;
                    //    lowEfficiency.Add(objectArray);
                    //}
                    //else if (element.Efficiency >= 51 && element.Efficiency <= 75)
                    //{
                    //    objectArray[0] = element.OperatorIndex;
                    //    objectArray[1] = element.Efficiency;
                    //    moderateEfficiency.Add(objectArray);
                    //}
                    //else if (element.Efficiency >= 76 && element.Efficiency <= 100)
                    //{
                    //    objectArray[0] = element.OperatorIndex;
                    //    objectArray[1] = element.Efficiency;
                    //    highEfficiency.Add(objectArray);
                    //}
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
