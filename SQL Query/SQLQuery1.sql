USe RMGTextile;

create table Misc(Id int not null Identity(1,1), Data float null, Unit varchar(10) null, Primary Key(Id) )
Alter table Misc add Parameter varchar(50) not null;
insert into Misc(Parameter, Data, Unit) values('Planned downtime', 35, 'Min')
select * from Misc;
select * from UnplannedDowntime
select * from WorkerAttendance;
Update WorkerAttendance set Date = '2021-01-31 00:00:00.000' where Date = '2021-01-01 00:00:00.000'
Update UnplannedDowntime set Data = 30 where Date = '2021-01-31 00:00:00.000'
select * from OperatorSkill


CREATE TABLE KPI(Id int not null Identity(1,1), Primary Key(Id), Name varchar(max), Module int, Department int)
insert into KPI(Name, Module, Department) values('Efficiency',1,1)
insert into KPI(Name, Module, Department) values('Machine downtime',1,1)
insert into KPI(Name, Module, Department) values('Absenteism',1,1)
select * from KPI

create table Module(Id int not null Identity(1,1), Primary Key(Id), Name varchar(max))
insert into Module(Name) values('Processes')
insert into Module(Name) values('Outward')
insert into Module(Name) values('Absenteism')
select * from Module

select * from Recommendation

create table Department(Id int not null Identity(1,1), Primary Key(Id), Name varchar(max))
insert into Department(Name) values('Sewing')
insert into Department(Name) values('Spreading & Cutting')
insert into Department(Name) values('Fabric & Trims Store')
insert into Department(Name) values('Finishing & Packaging')