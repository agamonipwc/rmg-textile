using Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RMGWebApi.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperatorEfficiencyController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public OperatorEfficiencyController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            DateTime? startDate = Convert.ToDateTime(kpiViewModel.StartDate);
            List<OperatorEfficiencyViewModel> operatorViewModels = new List<OperatorEfficiencyViewModel>();
            if(kpiViewModel.Location.Count > 0)
            {
                operatorViewModels = _rmgDbContext.EfficiencyWorker.Where(efficiencyworker => kpiViewModel.Location.Contains(efficiencyworker.Location) && efficiencyworker.Date == startDate).Select(ope=> new OperatorEfficiencyViewModel
                { 
                    OperatorName = _rmgDbContext.OperatorMaster.Where(x => x.Name == ope.Name).Select(x => x.Name).FirstOrDefault(),
                    OperatorIndex = _rmgDbContext.OperatorMaster.Where(x=> x.Name == ope.Name).Select(x=> x.Id).FirstOrDefault(),
                    Efficiency = Convert.ToInt32(ope.Production* (_rmgDbContext.TimeStudy.Where(x=> x.SlNo == ope.OperationIndex).Select(x=> x.SAM).FirstOrDefault())/ope.WorkingMins*1)
                }).ToList();
            }
            return Json(new
            {
                data = operatorViewModels,
                statusCode = 200
            });
        }
    }
}
