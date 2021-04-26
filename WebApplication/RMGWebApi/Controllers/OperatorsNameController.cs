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
    public class OperatorsNameController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public OperatorsNameController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(OperatorsNameEfficiencyViewModel operatorsNameViewModel)
        {
            List<OperatorsDetails> operatorsDetails = new List<OperatorsDetails>();
            switch (operatorsNameViewModel.EfficiencyLevel)
            {
                case "Low":
                    operatorsDetails = _rmgDbContext.EfficiencyWorker.Where(x => x.Efficiency >= 0.0 && x.Efficiency <= 0.50).GroupBy(x=> new { x.Name, x.Machine, x.Line, x.Unit, x.Location, x.Operation}).Select(operators => new OperatorsDetails
                    {
                        Name = operators.Key.Name,
                        OperationName = operators.Key.Operation,
                        Machine = operators.Key.Machine,
                        Line = _rmgDbContext.Line.Where(x=> x.Id == operators.Key.Line).Select(x=> x.Name).FirstOrDefault(),
                        Unit = _rmgDbContext.Unit.Where(x => x.Id == operators.Key.Unit).Select(x => x.Name).FirstOrDefault(),
                        Location = _rmgDbContext.Location.Where(x => x.Id == operators.Key.Location).Select(x => x.Name).FirstOrDefault(),
                    }).ToList();
                    break;
                case "Moderate":
                    operatorsDetails = _rmgDbContext.EfficiencyWorker.Where(x => x.Efficiency >= 0.51 && x.Efficiency <= 0.75).GroupBy(x => new { x.Name, x.Machine, x.Line, x.Unit, x.Location, x.Operation }).Select(operators => new OperatorsDetails
                    {
                        Name = operators.Key.Name,
                        OperationName = operators.Key.Operation,
                        Machine = operators.Key.Machine,
                        Line = _rmgDbContext.Line.Where(x => x.Id == operators.Key.Line).Select(x => x.Name).FirstOrDefault(),
                        Unit = _rmgDbContext.Unit.Where(x => x.Id == operators.Key.Unit).Select(x => x.Name).FirstOrDefault(),
                        Location = _rmgDbContext.Location.Where(x => x.Id == operators.Key.Location).Select(x => x.Name).FirstOrDefault(),
                    }).ToList();
                    break;
                case "High":
                    operatorsDetails = _rmgDbContext.EfficiencyWorker.Where(x => x.Efficiency >= 0.76 && x.Efficiency <= 1.10).GroupBy(x => new { x.Name, x.Machine, x.Line, x.Unit, x.Location, x.Operation }).Select(operators => new OperatorsDetails
                    {
                        Name = operators.Key.Name,
                        OperationName = operators.Key.Operation,
                        Machine = operators.Key.Machine,
                        Line = _rmgDbContext.Line.Where(x => x.Id == operators.Key.Line).Select(x => x.Name).FirstOrDefault(),
                        Unit = _rmgDbContext.Unit.Where(x => x.Id == operators.Key.Unit).Select(x => x.Name).FirstOrDefault(),
                        Location = _rmgDbContext.Location.Where(x => x.Id == operators.Key.Location).Select(x => x.Name).FirstOrDefault(),
                    }).ToList();
                    break;
            }
            
            return Json(new
            {
                operatorsDetails = operatorsDetails,
                statusCode = 200
            });
        }
    }
}
