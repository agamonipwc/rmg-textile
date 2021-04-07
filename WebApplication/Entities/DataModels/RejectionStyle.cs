using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("RejectionStyle")]
    public class RejectionStyle
    {
        [Key]
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public double Location { get; set; }
        public double Unit{ get; set; }
        public double Line { get; set; }
        public string Style { get; set; }
        public double Rejection { get; set; }
        public double Production { get; set; }
    }
}
