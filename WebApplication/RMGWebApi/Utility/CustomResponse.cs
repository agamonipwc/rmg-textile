using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace RMGWebApi.Utility
{
    public class CustomResponse
    {
        public string message { get; set; }
        public int statusCode { get; set; }
        public dynamic data { get; set; }
    }

    public class PasswordEncryption
    {
        public string CreateHashPassword(string password)
        {
            var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            var hash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            return hash;
        }
    }
}
