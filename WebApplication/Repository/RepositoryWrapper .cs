using Contracts;
using Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Repository
{
    public class RepositoryWrapper : IRepositoryWrapper
    {
        private RepositoryContext _repoContext;
        private IUserDetailsRepository _userDetails;
        public IUserDetailsRepository UserDetails
        {
            get
            {
                if (_userDetails == null)
                {
                    _userDetails = new UserDetailsRepository(_repoContext);
                }
                return _userDetails;
            }
        }
        public RepositoryWrapper(RepositoryContext repositoryContext)
        {
            _repoContext = repositoryContext;
        }
        public void Save()
        {
            _repoContext.SaveChanges();
        }

    }
}
