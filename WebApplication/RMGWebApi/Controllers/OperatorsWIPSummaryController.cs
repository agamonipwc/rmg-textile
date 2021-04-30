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
    public class OperatorsWIPSummaryController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public OperatorsWIPSummaryController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> inlineWIPOperatorSummaryDataList = new List<ProductionViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                inlineWIPOperatorSummaryDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line, x.Unit, x.Name, x.Operation, x.Machine }).Select(grp => new ProductionViewModel
                {
                    WIPData = Math.Round(grp.Sum(x => x.WIP) / grp.Sum(x=> x.Production),2),
                    OperatorName = grp.Key.Name,
                    Line = grp.Key.Line,
                    Unit = grp.Key.Unit,
                    OperationDescription = grp.Key.Operation,
                    DefectReason1 = grp.Key.Machine
                }).ToList();
            }
            var filtedredInlineWIPOperatorSummaryDataList = inlineWIPOperatorSummaryDataList.Where(x => x.WIPData >= 0.1).OrderByDescending(x=> x.WIPData).Select(x=> new OperatorsInlineWIPDataset { 
                WIPData = x.WIPData,
                OperatorName = x.OperatorName,
                Line = _rmgDbContext.Line.Where(y=> y.Id == x.Line).Select(y=> y.Name).FirstOrDefault(),
                Unit = _rmgDbContext.Unit.Where(y => y.Id == x.Unit).Select(y => y.Name).FirstOrDefault(),
                OpearationName = x.OperationDescription,
                MachineName = x.DefectReason1
            }).ToList();
            return Json(new { 
                data = filtedredInlineWIPOperatorSummaryDataList
            });
        }

        private class OperatorsInlineWIPDataset
        {
            public double WIPData { get; set; }
            public string OperatorName { get; set; }
            public string Line { get; set; }
            public string Unit { get; set; }
            public string OpearationName { get; set; }
            public string MachineName { get; set; }
        }
    }
}
