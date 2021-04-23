using Entities;
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
    public class KPICalculationController  : Controller
    {
        private readonly  RepositoryContext _rmgDbContext;
        public KPICalculationController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        public JsonResult Get()
        {
            try
            {
                
                var linesData = _rmgDbContext.Line.ToList();
                var unitData = _rmgDbContext.Unit.ToList();
                var locationData = _rmgDbContext.Location.ToList();
                dynamic data = new { lineMasterData = linesData , unitMasterData = unitData, locationMasterData = locationData };
                return Json(new
                {
                    responseData = data,
                    statusCode = 200
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    responseData = ex.Message,
                    statusCode = 500
                });
            }

        }

        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            
            var kpiResults = new {
                CapaCityCalculation = CapacityCalculation(kpiViewModel),
                Efficiency = CalculateEfficiency(kpiViewModel),
                InlineWIPLevel = CalculateInlineWIP(kpiViewModel),
                MachineDownTime = CalculateMachineDowntime(kpiViewModel),
                ManMachineRatio = CalculateMMR(kpiViewModel),
                StatusCode = 200
            };
            return Json(kpiResults);
        }

        private JsonResult CapacityCalculation(KPIViewModel kpiViewModel)
        {
            double productionData = 0;
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                productionData = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    ProdData = grp.Sum(x => x.Production)
                }).Average(x => x.ProdData);
            }
            var timeStudyData = _rmgDbContext.TimeStudy.Where(x => x.OperationDescription == "Checking").Select(x => new TimeStudyData
            {
                PlannedProduction = (x.PlannedProduction * 8),
                OperationDesc = x.OperationDescription
            });
            var timeStudyCheckerData = timeStudyData.Select(x => x.PlannedProduction).Sum();
            var capacityUtilized = Math.Round((productionData / timeStudyCheckerData));
            #region color code calculation
            string colorCode = "";
            if (capacityUtilized >= 0 && capacityUtilized <= 50)
            {
                colorCode = "#e0301e";
            }
            else if (capacityUtilized >= 51 && capacityUtilized <= 75)
            {
                colorCode = "#ffb600";
            }
            else
            {
                colorCode = "#175d2d";
            }
            #endregion

            object[] objectArray = new object[2];
            objectArray[0] = startDate.Value.Date.ToString("dd/MM/yyyy");
            objectArray[1] = capacityUtilized;
            return Json(new
            {
                capacityUtilizationResponse = objectArray,
                colorCode = colorCode
            });
        }

        private JsonResult CalculateEfficiency(KPIViewModel kpiViewModel)
        {
            double efficiency = 0;
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            int countOperations = _rmgDbContext.TimeStudy.Count();
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                efficiency = Math.Round((_rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && x.Operation == "Checking" && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).Select(x => x.Production).Average() * 16.72 * 100) / (480 * countOperations),2);
            }
            #region Calculate color code
            string colorCode = "";
            if(efficiency >= 0 && efficiency<=50)
            {
                colorCode = "#e0301e";
            }
            else if (efficiency >= 51 && efficiency <=75)
            {
                colorCode = "#ffb600";
            }
            else
            {
                colorCode = "#175d2d";
            }
            #endregion
            object[] objectArray = new object[2];
            objectArray[0] = startDate.Value.Date.ToString("dd/MM/yyyy");
            objectArray[1] = efficiency;
            return Json(new
            {
                efficiencyResponse = objectArray,
                colorCode = colorCode
            });


        }

        private JsonResult CalculateMMR(KPIViewModel kpiViewModel)
        {
            double operatorNosData = 0;
            double helpersData = 0;
            double checkersData = 0;
            double machineryData = 0;
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count == 0 && kpiViewModel.Line.Count == 0 && kpiViewModel.Unit.Count == 0)
            {
                operatorNosData = _rmgDbContext.OperatorNos.Where(x => x.Date >= startDate && x.Date <= endDate).Average(x => x.Data);
                helpersData = _rmgDbContext.Helpers.Where(x => x.Date >= startDate && x.Date <= endDate).Average(x => x.Data);
                checkersData = _rmgDbContext.Checkers.Where(x => x.Date >= startDate && x.Date <= endDate).Average(x => x.Data);
                machineryData = _rmgDbContext.Machinery.Where(x => x.Date >= startDate && x.Date <= endDate).Average(x => x.Data);
            }
            else
            {
                if (kpiViewModel.Location.Count > 0)
                {
                    checkersData = _rmgDbContext.Checkers.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location)).Average(x => x.Data);
                    operatorNosData = _rmgDbContext.OperatorNos.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location)).Average(x => x.Data);
                    helpersData = _rmgDbContext.Helpers.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location)).Average(x => x.Data);
                    machineryData = _rmgDbContext.Machinery.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location)).Average(x => x.Data);
                
                }
                else
                {
                    if (kpiViewModel.Unit.Count > 0)
                    {
                        checkersData = _rmgDbContext.Checkers.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Unit.Contains(x.Unit)).Average(x => x.Data);
                        operatorNosData = _rmgDbContext.OperatorNos.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Unit.Contains(x.Unit)).Average(x => x.Data);
                        helpersData = _rmgDbContext.Helpers.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Unit.Contains(x.Unit)).Average(x => x.Data);
                        machineryData = _rmgDbContext.Machinery.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Unit.Contains(x.Unit)).Average(x => x.Data);

                    }
                    else
                    {
                        checkersData = _rmgDbContext.Checkers.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Line.Contains(x.Line)).Average(x => x.Data);
                        operatorNosData = _rmgDbContext.OperatorNos.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Line.Contains(x.Line)).Average(x => x.Data);
                        helpersData = _rmgDbContext.Helpers.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Line.Contains(x.Line)).Average(x => x.Data);
                        machineryData = _rmgDbContext.Machinery.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Line.Contains(x.Line)).Average(x => x.Data);

                    }
                }
            }
            
            var mmrLevel = Math.Round(((operatorNosData + helpersData + checkersData) / machineryData), 2);
            
            #region Calculate color code
            string mmrColorCode = "";
            if (mmrLevel >= 1.6)
            {
                mmrColorCode = "#e0301e";
            }
            else if (mmrLevel > 1 && mmrLevel <= 1.5)
            {
                mmrColorCode = "#ffb600";
            }
            else if (mmrLevel <= 1)
            {
                mmrColorCode = "#175d2d";
            }
            #endregion
            object[] mmrObjectArray = new object[2];
            mmrObjectArray[0] = startDate.Value.Date.ToString("dd/MM/yyyy");
            mmrObjectArray[1] = mmrLevel;
            return Json(new
            {
                mmrResponse = mmrObjectArray,
                mmrColorCode = mmrColorCode,
            });
        }

        private JsonResult CalculateMachineDowntime(KPIViewModel kpiViewModel)
        {
            double machineDowntime = 0;
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            List<MachineDowntimeViewModel> machineDowntimeHistoricalDataLists = new List<MachineDowntimeViewModel>();
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                machineDowntime = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new MachineDowntimeViewModel
                {
                    Date = grp.Key.Date,
                    MachineDownTime = Math.Round((grp.Sum(x => x.MachineDowntime) * 100) / (480 * grp.Count()), 2),
                }).Select(x => x.MachineDownTime).Average();
            }
            #region colorcode calculation
            string machineDowntimeColorCode = "";
            if (machineDowntime >= 0 && machineDowntime <= 5)
            {
                machineDowntimeColorCode = "#175d2d";
            }
            else if (machineDowntime >= 6 && machineDowntime <= 10)
            {
                machineDowntimeColorCode = "#ffb600";
            }
            else
            {
                machineDowntimeColorCode = "#e0301e";
            }
            object[] machineDowntimeObject = new object[2];
            machineDowntimeObject[0] = startDate.Value.Date.ToString("dd/MM/yyyy");
            machineDowntimeObject[1] = machineDowntime;
            #endregion
            return Json(new
            {
                machineDowntimeRespponse = machineDowntimeObject,
                machineDowntimeColorCode = machineDowntimeColorCode
            });
        }

        private JsonResult CalculateInlineWIP(KPIViewModel kpiViewModel)
        {
            double productionData = 0;
            double wipData = 0;
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            List<ProductionViewModel> productionsDataList = new List<ProductionViewModel>();
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                productionData = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    ProdData = grp.Where(x => x.Operation == "Checking").Sum(x => x.Production),
                    WIPData = grp.Sum(x => x.WIP)
                }).Select(x => x.ProdData).Average();

                wipData = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new ProductionViewModel
                {
                    Date = grp.Key.Date,
                    ProdData = grp.Where(x => x.Operation == "Checking").Sum(x => x.Production),
                    WIPData = grp.Sum(x => x.WIP)
                }).Select(x => x.WIPData).Average();
            }
            var inlineWIPLevel = Math.Round((wipData / productionData), 2);
            #region Calculate color code
            string wipColorCode = "";
            if (wipData > 2 || wipData < 0.8)
            {
                wipColorCode = "#e0301e";
            }
            else if (wipData >= 1.2 && wipData <= 2)
            {
                wipColorCode = "#ffb600";
            }
            else if (wipData >= 0.8 && wipData <= 1.2)
            {
                wipColorCode = "#175d2d";
            }
            #endregion
            object[] wipObjectArray = new object[2];
            wipObjectArray[0] = startDate.Value.Date.ToString("dd/MM/yyyy");
            wipObjectArray[1] = inlineWIPLevel;
            return Json(new
            {
                inlineWIPResponse = wipObjectArray,
                wipColorCode = wipColorCode
            });
        }

    }
}
