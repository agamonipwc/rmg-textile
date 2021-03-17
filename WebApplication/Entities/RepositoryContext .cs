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
        public DbSet<WorkingHrs> WorkingHrs { get; set; }
        public DbSet<OperatorNos> OperatorNos { get; set; }
        public DbSet<Helpers> Helpers { get; set; }
        public DbSet<DHU> DHU { get; set; }
        public DbSet<Rejection> Rejection { get; set; }
        public DbSet<Machinery> Machinery { get; set; }
        public DbSet<WIP> WIP { get; set; }
        public DbSet<Alteration> Alteration { get; set; }
        public DbSet<Checkers> Checkers { get; set; }
        public DbSet<Misc> Misc { get; set; }
        public DbSet<UnplannedDowntime> UnplannedDowntime { get; set; }
        public DbSet<WorkerAttendance> WorkerAttendance { get; set; }
        public DbSet<OperatorSkill> OperatorSkill { get; set; }
        public DbSet<Module> Module { get; set; }
        public DbSet<KPI> KPI { get; set; }
        public DbSet<Department> Department { get; set; }
        public DbSet<Recommendation> Recommendation { get; set; }
        public DbSet<EfficiencyWorker> EfficiencyWorker { get; set; }
        public DbSet<TimeStudy> TimeStudy { get; set; }
        public DbSet<OperatorMaster> OperatorMaster { get; set; }
    }
}
