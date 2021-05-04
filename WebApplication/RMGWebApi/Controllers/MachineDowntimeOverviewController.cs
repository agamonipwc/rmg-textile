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
            List<MachineDowntimeViewModel> specialMachineDowntimeDataLists = new List<MachineDowntimeViewModel>();
            List<MachineDowntimeViewModel> lineUnitWiseDowntimeDataLists = new List<MachineDowntimeViewModel>();
            List<MachineDowntimeViewModel> generalDowntimeDataLists = new List<MachineDowntimeViewModel>();
            List<MachineDowntimeViewModel> lineUnitWiseFeedingDowntimeDataLists = new List<MachineDowntimeViewModel>();
            List<MachineDowntimeViewModel> lineUnitSpecialMachineDowntimeDataLists = new List<MachineDowntimeViewModel>();
            List<MachineDowntimeViewModel> lineUnitGeneralMachineDowntimeDataLists = new List<MachineDowntimeViewModel>();

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

                specialMachineDowntimeDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line, x.Unit, x.Machine, x.OperationIndex }).Select(grp => new MachineDowntimeViewModel
                {
                    MachineDownTime = grp.Where(x => x.Machine == "FOA" || x.Machine == "MNCS").Sum(x => x.MachineDowntime),
                    Line = grp.Key.Line,
                    Unit = grp.Key.Unit,
                    TotalMachineCount = grp.Where(x => x.Machine == "FOA" || x.Machine == "MNCS").Count(),
                    MachineName = grp.Key.Machine,
                    OperationIndex = grp.Key.OperationIndex
                }).ToList();

                generalDowntimeDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line, x.Unit, x.Machine, x.OperationIndex }).Select(grp => new MachineDowntimeViewModel
                {
                    MachineDownTime = grp.Where(x => x.Machine != "Checking Table" && x.Machine != "TABLE" && x.Machine != "FOA" && x.Machine != "MNCS").Sum(x => x.MachineDowntime),
                    Line = grp.Key.Line,
                    Unit = grp.Key.Unit,
                    TotalMachineCount = grp.Where(x => x.Machine != "Checking Table" && x.Machine != "TABLE" && x.Machine != "FOA" && x.Machine != "MNCS").Count(),
                    MachineName = grp.Key.Machine,
                    OperationIndex = grp.Key.OperationIndex
                }).ToList();

                lineUnitWiseFeedingDowntimeDataLists = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line, x.Unit }).Select(grp => new MachineDowntimeViewModel
                {
                    FeedingDownTime = grp.Where(x => x.Machine != "Checking Table" && x.Machine != "TABLE").Sum(x => x.FeedingDowntime),
                    Line = grp.Key.Line,
                    Unit = grp.Key.Unit,
                    TotalMachineCount = grp.Where(x => x.Machine != "Checking Table" && x.Machine != "TABLE").Count()
                }).ToList();
            }
            //List<MachineDowntimeViewModel> filteredMachinesViewModel = new List<MachineDowntimeViewModel>();
            //foreach(var element in machineDowntimeDataLists)
            //{
            //    if(element.MachineName != "Checking Table" && element.MachineName != "TABLE")
            //    {
            //        filteredMachinesViewModel.Add(new MachineDowntimeViewModel {
            //            MachineDownTime = element.MachineDownTime,
            //            MachineName = element.MachineName,
            //            ColorCode = GetDowntimeColorCode(element.MachineDownTime)
            //        });
            //    }
            //}
            foreach (var element in specialMachineDowntimeDataLists)
            {
                lineUnitSpecialMachineDowntimeDataLists.Add(new MachineDowntimeViewModel
                {
                    MachineDownTime = Math.Round((element.MachineDownTime * 100)/(480*element.TotalMachineCount),2),
                    MachineName = string.Join("_",element.MachineName,string.Join("","U",element.Unit), string.Join("", "L", element.Line), element.OperationIndex),
                    ColorCode = GetDowntimeColorCode(element.MachineDownTime)
                });
            }
            foreach (var element in generalDowntimeDataLists)
            {
                lineUnitGeneralMachineDowntimeDataLists.Add(new MachineDowntimeViewModel
                {
                    MachineDownTime = Math.Round((element.MachineDownTime * 100) / (480 * element.TotalMachineCount), 2),
                    MachineName = string.Join("_", element.MachineName, string.Join("", "U", element.Unit), string.Join("", "L", element.Line), element.OperationIndex),
                    ColorCode = GetDowntimeColorCode(element.MachineDownTime)
                });
            }
            var topFiveMachineDowntimeList = lineUnitSpecialMachineDowntimeDataLists.OrderByDescending(x => x.MachineDownTime).Take(5).ToList();
            var topFiveGeneralMachineDowntimeList = lineUnitGeneralMachineDowntimeDataLists.OrderByDescending(x => x.MachineDownTime).Take(5).ToList();
            double totalMachineDownTime = 0;
            double totalFeedingDownTime = 0;
            double totalMachineDowntimeWorkingHours = 0;
            double totalFeedingDowntimeWorkingHours = 0 ;
            double totalSpecialMachineDownTime = 0;
            double totalSpecialMachineWorkingHours = 0;
            double totalGeneralMachineDownTime = 0;
            double totalGeneralMachineWorkingHours = 0;
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
            foreach (var element in specialMachineDowntimeDataLists)
            {
                totalSpecialMachineDownTime += element.MachineDownTime;
                totalSpecialMachineWorkingHours += element.TotalMachineCount;
            }
            foreach (var element in generalDowntimeDataLists)
            {
                totalGeneralMachineDownTime += element.MachineDownTime;
                totalGeneralMachineWorkingHours += element.TotalMachineCount;
            }
            totalMachineDownTime = Math.Round(totalMachineDownTime*100 / (totalMachineDowntimeWorkingHours*480),2);
            totalFeedingDownTime = Math.Round(totalFeedingDownTime * 100 / (totalFeedingDowntimeWorkingHours * 480), 2);
            totalSpecialMachineDownTime = Math.Round(totalSpecialMachineDownTime * 100 / (totalSpecialMachineWorkingHours * 480), 2);
            totalGeneralMachineDownTime = Math.Round(totalGeneralMachineDownTime * 100 / (totalGeneralMachineWorkingHours * 480), 2);
            
            double totalDownTime = totalMachineDownTime + totalFeedingDownTime;
            string feedingDowntimeColorCode = GetDowntimeColorCode(totalFeedingDownTime);
            string machineDowntimeColorCode = GetDowntimeColorCode(totalMachineDownTime);
            string totalDowntimeColorCode = GetDowntimeColorCode(totalDownTime);
            string totalSpecialMachineDowntimeColorCode = GetDowntimeColorCode(totalSpecialMachineDownTime);
            string totalGeneralMachineDowntimeColorCode = GetDowntimeColorCode(totalGeneralMachineDownTime);
            
            return Json(new { 
                totalDownTime = totalDownTime,
                totalFeedingDownTime = totalFeedingDownTime,
                totalMachineDownTime = totalMachineDownTime,
                totalSpecialMachineDownTime = totalSpecialMachineDownTime,
                totalGeneralMachineDownTime = totalGeneralMachineDownTime,
                topFiveMachineDowntimeList = topFiveMachineDowntimeList,
                feedingDowntimeColorCode = feedingDowntimeColorCode,
                machineDowntimeColorCode = machineDowntimeColorCode,
                totalDowntimeColorCode = totalDowntimeColorCode,
                totalSpecialMachineDowntimeColorCode = totalSpecialMachineDowntimeColorCode,
                totalGeneralMachineDowntimeColorCode = totalGeneralMachineDowntimeColorCode,
                topFiveGeneralMachineDowntimeList = topFiveGeneralMachineDowntimeList
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
