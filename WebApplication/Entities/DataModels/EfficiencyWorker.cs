using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("EfficiencyWorker")]
    public class EfficiencyWorker
    {
        [Key]
        public int Id { get; set; }
        public double OperationIndex { get; set; }
        public DateTime Date { get; set; }
        public double Location { get; set; }
        public double Unit { get; set; }
        public double Line { get; set; }
        public double WorkingMins { get; set; }
        public string Operation { get; set; }
        public string Category { get; set; }
        public string Name { get; set; }
        public string Machine { get; set; }
        public double Production { get; set; }
        public string PUnit { get; set; }
        public double Alterations { get; set; }
        public string AlUnit { get; set; }
        public string AlterationReason1 { get; set; }
        public double PcsFound1 { get; set; }
        public string AlterationReason2 { get; set; }
        public double PcsFound2 { get; set; }
        public string AlterationReason3 { get; set; }
        public double PcsFound3 { get; set; }
        public string AlterationReason4 { get; set; }
        public double PcsFound4 { get; set; }
        public string AlterationReason5 { get; set; }
        public double PcsFound5 { get; set; }
        public double WIP { get; set; }
        public string WIPUnit { get; set; }
        public double FeedingDowntime { get; set; }
        public string FDUnit { get; set; }
        public double MachineDowntime { get; set; }
        public string MDUnit { get; set; }
        public double Efficiency { get; set; }
    }
}
