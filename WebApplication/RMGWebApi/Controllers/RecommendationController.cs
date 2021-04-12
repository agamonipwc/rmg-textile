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
            List<string> recommendationIdList = new List<string>();
            if (!string.IsNullOrEmpty(recommendationView.RecommendationId))
            {
                recommendationIdList = recommendationView.RecommendationId.Split(',').ToList();
                if (recommendationView.KPIId != 0 && recommendationIdList.Count > 0)
                {
                    foreach (var element in recommendationIdList)
                    {
                        int recommendationId = Convert.ToInt32(element);
                        var selectedRecommendation = _rmgDbContext.Recommendation.Where(x => x.KPI == recommendationView.KPIId && x.Id == recommendationId).FirstOrDefault();
                        listOfAllRecommendations.Add(selectedRecommendation);
                    }
                }
            }
            else if(recommendationView.KPIId != 0)
            {
                listOfAllRecommendations = _rmgDbContext.Recommendation.Where(x => x.KPI == recommendationView.KPIId).ToList();
            }
            else
            {
                listOfAllRecommendations = _rmgDbContext.Recommendation.Where(x => x.KPI == recommendationView.KPIId).ToList();
            }
            return Json(new {
                allRecommendations = listOfAllRecommendations,
                statusCode = 200
            });
        }

        [HttpGet]
        public JsonResult Get()
        {
            var kpiMasterList = _rmgDbContext.KPI.ToList();
            return Json(new {
                data = kpiMasterList,
                statusCode = 200
            });
        }
    }
}
