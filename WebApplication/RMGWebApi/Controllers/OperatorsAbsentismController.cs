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
    public class OperatorsAbsentismController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public OperatorsAbsentismController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            List<OperatorCapacityUtilization> operatorsAbsentismViewModels = new List<OperatorCapacityUtilization>();
            if (kpiViewModel.Location.Count == 0 && kpiViewModel.Line.Count == 0 && kpiViewModel.Unit.Count == 0)
            {
                operatorsAbsentismViewModels = _rmgDbContext.Attendance.Where(efficiencyworker => efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name}).Select(ope => new OperatorCapacityUtilization
                {
                    OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                    OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                    TotalOperators = 31,
                    AbsentOperators = ope.Where(x=> x.Name == ope.Key.Name && x.Attendence != "Yes").Count()
                }).ToList();

            }
            else
            {
                if (kpiViewModel.Location.Count > 0)
                {
                    operatorsAbsentismViewModels = _rmgDbContext.Attendance.Where(efficiencyworker => kpiViewModel.Location.Contains(efficiencyworker.Location)).Where(efficiencyworker => efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name}).Select(ope => new OperatorCapacityUtilization
                    {
                        OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                        OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                        TotalOperators = 31,
                        AbsentOperators = ope.Where(x => x.Name == ope.Key.Name && x.Attendence != "Yes").Count()
                    }).ToList();
                }
                else
                {
                    if (kpiViewModel.Unit.Count > 0)
                    {
                        operatorsAbsentismViewModels = _rmgDbContext.Attendance.Where(efficiencyworker => kpiViewModel.Unit.Contains(efficiencyworker.Unit) && efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name}).Select(ope => new OperatorCapacityUtilization
                        {
                            OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                            OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                            TotalOperators = 31,
                            AbsentOperators = ope.Where(x => x.Name == ope.Key.Name && x.Attendence != "Yes").Count()
                        }).ToList();
                    }
                    else
                    {
                        operatorsAbsentismViewModels = _rmgDbContext.Attendance.Where(efficiencyworker => kpiViewModel.Line.Contains(efficiencyworker.Line) && efficiencyworker.Date >= startDate && efficiencyworker.Date <= endDate).GroupBy(grp => new { grp.Name}).Select(ope => new OperatorCapacityUtilization
                        {
                            OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Name).FirstOrDefault(),
                            OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Key.Name).Select(x => x.Id).FirstOrDefault(),
                            TotalOperators = 31,
                            AbsentOperators = ope.Where(x => x.Name == ope.Key.Name && x.Attendence != "Yes").Count()
                        }).ToList();
                    }
                }
            }

            //var timeStudyData = _rmgDbContext.TimeStudy.Select(x => new TimeStudyData
            //{
            //    PlannedProduction = (x.PlannedProduction * 8),
            //    OperationDesc = x.OperationDescription
            //}).ToList();

            var resultDataSet = (from s in operatorsAbsentismViewModels
                                 //join cs in timeStudyData on s.OperationName equals cs.OperationDesc
                                 select new OperatorCapacityUtilization
                                 {
                                     OperationName = s.OperationName,
                                     OperatorIndex = s.OperatorIndex,
                                     CapapcityUtilization = Math.Round((s.AbsentOperators / s.TotalOperators) * 100)
                                 }).ToList();



            List<EfficiencyViewModel> seriesData = new List<EfficiencyViewModel>();
            List<object[]> lowAbsentism = new List<object[]>();
            List<object[]> moderateAbsentism = new List<object[]>();
            List<object[]> highAbsentism = new List<object[]>();
            foreach (var element in resultDataSet)
            {
                if (element.CapapcityUtilization <= 100)
                {
                    object[] objectArray = new object[2];
                    //string color = "";
                    if (element.CapapcityUtilization >= 11)
                    {
                        objectArray[0] = element.OperatorIndex;
                        objectArray[1] = element.CapapcityUtilization;
                        highAbsentism.Add(objectArray);
                        //color = "#e0301e";
                    }
                    else if (element.CapapcityUtilization >= 6 && element.CapapcityUtilization <= 10)
                    {
                        //color = "#ffb600";
                        objectArray[0] = element.OperatorIndex;
                        objectArray[1] = element.CapapcityUtilization;
                        moderateAbsentism.Add(objectArray);
                    }
                    else if (element.CapapcityUtilization >= 0 && element.CapapcityUtilization <= 5)
                    {
                        //color = "#175d2d";
                        objectArray[0] = element.OperatorIndex;
                        objectArray[1] = element.CapapcityUtilization;
                        lowAbsentism.Add(objectArray);
                    }
                }

            }
            seriesData.Add(new EfficiencyViewModel
            {
                name = "Low",
                showInLegend = false,
                color = "#e0301e",
                data = lowAbsentism
            });
            seriesData.Add(new EfficiencyViewModel
            {
                name = "Moderate",
                showInLegend = false,
                color = "#ffb600",
                data = moderateAbsentism
            });
            seriesData.Add(new EfficiencyViewModel
            {
                name = "High",
                showInLegend = false,
                color = "#175d2d",
                data = highAbsentism
            });
            return Json(new
            {
                data = seriesData,
                statusCode = 200
            });
        }
    }
    
}
