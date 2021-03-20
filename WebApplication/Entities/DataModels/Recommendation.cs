using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("Recommendation")]
    public class Recommendation
    {
        [Key]
        public int Id { get; set; }
        public double KPI { get; set; }
        public string Reasons { get; set; }
        public string SubReasons { get; set; }
        public string Recommendations { get; set; }
    }
}
