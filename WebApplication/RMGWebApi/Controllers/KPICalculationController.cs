using Entities;
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
    public class KPICalculationController : Controller
    {
        private readonly  RepositoryContext _appEnsureDbContext;
        public KPICalculationController(RepositoryContext appEnsureDbContext)
        {
            _appEnsureDbContext = appEnsureDbContext;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            List<dynamic> kpiResults = new List<dynamic>();
            var efficiencyResult = CalculateEfficiency(kpiViewModel);
            var defectsPerHundredResult = CalculateDefectsPerHundredUnits(kpiViewModel);
            var defectsPercentage = CalculateDefectPercentage(kpiViewModel);
            var rejectionPercentage = CalculateRejectionPercentage(kpiViewModel);
            kpiResults.Add(efficiencyResult.data);
            kpiResults.Add(defectsPerHundredResult.data);
            kpiResults.Add(defectsPercentage.data);
            kpiResults.Add(rejectionPercentage.data);
            return Json(kpiResults);
        }

        private CustomResponse CalculateEfficiency(KPIViewModel kpiViewModel)
        {
            string backgroundColor = "";
            string prodDataColumnName = string.Join("", "ProductionL", kpiViewModel.lineNo);
            string operatorDataColumnName = string.Join("", "OperatorsL", kpiViewModel.lineNo);
            string helpersDataColumnName = string.Join("", "HelpersL", kpiViewModel.lineNo);
            string chekersDataColumnName = string.Join("", "CheckersL", kpiViewModel.lineNo);
            string workinghrsDataColumnName = string.Join("", "WorkingL", kpiViewModel.lineNo);

            CustomResponse response = new CustomResponse();
            double lineNo = Convert.ToDouble(kpiViewModel.lineNo);
            response.statusCode = 403;
            try
            {
                var linewiseProdDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(prodDataColumnName).GetValue(x)).ToList();
                var linewiseStyleDataList = _appEnsureDbContext.Style.Where(x => x.Line == lineNo).Select(x => x.GetType().GetProperty("SewingSAM").GetValue(x)).ToList();
                var linewiseOperatorDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(operatorDataColumnName).GetValue(x)).ToList();
                var linewiseHelpersDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(helpersDataColumnName).GetValue(x)).ToList();
                var linewiseChekersDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(chekersDataColumnName).GetValue(x)).ToList();
                var linewiseWorkingHrsDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(workinghrsDataColumnName).GetValue(x)).ToList();

                double sumOfProductionPerLinePerMonth = 0;
                double avgOfProductionPerLinePerMonth = 0;
                double sumOfStylePerLinePerMonth = 0;
                double avgOfStylePerLinePerMonth = 0;
                double sumOfOperatorPerLinePerMonth = 0;
                double avgOfOperatorPerLinePerMonth = 0;
                double sumOfHelpersPerLinePerMonth = 0;
                double avgOfHelpersPerLinePerMonth = 0;
                double sumOfCheckersPerLinePerMonth = 0;
                double avgOfCheckersPerLinePerMonth = 0;
                double sumOfWorkingHrsPerLinePerMonth = 0;
                double avgOfWorkingHrsPerLinePerMonth = 0;

                //int days = DateTime.DaysInMonth(efficiencyView.year, efficiencyView.month);
                foreach (var element in linewiseProdDataList)
                {
                    sumOfProductionPerLinePerMonth += Convert.ToDouble(element);
                }
                foreach (var element in linewiseStyleDataList)
                {
                    sumOfStylePerLinePerMonth += Convert.ToDouble(element);
                }
                foreach (var element in linewiseOperatorDataList)
                {
                    sumOfOperatorPerLinePerMonth += Convert.ToDouble(element);
                }
                foreach (var element in linewiseHelpersDataList)
                {
                    sumOfHelpersPerLinePerMonth += Convert.ToDouble(element);
                }
                foreach (var element in linewiseChekersDataList)
                {
                    sumOfCheckersPerLinePerMonth += Convert.ToDouble(element);
                }
                foreach (var element in linewiseWorkingHrsDataList)
                {
                    sumOfWorkingHrsPerLinePerMonth += Convert.ToDouble(element);
                }

                avgOfOperatorPerLinePerMonth = sumOfOperatorPerLinePerMonth / linewiseOperatorDataList.Count;
                avgOfStylePerLinePerMonth = sumOfStylePerLinePerMonth / linewiseStyleDataList.Count;
                avgOfProductionPerLinePerMonth = sumOfProductionPerLinePerMonth / linewiseProdDataList.Count;
                avgOfHelpersPerLinePerMonth = sumOfHelpersPerLinePerMonth / linewiseHelpersDataList.Count;
                avgOfCheckersPerLinePerMonth = sumOfCheckersPerLinePerMonth / linewiseOperatorDataList.Count;
                avgOfWorkingHrsPerLinePerMonth = sumOfWorkingHrsPerLinePerMonth / linewiseWorkingHrsDataList.Count;
                var efficiency = Math.Round((avgOfProductionPerLinePerMonth * avgOfStylePerLinePerMonth) / ((avgOfOperatorPerLinePerMonth + avgOfHelpersPerLinePerMonth + avgOfCheckersPerLinePerMonth) * avgOfWorkingHrsPerLinePerMonth) * 100);
                double scoreCard = 0;
                string status = "";
                //calculate weightage;
                if (efficiency == 0)
                {
                    scoreCard = 0;
                }
                else if (efficiency > 0 && efficiency <= 25)
                {
                    scoreCard = 1 * 0.15;
                }
                else if (efficiency > 25 && efficiency <= 50)
                {
                    scoreCard = 2 * 0.15;
                }
                else if (efficiency > 50 && efficiency <= 80)
                {
                    scoreCard = 3 * 0.15;
                }
                else if (efficiency > 80 && efficiency <= 90)
                {
                    scoreCard = 4 * 0.15;
                }
                else
                {
                    scoreCard = 5 * 0.15;
                }
                //calculate status
                if (scoreCard < 0.25)
                {
                    status = "Red";
                    backgroundColor = "#e0301e";
                }
                else if (scoreCard >= 0.25 && scoreCard <= 0.5)
                {
                    status = "Amber";
                    backgroundColor = "#ffb600";
                }
                else if (scoreCard >= 0.5 && scoreCard <= 0.75)
                {
                    status = "Green";
                    backgroundColor = "#175d2d";
                }
                response.statusCode = 200;
                response.message = "Data is retrieved successfully.";
                response.data = Json(new
                {
                    weightageScore = scoreCard,
                    status = status,
                    kpiname = "Efficiency",
                    backgroundColor = backgroundColor
                });
                return response;
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
                response.statusCode = 500;
                return response;
            }
        }

        private CustomResponse CalculateDefectsPerHundredUnits(KPIViewModel kpiViewModel)
        {
            string backgroundColor = "#e0301e";
            string defectsPerHundredUnitsDataColumnName = string.Join("", "DefectsPerHundredUnitL", kpiViewModel.lineNo);
            CustomResponse response = new CustomResponse();
            double lineNo = Convert.ToDouble(kpiViewModel.lineNo);
            response.statusCode = 403;
            try
            {
                var linewiseDefectsPerHundredUnitsDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(defectsPerHundredUnitsDataColumnName).GetValue(x)).ToList();
                double sumOfDefectsPerHundredUnitsPerLinePerMonth = 0;
                double avgOfDefectsPerHundredUnitsPerLinePerMonth = 0;
                foreach (var element in linewiseDefectsPerHundredUnitsDataList)
                {
                    sumOfDefectsPerHundredUnitsPerLinePerMonth += Convert.ToDouble(element);
                }
                avgOfDefectsPerHundredUnitsPerLinePerMonth = sumOfDefectsPerHundredUnitsPerLinePerMonth / linewiseDefectsPerHundredUnitsDataList.Count;
                double scoreCard = 0;
                string status = "";
                //calculate weightage;
                if (avgOfDefectsPerHundredUnitsPerLinePerMonth > 11)
                {
                    scoreCard = 0;
                }
                else if (avgOfDefectsPerHundredUnitsPerLinePerMonth <= 11 && avgOfDefectsPerHundredUnitsPerLinePerMonth > 10)
                {
                    scoreCard = 1 * 0.05;
                }
                else if (avgOfDefectsPerHundredUnitsPerLinePerMonth <= 10 && avgOfDefectsPerHundredUnitsPerLinePerMonth > 9)
                {
                    avgOfDefectsPerHundredUnitsPerLinePerMonth = 2 * 0.05;
                }
                else if (avgOfDefectsPerHundredUnitsPerLinePerMonth <= 9 && avgOfDefectsPerHundredUnitsPerLinePerMonth > 8)
                {
                    scoreCard = 3 * 0.05;
                }
                else if (avgOfDefectsPerHundredUnitsPerLinePerMonth <= 8 && avgOfDefectsPerHundredUnitsPerLinePerMonth > 6)
                {
                    scoreCard = 4 * 0.05;
                }
                else
                {
                    scoreCard = 5 * 0.05;
                }
                //calculate status
                if (scoreCard < 0.08)
                {
                    status = "Red";
                    backgroundColor = "#e0301e";
                }
                else if (scoreCard >= 0.08 && scoreCard <= 0.16)
                {
                    status = "Amber";
                    backgroundColor = "#ffb600";
                }
                else if (scoreCard >= 0.16 && scoreCard <= 0.25)
                {
                    status = "Green";
                    backgroundColor = "#175d2d";
                }
                response.statusCode = 200;
                response.message = "Data is retrieved successfully.";
                response.data = Json(new
                {
                    weightageScore = scoreCard,
                    status = status,
                    kpiname = "Defects Per Hundred Units (D.H.U.)",
                    backgroundColor = backgroundColor
                });
                return response;
            }
            catch(Exception ex)
            {
                response.message = ex.Message;
                response.statusCode = 500;
                return response;
            }
        }

        private CustomResponse CalculateDefectPercentage(KPIViewModel kpiViewModel)
        {
            string backgroundColor = "#175d2d";
            string alterationDataColumnName = string.Join("", "AlterationsL", kpiViewModel.lineNo);
            string prodDataColumnName = string.Join("", "ProductionL", kpiViewModel.lineNo);
            CustomResponse response = new CustomResponse();
            double lineNo = Convert.ToDouble(kpiViewModel.lineNo);
            response.statusCode = 403;
            try
            {
                var linewiseProdDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(prodDataColumnName).GetValue(x)).ToList();
                var linewiseAlterationsDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(alterationDataColumnName).GetValue(x)).ToList();
                double sumOfAlterationsPerLinePerMonth = 0;
                double avgOfAlterationsPerLinePerMonth = 0;
                double sumOfProductionPerLinePerMonth = 0;
                double avgOfProductionPerLinePerMonth = 0;
                foreach (var element in linewiseProdDataList)
                {
                    sumOfProductionPerLinePerMonth += Convert.ToDouble(element);
                }
                foreach (var element in linewiseAlterationsDataList)
                {
                    sumOfAlterationsPerLinePerMonth += Convert.ToDouble(element);
                }
                avgOfAlterationsPerLinePerMonth = sumOfAlterationsPerLinePerMonth / linewiseAlterationsDataList.Count;
                avgOfProductionPerLinePerMonth = sumOfProductionPerLinePerMonth / linewiseProdDataList.Count;
                var defectPercentage = Math.Round((avgOfAlterationsPerLinePerMonth / avgOfProductionPerLinePerMonth) * 100);
                double scoreCard = 0;
                string status = "";
                //calculate weightage;
                if (defectPercentage >= 0 && defectPercentage <= 5)
                {
                    scoreCard = 3 * 0.10;
                }
                else if (defectPercentage >= 6 && defectPercentage <= 20)
                {
                    scoreCard = 2 * 0.10;
                }
                else
                {
                    scoreCard = 1 * 0.10;
                }
                scoreCard = Math.Round(scoreCard, 3);
                //calculate status
                if (scoreCard < 0.1)
                {
                    status = "Red";
                    backgroundColor = "#e0301e";
                }
                else if (scoreCard >= 0.10 && scoreCard <= 0.20)
                {
                    status = "Amber";
                    backgroundColor = "#ffb600";
                }
                else if (scoreCard > 0.20 && scoreCard <= 0.30)
                {
                    status = "Green";
                    backgroundColor = "#175d2d";
                }
                response.statusCode = 200;
                response.message = "Data is retrieved successfully.";
                response.data = Json(new
                {
                    weightageScore = scoreCard,
                    status = status,
                    kpiname = "Defect %",
                    backgroundColor = backgroundColor
                });
                return response;
            }
            catch(Exception ex)
            {
                response.message = ex.Message;
                response.statusCode = 500;
                return response;
            }
        }

        private CustomResponse CalculateRejectionPercentage(KPIViewModel kpiViewModel)
        {
            string backgroundColor = "#e0301e";
            string rejectionDataColumnName = string.Join("", "RejectionL", kpiViewModel.lineNo);
            string prodDataColumnName = string.Join("", "ProductionL", kpiViewModel.lineNo);
            CustomResponse response = new CustomResponse();
            double lineNo = Convert.ToDouble(kpiViewModel.lineNo);
            response.statusCode = 403;
            try
            {
                var linewiseProdDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(prodDataColumnName).GetValue(x)).ToList();
                var linewiseRejectionsDataList = _appEnsureDbContext.ProdData.Select(x => x.GetType().GetProperty(rejectionDataColumnName).GetValue(x)).ToList();
                double sumOfRejectionsPerLinePerMonth = 0;
                double avgOfRejectionsPerLinePerMonth = 0;
                double sumOfProductionPerLinePerMonth = 0;
                double avgOfProductionPerLinePerMonth = 0;
                foreach (var element in linewiseProdDataList)
                {
                    sumOfProductionPerLinePerMonth += Convert.ToDouble(element);
                }
                foreach (var element in linewiseRejectionsDataList)
                {
                    sumOfRejectionsPerLinePerMonth += Convert.ToDouble(element);
                }
                avgOfRejectionsPerLinePerMonth = sumOfRejectionsPerLinePerMonth / linewiseRejectionsDataList.Count;
                avgOfProductionPerLinePerMonth = sumOfProductionPerLinePerMonth / linewiseProdDataList.Count;
                var defectPercentage = Math.Round((avgOfRejectionsPerLinePerMonth / avgOfProductionPerLinePerMonth) * 100);
                double scoreCard = 0;
                string status = "";
                //calculate weightage;
                if (defectPercentage >= 0 && defectPercentage <= 1)
                {
                    scoreCard = 3 * 0.10;
                }
                else if (defectPercentage > 1 && defectPercentage <= 5)
                {
                    scoreCard = 2 * 0.10;
                }
                else
                {
                    scoreCard = 1 * 0.10;
                }
                scoreCard = Math.Round(scoreCard, 3);
                //calculate status
                if (scoreCard < 0.1)
                {
                    status = "Red";
                    backgroundColor = "#e0301e";
                }
                else if (scoreCard >= 0.10 && scoreCard <= 0.20)
                {
                    status = "Amber";
                    backgroundColor = "#ffb600";
                }
                else if (scoreCard > 0.20 && scoreCard <= 0.30)
                {
                    status = "Green";
                    backgroundColor = "#175d2d";
                }
                response.statusCode = 200;
                response.message = "Data is retrieved successfully.";
                response.data = Json(new
                {
                    weightageScore = scoreCard,
                    status = status,
                    kpiname = "Rejection %",
                    backgroundColor = backgroundColor
                });
                return response;
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
                response.statusCode = 500;
                return response;
            }
        }
    }
}
