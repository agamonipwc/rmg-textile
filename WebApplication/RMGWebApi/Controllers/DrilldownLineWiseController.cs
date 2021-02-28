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
                ProductionLineWiseAnalysis = CalculateAlterationDataLineWise(kpiViewModel),
                DHULineWiseAnalysis = CalculateDHUDataLineWise(kpiViewModel),
                RejectionLineWiseAnalysis = CalculateRejectionDataLineWise(kpiViewModel),
                StatusCode = 200
            };
            return Json(kpiResults);
        }

        private JsonResult CalculateAlterationDataLineWise(KPIViewModel kpiViewModel)
        {
            var productionDataGroupingByLineDay = _rmgDbContext.Alteration.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Day, x.Line, x.Date.Month })
                .Select(grp => new AlterationViewModel { AlterationData = grp.Sum(c => c.Data), Day = grp.Key.Day, Line = grp.Key.Line, Month = grp.Key.Month }).ToList();

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
                    y = Convert.ToInt32(grp.Sum(x => x.AlterationData)),
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
                    data = Convert.ToInt32(grp.Sum(x => x.AlterationData))
                }).ToList();

                foreach (var element in kpiViewModel.Line)
                {
                    ProductionDrilldownMonthSeries seriesObj = new ProductionDrilldownMonthSeries();
                    seriesObj.id = string.Join('-', string.Join("", "Line", element.ToString()), monthName);
                    seriesObj.name = string.Join(' ', "Line", element.ToString(), "Weekly Data");
                    //List<int> seriesData = new List<int>();
                    List<object[]> seriesData = new List<object[]>();
                    foreach (var innerelement in productionDataGroupByLineDaySeries)
                    {
                        object[] array = new object[2];
                        if (element.ToString() == innerelement.id)
                        {
                            array[0] = innerelement.name;
                            array[1] = innerelement.data;
                            seriesData.Add(array);
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
                .Select(grp => new DHUViewModel { DHUData = grp.Sum(c => c.Data), Day = grp.Key.Day, Line = grp.Key.Line }).ToList();
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

        private JsonResult CalculateRejectionDataLineWise(KPIViewModel kpiViewModel)
        {
            var rejectionDataGroupingByLineDay = _rmgDbContext.Rejection.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Day, x.Line, x.Date.Month })
                .Select(grp => new RejectionViewModel { RejectionData = grp.Sum(c => c.Data), Day = grp.Key.Day, Line = grp.Key.Line, Month = grp.Key.Month }).ToList();

            foreach (var element in rejectionDataGroupingByLineDay)
            {
                element.MonthName = getMonthName(element.Month);
            }

            List<RejectionSeries> rejectionSeries = new List<RejectionSeries>();

            List<RejectionDrilldownMonthSeries> rejectionDrilldownMonthSeries = new List<RejectionDrilldownMonthSeries>();

            foreach (var element in kpiViewModel.Line)
            {
                //string monthName = getMonthName(element);
                List<RejectionMonthDrilldown> rejectionMonthDrilldowns = new List<RejectionMonthDrilldown>();
                rejectionMonthDrilldowns = rejectionDataGroupingByLineDay.Where(x => x.Line == element).GroupBy(x => new { x.Line, x.Month, x.MonthName }).Select(grp => new RejectionMonthDrilldown
                {
                    name = grp.Key.MonthName,
                    y = Convert.ToInt32(grp.Sum(x => x.RejectionData)),
                    drilldown = string.Join('-', string.Join("", "Line", grp.Key.Line.ToString()), grp.Key.MonthName.ToString())
                }).ToList();
                rejectionSeries.Add(new RejectionSeries
                {
                    name = string.Join(' ', "Line ", element.ToString()),
                    data = rejectionMonthDrilldowns
                });
            }


            foreach (var monthelement in kpiViewModel.Month)
            {
                string monthName = getMonthName(monthelement);
                var productionDataGroupByLineDaySeries = rejectionDataGroupingByLineDay.Where(x => x.Month == monthelement).GroupBy(x => new { x.Line, x.Day }).Select(grp => new ProductionDrilldownObtainedMonthSeries
                {
                    name = grp.Key.Day,
                    id = grp.Key.Line.ToString(),
                    data = Convert.ToInt32(grp.Sum(x => x.RejectionData))
                }).ToList();

                foreach (var element in kpiViewModel.Line)
                {
                    RejectionDrilldownMonthSeries seriesObj = new RejectionDrilldownMonthSeries();
                    seriesObj.id = string.Join('-', string.Join("", "Line", element.ToString()), monthName);
                    seriesObj.name = string.Join(' ', "Line", element.ToString(), "Weekly Data");
                    //List<int> seriesData = new List<int>();
                    List<object[]> seriesData = new List<object[]>();
                    foreach (var innerelement in productionDataGroupByLineDaySeries)
                    {
                        object[] array = new object[2];
                        if (element.ToString() == innerelement.id)
                        {
                            //seriesData.Add(innerelement.data);
                            array[0] = innerelement.name;
                            array[1] = innerelement.data;
                            seriesData.Add(array);
                        }
                    }
                    seriesObj.data = seriesData;
                    rejectionDrilldownMonthSeries.Add(seriesObj);
                }
            }
            return Json(new
            {
                rejectionDrilldownMonthSeries = rejectionDrilldownMonthSeries,
                rejectionMonthDrilldowns = rejectionSeries
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
