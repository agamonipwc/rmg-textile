using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.ViewModel
{
    public class EfficiencyViewModel
    {
        public string name { get; set; }
        public bool showInLegend { get; set; }
        public string color { get; set; }
        public List<object[]> data { get; set; }
    }


    public class EfficiencyViewModel_New
    {
        public string name { get; set; }
        public bool showInLegend { get; set; }
        public string color { get; set; }
        public List<ModifiedDataSet> data { get; set; }
    }

    public class ModifiedDataSet
    {
        public int x { get; set; }
        public int y { get; set; }
        public string name { get; set; }
    }


    public class HistoricalDataViewModel {
        public double y { get; set; }
        public string color { get; set; }
    }

}
