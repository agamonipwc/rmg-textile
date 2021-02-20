using Contracts;
using Entities.DataModels;
using Microsoft.AspNetCore.Mvc;
using RMGWebApi.Utility;
using System;
using System.Collections.Generic;

namespace RMGWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[EnableCors("CorsPolicy")]
    public class RegistrationController : Controller
    {
        private IRepositoryWrapper _repoWrapper;
        private PasswordEncryption _passwordEncryption;
        public RegistrationController(IRepositoryWrapper repoWrapper)
        {
            _repoWrapper = repoWrapper;
        }
        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            //var user = new UserDetails();
            //_repoWrapper.UserDetails.Create(user);
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public JsonResult Post(UserDetails user)
        {
            CustomResponse response = new CustomResponse();
            response.statusCode = 403;
            try
            {
                if (user != null)
                {
                    if (string.IsNullOrEmpty(user.Name))
                    {
                        response.message = string.Join(' ', nameof(user.Name), "Name can not be blank.");
                        return Json(response);
                    }
                    if (string.IsNullOrEmpty(user.Email))
                    {
                        response.message = string.Join(' ', nameof(user.Name), "Email Address can not be blank.");
                        return Json(response);
                    }
                    if (string.IsNullOrEmpty(user.Username))
                    {
                        response.message = string.Join(' ', nameof(user.Username), "User name can not be blank.");
                        return Json(response);
                    }
                    if (string.IsNullOrEmpty(user.Password))
                    {
                        response.message = "Password can not be blank.";
                        return Json(response);
                    }
                    if (string.IsNullOrEmpty(user.ConfirmPassword))
                    {
                        response.message = "Confirm Password can not be blank.";
                        return Json(response);
                    }
                    if (user.Password.Length < 8 && user.Password.Length > 15)
                    {
                        response.message = "Password must be between 8 to 15 characters";
                        return Json(response);
                    }
                    if (user.ConfirmPassword.Length < 8 && user.ConfirmPassword.Length > 15)
                    {
                        response.message = "Confirm Password must be between 8 to 15 characters";
                        return Json(response);
                    }
                    if (user.ConfirmPassword != user.Password)
                    {
                        response.message = "Password and Confirm Password must be equal.";
                        return Json(response);
                    }
                    user.Password = _passwordEncryption.CreateHashPassword(user.Password);
                    user.ConfirmPassword = _passwordEncryption.CreateHashPassword(user.ConfirmPassword);
                    user.CreatedOn = DateTime.Now.ToString();
                    user.CreatedBy = user.Username;
                    _repoWrapper.UserDetails.Create(user);
                    _repoWrapper.Save();
                    response.statusCode = 200;
                    response.message = "Registration is successfull";
                }
                else
                {
                    response.message = "Model is not valid";
                    return Json(response);
                }
                return Json(response);
            }
            catch(Exception ex)
            {
                response.message = ex.Message;
                response.statusCode = 500;
                return Json(response);
            }
            
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
        
    }
}
