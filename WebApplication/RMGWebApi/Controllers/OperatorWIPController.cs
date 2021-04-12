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
            List<ProductionViewModel> inlineWIPLineWiseDataList = new List<ProductionViewModel>();
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                inlineWIPLineWiseDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line, x.Unit, x.Name }).Select(grp => new ProductionViewModel
                {
                    WIPData = grp.Average(x => x.WIP),
                    OperatorName = grp.Key.Name,
                    Line = grp.Key.Line,
                    Unit = grp.Key.Unit
                }).ToList();
            }
            var groupedInlineWIPList = inlineWIPLineWiseDataList.GroupBy(u => new { u.Line, u.Unit }).Select(grp => grp.OrderByDescending(x=> x.WIPData).Take(3).ToList()).ToList();
            List<string> categories = new List<string>();
            foreach(var element in groupedInlineWIPList)
            {
                //string lineName = "Line_" + element.Select(x => x.Line).FirstOrDefault() + "_Unit_" + element.Select(x => x.Unit).FirstOrDefault();
                //categories.Add(lineName);
                foreach (var innerElement in element)
                {

                }
            }
            return Json(new
            {
                
            }); ;
        }
    }
}
