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
                StatusCode = 200
            };
            return Json(kpiResults);
        }
        private JsonResult CalculateDHUDefectRejection(KPIViewModel kpiViewModel)
        {
            //double avgProductionDataByYearGroup = 0;
            DateTime? date = Convert.ToDateTime(kpiViewModel.StartDate);
            var productionData = _rmgDbContext.Production.Where(x => x.Date == date).Average(x => x.Data);
            var rejectionData = _rmgDbContext.Rejection.Where(x => x.Date == date).Average(x => x.Data);
            var alterationData = _rmgDbContext.Rejection.Where(x => x.Date == date).Average(x => x.Data);
            var percentageDefection = Math.Round((((rejectionData + alterationData) / productionData)*100), 2);
            var percentageRejection = Math.Round(((rejectionData / productionData)*100), 2);
            //int scoreCardDHU = 0;
            //int scoreCardReject = 0;
            //int scoreCardDefect = 0;
            //double defectionWeightage = 0;
            //if (percentageDefection >= 0 && percentageDefection <= 5)
            //{
            //    defectionWeightage = 0.1 * 3;
            //    scoreCardDefect = 3;
            //}
            //else if (percentageDefection >= 6 && percentageDefection <= 20)
            //{
            //    defectionWeightage = 0.1 * 2;
            //    scoreCardDefect = 2;
            //}
            //else
            //{
            //    defectionWeightage = 0.1 * 1;
            //    scoreCardDefect = 1;
            //}
            //double rejectionWeitage = 0;
            //if (rejectionWeitage >= 0 && rejectionWeitage <= 1)
            //{
            //    defectionWeightage = 0.1 * 3;
            //    scoreCardReject = 3;
            //}
            //else if (rejectionWeitage >= 2 && rejectionWeitage <= 5)
            //{
            //    rejectionWeitage = 0.1 * 2;
            //    scoreCardReject = 2;
            //}
            //else
            //{
            //    rejectionWeitage = 0.1 * 1;
            //    scoreCardReject = 1;
            //}
            string dhuColor = "";
            string defectColor = "";
            string rejectColor = "";
            
            var percentageDHU = (Math.Round(_rmgDbContext.DHU.Where(x => x.Date == date).Average(x => x.Data)))-1;
            //double weightagetage = 0;
            //if (percentageDHU > 11)
            //{
            //    weightagetage = (0 * 0.05);
            //    scoreCardDHU = 0;
            //}
            //else if (percentageDHU <= 11 && percentageDHU > 10)
            //{
            //    weightagetage = 1 * 0.05;
            //    scoreCardDHU = 1;
            //}
            //else if (percentageDHU <= 10 && percentageDHU > 9)
            //{
            //    weightagetage = 2 * 0.05;
            //    scoreCardDHU = 2;
            //}
            //else if (percentageDHU <= 9 && percentageDHU > 8)
            //{
            //    weightagetage = 3 * 0.05;
            //    scoreCardDHU = 3;
            //}
            //else if (percentageDHU <= 8 && percentageDHU > 6)
            //{
            //    weightagetage = 4 * 0.05;
            //    scoreCardDHU = 4;
            //}
            //else
            //{
            //    weightagetage = 5 * 0.05;
            //    scoreCardDHU = 5;
            //}

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

            #region Color code calculation of reject
            if (percentageRejection >= 5)
            {
                rejectColor = "#e0301e";
            }
            else if (percentageRejection >= 2 && percentageRejection <= 5)
            {
                rejectColor = "#ffb600";
            }
            else
            {
                rejectColor = "#175d2d";
            }
            #endregion

            #region Adding calculated data into json response
            return Json(new
            {
                percentageDHU = new object[2] {date.Value.ToString("dd/MM/yyyy"), percentageDHU },
                dhuColor = dhuColor,
                percentageDefection = new object[2] { date.Value.ToString("dd/MM/yyyy"), percentageDefection },
                defectColor = defectColor,
                percentageRejection = new object[2] { date.Value.ToString("dd/MM/yyyy"), percentageRejection },
                rejectColor = rejectColor
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
            int countWorkerAttendance = 0;
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            if (kpiViewModel.Location.Count == 0 && kpiViewModel.Line.Count == 0 && kpiViewModel.Unit.Count == 0)
            {
                sumWorkerAttendance = _rmgDbContext.WorkerAttendance.Where(x => x.Date == startDate).Sum(x => x.Attendance);
                countWorkerAttendance = _rmgDbContext.WorkerAttendance.Where(x => x.Date == startDate).Count();

            }
            else
            {
                if (kpiViewModel.Location.Count > 0)
                {
                    sumWorkerAttendance = _rmgDbContext.WorkerAttendance.Where(x => x.Date == startDate && kpiViewModel.Location.Contains(x.Location)).Sum(x => x.Attendance);
                    countWorkerAttendance = _rmgDbContext.WorkerAttendance.Where(x => x.Date == startDate && kpiViewModel.Location.Contains(x.Location)).Count();
                
                }
                else
                {
                    if (kpiViewModel.Unit.Count > 0)
                    {
                        sumWorkerAttendance = _rmgDbContext.WorkerAttendance.Where(x => x.Date == startDate && kpiViewModel.Unit.Contains(x.Location)).Sum(x => x.Attendance);
                        countWorkerAttendance = _rmgDbContext.WorkerAttendance.Where(x => x.Date == startDate && kpiViewModel.Unit.Contains(x.Location)).Count();

                    }
                    else
                    {
                        sumWorkerAttendance = _rmgDbContext.WorkerAttendance.Where(x => x.Date == startDate && kpiViewModel.Line.Contains(x.Location)).Sum(x => x.Attendance);
                        countWorkerAttendance = _rmgDbContext.WorkerAttendance.Where(x => x.Date == startDate && kpiViewModel.Line.Contains(x.Location)).Count();

                    }
                }
            }

            var absentismData = Math.Round(((sumWorkerAttendance / countWorkerAttendance) * 100));
            string absentismColor = "";
            #region weightage of absentism
            if (absentismData <= 0 && absentismData >= 5)
            {
                absentismColor = "#e0301e";
                //scoreCardAbsentism = 1;
            }
            else if (absentismData >= 6 && absentismData <= 10)
            {
                absentismColor = "#ffb600";
                //scoreCardAbsentism = 2;
            }
            else if (absentismData >= 11)
            {
                absentismColor = "#175d2d";
                //scoreCardAbsentism = 3;
            }
            #endregion
            return Json(new
            {
                absentismData = new object[2] { startDate.Value.ToString("dd/MM/yyyy"), absentismData },
                absentismColor = absentismColor
            });
        }
    }
}
