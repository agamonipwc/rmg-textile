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
    public class OperatorDefectEfficiencyController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public OperatorDefectEfficiencyController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            List<ProductionViewModel> lowEfficiency = new List<ProductionViewModel>();
            List<ProductionViewModel> highDefect = new List<ProductionViewModel>();
            List<ProductionViewModel> lowEfficiencyHighDefectOperatorSummaryDataList = new List<ProductionViewModel>();
            //highEfficiencyLowDefectOperatorSummaryDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line) && (x.Efficiency >= 0.50 && x.Efficiency < 0.75) && (x.DefectCount <= 10)).GroupBy(x => new { x.Location, x.Line, x.Unit, x.Name }).Select(grp => new ProductionViewModel
            //{
            //    DefectCount1Data = Math.Round(grp.Average(x=> x.DefectCount)),
            //    ProdData = Math.Round(grp.Average(x => x.Efficiency) * 100),
            //    OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == grp.Key.Name).Select(x => x.Id).FirstOrDefault(),
            //    OperatorName = grp.Key.Name
            //}).ToList();

            lowEfficiency = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line) && (x.Efficiency >= 0.0 && x.Efficiency < 0.50)).GroupBy(x => new { x.Location, x.Line, x.Unit, x.Name }).Select(grp => new ProductionViewModel
            {
                DefectCount1Data = Math.Round(grp.Average(x => x.DefectCount)),
                ProdData = Math.Round(grp.Average(x => x.Efficiency) * 100),
                OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == grp.Key.Name).Select(x => x.Id).FirstOrDefault(),
                OperatorName = grp.Key.Name,
                OperationDescription = _rmgDbContext.Line.Where(x=> x.Id == grp.Key.Line).Select(x=> x.Name).FirstOrDefault()
            }).ToList();

            highDefect = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line) && (x.DefectCount >= 20)).GroupBy(x => new { x.Location, x.Line, x.Unit, x.Name }).Select(grp => new ProductionViewModel
            {
                DefectCount1Data = Math.Round(grp.Average(x => x.DefectCount)),
                ProdData = Math.Round(grp.Average(x => x.Efficiency) * 100),
                OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == grp.Key.Name).Select(x => x.Id).FirstOrDefault(),
                OperatorName = grp.Key.Name,
                OperationDescription = _rmgDbContext.Line.Where(x => x.Id == grp.Key.Line).Select(x => x.Name).FirstOrDefault()
            }).ToList();

            lowEfficiencyHighDefectOperatorSummaryDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line) && (x.Efficiency >= 0.0 && x.Efficiency < 0.50) && (x.DefectCount >= 20)).GroupBy(x => new { x.Location, x.Line, x.Unit, x.Name }).Select(grp => new ProductionViewModel
            {
                DefectCount1Data = Math.Round(grp.Average(x => x.DefectCount)),
                ProdData = Math.Round(grp.Average(x => x.Efficiency) * 100),
                OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == grp.Key.Name).Select(x => x.Id).FirstOrDefault(),
                OperatorName = grp.Key.Name,
                OperationDescription = _rmgDbContext.Line.Where(x => x.Id == grp.Key.Line).Select(x => x.Name).FirstOrDefault()
            }).ToList();

            return Json(new {
                lowEfficiency = lowEfficiency,
                highDefect = highDefect,
                lowEfficiencyHighDefectOperatorSummaryDataList = lowEfficiencyHighDefectOperatorSummaryDataList
            });
        }
    }
}
