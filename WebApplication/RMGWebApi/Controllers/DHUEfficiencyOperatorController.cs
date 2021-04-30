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
                //if(kpiViewModel.OperatorType == "Low")
                //{
                    inlineWIPOperatorSummaryDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Name }).Select(grp => new ProductionViewModel
                    {
                        WIPData = Math.Round(grp.Sum(x => x.Alterations * 100)/ grp.Sum(x=> x.Production),2),
                        ProdData = Math.Round(grp.Average(x => x.Efficiency) * 100,2),
                        OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == grp.Key.Name).Select(x => x.Id).FirstOrDefault(),
                        OperatorName = grp.Key.Name
                    }).ToList();
                //}
                //else if(kpiViewModel.OperatorType == "Medium")
                //{
                    //inlineWIPOperatorSummaryDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line) && (x.Efficiency >= 0.50 && x.Efficiency < 0.75)).GroupBy(x => new { x.Location, x.Line, x.Unit, x.Name }).Select(grp => new ProductionViewModel
                    //{
                    //    WIPData = Math.Round(grp.Average(x => x.Alterations * 100) / grp.Average(x => x.Production),2),
                    //    ProdData = Math.Round(grp.Average(x => x.Efficiency) * 100,2),
                    //    OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == grp.Key.Name).Select(x => x.Id).FirstOrDefault(),
                    //    OperatorName = grp.Key.Name
                    //}).ToList();
                //}
                //else
                //{
                    //inlineWIPOperatorSummaryDataList = _rmgDbContext.EfficiencyWorker.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line) && (x.Efficiency >= 0.75)).GroupBy(x => new { x.Location, x.Line, x.Unit, x.Name }).Select(grp => new ProductionViewModel
                    //{
                    //    WIPData = Math.Round(grp.Average(x => x.Alterations * 100) / grp.Average(x => x.Production),2),
                    //    ProdData = Math.Round(grp.Average(x => x.Efficiency) * 100,2),
                    //    OperatorIndex = _rmgDbContext.OperatorMaster.Where(x => x.Name == grp.Key.Name).Select(x => x.Id).FirstOrDefault(),
                    //    OperatorName = grp.Key.Name
                    //}).ToList();
                //}

                
                //foreach (var element in inlineWIPOperatorSummaryDataList)
                //{
                //    DHUEfficiencyChartViewModel viewModel = new DHUEfficiencyChartViewModel();
                //    DHUMarkerViewModel dHUMarkerViewModel = new DHUMarkerViewModel();
                //    dHUMarkerViewModel.radius = 8;
                //    dHUMarkerViewModel.symbol = "circle";
                //    viewModel.marker = dHUMarkerViewModel;
                //    viewModel.name = string.Join("","Op",element.OperatorIndex);
                //    string color = "";
                //    Object[] arrayObject = new Object[2];
                //    List<object[]> objectList = new List<object[]>();
                //    if (kpiViewModel.OperatorType == "Low") 
                //    {
                //        if (element.ProdData >= 0 && element.ProdData < 50)
                //        {
                //            arrayObject[0] = element.WIPData;
                //            arrayObject[1] = element.ProdData;
                //            color = "#e0301e";
                //        }
                //    }
                //    else if(kpiViewModel.OperatorType == "Medium")
                //    {
                //        if (element.ProdData >= 50 && element.ProdData < 75)
                //        {
                //            arrayObject[0] = element.WIPData;
                //            arrayObject[1] = element.ProdData;
                //            color = "#ffb600";
                //        }
                //    }
                //    else
                //    {
                //        if (element.ProdData >= 75 && element.ProdData <= 100)
                //        {
                //            arrayObject[0] = element.WIPData;
                //            arrayObject[1] = element.ProdData;
                //            color = "#175d2d";
                //        }
                //    }
                //    objectList.Add(arrayObject);
                //    viewModel.data = objectList;
                //    viewModel.color = color;
                //    chartViewModels.Add(viewModel);
                //}
            }
            //inlineWIPOperatorSummaryDataList = inlineWIPOperatorSummaryDataList.OrderBy(x => x.ProdData).ToList();
            List<EfficiencyDefectViewModel_New> seriesData = new List<EfficiencyDefectViewModel_New>();
            List<EfficiencyDefectModifiedDataSet> lowEfficiency = new List<EfficiencyDefectModifiedDataSet>();
            List<EfficiencyDefectModifiedDataSet> moderateEfficiency = new List<EfficiencyDefectModifiedDataSet>();
            List<EfficiencyDefectModifiedDataSet> highEfficiency = new List<EfficiencyDefectModifiedDataSet>();
            foreach (var element in inlineWIPOperatorSummaryDataList)
            {
                if (element.ProdData <= 100)
                {
                    EfficiencyDefectModifiedDataSet dataSet = new EfficiencyDefectModifiedDataSet();
                    if (element.ProdData >= 0 && element.ProdData <= 50)
                    {
                        dataSet.x = element.WIPData;
                        dataSet.y = element.ProdData;
                        dataSet.name = element.OperatorName;
                        lowEfficiency.Add(dataSet);
                    }
                    else if (element.ProdData >= 51 && element.ProdData <= 75)
                    {
                        dataSet.x = element.WIPData;
                        dataSet.y = element.ProdData;
                        dataSet.name = element.OperatorName;
                        moderateEfficiency.Add(dataSet);
                    }
                    else if (element.ProdData >= 76 && element.ProdData <= 100)
                    {
                        dataSet.x = element.WIPData;
                        dataSet.y = element.ProdData;
                        dataSet.name = element.OperatorName;
                        highEfficiency.Add(dataSet);
                    }
                }

            }
            seriesData.Add(new EfficiencyDefectViewModel_New
            {
                name = "Low",
                showInLegend = false,
                color = "#e0301e",
                data = lowEfficiency
            });
            seriesData.Add(new EfficiencyDefectViewModel_New
            {
                name = "Moderate",
                showInLegend = false,
                color = "#ffb600",
                data = moderateEfficiency
            });
            seriesData.Add(new EfficiencyDefectViewModel_New
            {
                name = "High",
                showInLegend = false,
                color = "#175d2d",
                data = highEfficiency
            });
            return Json(new {
                chartViewModels = seriesData
            });
        }
    }
}
