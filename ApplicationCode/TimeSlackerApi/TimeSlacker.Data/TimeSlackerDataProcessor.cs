using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols;
using System.Runtime.InteropServices;
using TimeSlackerApi.Data;
using TimeSlackerApi.Data.Models;

namespace TimeSlackerApi.Data
{
    public static class TimeSlackerDataProcessor
    {

        public static List<PersonFails> GetAllFails() 
        { 
            var retList = new List<PersonFails>();

            using (var sqlConn = new SqlConnection(TimeSlackerApiDatabaseConnection.conn))
            using (var cmd = sqlConn.CreateCommand())
            {
                cmd.CommandText = @"-- Total failures
                                    WITH Failures (Employee_Id, Failures)
                                    AS
                                    (
	                                    SELECT DISTINCT Employee_Id, COUNT(DISTINCT EventDurationEndDate) AS Failures
		                                    FROM Submission.SubmissionApprovalEvents ae
		                                    WHERE EventTypeId = '1' 
			                                    AND ae.EventDateStamp > DATEADD(day, 1, ae.EventDurationEndDate) 
			                                    AND ae.EventDurationEndDate > '2022-05-23'
		                                    GROUP BY Employee_Id
                                    ), totals (Employee_Id, Total)
                                    AS
                                    (
	                                    -- Time Sheets per person
	                                    SELECT ae.Employee_Id, COUNT(DISTINCT EventDurationEndDate)
		                                    FROM Submission.SubmissionApprovalEvents ae
		                                    INNER JOIN tbl_Employees emp
				                                    ON ae.Employee_Id = emp.Employee_ID
		                                    WHERE emp.IsActive = '1'
			                                    AND EventTypeId = '1'
			                                    AND ae.EventDurationEndDate > '2022-05-23'
		                                    GROUP BY ae.Employee_Id
                                    )
                                    SELECT e.Employee_ID, e.Fname, e.Lname, f.Failures, t.Total, CAST(((f.Failures * 1.00) / t.Total) AS numeric(10,4)) AS FailureRate
	                                    FROM tbl_Employees e
		                                    INNER JOIN Failures f
			                                    ON e.Employee_Id = f.Employee_ID
		                                    INNER JOIN totals t
			                                    ON e.Employee_ID = t.Employee_Id
		                                    WHERE e.IsActive = '1'
		                                    --AND e.Employee_ID IN ('48','126','128','150','105','148','149') -- Dev Team
		                                    --AND e.Employee_ID IN ('144','131','159','129','56','157','140','96','139','155','156','73','168','169','164','163','166','143') -- Data Team
		                                    --AND e.Employee_ID IN ('103','127','120','154','135','57','49','133','170','58','119','146','62','161','173') -- Env Team
		                                    --AND e.Employee_ID IN ('50','158','151','125','134') -- Excluded
	                                    ORDER BY f.Failures DESC;";

                sqlConn.Open();

                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        retList.Add(new PersonFails()
                        {
                            EmployeeId = dr.GetInt64(0),
                            FirstName = dr.GetString(1),
                            LastName = dr.GetString(2),
                            TotalFails = dr.GetInt32(3),
                            TotalTimesheets = dr.GetInt32(4),
                            FailRate = dr.GetDecimal(5)
                        });
                    }
                }
            }

            return retList;
        }

        public static List<RecentFail> GetRecentFails()
        {
            var retList = new List<RecentFail>();

            using (var sqlConn = new SqlConnection(TimeSlackerApiDatabaseConnection.conn))
            using (var cmd = sqlConn.CreateCommand())
            {
                cmd.CommandText = @"-- Fails of the Previous week
									WITH MostRecent (Employee_Id, MostRecent)
									AS
									(
									-- Most Recent Fail besides last week.
									SELECT Employee_Id, MAX(EventDurationEndDate)
										FROM Submission.SubmissionApprovalEvents ae
										WHERE EventTypeId = 1 
											AND ae.EventDateStamp > DATEADD(day, 1, ae.EventDurationEndDate) 
											AND ae.EventDurationEndDate > '2022-05-23'
											AND ae.EventDurationEndDate < (SELECT TOP (1) ae.EventDurationEndDate
															FROM Submission.SubmissionApprovalEvents ae
															WHERE ae.EventDurationEndDate < GETDATE()
															ORDER BY ae.EventDurationEndDate DESC)
										GROUP BY Employee_Id
									), Failures (Employee_Id, Failures)
									AS
									(
										SELECT DISTINCT Employee_Id, COUNT(DISTINCT EventDurationEndDate) AS Failures
											FROM Submission.SubmissionApprovalEvents ae
											WHERE EventTypeId = '1' 
												AND ae.EventDateStamp > DATEADD(day, 1, ae.EventDurationEndDate) 
												AND ae.EventDurationEndDate > '2022-05-23'
											GROUP BY Employee_Id
									), Totals (Employee_Id, Total)
									AS
									(
										-- Time Sheets per person
										SELECT ae.Employee_Id, COUNT(DISTINCT EventDurationEndDate)
											FROM Submission.SubmissionApprovalEvents ae
											INNER JOIN tbl_Employees emp
													ON ae.Employee_Id = emp.Employee_ID
											WHERE emp.IsActive = '1'
												AND EventTypeId = '1'
												AND ae.EventDurationEndDate > '2022-05-23'
											GROUP BY ae.Employee_Id
									), Rates (Employee_Id, FailureRate)
									AS
									(
										SELECT e.Employee_ID,CAST(((f.Failures * 1.00) / t.Total) AS numeric(10,4)) AS FailureRate
											FROM tbl_Employees e
												INNER JOIN Failures f
													ON e.Employee_Id = f.Employee_ID
												INNER JOIN Totals t
													ON e.Employee_ID = t.Employee_Id
												WHERE e.IsActive = '1'
									)
									SELECT e.Employee_ID, e.Fname, e.Lname, f.Failures, mr.MostRecent, r.FailureRate
										FROM tbl_Employees e
											INNER JOIN MostRecent mr
												ON e.Employee_ID = mr.Employee_Id
											INNER JOIN Failures f
												ON e.Employee_ID = f.Employee_Id
											INNER JOIN Rates r
												ON e.Employee_ID = r.Employee_Id
											LEFT JOIN Submission.SubmissionApprovalEvents ae
												ON e.Employee_Id = ae.Employee_ID 
													AND ae.EventDateStamp < DATEADD(dd, 1, ae.EventDurationEndDate)
													AND ae.EventDurationEndDate = (SELECT TOP (1) ae.EventDurationEndDate
																					FROM Submission.SubmissionApprovalEvents ae
																					WHERE ae.EventDurationEndDate < GETDATE()
																					ORDER BY ae.EventDurationEndDate DESC)
													AND ae.EventTypeId = '1'
										WHERE e.IsActive = '1' 
												AND ae.EventDateStamp IS NULL 
												AND e.Employee_ID <> '125' --Exclude Chris Rennix bc he doesn't have any submission events
										ORDER BY e.Employee_ID;";

                sqlConn.Open();

                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
						retList.Add(new RecentFail()
						{
							EmployeeId = dr.GetInt64(0),
							FirstName = dr.GetString(1),
							LastName = dr.GetString(2),
							TotalFails = dr.GetInt32(3),
							MostRecent = dr.GetDateTime(4).ToShortDateString(),
							FailRate = dr.GetDecimal(5)
						});
                    }
                }
            }

            return retList;
        }

        public static (string Name, int SecondsTilFail) GetClosestCall()
        {
            (string Name, int SecondsTilFail) ret = ("", 0);

            using (var sqlConn = new SqlConnection(TimeSlackerApiDatabaseConnection.conn))
            using (var cmd = sqlConn.CreateCommand())
            {
                cmd.CommandText = @"SELECT TOP (1) e.Fname + ' ' + e.Lname, DATEDIFF(s, EventDateStamp, DATEADD(dd, 1,  CONVERT(datetime, ae.EventDurationEndDate))) AS SecondsTilFail
	                                    FROM Submission.SubmissionApprovalEvents ae
		                                    INNER JOIN tbl_Employees e
			                                    ON ae.Employee_Id = e.Employee_ID
	                                    WHERE EventTypeId = '1' 
		                                    AND ae.EventDateStamp BETWEEN DATEADD(hh, 23, CONVERT(datetime, ae.EventDurationEndDate)) 
                                            AND DATEADD(dd, 1,  CONVERT(datetime, ae.EventDurationEndDate))
	                                    ORDER BY DATEDIFF(s, EventDateStamp, DATEADD(dd, 1,  CONVERT(datetime, ae.EventDurationEndDate))) ASC;";

                sqlConn.Open();

                using (var dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        ret.Name = dr.GetString(0);
                        ret.SecondsTilFail = dr.GetInt32(1);
                    }
                }
            }

            return ret;
        }

        public static (string recentStartDate, string recentEndDate) GetMostRecentPeriod()
		{ 
            (string recentStartDate, string recentEndDate) ret = ("", "");

            using (var sqlConn = new SqlConnection(TimeSlackerApiDatabaseConnection.conn))
            using (var cmd = sqlConn.CreateCommand())
            {
                cmd.CommandText = @"SELECT TOP (1) ae.EventDurationStartDate, ae.EventDurationEndDate
										FROM Submission.SubmissionApprovalEvents ae
										WHERE ae.EventDurationEndDate < GETDATE()
										ORDER BY ae.EventDurationEndDate DESC";

                sqlConn.Open();

                using (var dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        ret.recentStartDate = dr.GetDateTime(0).ToString("MM/dd");
                        ret.recentEndDate = dr.GetDateTime(1).ToString("MM/dd");
                    }
                }
            }

            return ret;
        }

        public static List<SubmissionPeriod> GetFailsPerPeriod()
        {
            var retList = new List<SubmissionPeriod>();

            using (var sqlConn = new SqlConnection(TimeSlackerApiDatabaseConnection.conn))
            using (var cmd = sqlConn.CreateCommand())
            {
                cmd.CommandText = @"-- Fails per submission
									WITH submissionPeriods (StartDay, EventDurationStartDate, EndDay, EventDurationEndDate)
									AS
									(
										SELECT DISTINCT DATENAME(dw, EventDurationStartDate) AS StartDay, EventDurationStartDate, DATENAME(dw, EventDurationEndDate) AS EndDay, EventDurationEndDate
											FROM Submission.SubmissionApprovalEvents ae
											WHERE ae.EventDurationEndDate <= GETDATE()
									)
									SELECT DATENAME(dw, sp.EventDurationStartDate) AS StartDay
											,sp.EventDurationStartDate
											,DATENAME(dw, sp.EventDurationEndDate) AS EndDay
											,sp.EventDurationEndDate
											,COUNT(DISTINCT Employee_Id) AS FailsForPeriod
										FROM submissionPeriods sp
											LEFT JOIN Submission.SubmissionApprovalEvents ae
												ON sp.EventDurationStartDate = ae.EventDurationStartDate
													AND EventTypeId = 1 
													AND ae.EventDateStamp > DATEADD(day, 1, ae.EventDurationEndDate)
										GROUP BY sp.EventDurationStartDate, sp.EventDurationEndDate
										ORDER BY sp.EventDurationEndDate ASC;";

                sqlConn.Open();

                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        retList.Add(new SubmissionPeriod()
                        {
                            StartDayName = dr.GetString(0),
                            StartDate = dr.GetDateTime(1),
                            EndDayName = dr.GetString(2),
                            EndDate = dr.GetDateTime(3),
                            TotalFails = dr.GetInt32(4)
                        });
                    }
                }
            }

            return retList;
        }
    }
}