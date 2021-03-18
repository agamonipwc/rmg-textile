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
}
