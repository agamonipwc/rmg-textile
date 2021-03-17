using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("TimeStudy")]
    public class TimeStudy
    {
        [Key]
        public int Id { get; set; }
        public double SlNo { get; set; }
        public string OperationDescription { get; set; }
        public double Operator { get; set; }
        public string Machine { get; set; }
        public double SMV { get; set; }
        public double T1 { get; set; }
        public double T2 { get; set; }
        public double T3 { get; set; }
        public double T4 { get; set; }
        public double T5 { get; set; }
        public double T6 { get; set; }
        public double T7 { get; set; }
        public double T8 { get; set; }
        public double T9 { get; set; }
        public double T10 { get; set; }
        public double Average { get; set; }
        public double BHT { get; set; }
        public double MD_PF { get; set; }
        public double ASCT { get; set; }
        public double SAM { get; set; }
        public double PlannedProduction { get; set; }
    }
}
