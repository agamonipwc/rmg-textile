using Contracts;
using Entities;
using Entities.DataModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Repository
{
    public class UserDetailsRepository : RepositoryBase<UserDetails>, IUserDetailsRepository
    {
        public UserDetailsRepository(RepositoryContext repositoryContext)
            : base(repositoryContext)
        {
        }
    }
}
