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
            List<ProductionViewModel> inlineWIPLineWiseDataList = new List<ProductionViewModel>();
            List<InlineWIPViewModel> inlineWIPViewModels = new List<InlineWIPViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            var styleData = _rmgDbContext.StyleMaster.ToList();
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                inlineWIPLineWiseDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line, x.Unit }).Select(grp => new ProductionViewModel
                {
                    Line = grp.Key.Line,
                    Unit = grp.Key.Unit,
                    WIPData = grp.Average(x => x.WIP),
                }).ToList();
                
            }
            foreach (var element in styleData)
            {
                List<LinewiseWIPViewModel> viewModels = new List<LinewiseWIPViewModel>();
                foreach (var innerElement in inlineWIPLineWiseDataList)
                {
                    if (element.LineId == innerElement.Line && element.UnitId == innerElement.Unit)
                    {
                        var overallWIPData = inlineWIPLineWiseDataList.Average(x => x.WIPData);
                        var styleWIPData = innerElement.WIPData;
                        var wipPercentage = Math.Round((styleWIPData * 100) / overallWIPData);
                        viewModels.Add(new LinewiseWIPViewModel
                        {
                            LineName = innerElement.Line.ToString(),
                            Unit = innerElement.Unit.ToString(),
                            LineWIPPercentage = wipPercentage
                        });
                    }
                }
                inlineWIPViewModels.Add(new InlineWIPViewModel
                {
                    StyleName = element.Name,
                    StyleWIPViewModel = viewModels
                });
            }
            return Json(new
            {
                data = inlineWIPViewModels
            });
        }
    }
}
