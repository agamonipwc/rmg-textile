using Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RMGWebApi.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecondPageKPIController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        CustomResponse customResponse = new CustomResponse();
        //DateTime? date = Convert.ToDateTime("2021-01-31 00:00:00.000");
        public SecondPageKPIController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {

            var kpiResults = new
            {
                DefectRejectDHUPercentage = CalculateDHUDefectRejection(kpiViewModel),
                Multiskill = CalculateMultiskill(kpiViewModel),
                Absentism = CalculateAbsentism(kpiViewModel),
                Rejection = CalculateRejection(kpiViewModel),
                StatusCode = 200
            };
            return Json(kpiResults);
        }
        private JsonResult CalculateDHUDefectRejection(KPIViewModel kpiViewModel)
        {
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            double productionData = 0;
            double alterationData = 0;
            double defectCountData = 0;
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                productionData = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    ProdData = grp.Sum(x => x.Production),
                    AlterationData = grp.Sum(x => x.Alterations)
                }).Select(x => x.ProdData).Average();

                alterationData = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    ProdData = grp.Sum(x => x.Production),
                    AlterationData = grp.Sum(x => x.Alterations)
                }).Select(x => x.AlterationData).Average();

                defectCountData = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    ProdData = grp.Sum(x => x.Production),
                    SumDefectCount = grp.Sum(x => x.DefectCount)
                }).Select(x => x.SumDefectCount).Average();
            }


            //var productionData = _rmgDbContext.Production.Where(x => x.Date == startDate).Average(x => x.Data);
            //var rejectionData = _rmgDbContext.Rejection.Where(x => x.Date == startDate).Average(x => x.Data);
            //var alterationData = _rmgDbContext.Rejection.Where(x => x.Date == startDate).Average(x => x.Data);
            var percentageDefection = Math.Round(((alterationData / productionData)*100), 2);
            string dhuColor = "";
            string defectColor = "";
            
            var percentageDHU = Math.Round(((defectCountData / productionData) * 100), 2);
            if (percentageDHU >= 9 && percentageDHU <= 13)
            {
                dhuColor = "#e0301e";
            }
            else if (percentageDHU >= 6 && percentageDHU < 9)
            {
                dhuColor = "#ffb600";
            }
            else
            {
                dhuColor = "#175d2d";
            }
            #region Color code calculation of defect
            if (percentageDefection >= 20)
            {
                defectColor = "#175d2d";
            }
            else if (percentageDefection >= 10 && percentageDefection <= 20)
            {
                defectColor = "#ffb600";
            }
            else
            {
                defectColor = "#e0301e";
            }
            #endregion

            #region Adding calculated data into json response
            return Json(new
            {
                percentageDHU = new object[2] {startDate.Value.ToString("dd/MM/yyyy"), percentageDHU },
                dhuColor = dhuColor,
                percentageDefection = new object[2] { startDate.Value.ToString("dd/MM/yyyy"), percentageDefection },
                defectColor = defectColor,
                //percentageRejection = new object[2] { date.Value.ToString("dd/MM/yyyy"), percentageRejection },
                //rejectColor = rejectColor
            });
            #endregion
        }

        private JsonResult CalculateMultiskill(KPIViewModel kpiViewModel)
        {
            double countMultiSkillYes = 0;
            int countTotalOperators = 0;
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            if (kpiViewModel.Location.Count == 0 && kpiViewModel.Line.Count == 0 && kpiViewModel.Unit.Count == 0)
            {
                countMultiSkillYes = Convert.ToDouble(_rmgDbContext.OperatorSkill.Where(x => x.MultiskilledOperator == "Yes").Count());
                countTotalOperators = _rmgDbContext.OperatorSkill.Count();

            }
            else
            {
                if (kpiViewModel.Location.Count > 0)
                {
                    countMultiSkillYes = Convert.ToDouble(_rmgDbContext.OperatorSkill.Where(x => x.MultiskilledOperator == "Yes").Count());
                    countTotalOperators = _rmgDbContext.OperatorSkill.Count();
                }
                else
                {
                    if (kpiViewModel.Unit.Count > 0)
                    {
                        countMultiSkillYes = Convert.ToDouble(_rmgDbContext.OperatorSkill.Where(x => x.MultiskilledOperator == "Yes").Count());
                        countTotalOperators = _rmgDbContext.OperatorSkill.Count();
                    }
                    else
                    {
                        countMultiSkillYes = Convert.ToDouble(_rmgDbContext.OperatorSkill.Where(x => x.MultiskilledOperator == "Yes" && kpiViewModel.Line.Contains(x.Line)).Count());
                        countTotalOperators = _rmgDbContext.OperatorSkill.Count();
                    }
                }
            }
            
            double multiskillData = Math.Round(((countMultiSkillYes / countTotalOperators)*100), 2);
            //double multiskillWeitage = 0;
            string multiskillColor = "";
            #region multiskill calculation
            //int scoreCardMultiSkill = 0;
            //if (multiskillData >= 51)
            //{
            //    multiskillWeitage = 0.08 * 3;
            //    scoreCardMultiSkill = 3;
            //}
            //else if (multiskillData >= 31 && multiskillData <= 50)
            //{
            //    multiskillWeitage = 0.08 * 2;
            //    scoreCardMultiSkill = 2;
            //}
            //else if (multiskillData >= 20 && multiskillData <= 30)
            //{
            //    multiskillWeitage = 0.08 * 1;
            //    scoreCardMultiSkill = 1;
            //}
            if (multiskillData < 30)
            {
                multiskillColor = "#e0301e";
            }
            else if (multiskillData >= 31 && multiskillData <= 50)
            {
                multiskillColor = "#ffb600";
            }
            else
            {
                multiskillColor = "#175d2d";
            }
            #endregion
            return Json(new {
                multiskillColor = multiskillColor,
                multiskillData = new object[2] { startDate.Value.ToString("dd/MM/yyyy"), multiskillData },
            });
        }

        private JsonResult CalculateAbsentism(KPIViewModel kpiViewModel)
        {
            double sumWorkerAttendance = 0;
            double countWorkerAttendance = 0;
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                sumWorkerAttendance = _rmgDbContext.Attendance.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    TotalOperatorsCount = grp.Where(x => x.Name != "").Count(),
                    PresentOperatorsCount = grp.Where(x => x.Attendence != "Yes").Count(),
                }).Select(x => x.PresentOperatorsCount).Sum();

                countWorkerAttendance = _rmgDbContext.Attendance.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    TotalOperatorsCount = grp.Where(x => x.Name != "").Count(),
                    PresentOperatorsCount = grp.Where(x => x.Attendence != "Yes").Count(),
                }).Select(x => x.TotalOperatorsCount).Sum();
            }

            var absentismData = Math.Round(((sumWorkerAttendance / countWorkerAttendance) * 100));
            string absentismColor = "";
            #region weightage of absentism
            if (absentismData <= 0 && absentismData >= 5)
            {
                absentismColor = "#175d2d";
            }
            else if (absentismData >= 6 && absentismData <= 10)
            {
                absentismColor = "#ffb600";
            }
            else if (absentismData >= 11)
            {
                absentismColor = "#e0301e";
            }
            #endregion
            return Json(new
            {
                absentismData = new object[2] { startDate.Value.ToString("dd/MM/yyyy"), absentismData },
                absentismColor = absentismColor
            });
        }

        private JsonResult CalculateRejection(KPIViewModel kpiViewModel)
        {
            double productionData = 0;
            double rejectionData = 0;
            List<ProductionViewModel> rejectionsDataList = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                productionData = _rmgDbContext.RejectionStyle.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    SumProduction = grp.Sum(x => x.Production),
                    SumRejection = grp.Sum(x => x.Rejection)
                }).Select(x => x.SumProduction).Average();

                rejectionData = _rmgDbContext.RejectionStyle.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    SumProduction = grp.Sum(x => x.Production),
                    SumRejection = grp.Sum(x => x.Rejection)
                }).Select(x => x.SumRejection).Average();
            }
            var rejectionPercentage = Math.Round((rejectionData * 100) / productionData);
            string rejectionColor = "";
            #region weightage of absentism
            if (rejectionData <=2)
            {
                rejectionColor = "#175d2d";
            }
            else if (rejectionData > 2 && rejectionData <= 5)
            {
                rejectionColor = "#ffb600";
            }
            else if (rejectionData >5)
            {
                rejectionColor = "#e0301e";
            }
            #endregion
            return Json(new
            {
                rejectionData = new object[2] { startDate.Value.ToString("dd/MM/yyyy"), rejectionPercentage },
                rejectionColor = rejectionColor
            });
        }
    }
}
