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
    public class MachineDowntimeTabularController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public MachineDowntimeTabularController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }

        [HttpPost]
        public JsonResult Post(KPIViewModel kpiViewModel)
        {
            return Json(new { });
        }
    }
}
