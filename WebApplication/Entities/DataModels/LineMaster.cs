using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("Line")]
    public class Line
    {
        [Key]
        public int Id{get; set; }
        public string Name { get; set; }
        public int LocationId { get; set; }
        public double UnitId { get; set; }
    }
}
