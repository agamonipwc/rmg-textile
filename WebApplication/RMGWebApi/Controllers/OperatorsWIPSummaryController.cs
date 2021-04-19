﻿using Entities;
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
                inlineWIPOperatorSummaryDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Line, x.Unit, x.Name }).Select(grp => new ProductionViewModel
                {
                    WIPData = Math.Round(grp.Sum(x => x.WIP) / grp.Sum(x=> x.Production),2),
                    OperatorName = grp.Key.Name,
                    Line = grp.Key.Line,
                    Unit = grp.Key.Unit
                }).ToList();
            }
            var filtedredInlineWIPOperatorSummaryDataList = inlineWIPOperatorSummaryDataList.Where(x => x.WIPData >= 0.1).OrderByDescending(x=> x.WIPData).ToList();
            return Json(new { 
                data = filtedredInlineWIPOperatorSummaryDataList
            });
        }
    }
}