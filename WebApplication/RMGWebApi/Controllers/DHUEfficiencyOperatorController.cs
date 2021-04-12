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
    public class DHUEfficiencyOperatorController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public DHUEfficiencyOperatorController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> inlineWIPOperatorSummaryDataList = new List<ProductionViewModel>();
            List<DHUEfficiencyChartViewModel> chartViewModels = new List<DHUEfficiencyChartViewModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                if(kpiViewModel.OperatorType == "Low")
                {
                    inlineWIPOperatorSummaryDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line) &&(x.Efficiency >= 0.0 && x.Efficiency< 0.50)).GroupBy(x => new { x.Location, x.Line, x.Unit, x.Name }).Select(grp => new ProductionViewModel
                    {
                        WIPData = grp.Average(x => x.DHU),
                        ProdData = Math.Round(grp.Average(x => x.Efficiency) * 100),
                        OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == grp.Key.Name).Select(x => x.Id).FirstOrDefault(),
                        
                    }).ToList();
                }
                else if(kpiViewModel.OperatorType == "Medium")
                {
                    inlineWIPOperatorSummaryDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line) && (x.Efficiency >= 0.50 && x.Efficiency < 0.75)).GroupBy(x => new { x.Location, x.Line, x.Unit, x.Name }).Select(grp => new ProductionViewModel
                    {
                        WIPData = grp.Average(x => x.DHU),
                        ProdData = Math.Round(grp.Average(x => x.Efficiency) * 100),
                        OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == grp.Key.Name).Select(x => x.Id).FirstOrDefault(),
                        
                    }).ToList();
                }
                else
                {
                    inlineWIPOperatorSummaryDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line) && (x.Efficiency >= 0.75)).GroupBy(x => new { x.Location, x.Line, x.Unit, x.Name }).Select(grp => new ProductionViewModel
                    {
                        WIPData = grp.Average(x => x.DHU),
                        ProdData = Math.Round(grp.Average(x => x.Efficiency) * 100),
                        OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == grp.Key.Name).Select(x => x.Id).FirstOrDefault(),
                        
                    }).ToList();
                }

                inlineWIPOperatorSummaryDataList = inlineWIPOperatorSummaryDataList.OrderBy(x => x.ProdData).Take(30).ToList();

                foreach (var element in inlineWIPOperatorSummaryDataList)
                {
                    DHUEfficiencyChartViewModel viewModel = new DHUEfficiencyChartViewModel();
                    DHUMarkerViewModel dHUMarkerViewModel = new DHUMarkerViewModel();
                    dHUMarkerViewModel.radius = Convert.ToInt32(element.WIPData);
                    dHUMarkerViewModel.symbol = "circle";
                    viewModel.marker = dHUMarkerViewModel;
                    viewModel.name = string.Join("","Op",element.OperatorIndex);
                    string color = "";
                    Object[] arrayObject = new Object[2];
                    List<object[]> objectList = new List<object[]>();
                    if (kpiViewModel.OperatorType == "Low") 
                    {
                        if (element.ProdData >= 0 && element.ProdData < 50)
                        {
                            arrayObject[0] = element.OperatorIndex;
                            arrayObject[1] = element.ProdData;
                            color = "#e0301e";
                        }
                    }
                    else if(kpiViewModel.OperatorType == "Medium")
                    {
                        if (element.ProdData >= 50 && element.ProdData < 75)
                        {
                            arrayObject[0] = element.OperatorIndex;
                            arrayObject[1] = element.ProdData;
                            color = "#ffb600";
                        }
                    }
                    else
                    {
                        if (element.ProdData >= 75 && element.ProdData <= 100)
                        {
                            arrayObject[0] = element.OperatorIndex;
                            arrayObject[1] = element.ProdData;
                            color = "#175d2d";
                        }
                    }
                    objectList.Add(arrayObject);
                    viewModel.data = objectList;
                    viewModel.color = color;
                    chartViewModels.Add(viewModel);

                    //if(element.ProdData >= 0 && element.ProdData < 50)
                    //{
                    //    color = "#e0301e";
                    //}
                    //else if (element.ProdData >= 50 && element.ProdData < 75)
                    //{
                    //    color = "#ffb600";
                    //}
                    //else
                    //{
                    //    color = "#175d2d";
                    //}
                }
            }
            return Json(new {
                chartViewModels = chartViewModels
            });
        }
    }
}
