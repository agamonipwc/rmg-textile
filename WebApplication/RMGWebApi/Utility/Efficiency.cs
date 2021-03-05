using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.Utility
{
    public class EfficiencyParameters
    {
        public double efficiency { get; set; }
        public string Year { get; set; }
        public string Month { get; set; }
        public string Dailydate { get; set; }
    }
    public class EfficiencyViewModel
    {
        public string name { get; set; }
        public List<double> data { get; set; }
        public string type { get; set; }
        public dynamic tooltip { get; set; }
    }
    public class EfficiencyWeitageViewModel
    {
        public string name { get; set; }
        public List<double> data { get; set; }
        public string type { get; set; }
        public int yAxis { get; set; }
        public dynamic tooltip { get; set; }
        public string color { get; set; }
    }
}
