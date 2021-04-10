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
    public class MachineDowntimeHistoricalController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        List<string> colorCodes = new List<string>() { "#003dab", "#175c2c", "#c28a00", "#aa2417", "#deb8ff" };
        public MachineDowntimeHistoricalController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            List<MachineDowntimeViewModel> machineDowntimeHistoricalDataLists = new List<MachineDowntimeViewModel>();
            List<MachineDowntimeViewModel> feedingDowntimeHistoricalDataLists = new List<MachineDowntimeViewModel>();
            List<DHUTopFiveDefects> groupedMachineDowntimeViewModels = new List<DHUTopFiveDefects>();
            List<string> categories = new List<string>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                machineDowntimeHistoricalDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new MachineDowntimeViewModel
                {
                    MachineDownTime = Math.Round((grp.Sum(x => x.MachineDowntime) * 100) / (480 * grp.Count()), 2),
                    Date = grp.Key.Date
                }).ToList();
                feedingDowntimeHistoricalDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Date }).Select(grp => new MachineDowntimeViewModel
                {
                    FeedingDownTime = Math.Round((grp.Sum(x => x.FeedingDowntime) * 100) / (480 * grp.Count()), 2),
                    Date = grp.Key.Date
                }).ToList();
            }
            for (DateTime date = startDate.Value; date <= endDate.Value; date = date.AddDays(1))
            {
                var dateString = date.ToString("dd-MMM-yyyy");
                categories.Add(dateString);
            }
            List<double> machineDowntimedata = new List<double>();
            List<double> feedingDowntimedata = new List<double>();
            List<double> overallDowntimedata = new List<double>();
            for (int index = 0; index< machineDowntimeHistoricalDataLists.Count; index++)
            {
                var overallDowntime = Math.Round((machineDowntimeHistoricalDataLists[index].MachineDownTime + feedingDowntimeHistoricalDataLists[index].FeedingDownTime) / 2, 2);
                overallDowntimedata.Add(overallDowntime);
                machineDowntimedata.Add(Math.Round(machineDowntimeHistoricalDataLists[index].MachineDownTime,2));
                feedingDowntimedata.Add(Math.Round(feedingDowntimeHistoricalDataLists[index].FeedingDownTime, 2));
            }
            groupedMachineDowntimeViewModels.Add(new DHUTopFiveDefects
            {
                name = "Overall Downtime",
                data = overallDowntimedata,
                color = colorCodes[0]
            });
            groupedMachineDowntimeViewModels.Add(new DHUTopFiveDefects
            {
                name = "Machine Downtime",
                data = machineDowntimedata,
                color = colorCodes[1]
            });
            groupedMachineDowntimeViewModels.Add(new DHUTopFiveDefects
            {
                name = "Feeding Downtime",
                data = feedingDowntimedata,
                color = colorCodes[2]
            });

            return Json(new {
                data = groupedMachineDowntimeViewModels,
                categories = categories
            });
        }
    }
}
