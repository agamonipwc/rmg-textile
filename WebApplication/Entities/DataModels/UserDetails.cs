using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.DataModels
{
    [Table("UserDetails")]
    public class UserDetails
    {
        [Key]
        public int Id { get; set; }
        //[Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }
        //[Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
        //[Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }
        //[Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        //[Required(ErrorMessage = "Confirm Password is required")]
        public string ConfirmPassword { get; set; }
        public string CreatedOn { get; set; }
        public string CreatedBy { get; set; }
    }
}
