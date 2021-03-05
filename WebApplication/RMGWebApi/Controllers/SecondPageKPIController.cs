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
        DateTime? date = Convert.ToDateTime("2021-01-31 00:00:00.000");
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
                AbsentismMultiskill = CalculateAbsentismMultiskill(kpiViewModel),
                StatusCode = 200
            };
            return Json(kpiResults);
        }
        private JsonResult CalculateDHUDefectRejection(KPIViewModel kpiViewModel)
        {
            //double avgProductionDataByYearGroup = 0;
            var productionData = _rmgDbContext.Production.Where(x => x.Date == date).Average(x => x.Data);
            var rejectionData = _rmgDbContext.Rejection.Where(x => x.Date == date).Average(x => x.Data);
            var alterationData = _rmgDbContext.Rejection.Where(x => x.Date == date).Average(x => x.Data);
            var percentageDefection = Math.Round(((rejectionData + alterationData) / productionData), 2);
            var percentageRejection = Math.Round((rejectionData / productionData), 2);


            double defectionWeightage = 0;
            if (percentageDefection >= 0 && percentageDefection <= 5)
            {
                defectionWeightage = 0.1 * 3;
            }
            else if (percentageDefection >= 6 && percentageDefection <= 20)
            {
                defectionWeightage = 0.1 * 2;
            }
            else
            {
                defectionWeightage = 0.1 * 1;
            }
            double rejectionWeitage = 0;
            if (rejectionWeitage >= 0 && percentageDefection <= 1)
            {
                defectionWeightage = 0.1 * 3;
            }
            else if (percentageDefection >= 2 && percentageDefection <= 5)
            {
                defectionWeightage = 0.1 * 2;
            }
            else
            {
                defectionWeightage = 0.1 * 1;
            }
            string dhuColor = "";
            string dhuTextColor = "";
            string defectColor = "";
            string defectTextColor = "";
            string rejectColor = "";
            string rejectTextColor = "";
            var percentageDHU = _rmgDbContext.DHU.Where(x => x.Date == date).Average(x => x.Data);
            double weightagetage = 0;
            if (percentageDHU > 11)
            {
                weightagetage = (0 * 0.05);
            }
            else if (percentageDHU <= 11 && percentageDHU > 10)
            {
                weightagetage = 1 * 0.05;
            }
            else if (percentageDHU <= 10 && percentageDHU > 9)
            {
                weightagetage = 2 * 0.05;
            }
            else if (percentageDHU <= 9 && percentageDHU > 8)
            {
                weightagetage = 3 * 0.05;
            }
            else if (percentageDHU <= 8 && percentageDHU > 6)
            {
                weightagetage = 4 * 0.05;
            }
            else
            {
                weightagetage = 5 * 0.05;
            }

            if (weightagetage < 0.08)
            {
                dhuColor = "#175d2d";
            }
            else if (weightagetage >= 0.08 && weightagetage < 0.16)
            {
                dhuColor = "#ffb600";
            }
            else
            {
                dhuColor = "#e0301e";
            }
            #region Color code calculation of defect
            if (defectionWeightage < 0.1)
            {
                defectColor = "#175d2d";
                defectTextColor = "#ffffff";
            }
            else if (defectionWeightage > 0.1 && defectionWeightage <= 0.2)
            {
                defectColor = "#ffb600";
                defectTextColor = "#ffffff";
            }
            else
            {
                defectColor = "#e0301e";
                defectTextColor = "#000000";
            }
            #endregion

            #region Color code calculation of reject
            if (rejectionWeitage < 0.1)
            {
                rejectColor = "#175d2d";
                rejectTextColor = "#ffffff";
            }
            else if (defectionWeightage > 0.1 && defectionWeightage <= 0.2)
            {
                rejectColor = "#ffb600";
                rejectTextColor = "#ffffff";
            }
            else
            {
                rejectColor = "#e0301e";
                rejectTextColor = "#000000";
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

        private JsonResult CalculateAbsentismMultiskill(KPIViewModel kPIViewModel)
        {
            var sumWorkerAttendance = _rmgDbContext.WorkerAttendance.Where(x => x.Date == date).Sum(x => x.Attendance);
            var countWorkerAttendance = _rmgDbContext.WorkerAttendance.Where(x => x.Date == date).Count();
            var absentismData = Math.Round(((sumWorkerAttendance / countWorkerAttendance)*100));
            var countMultiSkillYes = Convert.ToDouble(_rmgDbContext.OperatorSkill.Where(x => x.MultiskilledOperator == "Yes").Count());
            var countTotalOperators = _rmgDbContext.OperatorSkill.Count();
            double multiskillData = Math.Round(((countMultiSkillYes / countTotalOperators)*100), 2);
            double absetismWeitage = 0;
            string absentismColor = "";
            #region weightage of absentism
            if(absentismData >=0 && absentismData <= 5)
            {
                absetismWeitage = 0.07 * 3;
            }
            else if (absentismData >= 6 && absentismData <= 10)
            {
                absetismWeitage = 0.07 * 2;
            }
            else if (absentismData >= 11)
            {
                absetismWeitage = 0.07 * 1;
            }
            if(absetismWeitage < 0.07)
            {
                absentismColor = "#e0301e";
            }
            else if (absetismWeitage >= 0.07 && absetismWeitage <0.14)
            {
                absentismColor = "#ffb600";
            }
            else if (absetismWeitage >= 0.14 && absetismWeitage <= 0.21)
            {
                absentismColor = "#175d2d";
            }
            #endregion
            double multiskillWeitage = 0;
            string multiskillColor = "";
            #region multiskill calculation
            if (multiskillData >= 51)
            {
                multiskillWeitage = 0.08 * 3;
            }
            else if (multiskillData >= 31 && multiskillData <= 50)
            {
                multiskillWeitage = 0.08 * 2;
            }
            else if (multiskillData >= 20 && multiskillData <= 30)
            {
                multiskillWeitage = 0.08 * 1;
            }
            if (multiskillWeitage < 0.08)
            {
                multiskillColor = "#e0301e";
            }
            else if (absetismWeitage >= 0.08 && absetismWeitage < 0.16)
            {
                multiskillColor = "#ffb600";
            }
            else if (absetismWeitage >= 0.16 && absetismWeitage <= 0.24)
            {
                multiskillColor = "#175d2d";
            }
            #endregion
            return Json(new {
                multiskillColor = multiskillColor,
                multiskillData = new object[2] { date.Value.ToString("dd/MM/yyyy"), multiskillData },
                absentismData = new object[2] { date.Value.ToString("dd/MM/yyyy"), absentismData },
                absentismColor = absentismColor
            });
        }
    }
}
