using Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RMGWebApi.Utility;
using RMGWebApi.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DrilldownProductivityLinewiseController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public DrilldownProductivityLinewiseController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(DateRangeViewModel dateRangeViewModel)
        {
            var kpiResults = new
            {
                //ProductionLineWiseAnalysis = CalculateWIPDataLineWise(kpiViewModel),
                //DHULineWiseAnalysis = CalculateProductionDataLineWise(kpiViewModel),
                //RejectionLineWiseAnalysis = CalculateWorkingHrsDataLineWise(kpiViewModel),
                EfficiencyLocationData = CalculateEfficiencyLocationWise(dateRangeViewModel),
                EfficiencyLineData = CalculateEfficiencyLineWise(dateRangeViewModel),
                EfficiencyUnitData = CalculateEfficiencyUnitWise(dateRangeViewModel),
                StatusCode = 200
            };
            return Json(kpiResults);
        }

        private JsonResult CalculateWIPDataLineWise(KPIViewModel kpiViewModel)
        {
            var productionDataGroupingByLineDay = _rmgDbContext.WIP.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Day, x.Line, x.Date.Month })
                .Select(grp => new WIPViewModel { WIPData = grp.Sum(c => c.Data), Day = grp.Key.Day, Line = grp.Key.Line, Month = grp.Key.Month }).ToList();

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
                    y = Convert.ToInt32(grp.Sum(x => x.WIPData)),
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
                    data = Convert.ToInt32(grp.Sum(x => x.WIPData))
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

        private JsonResult CalculateProductionDataLineWise(KPIViewModel kpiViewModel)
        {
            var dhuDataGroupingByLineDay = _rmgDbContext.Production.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Day, x.Line })
                .Select(grp => new ProductionViewModel { ProdData = grp.Sum(c => c.Data), Day = grp.Key.Day, Line = grp.Key.Line }).ToList();
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
                        data.Add(innerelement.ProdData);
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

        private JsonResult CalculateWorkingHrsDataLineWise(KPIViewModel kpiViewModel)
        {
            var rejectionDataGroupingByLineDay = _rmgDbContext.WorkingHrs.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Line.Contains(x.Line) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Day, x.Line, x.Date.Month })
                .Select(grp => new WorkingHoursViewModel { WorkingHrsData = grp.Sum(c => c.Data), Day = grp.Key.Day, Line = grp.Key.Line, Month = grp.Key.Month }).ToList();

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
                    y = Convert.ToInt32(grp.Sum(x => x.WorkingHrsData)),
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
                    data = Convert.ToInt32(grp.Sum(x => x.WorkingHrsData))
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

        private JsonResult CalculateEfficiencyLocationWise(DateRangeViewModel dateRangeViewModel) {
            DateTime? startDate = Convert.ToDateTime(dateRangeViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(dateRangeViewModel.EndDate);
            var productionDataLocationWise = _rmgDbContext.Production.Where(x=> x.Date >= startDate.Value && x.Date <= endDate.Value)
                .GroupBy(x => new { x.Date, x.Location }).
                Select(grp => new ProductionViewModel { ProdData = grp.Average(c => c.Data), Date= grp.Key.Date, Location= grp.Key.Location}).ToList();

            var styleData = _rmgDbContext.StyleData.Average(x => x.SewingSAM);

            var workingHrsDataLocationWise = _rmgDbContext.WorkingHrs.Where(x => x.Date >= startDate.Value && x.Date <= endDate.Value)
                .GroupBy(x => new { x.Date, x.Location }).
                Select(grp => new WorkingHoursViewModel { WorkingHrsData = grp.Average(c => c.Data), Date = grp.Key.Date, Location = grp.Key.Location }).ToList();

            var operatorsDataLocationWise = _rmgDbContext.OperatorNos.Where(x => x.Date >= startDate.Value && x.Date <= endDate.Value)
                .GroupBy(x => new { x.Date, x.Location }).
                Select(grp => new OperatorViewModel { OperatorData = grp.Average(c => c.Data), Date = grp.Key.Date, Location = grp.Key.Location }).ToList();

            var helperDataLocationWise = _rmgDbContext.Helpers.Where(x => x.Date >= startDate.Value && x.Date <= endDate.Value)
                .GroupBy(x => new { x.Date, x.Location }).
                Select(grp => new HelpersViewModel { HelperData = grp.Average(c => c.Data), Date = grp.Key.Date, Location = grp.Key.Location }).ToList();
            List<ProductionSeries> productionSeries = new List<ProductionSeries>();
            for(int index = 1; index<=2; index++)
            {
                List<ProductionMonthDrilldown> productionMonths = new List<ProductionMonthDrilldown>();
                var query = (from s in workingHrsDataLocationWise
                             join cs in operatorsDataLocationWise on new { s.Location, s.Date } equals new { cs.Location, cs.Date }
                             join os in helperDataLocationWise on new { s.Location, s.Date } equals new { os.Location, os.Date }
                             join x in productionDataLocationWise on new { s.Location, s.Date } equals new { x.Location, x.Date }
                             where s.Location == index
                             select new EfficiencyParameters
                             {
                                 efficiency = (Math.Round((x.ProdData * styleData) / (s.WorkingHrsData * (cs.OperatorData + os.HelperData)), 2)) * 100,
                                 Dailydate = s.Date.Value.ToString("dd/MM/yyyy")
                             }).ToList();
                foreach (var element in query)
                {
                    ProductionMonthDrilldown productionMonthDrilldown = new ProductionMonthDrilldown();
                    productionMonthDrilldown.name = element.Dailydate;
                    productionMonthDrilldown.y = Convert.ToInt32(element.efficiency);
                    productionMonths.Add(productionMonthDrilldown);
                }
                string locationame = "";
                if(index == 1)
                {
                    locationame = "Gurgaon";
                }
                else
                {
                    locationame = "Delhi";
                }
                productionSeries.Add(new ProductionSeries
                {
                    name = locationame,
                    data = productionMonths
                });
            }

            return Json(new {
                productionSeries = productionSeries
            });
        }

        private JsonResult CalculateEfficiencyLineWise(DateRangeViewModel dateRangeViewModel)
        {
            DateTime? startDate = Convert.ToDateTime(dateRangeViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(dateRangeViewModel.EndDate);
            var productionDataLocationWise = _rmgDbContext.Production.Where(x => x.Date >= startDate.Value && x.Date <= endDate.Value)
                .GroupBy(x => new { x.Date, x.Line }).
                Select(grp => new ProductionViewModel { ProdData = grp.Average(c => c.Data), Date = grp.Key.Date, Line = grp.Key.Line }).ToList();

            var styleData = _rmgDbContext.StyleData.Average(x => x.SewingSAM);

            var workingHrsDataLocationWise = _rmgDbContext.WorkingHrs.Where(x => x.Date >= startDate.Value && x.Date <= endDate.Value)
                .GroupBy(x => new { x.Date, x.Line }).
                Select(grp => new WorkingHoursViewModel { WorkingHrsData = grp.Average(c => c.Data), Date = grp.Key.Date, Line = grp.Key.Line }).ToList();

            var operatorsDataLocationWise = _rmgDbContext.OperatorNos.Where(x => x.Date >= startDate.Value && x.Date <= endDate.Value)
                .GroupBy(x => new { x.Date, x.Line }).
                Select(grp => new OperatorViewModel { OperatorData = grp.Average(c => c.Data), Date = grp.Key.Date, Line = grp.Key.Line }).ToList();

            var helperDataLocationWise = _rmgDbContext.Helpers.Where(x => x.Date >= startDate.Value && x.Date <= endDate.Value)
                .GroupBy(x => new { x.Date, x.Line }).
                Select(grp => new HelpersViewModel { HelperData = grp.Average(c => c.Data), Date = grp.Key.Date, Line = grp.Key.Line }).ToList();
            List<ProductionSeries> productionSeries = new List<ProductionSeries>();
            var lineMasterData = _rmgDbContext.Line.ToList();
            foreach (var lineElement in lineMasterData)
            {
                List<ProductionMonthDrilldown> productionMonths = new List<ProductionMonthDrilldown>();
                var query = (from s in workingHrsDataLocationWise
                             join cs in operatorsDataLocationWise on new { s.Line, s.Date } equals new { cs.Line, cs.Date }
                             join os in helperDataLocationWise on new { s.Line, s.Date } equals new { os.Line, os.Date }
                             join x in productionDataLocationWise on new { s.Line, s.Date } equals new { x.Line, x.Date }
                             where s.Line == lineElement.Id
                             select new EfficiencyParameters
                             {
                                 efficiency = (Math.Round((x.ProdData * styleData) / (s.WorkingHrsData * (cs.OperatorData + os.HelperData)), 2)) * 100,
                                 //Month = s.Line.ToString(),
                                 //Year = s.Year.ToString(),
                                 Dailydate = s.Date.Value.ToString("dd/MM/yyyy")
                             }).ToList();
                foreach (var element in query)
                {
                    ProductionMonthDrilldown productionMonthDrilldown = new ProductionMonthDrilldown();
                    productionMonthDrilldown.name = element.Dailydate;
                    productionMonthDrilldown.y = Convert.ToInt32(element.efficiency);
                    productionMonths.Add(productionMonthDrilldown);
                }
                productionSeries.Add(new ProductionSeries
                {
                    name = lineElement.Name,
                    data = productionMonths
                });
            }

            return Json(new
            {
                productionSeries = productionSeries
            });
        }

        private JsonResult CalculateEfficiencyUnitWise(DateRangeViewModel dateRangeViewModel)
        {
            DateTime? startDate = Convert.ToDateTime(dateRangeViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(dateRangeViewModel.EndDate);
            var productionDataLocationWise = _rmgDbContext.Production.Where(x => x.Date >= startDate.Value && x.Date <= endDate.Value)
                .GroupBy(x => new { x.Date, x.Unit }).
                Select(grp => new ProductionViewModel { ProdData = grp.Average(c => c.Data), Date = grp.Key.Date, Unit = grp.Key.Unit }).ToList();

            var styleData = _rmgDbContext.StyleData.Average(x => x.SewingSAM);

            var workingHrsDataLocationWise = _rmgDbContext.WorkingHrs.Where(x => x.Date >= startDate.Value && x.Date <= endDate.Value)
                .GroupBy(x => new { x.Date, x.Unit }).
                Select(grp => new WorkingHoursViewModel { WorkingHrsData = grp.Average(c => c.Data), Date = grp.Key.Date, Unit = grp.Key.Unit }).ToList();

            var operatorsDataLocationWise = _rmgDbContext.OperatorNos.Where(x => x.Date >= startDate.Value && x.Date <= endDate.Value)
                .GroupBy(x => new { x.Date, x.Unit }).
                Select(grp => new OperatorViewModel { OperatorData = grp.Average(c => c.Data), Date = grp.Key.Date, Unit = grp.Key.Unit }).ToList();

            var helperDataLocationWise = _rmgDbContext.Helpers.Where(x => x.Date >= startDate.Value && x.Date <= endDate.Value)
                .GroupBy(x => new { x.Date, x.Unit }).
                Select(grp => new HelpersViewModel { HelperData = grp.Average(c => c.Data), Date = grp.Key.Date, Unit = grp.Key.Unit }).ToList();
            List<ProductionSeries> productionSeries = new List<ProductionSeries>();
            var unitMasterData = _rmgDbContext.Unit.ToList();
            foreach (var unitElement in unitMasterData)
            {
                List<ProductionMonthDrilldown> productionMonths = new List<ProductionMonthDrilldown>();
                var query = (from s in workingHrsDataLocationWise
                             join cs in operatorsDataLocationWise on new { s.Unit, s.Date } equals new { cs.Unit, cs.Date }
                             join os in helperDataLocationWise on new { s.Unit, s.Date } equals new { os.Unit, os.Date }
                             join x in productionDataLocationWise on new { s.Unit, s.Date } equals new { x.Unit, x.Date }
                             where s.Unit == unitElement.Id
                             select new EfficiencyParameters
                             {
                                 efficiency = (Math.Round((x.ProdData * styleData) / (s.WorkingHrsData * (cs.OperatorData + os.HelperData)), 2)) * 100,
                                 //Month = s.Line.ToString(),
                                 //Year = s.Year.ToString(),
                                 Dailydate = s.Date.Value.ToString("dd/MM/yyyy")
                             }).ToList();
                foreach (var element in query)
                {
                    ProductionMonthDrilldown productionMonthDrilldown = new ProductionMonthDrilldown();
                    productionMonthDrilldown.name = element.Dailydate;
                    productionMonthDrilldown.y = Convert.ToInt32(element.efficiency);
                    productionMonths.Add(productionMonthDrilldown);
                }
                productionSeries.Add(new ProductionSeries
                {
                    name = unitElement.Name,
                    data = productionMonths
                });
            }

            return Json(new
            {
                productionSeries = productionSeries
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
