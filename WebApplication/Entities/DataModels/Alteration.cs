using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("Alteration")]
    public class Alteration
    {
        [Key]
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string Day { get; set; }
        public double Unit { get; set; }
        public string Location { get; set; }
        public double Line { get; set; }
        public string Parameter { get; set; }
        public double Data { get; set; }
        public string DataUnit { get; set; }
        public double DefectHoles { get; set; }
        public double SeamPuckering { get; set; }
        public double WrongMeasurement { get; set; }
        public double SkipStitch { get; set; }
        public double UnevenStitch { get; set; }
        public double OilSpot { get; set; }
    }
}
