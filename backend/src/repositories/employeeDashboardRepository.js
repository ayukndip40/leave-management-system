const pool = require("../config/db");


const getEmployeeDashboard = async (userId) => {


    // Employee profile
    const [profileRows] =
    await pool.query(
    `
    SELECT

        u.employee_number,

        u.first_name,

        u.last_name,

        u.email,

        u.phone,


        ep.gender,

        ep.date_of_birth,

        ep.employment_date,

        ep.employment_type,


        p.position_name,

        d.department_name


    FROM users u


    INNER JOIN employee_profiles ep
        ON u.id = ep.user_id


    LEFT JOIN positions p
        ON ep.position_id = p.id


    LEFT JOIN departments d
        ON p.department_id = d.id


    WHERE u.id = ?

    LIMIT 1

    `,
    [userId]
    );



    // Leave balances
    const [balanceRows] =
    await pool.query(
    `
    SELECT

        lb.id,

        lt.leave_name,

        lb.allocated_days AS total_days,

        lb.used_days,

        lb.remaining_days


    FROM leave_balances lb


    INNER JOIN leave_types lt

        ON lb.leave_type_id = lt.id


    WHERE lb.user_id = ?

    `,
    [userId]
    );




    // Recent leave requests
    const [leaveRows] =
await pool.query(
`
SELECT

    lr.leave_request_uuid,

    lt.leave_name,

    lr.start_date,

    lr.end_date,

    lr.total_days,

    lr.status,

    lr.created_at


FROM leave_requests lr


INNER JOIN leave_types lt

    ON lr.leave_type_id = lt.id


WHERE lr.user_id = ?


ORDER BY lr.created_at DESC


LIMIT 5

`,
[userId]
);



    return {

        profile:
            profileRows[0] || null,


        leaveBalances:
            balanceRows,


        recentLeaves:
            leaveRows

    };


};



module.exports = {
    getEmployeeDashboard
};