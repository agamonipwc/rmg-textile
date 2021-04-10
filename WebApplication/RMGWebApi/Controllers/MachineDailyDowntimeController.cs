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
            List<MachineDowntimeViewModel> machineDowntimeDataLists = new List<MachineDowntimeViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            List<string> dates = new List<string>();
            List<DHUTopFiveDefects> machineDowntimeGroupedDataList = new List<DHUTopFiveDefects>();
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                machineDowntimeDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line) && x.Machine == kpiViewModel.MachineName).GroupBy(x => new { x.Date, x.Machine, x.Line, x.Location, x.Unit }).Select(grp => new MachineDowntimeViewModel 
                {
                    Date = grp.Key.Date,
                    Line = grp.Key.Line,
                    Unit = grp.Key.Unit,
                    Location = grp.Key.Location,
                    MachineName = string.Join('_',grp.Key.Machine, grp.Key.Location, grp.Key.Unit, grp.Key.Line),
                    MachineDownTime = grp.Sum(x => x.MachineDowntime),
                    WorkingMins = grp.Average(x=> x.WorkingMins)
                }).ToList();
            }
            var groupedMachineDowntimeLists = machineDowntimeDataLists.GroupBy(u => u.MachineName).Select(grp => grp.ToList()).ToList();
            List<DateTime> dailyDates = new List<DateTime>();
            for (DateTime date = startDate.Value; date <= endDate.Value; date = date.AddDays(1))
            {
                dailyDates.Add(date);
                var dateString = date.ToString("dd-MMM-yyyy");
                dates.Add(dateString);
            }
            List<DHUTopFiveDefects> groupedMachineDowntimeViewModels = new List<DHUTopFiveDefects>();
            List<DHUTopFiveDefects> curveFitMachineDowntimeViewModels = new List<DHUTopFiveDefects>();
            for (int index = 0; index < groupedMachineDowntimeLists.Count; index++)
            {
                string machineName = "";
                string curveFitMachineName = "";
                List<double> calculatedMachineDowntimeList = new List<double>();
                List<double> curveFitMachineDowntimeList = new List<double>();
                for (int innerIndex = 0; innerIndex < groupedMachineDowntimeLists[index].Count; innerIndex++)
                {
                    if (innerIndex == 0)
                    {
                        machineName = groupedMachineDowntimeLists[index][0].MachineName;
                    }
                    double machineDownTimeValue = Math.Round((groupedMachineDowntimeLists[index][innerIndex].MachineDownTime * 100) / ( 480 * 1));
                    calculatedMachineDowntimeList.Add(machineDownTimeValue);
                    if(machineDownTimeValue >= 5)
                    {
                        curveFitMachineName = groupedMachineDowntimeLists[index][innerIndex].MachineName;
                        curveFitMachineDowntimeList.Add(machineDownTimeValue);
                    }
                    else
                    {
                        curveFitMachineDowntimeList.Add(0);
                    }
                    
                }
                groupedMachineDowntimeViewModels.Add(new DHUTopFiveDefects
                {
                    name = machineName,
                    data = calculatedMachineDowntimeList,
                    color = colorCodes[index]
                });
                int zeroValueCount = curveFitMachineDowntimeList.Where(x => x == 0).Count();
                if (dates.Count != zeroValueCount)
                {
                    curveFitMachineDowntimeViewModels.Add(new DHUTopFiveDefects
                    {
                        name = curveFitMachineName,
                        data = curveFitMachineDowntimeList,
                        color = colorCodes[index]
                    });
                }
                
            }
            return Json(new {
                data = groupedMachineDowntimeViewModels,
                curveFitMachineDowntimeData = curveFitMachineDowntimeViewModels,
                categories = dates
            });
        }
    }
}
