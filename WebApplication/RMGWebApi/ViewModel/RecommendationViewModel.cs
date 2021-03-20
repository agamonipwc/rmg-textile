using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.ViewModel
{
    public class RecommendationViewModel
    {
        public int KPIId { get; set; }
        public int RecommendationId { get; set; }
    }

    public class OperatorsNameEfficiencyViewModel
    {
        public string EfficiencyLevel { get; set; }
    }
    public class OperatorsDetails
    {
        public string Name { get; set; }
        public string Machine { get; set; }
        public string Unit { get; set; }
        public string Location { get; set; }
        public string Line { get; set; }
    }
}
