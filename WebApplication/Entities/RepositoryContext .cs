using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities
{
    public  class RepositoryContext : DbContext
    {
        public RepositoryContext(DbContextOptions options): base(options)
        {
        }
        public DbSet<UserDetails> UserDetails { get; set; }
        public DbSet<Line> Line { get; set; }
        public DbSet<Location> Location { get; set; }
        public DbSet<Unit> Unit { get; set; }
        public DbSet<Production> Production { get; set; }
        public DbSet<StyleData> StyleData { get; set; }
    }
}
