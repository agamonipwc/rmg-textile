﻿using Entities;
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
    public class DrilldownResourceStengthUnitwiseController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public DrilldownResourceStengthUnitwiseController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            var kpiResults = new
            {
                ProductionUnitWiseAnalysis = CalculateOperatorsUnitWise(kpiViewModel),
                DHUUnitWiseAnalysis = CalculateHelpersDataUnitWise(kpiViewModel),
                RejectionUnitWiseAnalysis = CalculateCheckersDataUnitWise(kpiViewModel),
                StatusCode = 200
            };
            return Json(kpiResults);
        }

        private JsonResult CalculateOperatorsUnitWise(KPIViewModel kpiViewModel)
        {
            var productionDataGroupingByUnitDay = _rmgDbContext.OperatorNos.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Day, x.Unit, x.Date.Month })
                .Select(grp => new OperatorViewModel { OperatorData = grp.Sum(c => c.Data), Day = grp.Key.Day, Unit = grp.Key.Unit, Month = grp.Key.Month }).ToList();

            foreach (var element in productionDataGroupingByUnitDay)
            {
                element.MonthName = getMonthName(element.Month);
            }

            List<ProductionSeries> productionSeries = new List<ProductionSeries>();

            List<ProductionDrilldownMonthSeries> productionDrilldownMonthSeries = new List<ProductionDrilldownMonthSeries>();

            foreach (var element in kpiViewModel.Unit)
            {
                //string monthName = getMonthName(element);
                List<ProductionMonthDrilldown> productionMonthDrilldowns = new List<ProductionMonthDrilldown>();
                productionMonthDrilldowns = productionDataGroupingByUnitDay.Where(x => x.Unit == element).GroupBy(x => new { x.Unit, x.Month, x.MonthName }).Select(grp => new ProductionMonthDrilldown
                {
                    name = grp.Key.MonthName,
                    y = Convert.ToInt32(grp.Sum(x => x.OperatorData)),
                    drilldown = string.Join('-', string.Join("", "Unit", grp.Key.Unit.ToString()), grp.Key.MonthName.ToString())
                }).ToList();
                productionSeries.Add(new ProductionSeries
                {
                    name = string.Join(' ', "Unit ", element.ToString()),
                    data = productionMonthDrilldowns
                });
            }


            foreach (var monthelement in kpiViewModel.Month)
            {
                string monthName = getMonthName(monthelement);
                var productionDataGroupByUnitDaySeries = productionDataGroupingByUnitDay.Where(x => x.Month == monthelement).GroupBy(x => new { x.Unit, x.Day }).Select(grp => new ProductionDrilldownObtainedMonthSeries
                {
                    name = grp.Key.Day,
                    id = grp.Key.Unit.ToString(),
                    data = Convert.ToInt32(grp.Sum(x => x.OperatorData))
                }).ToList();

                foreach (var element in kpiViewModel.Unit)
                {
                    ProductionDrilldownMonthSeries seriesObj = new ProductionDrilldownMonthSeries();
                    seriesObj.id = string.Join('-', string.Join("", "Unit", element.ToString()), monthName);
                    seriesObj.name = string.Join(' ', "Unit", element.ToString(), "Weekly Data");
                    //List<int> seriesData = new List<int>();
                    List<object[]> seriesData = new List<object[]>();
                    foreach (var innerelement in productionDataGroupByUnitDaySeries)
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

        private JsonResult CalculateHelpersDataUnitWise(KPIViewModel kpiViewModel)
        {
            var dhuDataGroupingByUnitDay = _rmgDbContext.Helpers.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Day, x.Unit })
                .Select(grp => new HelpersViewModel { HelperData = grp.Sum(c => c.Data), Day = grp.Key.Day, Unit = grp.Key.Unit }).ToList();
            List<DHUVisualViewModel> dHUVisualListViews = new List<DHUVisualViewModel>();
            List<string> weekCategories = new List<string>();
            foreach (var element in kpiViewModel.Unit)
            {
                DHUVisualViewModel dHUVisualView = new DHUVisualViewModel();
                List<double> data = new List<double>();
                foreach (var innerelement in dhuDataGroupingByUnitDay)
                {
                    if (element == innerelement.Unit)
                    {
                        dHUVisualView.name = string.Join(' ', "Unit", element.ToString());
                        data.Add(innerelement.HelperData);
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

        private JsonResult CalculateCheckersDataUnitWise(KPIViewModel kpiViewModel)
        {
            var rejectionDataGroupingByUnitDay = _rmgDbContext.Checkers.Where(x =>
                kpiViewModel.Year.Contains(x.Date.Year) &&
                kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Month.Contains(x.Date.Month)).GroupBy(x => new { x.Day, x.Unit, x.Date.Month })
                .Select(grp => new CheckersViewModel { CheckersData = grp.Sum(c => c.Data), Day = grp.Key.Day, Unit = grp.Key.Unit, Month = grp.Key.Month }).ToList();

            foreach (var element in rejectionDataGroupingByUnitDay)
            {
                element.MonthName = getMonthName(element.Month);
            }

            List<RejectionSeries> rejectionSeries = new List<RejectionSeries>();

            List<RejectionDrilldownMonthSeries> rejectionDrilldownMonthSeries = new List<RejectionDrilldownMonthSeries>();

            foreach (var element in kpiViewModel.Unit)
            {
                //string monthName = getMonthName(element);
                List<RejectionMonthDrilldown> rejectionMonthDrilldowns = new List<RejectionMonthDrilldown>();
                rejectionMonthDrilldowns = rejectionDataGroupingByUnitDay.Where(x => x.Unit == element).GroupBy(x => new { x.Unit, x.Month, x.MonthName }).Select(grp => new RejectionMonthDrilldown
                {
                    name = grp.Key.MonthName,
                    y = Convert.ToInt32(grp.Sum(x => x.CheckersData)),
                    drilldown = string.Join('-', string.Join("", "Unit", grp.Key.Unit.ToString()), grp.Key.MonthName.ToString())
                }).ToList();
                rejectionSeries.Add(new RejectionSeries
                {
                    name = string.Join(' ', "Unit ", element.ToString()),
                    data = rejectionMonthDrilldowns
                });
            }


            foreach (var monthelement in kpiViewModel.Month)
            {
                string monthName = getMonthName(monthelement);
                var productionDataGroupByUnitDaySeries = rejectionDataGroupingByUnitDay.Where(x => x.Month == monthelement).GroupBy(x => new { x.Unit, x.Day }).Select(grp => new ProductionDrilldownObtainedMonthSeries
                {
                    name = grp.Key.Day,
                    id = grp.Key.Unit.ToString(),
                    data = Convert.ToInt32(grp.Sum(x => x.CheckersData))
                }).ToList();

                foreach (var element in kpiViewModel.Unit)
                {
                    RejectionDrilldownMonthSeries seriesObj = new RejectionDrilldownMonthSeries();
                    seriesObj.id = string.Join('-', string.Join("", "Unit", element.ToString()), monthName);
                    seriesObj.name = string.Join(' ', "Unit", element.ToString(), "Weekly Data");
                    //List<int> seriesData = new List<int>();
                    List<object[]> seriesData = new List<object[]>();
                    foreach (var innerelement in productionDataGroupByUnitDaySeries)
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
