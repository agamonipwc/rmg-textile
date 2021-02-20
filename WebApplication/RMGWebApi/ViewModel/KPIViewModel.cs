using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi
{
    public class KPIViewModel
    {
        public List<int> Year { get; set; }
        public List<int> Month { get; set; }
        public List<double> Line{ get; set; }
        //public List<string> Unit { get; set; }
        //public List<string> Location { get; set; }
    }
}
