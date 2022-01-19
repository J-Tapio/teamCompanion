export default [
  {
    id: 1,
    athleteId: 5,
    activityId: 1,
    activityStart: "2022-01-14T18:00",
    activityEnd: "2022-01-14T19:30",
    createdBy: 6,
  },
  {
    id: 2,
    athleteId: 5,
    activityId: 4,
    activityStart: "2022-01-15T17:00",
    activityEnd: "2022-01-15T18:30",
    createdBy: 7,
  },
  {
    id: 3,
    athleteId: 5,
    activityId: 4,
    activityStart: "2022-01-16T09:00",
    activityEnd: "2022-01-16T10:30",
    createdBy: 7,
  },
  {
    id: 4,
    athleteId: 5,
    activityId: 2,
    activityStart: "2022-01-17T19:00",
    activityEnd: "2022-01-17T20:30",
    createdBy: 1,
  },
  {
    id: 5,
    athleteId: 5,
    activityId: 5,
    activityStart: "2022-01-18T12:00",
    activityEnd: "2022-01-18T13:00",
    createdBy: 3,
  },
]

/**
 * Athlete(s) is/are receiver of the activities
 * Team's Coach, Trainer, Physiotherapist, Staff creates activities
 * 
/

//TODO: Re-consider later naming convention of athlete_id column.
/** 
 * athlete_id column:
 * References id of user_teams table. 
 * Table row contains information about user_id, team_id, team_role etc. 
 * More  meaningful reference to this table than to users table, 
 * even though join-table in question. In a way this is meaningful naming
 * convention as this column will only contain id's from user_teams table,
 * which is related to athlete in certain team.
 * 
 * */ 

