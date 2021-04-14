using Contracts;
using Entities.DataModels;
using Microsoft.AspNetCore.Mvc;
using RMGWebApi.Utility;
using System;

namespace RMGWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private PasswordEncryption _passwordEncryption = new PasswordEncryption();
        private IRepositoryWrapper _repoWrapper;
        public LoginController(IRepositoryWrapper repoWrapper)
        {
            _repoWrapper = repoWrapper;
        }
        [HttpPost]
        public JsonResult Post(UserDetails user)
        {
            CustomResponse response = new CustomResponse();
            response.statusCode = 403;
            try
            {
                if (user != null)
                {
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
                    //string password = _passwordEncryption.CreateHashPassword(user.Password);
                    //var userloginStatus = _repoWrapper.UserDetails.FindByCondition(x=> x.Username == user.Username && x.Password == password);
                    if(user.Username == "rmguser" && user.Password == "rmg@user123")
                    {
                        response.statusCode = 200;
                        response.message = "Login is successful";
                    }
                    else
                    {
                        response.statusCode = 404;
                        response.message = "User is not found with given credentials.";
                    }
                }
                else
                {
                    response.message = "Model is not valid.";
                    return Json(response);
                }
                return Json(response);
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
                response.statusCode = 500;
                return Json(response);
            }

        }
    }
}
