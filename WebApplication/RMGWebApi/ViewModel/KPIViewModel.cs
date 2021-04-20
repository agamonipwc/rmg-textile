using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi
{
    public class KPIViewModel
    {
        public List<double> Line { get; set; }
        public List<double> Unit{ get; set; }
        public List<double> Location { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string MachineName { get; set; }
        public string StyleName { get; set; }
        public string OperatorType { get; set; }
    }

    public class DateRangeViewModel
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }

    public class WorkingHoursViewModel
    {
        public double WorkingHrsData { get; set; }
        public double Line { get; set; }
        public double Unit { get; set; }
        public double Location { get; set; }
        public DateTime Date { get; set; }
    }

    public class CheckersViewModel
    {
        public double CheckersData { get; set; }
        public double Location { get; set; }
        public DateTime Date { get; set; }
        public double Line { get; set; }
        public double Unit { get; set; }
    }

    public class AlterationViewModel
    {
        public double AlterationData { get; set; }
        public double Location { get; set; }
        public DateTime Date { get; set; }

        public double Line { get; set; }
        
        public double Unit { get; set; }
    }

    public class OperatorViewModel
    {
        public double OperatorData { get; set; }
        public double Line { get; set; }
        public double Unit { get; set; }
        public double Location { get; set; }
        public DateTime Date { get; set; }
    }
    public class HelpersViewModel
    {
        public double HelperData { get; set; }
        
        public double Line { get; set; }
        public double Unit { get; set; }
        public double Location { get; set; }
        public DateTime Date { get; set; }
    }
    public class MachineryViewModel
    {
        public double MechineryData { get; set; }
        public double Location { get; set; }
        public DateTime Date { get; set; }

        public double Line { get; set; }
        public double Unit { get; set; }
    }
    public class WIPViewModel
    {
        public double WIPData { get; set; }
        public double Location { get; set; }
        public DateTime Date { get; set; }

        public double Line { get; set; }
        public double Unit { get; set; }
    }

    public class MachineDowntimeViewModel
    {
        public double Line { get; set; }
        public double Unit { get; set; }
        public double Location { get; set; }
        public DateTime Date { get; set; }
        public double MachineDownTime { get; set; }
        public double FeedingDownTime { get; set; }
        public string MachineName { get; set; }
        public string ColorCode { get; set; }
        public double WorkingMins { get; set; }
        public int TotalMachineCount { get; set; }
    }
    public class ProductionViewModel
    {
        public int OperatorIndex { get; set; }
        public double ProdData { get; set; }
        public double WIPData { get; set; }
        public double StyleWiseWIPData { get; set; }
        public double Line { get; set; }
        public double Unit { get; set; }
        public double Location { get; set; }
        public string Style { get; set; }
        public DateTime Date { get; set; }
        public double AlterationData { get; set; }
        public string OperationDescription { get; set; }
        public double TotalOperatorsCount { get; set; }
        public double PresentOperatorsCount { get; set; }
        public double SumProduction { get; set; }
        public double SumRejection { get; set; }
        public string OperatorName { get; set; }
        public double SumDefectCount { get; set; }
        public double DefectCount1Data { get; set; }
        public string DefectReason1 { get; set; }
        public double DefectCount2Data { get; set; }
        public string DefectReason2 { get; set; }
        public double DefectCount3Data { get; set; }
        public string DefectReason3 { get; set; }
        public double DefectCount4Data { get; set; }
        public string DefectReason4 { get; set; }
        public double DefectCount5Data { get; set; }
        public string DefectReason5 { get; set; }
    }

    public class InlineWIPStyleViewModel
    {
        public double Line { get; set; }
        public double Unit { get; set; }
        public string Style { get; set; }
        public double WIPData { get; set; }
    }
    public class DefectViewModel
    {
        public double DefectCount { get; set; }
        public string DefectName { get; set; }
        public double ProductionData { get; set; }
        public double DHU { get; set; }
        public DateTime DailyDate { get; set; }
    }

    public class RejectionViewModel
    {
        public double RejectionData { get; set; }
        public double Line { get; set; }
        public double Location { get; set; }
        public DateTime Date { get; set; }
        public double Unit { get; set; }
    }

    public class InlineWIPViewModel
    {
        public string StyleName { get; set; }
        public List<LinewiseWIPViewModel> StyleWIPViewModel { get; set; }
    }

    public class LinewiseWIPViewModel
    {
        public double LineWIPPercentage { get; set; }
        public string LineName { get; set; }
        public string Unit { get; set; }
        public double LineWIPActualValue { get; set; }
    }

    public class OperatorsLinewiseWIPViewModel
    {
        public string OperatorName { get; set; }
        public string LineUnitName { get; set; }
        public string Unit { get; set; }
        public double LineWIPActualValue { get; set; }
        public double LineWIPLevelValue { get; set; }
        public string StyleName { get; set; }
        //public int GroupCount { get; set; }
    }

    public class DHUViewModel
    {
        public double DHUData { get; set; }

        public double Location { get; set; }
        public DateTime Date { get; set; }
        public double Line { get; set; }
        public double Unit { get; set; }
    }

    public class DHUTopFiveDefects
    {
        public string name { get; set; }
        public List<double> data { get; set; }
        public string color { get; set; }
    }

    public class CurveFitAnalysis
    {
        public DateTime DailyDate { get; set; }
        public int MachineDowntimeValue { get; set; }
    }
    
    public class DHUEfficiencyChartViewModel
    {
        public string name { get; set; }
        public bool showInLegend { get; set; }
        public string color { get; set; }
        public List<object[]> data { get; set; }
        public DHUMarkerViewModel marker { get; set; }
    }
    public class DHUMarkerViewModel
    {
        public string symbol { get; set; }
        public int radius { get; set; }
    }
}
