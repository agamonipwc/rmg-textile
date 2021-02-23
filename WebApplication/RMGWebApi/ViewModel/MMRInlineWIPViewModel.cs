using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.ViewModel
{
    public class MMRInlineWIPViewModel
    {
        public string name { get; set; }
        public List<double> data { get; set; }
    }
    public class MMRInlineWIPParameter
    {
        public double mmrValue { get; set; }
        public double wipValue { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
    }
    public class MMRInlineMonthlyViewModel
    {
        public string month { get; set; }
        public double mmrdata { get; set; }
        public double wipdata { get; set; }
    }
    public class MMRWIPChartData
    {
        public string name { get; set; }
        public List<double> data { get; set; }
}
}
