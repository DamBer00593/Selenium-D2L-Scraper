create DATABASE IF NOT EXISTS D2LIntegration;
use D2LIntegration;
drop table if EXISTS lastMessageID;
-- create table IF NOT EXISTS lastMessageID(
--     ID int NOT NULL AUTO_INCREMENT primary key,
--     lastMessageID BIGINT
-- );
-- insert into lastMessageID(lastMessageID)
-- values (1208642624844603442);
drop table if EXISTS assignments;
create table IF NOT EXISTS assignments(
    assignmentName varchar(500),
    d2lCourseCode int(6) not null,
    nbccCourseCode varchar(10) not null,
    unixtime datetime not null,
    primary key (assignmentName, d2lCourseCode)
);