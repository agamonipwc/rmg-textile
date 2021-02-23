using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("WIP")]
    public class WIP
    {
        [Key]
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string Day { get; set; }
        public double Unit { get; set; }
        public double Location { get; set; }
        public double Line { get; set; }
        public string Parameter { get; set; }
        public double Data { get; set; }
        public string DataUnit { get; set; }
    }
}
