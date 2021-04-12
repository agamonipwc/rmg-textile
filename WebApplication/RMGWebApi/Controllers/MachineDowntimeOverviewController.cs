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
    public class MachineDowntimeOverviewController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public MachineDowntimeOverviewController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }

        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            List<MachineDowntimeViewModel> machineDowntimeDataLists = new List<MachineDowntimeViewModel>();
            List<MachineDowntimeViewModel> feedingDowntimeDataLists = new List<MachineDowntimeViewModel>();

            List<MachineDowntimeViewModel> lineUnitWiseDowntimeDataLists = new List<MachineDowntimeViewModel>();
            List<MachineDowntimeViewModel> lineUnitWiseFeedingDowntimeDataLists = new List<MachineDowntimeViewModel>();

            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                machineDowntimeDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Machine}).Select(grp => new MachineDowntimeViewModel 
                { 
                    MachineDownTime = Math.Round((grp.Sum(x=>x.MachineDowntime) * 100)/(480*grp.Count()),2),
                    MachineName = grp.Key.Machine,
                }).ToList();

                feedingDowntimeDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Machine}).Select(grp => new MachineDowntimeViewModel
                {
                    FeedingDownTime = Math.Round((grp.Sum(x => x.FeedingDowntime) * 100) / (480 *grp.Count()),2),
                    MachineName = grp.Key.Machine,
                }).ToList();

                lineUnitWiseDowntimeDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line, x.Unit }).Select(grp => new MachineDowntimeViewModel
                {
                    MachineDownTime = grp.Where(x => x.Machine != "Checking Table" && x.Machine != "TABLE").Sum(x=> x.MachineDowntime),
                    Line = grp.Key.Line,
                    Unit = grp.Key.Unit,
                    TotalMachineCount = grp.Where(x=> x.Machine != "Checking Table" && x.Machine != "TABLE").Count()
                }).ToList();

                lineUnitWiseFeedingDowntimeDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line, x.Unit }).Select(grp => new MachineDowntimeViewModel
                {
                    FeedingDownTime = grp.Where(x => x.Machine != "Checking Table" && x.Machine != "TABLE").Sum(x => x.FeedingDowntime),
                    Line = grp.Key.Line,
                    Unit = grp.Key.Unit,
                    TotalMachineCount = grp.Where(x => x.Machine != "Checking Table" && x.Machine != "TABLE").Count()
                }).ToList();
            }
            List<MachineDowntimeViewModel> filteredMachinesViewModel = new List<MachineDowntimeViewModel>();
            foreach(var element in machineDowntimeDataLists)
            {
                if(element.MachineName != "Checking Table" && element.MachineName != "TABLE")
                {
                    filteredMachinesViewModel.Add(new MachineDowntimeViewModel {
                        MachineDownTime = element.MachineDownTime,
                        MachineName = element.MachineName,
                        ColorCode = GetDowntimeColorCode(element.MachineDownTime)
                    });
                }
            }
            var topFiveMachineDowntimeList = filteredMachinesViewModel.OrderByDescending(x => x.MachineDownTime).Take(5).ToList();
            double totalMachineDownTime = 0;
            double totalFeedingDownTime = 0;
            double totalMachineDowntimeWorkingHours = 0;
            double totalFeedingDowntimeWorkingHours = 0 ;
            //totalMachineDownTime = Math.Round(filteredMachinesViewModel.Average(x => x.MachineDownTime),2);
            //totalFeedingDownTime = Math.Round(feedingDowntimeDataLists.Average(x => x.FeedingDownTime),2);
            foreach (var element in lineUnitWiseDowntimeDataLists)
            {
                totalMachineDownTime += element.MachineDownTime;
                totalMachineDowntimeWorkingHours += element.TotalMachineCount;
            }
            foreach (var element in lineUnitWiseFeedingDowntimeDataLists)
            {
                totalFeedingDownTime += element.FeedingDownTime;
                totalFeedingDowntimeWorkingHours += element.TotalMachineCount;
            }
            totalMachineDownTime = Math.Round(totalMachineDownTime*100 / (totalMachineDowntimeWorkingHours*480),2);
            totalFeedingDownTime = Math.Round(totalFeedingDownTime * 100 / (totalFeedingDowntimeWorkingHours * 480), 2);
            double totalDownTime = totalMachineDownTime + totalFeedingDownTime;
            string feedingDowntimeColorCode = GetDowntimeColorCode(totalFeedingDownTime);
            string machineDowntimeColorCode = GetDowntimeColorCode(totalMachineDownTime);
            string totalDowntimeColorCode = GetDowntimeColorCode(totalDownTime);
            return Json(new { 
                totalDownTime = totalDownTime,
                totalFeedingDownTime = totalFeedingDownTime,
                totalMachineDownTime = totalMachineDownTime,
                topFiveMachineDowntimeList = topFiveMachineDowntimeList,
                feedingDowntimeColorCode = feedingDowntimeColorCode,
                machineDowntimeColorCode = machineDowntimeColorCode,
                totalDowntimeColorCode = totalDowntimeColorCode
            });
        }

        private string GetDowntimeColorCode(double downtimeValue)
        {
            string colorCode = "";
            if(downtimeValue >= 0 && downtimeValue <= 5)
            {
                colorCode = "#175d2d";
            }
            else if(downtimeValue >= 6 && downtimeValue <= 10)
            {
                colorCode = "#ffb600";
            }
            else
            {
                colorCode = "#e0301e";
            }
            return colorCode;
        }
    }
}
