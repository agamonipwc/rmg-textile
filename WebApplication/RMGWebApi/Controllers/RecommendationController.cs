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
    public class RecommendationController : Controller
    {
        private readonly RepositoryContext _rmgDbContext;
        public RecommendationController(RepositoryContext rmgDbContext)
        {
            _rmgDbContext = rmgDbContext;
        }
        [HttpPost]
        public JsonResult Post(RecommendationViewModel recommendationView)
        {
            var listOfAllRecommendations = _rmgDbContext.Recommendation.Where(x => x.KPIId == recommendationView.KPIId).ToList();
            return Json(new {
                allRecommendations = listOfAllRecommendations
            });
        }
    }
}
