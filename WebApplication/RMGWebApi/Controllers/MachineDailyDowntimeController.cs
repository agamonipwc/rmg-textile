using Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MachineDailyDowntimeController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        List<string> colorCodes = new List<string>() { "#003dab", "#175c2c", "#c28a00", "#aa2417", "#deb8ff" };
        public MachineDailyDowntimeController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            List<MachineDowntimeViewModel> specialMachineDowntimeDataLists = new List<MachineDowntimeViewModel>();
            List<MachineDowntimeViewModel> specialMachineDowntimeDailyDataLists = new List<MachineDowntimeViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            List<string> dates = new List<string>();
            List<DHUTopFiveDefects> machineDowntimeGroupedDataList = new List<DHUTopFiveDefects>();
            List<string> specialMachine = new List<string>(){"FOA", "MNCS" };
            List<string> generalMachine = new List<string>() { "CTM", "SNUBT" ,"SNEC", "IRON TABLE"};
            List<MachineDowntimeViewModel> lineUnitSpecialMachineDowntimeDataLists = new List<MachineDowntimeViewModel>();
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                if(kpiViewModel.MachineCategory == "Special")
                {
                    specialMachineDowntimeDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && specialMachine.Contains(x.Machine) && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Machine, x.Line, x.Unit, x.OperationIndex }).Select(grp => new MachineDowntimeViewModel
                    {
                        Line = grp.Key.Line,
                        Unit = grp.Key.Unit,
                        MachineName = string.Join("_", grp.Key.Machine, string.Join("", "U", grp.Key.Unit), string.Join("", "L", grp.Key.Line), grp.Key.OperationIndex),
                        MachineDownTime = grp.Sum(x => x.MachineDowntime),
                        WorkingMins = grp.Average(x => x.WorkingMins),
                        TotalMachineCount = grp.Count(),
                    }).ToList();

                    specialMachineDowntimeDailyDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && specialMachine.Contains(x.Machine) && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date, x.Machine, x.Line, x.Unit, x.OperationIndex }).Select(grp => new MachineDowntimeViewModel
                    {
                        Date = grp.Key.Date,
                        Line = grp.Key.Line,
                        Unit = grp.Key.Unit,
                        MachineName = string.Join("_", grp.Key.Machine, string.Join("", "U", grp.Key.Unit), string.Join("", "L", grp.Key.Line), grp.Key.OperationIndex),
                        MachineDownTime = grp.Where(x => x.Machine == "FOA" || x.Machine == "MNCS").Sum(x => x.MachineDowntime),
                        WorkingMins = grp.Average(x => x.WorkingMins),
                        TotalMachineCount = grp.Where(x => x.Machine == "FOA" || x.Machine == "MNCS").Count(),
                    }).ToList();
                }
                else
                {
                    specialMachineDowntimeDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && generalMachine.Contains(x.Machine) && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Machine, x.Line, x.Unit, x.OperationIndex }).Select(grp => new MachineDowntimeViewModel
                    {
                        Line = grp.Key.Line,
                        Unit = grp.Key.Unit,
                        MachineName = string.Join("_", grp.Key.Machine, string.Join("", "U", grp.Key.Unit), string.Join("", "L", grp.Key.Line), grp.Key.OperationIndex),
                        MachineDownTime = grp.Sum(x => x.MachineDowntime),
                        WorkingMins = grp.Average(x => x.WorkingMins),
                        TotalMachineCount = grp.Count(),
                    }).ToList();

                    specialMachineDowntimeDailyDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && generalMachine.Contains(x.Machine) && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date, x.Machine, x.Line, x.Unit, x.OperationIndex }).Select(grp => new MachineDowntimeViewModel
                    {
                        Date = grp.Key.Date,
                        Line = grp.Key.Line,
                        Unit = grp.Key.Unit,
                        MachineName = string.Join("_", grp.Key.Machine, string.Join("", "U", grp.Key.Unit), string.Join("", "L", grp.Key.Line), grp.Key.OperationIndex),
                        MachineDownTime = grp.Sum(x => x.MachineDowntime),
                        WorkingMins = grp.Average(x => x.WorkingMins),
                        TotalMachineCount = grp.Count(),
                    }).ToList();
                }
            }

            foreach (var element in specialMachineDowntimeDataLists)
            {
                lineUnitSpecialMachineDowntimeDataLists.Add(new MachineDowntimeViewModel
                {
                    Line = element.Line,
                    Unit = element.Unit,
                    MachineDownTime = Math.Round((element.MachineDownTime * 100) / (480 * element.TotalMachineCount), 2),
                    MachineName = element.MachineName
                });
            }

            List<MachineDowntimeViewModel> machineDowntimeTabularViewModels = new List<MachineDowntimeViewModel>();
            var machineCount = Convert.ToInt32(kpiViewModel.MachineCount);

            var topFiveMachineDowntimeList = lineUnitSpecialMachineDowntimeDataLists.OrderByDescending(x => x.MachineDownTime).Take(machineCount).ToList();

            var groupedMachineDowntimeLists = specialMachineDowntimeDataLists.GroupBy(u => u.MachineName).Select(grp => grp.ToList()).ToList();
            List<DateTime> dailyDates = new List<DateTime>();
            List<string> individualMachineName = new List<string>();
            for (DateTime date = startDate.Value; date <= endDate.Value; date = date.AddDays(1))
            {
                dailyDates.Add(date);
                var dateString = date.ToString("MMM dd, yy");
                dates.Add(dateString);
            }

            List<DHUTopFiveDefects> machineDowntimeResultSet = new List<DHUTopFiveDefects>();
            List<double> allMachineDowntimeValues = new List<double>();
            for(int outerIndex = 0; outerIndex< topFiveMachineDowntimeList.Count; outerIndex++)
            {
                individualMachineName.Add(topFiveMachineDowntimeList[outerIndex].MachineName);
                List<double> calculatedMachineDowntimeList = new List<double>();
                string machineName = topFiveMachineDowntimeList[outerIndex].MachineName;
                string color = "";
                if (outerIndex == 0)
                {
                    color = "#175d2d";
                }
                if (outerIndex == 1)
                {
                    color = "#ffb600";
                }
                if (outerIndex == 2)
                {
                    color = "#e0301e";
                }
                if (outerIndex == 3)
                {
                    color = "#933401";
                }
                if (outerIndex == 4)
                {
                    color = "#ae6800";
                }
                double countDaysBreakage = 0;
                for (int innerIndex = 0; innerIndex < dailyDates.Count; innerIndex++)
                {
                    double avgMachineDowntime = 0;
                    var existingMachinesList = specialMachineDowntimeDailyDataLists.Where(x => x.MachineName == topFiveMachineDowntimeList[outerIndex].MachineName && x.Date == dailyDates[innerIndex]).Select(x => x.MachineDownTime).ToList();
                    if(existingMachinesList.Count > 0)
                    {
                        avgMachineDowntime = Math.Round((existingMachinesList.Average()*100) / (480* existingMachinesList.Count()),2);
                        if (avgMachineDowntime >= 5)
                        {
                            countDaysBreakage++;
                        }
                        allMachineDowntimeValues.Add(avgMachineDowntime);
                    }
                    calculatedMachineDowntimeList.Add(avgMachineDowntime);
                }
                machineDowntimeTabularViewModels.Add(new MachineDowntimeViewModel
                {
                    MachineName = machineName,
                    LineName = _rmgDbContext.Line.Where(x=> x.Id == topFiveMachineDowntimeList[outerIndex].Line).Select(x=> x.Name).FirstOrDefault(),
                    UnitName = _rmgDbContext.Unit.Where(x => x.Id == topFiveMachineDowntimeList[outerIndex].Unit).Select(x => x.Name).FirstOrDefault(),
                    MachineDownTime = Math.Round(calculatedMachineDowntimeList.Average()),
                    WorkingMins = countDaysBreakage,
                    TotalMachineCount = dailyDates.Count()
                });
                machineDowntimeResultSet.Add(new DHUTopFiveDefects
                {
                    data = calculatedMachineDowntimeList,
                    color = color,
                    name = machineName
                });
            }

            #region OldCode part
            //List<DHUTopFiveDefects> groupedMachineDowntimeViewModels = new List<DHUTopFiveDefects>();
            //List<DHUTopFiveDefects> curveFitMachineDowntimeViewModels = new List<DHUTopFiveDefects>();
            //for (int index = 0; index < groupedMachineDowntimeLists.Count; index++)
            //{
            //    string machineName = "";
            //    string curveFitMachineName = "";
            //    List<double> calculatedMachineDowntimeList = new List<double>();
            //    List<double> curveFitMachineDowntimeList = new List<double>();
            //    for (int innerIndex = 0; innerIndex < groupedMachineDowntimeLists[index].Count; innerIndex++)
            //    {
            //        if (innerIndex == 0)
            //        {
            //            machineName = groupedMachineDowntimeLists[index][0].MachineName;
            //        }
            //        double machineDownTimeValue = Math.Round((groupedMachineDowntimeLists[index][innerIndex].MachineDownTime * 100) / ( 480 * groupedMachineDowntimeLists[index][innerIndex].TotalMachineCount));
            //        calculatedMachineDowntimeList.Add(machineDownTimeValue);
            //        if(machineDownTimeValue >= 5 && machineDownTimeValue <= 20)
            //        {
            //            var dateString = "";
            //            dateString = groupedMachineDowntimeLists[index][innerIndex].Date.ToString("dd-MMM-yyyy");
            //            dates.Add(dateString);
            //            curveFitMachineName = groupedMachineDowntimeLists[index][innerIndex].MachineName;
            //            curveFitMachineDowntimeList.Add(machineDownTimeValue);
            //        }
            //    }
            //    groupedMachineDowntimeViewModels.Add(new DHUTopFiveDefects
            //    {
            //        name = machineName,
            //        data = calculatedMachineDowntimeList,
            //        color = colorCodes[index]
            //    });
            //    int zeroValueCount = curveFitMachineDowntimeList.Where(x => x == 0).Count();
            //    if (dates.Count != zeroValueCount && curveFitMachineName!="")
            //    {
            //        curveFitMachineDowntimeViewModels.Add(new DHUTopFiveDefects
            //        {
            //            name = curveFitMachineName,
            //            data = curveFitMachineDowntimeList,
            //            color = colorCodes[index]
            //        });
            //    }

            //}
            #endregion

            var maxValue = allMachineDowntimeValues.Max();

            return Json(new {
                data = machineDowntimeResultSet,
                categories = dates.Distinct().ToList(),
                maxValue = maxValue,
                machineDowntimeTabularViewModels = machineDowntimeTabularViewModels
                //curveFitMachineDowntimeData = curveFitMachineDowntimeViewModels,
                //categories = dates.Distinct().ToList(),
                //totalCountDays = (endDate-startDate).Value.TotalDays + 1
            });
        }
    }
}
