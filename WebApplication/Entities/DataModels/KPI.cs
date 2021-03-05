using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("KPI")]
    public class KPI
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int Module { get; set; }
        public int Department { get; set; }
    }
}
