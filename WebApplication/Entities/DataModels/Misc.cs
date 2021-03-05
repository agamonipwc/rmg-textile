using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("Misc")]
    public class Misc
    {
        [Key]
        public int Id { get; set; }
        public double Data { get; set; }
        public string Unit { get; set; }
        public string Parameter { get; set; }
    }
}
