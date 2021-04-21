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
    public class OperatorWIPController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public OperatorWIPController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            List<OperatorsLinewiseWIPViewModel> inlineWIPLineWiseDataList = new List<OperatorsLinewiseWIPViewModel>();
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                inlineWIPLineWiseDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line) && x.Style == kpiViewModel.StyleName).GroupBy(x => new { x.Line, x.Unit, x.Name }).Select(grp => new OperatorsLinewiseWIPViewModel
                {
                    LineWIPLevelValue = Math.Round((grp.Average(x => x.WIP) / (grp.Average(x => x.Production) / 8)), 2),
                    LineWIPActualValue = Math.Round(grp.Average(x => x.WIP),2),
                    OperatorName = grp.Key.Name,
                    LineUnitName = string.Join("","Line",grp.Key.Line,"Unit",grp.Key.Unit),
                    StyleName = kpiViewModel.StyleName,
                }).ToList();
            }   
            List<string> lineUnitNames = new List<string>();
            lineUnitNames = inlineWIPLineWiseDataList.Select(x => x.LineUnitName).Distinct().ToList();
            var groupedInlineWIPList = inlineWIPLineWiseDataList.Where(x=> x.LineWIPLevelValue >= 1).OrderByDescending(x => x.LineWIPLevelValue).ToList();
            List<DHUTopFiveDefects> inlineWIPOperatorsDataList = new List<DHUTopFiveDefects>();
            
            for(int outerIndex = 0; outerIndex < groupedInlineWIPList.Count; outerIndex++)
            {
                List<double> data = new List<double>();
                for (int innerIndex = 0; innerIndex < lineUnitNames.Count; innerIndex++)
                {
                    if(groupedInlineWIPList[outerIndex].LineUnitName == lineUnitNames[innerIndex])
                    {
                        data.Add(Math.Round(groupedInlineWIPList[outerIndex].LineWIPLevelValue, 2));
                    }
                    else
                    {
                        data.Add(0);
                    }
                }
                inlineWIPOperatorsDataList.Add(new DHUTopFiveDefects
                {
                    name = groupedInlineWIPList[outerIndex].OperatorName,
                    data = data,
                    color = CustomizeColorCode.GetRandomColors()
                });
            }
            return Json(new
            {
                inlineWIPOperatorsDataList = inlineWIPOperatorsDataList,
                categories = lineUnitNames
            }); ;
        }
    }
}
