using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.ViewModel
{
    public class CapacityUtilizationSeries {
        public string name { get; set; }
        public bool colorByPoint { get; set; }
        public List<CapacityUtilizationDrilldown> data { get; set; }
    }

    public class CapacityUtilizationDrilldown {
        public string drilldown { get; set; }
        public int y { get; set; }
    }

    public class CapacityUtilizationNested
    {
        public string type { get; set; }
        public string id { get; set; }
        public List<int> nestedData { get; set; }
    }

    public class CapacityUtilizationParameter
    {
        public int parameterValue { get; set; }
        public string line { get; set; }
    }
}
