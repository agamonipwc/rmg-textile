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
    public class DrilldownLineWiseController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public DrilldownLineWiseController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            var kpiResults = new
            {
                ProductionLineWiseAnalysis = CalculateProductionDataLineWise(kpiViewModel),
                DHULineWiseAnalysis = CalculateDHUDataLineWise(kpiViewModel),
                StatusCode = 200
            };
            return Json(kpiResults);
        }

        private JsonResult CalculateProductionDataLineWise(KPIViewModel kpiViewModel)
        {
            var productionDataGroupingByLineDay = _rmgDbContext.Production.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Day, x.Line, x.Date.Month })
                .Select(grp => new ProductionViewModel { ProdData = grp.Average(c => c.Data), Day = grp.Key.Day, Line = grp.Key.Line, Month = grp.Key.Month }).ToList();

            foreach (var element in productionDataGroupingByLineDay)
            {
                element.MonthName = getMonthName(element.Month);
            }

            List<ProductionSeries> productionSeries = new List<ProductionSeries>();

            List<ProductionDrilldownMonthSeries> productionDrilldownMonthSeries = new List<ProductionDrilldownMonthSeries>();

            foreach (var element in kpiViewModel.Line)
            {
                //string monthName = getMonthName(element);
                List<ProductionMonthDrilldown> productionMonthDrilldowns = new List<ProductionMonthDrilldown>();
                productionMonthDrilldowns = productionDataGroupingByLineDay.Where(x => x.Line == element).GroupBy(x => new { x.Line, x.Month, x.MonthName }).Select(grp => new ProductionMonthDrilldown
                {
                    name = grp.Key.MonthName,
                    y = Convert.ToInt32(grp.Average(x => x.ProdData)),
                    drilldown = string.Join('-', string.Join("", "Line", grp.Key.Line.ToString()), grp.Key.MonthName.ToString())
                }).ToList();
                productionSeries.Add(new ProductionSeries
                {
                    name = string.Join(' ', "Line ", element.ToString()),
                    data = productionMonthDrilldowns
                });
            }


            foreach (var monthelement in kpiViewModel.Month)
            {
                string monthName = getMonthName(monthelement);
                var productionDataGroupByLineDaySeries = productionDataGroupingByLineDay.Where(x => x.Month == monthelement).GroupBy(x => new { x.Line, x.Day }).Select(grp => new ProductionDrilldownObtainedMonthSeries
                {
                    name = grp.Key.Day,
                    id = grp.Key.Line.ToString(),
                    data = Convert.ToInt32(grp.Average(x => x.ProdData))
                }).ToList();

                foreach (var element in kpiViewModel.Line)
                {
                    ProductionDrilldownMonthSeries seriesObj = new ProductionDrilldownMonthSeries();
                    seriesObj.id = string.Join('-', string.Join("", "Line", element.ToString()), monthName);
                    seriesObj.name = string.Join(' ', "Line", element.ToString(), "Weekly Data");
                    List<int> seriesData = new List<int>();
                    foreach (var innerelement in productionDataGroupByLineDaySeries)
                    {
                        if (element.ToString() == innerelement.id)
                        {
                            seriesData.Add(innerelement.data);
                        }
                    }
                    seriesObj.data = seriesData;
                    productionDrilldownMonthSeries.Add(seriesObj);
                }
            }
            return Json(new
            {
                productionDrilldownMonthSeries = productionDrilldownMonthSeries,
                productionMonthDrilldowns = productionSeries
            });
        }

        private JsonResult CalculateDHUDataLineWise(KPIViewModel kpiViewModel)
        {
            var dhuDataGroupingByLineDay = _rmgDbContext.DHU.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Day, x.Line })
                .Select(grp => new DHUViewModel { DHUData = grp.Average(c => c.Data), Day = grp.Key.Day, Line = grp.Key.Line }).ToList();
            List<DHUVisualViewModel> dHUVisualListViews = new List<DHUVisualViewModel>();
            List<string> weekCategories = new List<string>();
            foreach (var element in kpiViewModel.Line)
            {
                DHUVisualViewModel dHUVisualView = new DHUVisualViewModel();
                List<double> data = new List<double>();
                foreach (var innerelement in dhuDataGroupingByLineDay)
                {
                    if (element == innerelement.Line)
                    {
                        dHUVisualView.name = string.Join(' ', "Line", element.ToString());
                        data.Add(innerelement.DHUData);
                        weekCategories.Add(innerelement.Day);
                    }
                }
                dHUVisualView.data = data;
                dHUVisualListViews.Add(dHUVisualView);
            }
            weekCategories = weekCategories.Distinct().ToList();
            return Json(new
            {
                series = dHUVisualListViews,
                categories = weekCategories
            });
        }

        private string getMonthName(int monthId)
        {
            string monthName = "";
            switch (monthId)
            {
                case 1:
                    monthName = "Jan";
                    break;
                case 2:
                    monthName = "Feb";
                    break;
            }
            return monthName;
        }
    }
}
