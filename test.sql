use D2LIntegration;
insert into assignments(
        assignmentName,
        d2lCourseCode,
        nbccCourseCode,
        unixtime
    )
values (
        "SPRINT01",
        211298,
        "PROG1197",
        FROM_UNIXTIME(1707105540.0)
    );
select assignmentName,
    d2lCourseCode,
    nbccCourseCode,
    UNIX_TIMESTAMP(unixtime) as unixtime
from assignments