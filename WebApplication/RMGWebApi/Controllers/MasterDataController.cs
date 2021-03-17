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
            var lineMasterData = _rmgDbContext.Line.ToList();
            return Json(new
            {
                locationMasterData = locationMasterData,
                unitMasterData = unitMasterData,
                lineMasterData = lineMasterData,
                statusCode = 200
            });
        }

        [HttpPost]
        public JsonResult Post(MasterDataViewModel dataViewModel)
        {
            if(dataViewModel.locations.Count > 0)
            {
                var locationData = _rmgDbContext.Line.Where(x => dataViewModel.locations.Contains(x.LocationId)).ToList();
                return Json(new
                {
                    statusCode = 200,
                    data = locationData
                });
            }
            else if(dataViewModel.locations.Count > 0 && dataViewModel.units.Count > 0)
            {
                var locationUnitData = _rmgDbContext.Line.Where(x => dataViewModel.units.Contains(x.UnitId) && dataViewModel.locations.Contains(x.LocationId)).ToList();
                return Json(new
                {
                    statusCode = 200,
                    data = locationUnitData
                });
            }
            else if(dataViewModel.units.Count > 0)
            {
                var unitData = _rmgDbContext.Line.Where(x => dataViewModel.units.Contains(x.UnitId)).ToList();
                return Json(new
                {
                    statusCode = 200,
                    data = unitData
                });
            }
            else
            {
                return Json(new
                {
                    statusCode = 404,
                });
            }
        }
    }
}
