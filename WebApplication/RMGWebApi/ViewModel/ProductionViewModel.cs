using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.ViewModel
{
    public class ProductionSeries
    {
        public string name { get; set; }
        public List<ProductionMonthDrilldown> data { get; set; }
    }
    public class ProductionMonthDrilldown
    {
        public string name { get; set; }
        public int y { get; set; }
        public string drilldown { get; set; }
    }

    public class ProductionDrilldownMonthSeries
    {
        public string id { get; set; }
        public string name { get; set; }
        public List<object[]> data { get; set; }
        //public List<int> data { get; set; }
    }


    public class ProductionDrilldownObtainedMonthSeries
    {
        public string id { get; set; }
        public string name { get; set; }
        //public object[] data { get; set; }
        public int data { get; set; }
    }
}
