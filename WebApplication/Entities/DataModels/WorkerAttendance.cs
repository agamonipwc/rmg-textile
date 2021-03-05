using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("WorkerAttendance")]
    public class WorkerAttendance
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public DateTime Date { get; set; }
        public double Unit { get; set; }
        public double Location { get; set; }
        public double Line { get; set; }
        public double Attendance { get; set; }
    }
}
