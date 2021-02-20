using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("ProdData")]
    public class ProdData
    {
        [Key]
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public double MachineryL1 { get; set; }
        public double MachineryL2 { get; set; }
        public double MachineryL3 { get; set; }
        public double MachineryL4 { get; set; }
        public double MachineryL5 { get; set; }
        public double WorkingL1 { get; set; }
        public double WorkingL2 { get; set; }
        public double WorkingL3 { get; set; }
        public double WorkingL4 { get; set; }
        public double WorkingL5 { get; set; }
        public double ProductionL1 { get; set; }
        public double ProductionL2 { get; set; }
        public double ProductionL3 { get; set; }
        public double ProductionL4 { get; set; }
        public double ProductionL5 { get; set; }
        public double WorkInProgressL1 { get; set; }
        public double WorkInProgressL2 { get; set; }
        public double WorkInProgressL3 { get; set; }
        public double WorkInProgressL4 { get; set; }
        public double WorkInProgressL5 { get; set; }
        public double OperatorsL1 { get; set; }
        public double OperatorsL2 { get; set; }
        public double OperatorsL3 { get; set; }
        public double OperatorsL4 { get; set; }
        public double OperatorsL5 { get; set; }
        public double HelpersL1 { get; set; }
        public double HelpersL2 { get; set; }
        public double HelpersL3 { get; set; }
        public double HelpersL4 { get; set; }
        public double HelpersL5 { get; set; }
        public double CheckersL1 { get; set; }
        public double CheckersL2 { get; set; }
        public double CheckersL3 { get; set; }
        public double CheckersL4 { get; set; }
        public double CheckersL5 { get; set; }
        public double RejectionL1 { get; set; }
        public double RejectionL2 { get; set; }
        public double RejectionL3 { get; set; }
        public double RejectionL4 { get; set; }
        public double RejectionL5 { get; set; }
        public double AlterationsL1 { get; set; }
        public double AlterationsL2 { get; set; }
        public double AlterationsL3 { get; set; }
        public double AlterationsL4 { get; set; }
        public double AlterationsL5 { get; set; }
        public double DefectsPerHundredUnitL1 { get; set; }
        public double DefectsPerHundredUnitL2 { get; set; }
        public double DefectsPerHundredUnitL3 { get; set; }
        public double DefectsPerHundredUnitL4 { get; set; }
        public double DefectsPerHundredUnitL5 { get; set; }
        public double UnplannedDowntimeL1 { get; set; }
        public double UnplannedDowntimeL2 { get; set; }
        public double UnplannedDowntimeL3 { get; set; }
        public double UnplannedDowntimeL4 { get; set; }
        public double UnplannedDowntimeL5 { get; set; }
        public string DowntimeL1 { get; set; }
        public string DowntimeL2 { get; set; }
        public string DowntimeL3 { get; set; }
        public string DowntimeL4 { get; set; }
        public string DowntimeL5 { get; set; }
        public string QualityL1 { get; set; }
        public string QualityL2 { get; set; }
        public string QualityL3 { get; set; }
        public string QualityL4 { get; set; }
        public string QualityL5 { get; set; }
    }
}
