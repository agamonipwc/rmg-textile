using System;
using System.Collections.Generic;
using System.Text;

namespace Contracts
{
    public interface IRepositoryWrapper
    {
        IUserDetailsRepository UserDetails { get; }
        void Save();
    }
}
