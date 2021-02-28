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
        public List<double> Line { get; set; }
        public List<double> Unit{ get; set; }
    }

    public class WorkingHoursViewModel
    {
        public double WorkingHrsData { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public double Line { get; set; }
        public string Day { get; set; }
        public string MonthName { get; set; }
        public double Unit { get; set; }
    }

    public class CheckersViewModel
    {
        public double CheckersData { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public double Line { get; set; }
        public string Day { get; set; }
        public string MonthName { get; set; }
        public double Unit { get; set; }
    }

    public class AlterationViewModel
    {
        public double AlterationData { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public double Line { get; set; }
        public string Day { get; set; }
        public string MonthName { get; set; }
        public double Unit { get; set; }
    }

    public class OperatorViewModel
    {
        public double OperatorData { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public double Line { get; set; }
        public string Day { get; set; }
        public string MonthName { get; set; }
        public double Unit { get; set; }
    }
    public class HelpersViewModel
    {
        public double HelperData { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public double Line { get; set; }
        public string Day { get; set; }
        public string MonthName { get; set; }
        public double Unit { get; set; }
    }
    
    public class MachineryViewModel
    {
        public double MechineryData { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public double Line { get; set; }
        public string Day { get; set; }
        public string MonthName { get; set; }
        public double Unit { get; set; }
    }
    public class WIPViewModel
    {
        public double WIPData { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public double Line { get; set; }
        public string Day { get; set; }
        public string MonthName { get; set; }
        public double Unit { get; set; }
    }
    public class ProductionViewModel
    {
        public double ProdData { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public double Line { get; set; }
        public string Day { get; set; }
        public string MonthName { get; set; }
        public double Unit { get; set; }
    }

    public class RejectionViewModel
    {
        public double RejectionData { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public double Line { get; set; }
        public string Day { get; set; }
        public string MonthName { get; set; }
        public double Unit { get; set; }
    }

    public class StyleDataViewModel
    {
        public double StyleData { get; set; }
        public double Line { get; set; }
    }

    public class DHUViewModel
    {
        public double DHUData { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public double Line { get; set; }
        public string Day { get; set; }
        public string MonthName { get; set; }
        public double Unit { get; set; }
        public int DayFlag { get; set; }
    }
}
