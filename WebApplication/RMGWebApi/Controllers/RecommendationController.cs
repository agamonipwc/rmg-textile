using Entities;
using Entities.DataModels;
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
            List<Recommendation> listOfAllRecommendations = new List<Recommendation>();
            if (recommendationView.KPIId != 0 && recommendationView.RecommendationId != 0)
            {
                listOfAllRecommendations = _rmgDbContext.Recommendation.Where(x => x.KPI == recommendationView.KPIId && x.Id == recommendationView.RecommendationId).ToList();
            }
            else
            {
                listOfAllRecommendations = _rmgDbContext.Recommendation.Where(x => x.KPI == recommendationView.KPIId).ToList();
            }
            //List<string> operatorsName = new List<string>();
            //if(recommendationView.RecommendationId == 6)
            //{
            //    operatorsName = _rmgDbContext.EfficiencyWorker.Where(x => x.Efficiency<=0.50).Select(x => x.Name).Distinct().ToList();
            //}
            //else
            //{
            //    operatorsName = _rmgDbContext.EfficiencyWorker.Where(x => x.Efficiency >= 0.51 && x.Efficiency<= 0.75).Select(x => x.Name).Distinct().ToList();
            //}
            return Json(new {
                allRecommendations = listOfAllRecommendations,
                //operatorsName = operatorsName,
                statusCode = 200
            });
        }

        
    }
}
