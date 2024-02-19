create DATABASE IF NOT EXISTS D2LIntegration;
use D2LIntegration;
drop table if EXISTS assignments;
create table IF NOT EXISTS assignments(
    assignmentName varchar(500),
    d2lCourseCode int(6) not null,
    unixtime datetime not null,
    primary key (assignmentName, d2lCourseCode)
);
drop table if exists courses;
create table if not exists courses(
    d2lCourseCode int(6) not null primary key,
    nbccCourseCode varchar(10) not null
);