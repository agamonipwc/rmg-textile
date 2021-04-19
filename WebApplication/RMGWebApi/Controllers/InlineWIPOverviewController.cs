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
    public class InlineWIPOverviewController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public InlineWIPOverviewController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            List<InlineWIPStyleViewModel> inlineWIPLineWiseDataList = new List<InlineWIPStyleViewModel>();
            List<InlineWIPViewModel> inlineWIPViewModels = new List<InlineWIPViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                inlineWIPLineWiseDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line, x.Unit, x.Style }).Select(grp => new InlineWIPStyleViewModel
                {
                    Line = grp.Key.Line,
                    Unit = grp.Key.Unit,
                    Style = grp.Key.Style,
                    WIPData = grp.Average(x => x.WIP),
                }).ToList();
            }
            var groupedStyleInlineWIPData = inlineWIPLineWiseDataList.GroupBy(x=> x.Style).Select(grp => grp.ToList()).ToList();
            List<double> overallWIPDataList = new List<double>();

            foreach (var outerElement in groupedStyleInlineWIPData)
            {
                double overallWIP = 0;
                foreach (var innerElement in outerElement)
                {
                    overallWIP += innerElement.WIPData;
                }
                overallWIPDataList.Add(Math.Round(overallWIP,2));
            }

            for (int outerIndex = 0; outerIndex<groupedStyleInlineWIPData.Count; outerIndex++)
            {
                List<LinewiseWIPViewModel> viewModels = new List<LinewiseWIPViewModel>();
                string styleName = "";
                for(int innerIndex = 0; innerIndex< groupedStyleInlineWIPData[outerIndex].Count; innerIndex++)
                {
                    styleName = groupedStyleInlineWIPData[outerIndex][0].Style;
                    viewModels.Add(new LinewiseWIPViewModel
                    {
                        LineName = groupedStyleInlineWIPData[outerIndex][innerIndex].Line.ToString(),
                        Unit = groupedStyleInlineWIPData[outerIndex][innerIndex].Unit.ToString(),
                        LineWIPPercentage = Math.Round((groupedStyleInlineWIPData[outerIndex][innerIndex].WIPData * 100) / overallWIPDataList[outerIndex]),
                        LineWIPActualValue = Math.Round(groupedStyleInlineWIPData[outerIndex][innerIndex].WIPData)
                    });
                }
                inlineWIPViewModels.Add(new InlineWIPViewModel
                {
                    StyleName = styleName,
                    StyleWIPViewModel = viewModels
                });
            }
            //foreach (var element in styleData)
            //{
            //    List<LinewiseWIPViewModel> viewModels = new List<LinewiseWIPViewModel>();
            //    foreach (var innerElement in inlineWIPLineWiseDataList)
            //    {
            //        if (element.LineId == innerElement.Line && element.UnitId == innerElement.Unit)
            //        {
            //            var overallWIPData = inlineWIPLineWiseDataList.Average(x => x.WIPData);
            //            var styleWIPData = innerElement.WIPData;
            //            var wipPercentage = Math.Round((styleWIPData * 100) / overallWIPData);
            //            viewModels.Add(new LinewiseWIPViewModel
            //            {
            //                LineName = innerElement.Line.ToString(),
            //                Unit = innerElement.Unit.ToString(),
            //                LineWIPPercentage = wipPercentage
            //            });
            //        }
            //    }
            //    inlineWIPViewModels.Add(new InlineWIPViewModel
            //    {
            //        StyleName = element.Name,
            //        StyleWIPViewModel = viewModels
            //    });
            //}
            return Json(new
            {
                data = inlineWIPViewModels
            });
        }
    }
}
