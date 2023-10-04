using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols;
using System.Runtime.InteropServices;
using TimeSlackerApi.Data;

namespace TimeSlackerApi.Data
{
    public static class TimeSlackerDataProcessor
    {
        public static List<string> GetRecentFails()
        {
            var retList = new List<string>();

            using (var sqlConn = new SqlConnection(TimeSlackerApiDatabaseConnection.conn))
            using (var cmd = sqlConn.CreateCommand())
            {
                cmd.CommandText = @"SELECT e.Fname + ' ' + e.Lname
	                                    FROM tbl_Employees e
		                                    LEFT JOIN Submission.SubmissionApprovalEvents ae
			                                    ON e.Employee_Id = ae.Employee_ID 
				                                    AND ae.EventDateStamp < DATEADD(dd, 1, ae.EventDurationEndDate)
				                                    AND ae.EventDurationEndDate = (SELECT TOP (1) ae.EventDurationEndDate
						                                    FROM Submission.SubmissionApprovalEvents ae
						                                    WHERE ae.EventDurationEndDate < GETDATE()
						                                    ORDER BY ae.EventDurationEndDate DESC)
				                                    AND ae.EventTypeId = '1'
	                                    WHERE e.IsActive = '1' AND ae.EventDateStamp IS NULL";

                sqlConn.Open();

                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        retList.Add(dr.GetString(0));
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
    }
}