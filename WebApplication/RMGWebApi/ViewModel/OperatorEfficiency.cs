using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.ViewModel
{
    public class OperatorEfficiency
    {
        public int OperatorIndex { get; set; }
        public double Efficiency { get; set; }
        public string OperatorName { get; set; }
    }

    public class OperatorDefect
    {
        public int OperatorIndex { get; set; }
        public double Defect { get; set; }
        public string OperatorName { get; set; }
    }
    public class OperatorCapacityUtilization
    {
        public int OperatorIndex { get; set; }
        public double CapapcityUtilization { get; set; }
        public string OperatorName { get; set; }
        public double ProductionData { get; set; }
        public string OperationName { get; set; }
        public int ActualProduction { get; set; }
        public double TotalOperators { get; set; }
        public double AbsentOperators { get; set; }
    }
    public class TimeStudyData
    {
        public double PlannedProduction { get; set; }
        public string  OperationDesc { get; set; }
    }
}
