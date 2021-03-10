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
    public class MasterDataController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public MasterDataController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }

        [HttpGet]
        public JsonResult Get()
        {
            var locationMasterData = _rmgDbContext.Location.ToList();
            var unitMasterData = _rmgDbContext.Unit.ToList();
            return Json(new
            {
                locationMasterData = locationMasterData,
                unitMasterData = unitMasterData,
                statusCode = 200
            });
        }
    }
}
