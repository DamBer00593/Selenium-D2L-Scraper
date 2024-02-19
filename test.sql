-- use D2LIntegration;
-- insert into assignments(
--         assignmentName,
--         d2lCourseCode,
--         unixtime
--     )
-- values (
--         "SPRINT01",
--         211298,
--         FROM_UNIXTIME(1707105540.0)
--     );
-- select assignmentName,
--     d2lCourseCode,
--     UNIX_TIMESTAMP(unixtime) as unixtime
-- from assignments;
-- select *
-- from courses;
select assignmentName,
    c.nbccCourseCode,
    unixtime as unixtime
from assignments a
    inner join courses c on c.d2lCourseCode = a.d2lCourseCode
where unixtime > DATE_SUB(CURDATE(), INTERVAL 2 DAY)
order by unixtime