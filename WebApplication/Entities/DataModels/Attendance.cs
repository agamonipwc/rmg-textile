using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("Attendance")]
    public class Attendance
    {
        public double OperatorIndex { get; set; }
        public double Line { get; set; }
        public double Location { get; set; }
        public double Unit { get; set; }
        public string Category { get; set; }
        public string Machine { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string Attendence { get; set; }
        [Key]
        public int Id { get; set; }
    }
}
