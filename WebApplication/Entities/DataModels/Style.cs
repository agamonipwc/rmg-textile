using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("Style")]
    public class Style
    {
        [Key]
        public int Id { get; set; }
        public string StyleName { get; set; }
        public string Buyer { get; set; }
        public double OrderQty { get; set; }
        public DateTime? OrderRcvngDate { get; set; }
        public DateTime? ShipmentDate { get; set; }
        public string Item { get; set; }
        public double SewingSAM { get; set; }
        public double PlannedOperator { get; set; }
        public double PlannedHelpers { get; set; }
        public double PlannedCheckers { get; set; }
        public double PlannedProduction { get; set; }
        public double Line { get; set; }
    }
}
