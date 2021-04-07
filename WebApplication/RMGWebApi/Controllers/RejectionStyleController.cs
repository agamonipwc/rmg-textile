using Entities;
using Entities.DataModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RMGWebApi.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RejectionStyleController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public RejectionStyleController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            List<ProductionViewModel> rejectionsStyleDataList = new List<ProductionViewModel>();
            List<RejectionStyleDataModel> rejectionStyleDataModel = new List<RejectionStyleDataModel>();
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            DateTime? endDate = Convert.ToDateTime(kpiViewModel.EndDate);
            if (kpiViewModel.Location.Count > 0 && kpiViewModel.Unit.Count > 0 && kpiViewModel.Line.Count > 0)
            {
                rejectionsStyleDataList = _rmgDbContext.RejectionStyle.Where(x => x.Date >= startDate && x.Date <= endDate && kpiViewModel.Location.Contains(x.Location) && kpiViewModel.Unit.Contains(x.Unit) && kpiViewModel.Line.Contains(x.Line)).GroupBy(x => new { x.Style }).Select(grp => new ProductionViewModel 
                {
                    Style = grp.Key.Style,
                    SumProduction = grp.Average(x => x.Production),
                    SumRejection = grp.Average(x => x.Rejection)
                }).ToList();
            }
            var query = (from x in rejectionsStyleDataList
                         select new EfficiencyParameters
                         {
                             efficiency = Math.Round(((x.SumRejection / x.SumProduction) * 100)),
                             StyleName = x.Style
                         }).ToList();
            List<string> categories = new List<string>();
            foreach(var element in query)
            {
                categories.Add(element.StyleName);
                if(element.efficiency < 2)
                {
                    rejectionStyleDataModel.Add(new RejectionStyleDataModel
                    {
                        y = element.efficiency,
                        color = "#175d2d"
                    });
                }
                if (element.efficiency >= 2 && element.efficiency <= 5)
                {
                    rejectionStyleDataModel.Add(new RejectionStyleDataModel
                    {
                        y = element.efficiency,
                        color = "#ffb600"
                    });
                }
                if (element.efficiency > 5 && element.efficiency <= 15)
                {
                    rejectionStyleDataModel.Add(new RejectionStyleDataModel
                    {
                        y = element.efficiency,
                        color = "#e0301e"
                    });
                }
                //if (element.efficiency >= 2)
                //{

                //}
            }
            return Json(new {
                data = rejectionStyleDataModel,
                categories = categories
            });
        }
    }
}
