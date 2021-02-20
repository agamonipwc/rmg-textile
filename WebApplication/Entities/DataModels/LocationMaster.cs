using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("Location")]
    public class Location
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
