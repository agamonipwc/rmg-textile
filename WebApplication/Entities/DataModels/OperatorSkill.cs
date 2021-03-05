using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("OperatorSkill")]
    public class OperatorSkill
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public double Line { get; set; }
        public double Skill1 { get; set; }
        public double Skill2 { get; set; }
        public double Skill3 { get; set; }
        public double Skill4 { get; set; }
        public double Skill5 { get; set; }
        public double Skill6 { get; set; }
        public double Skill7 { get; set; }
        public double Skill8 { get; set; }
        public double Skill9 { get; set; }
        public double Skill10 { get; set; }
        public double MultiskilledOperations { get; set; }
        public string MultiskilledOperator { get; set; }
    }
}
