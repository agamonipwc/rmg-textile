using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMGWebApi.Utility
{
    public static class CustomizeColorCode
    {
        public static string GetRandomColors()
        {
            Random rnd = new Random();
            var color = String.Format("#{0:X6}", rnd.Next(0x1000000));
            return color;
        }
    }
}
