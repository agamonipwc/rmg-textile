using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.ViewModel
{
    public class RejectionSeries
    {
        public string name { get; set; }
        public List<RejectionMonthDrilldown> data { get; set; }
    }
    public class RejectionMonthDrilldown
    {
        public string name { get; set; }
        public int y { get; set; }
        public string drilldown { get; set; }
    }

    public class RejectionDrilldownMonthSeries
    {
        public string id { get; set; }
        public string name { get; set; }
        //public List<Tuple<string, int>> data { get; set; }
        public List<object[]> data { get; set; }
    }
}
