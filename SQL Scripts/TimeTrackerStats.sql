USE TimeTracker
GO

-- Get Total Fails
SELECT COUNT(*)
	FROM
	( 
		SELECT MAX(EventDateStamp) AS EventDateStamp, MAX(EventByUID) AS EventByUID, EventDurationStartDate, EventDurationEndDate, ae.Employee_Id
			FROM Submission.SubmissionApprovalEvents ae
				INNER JOIN tbl_Employees e
					ON ae.Employee_Id = e.Employee_ID AND e.IsActive = '1'
			WHERE EventTypeId = 1 
				AND ae.EventDateStamp > DATEADD(day, 1, ae.EventDurationEndDate) 
				AND ae.EventDurationEndDate > '2022-05-23'
				--AND e.Employee_Id NOT IN ('125', '134', '50', '103')
			GROUP BY EventDurationStartDate, EventDurationEndDate, ae.Employee_Id) x;


-- Specific person's failures
SELECT MAX(EventDateStamp) AS EventDateStamp, MAX(EventByUID) AS EventByUID, EventDurationStartDate, EventDurationEndDate, Employee_Id
	FROM Submission.SubmissionApprovalEvents ae
	WHERE EventTypeId = 1 
		AND ae.EventDateStamp > DATEADD(day, 1, ae.EventDurationEndDate) 
		AND ae.EventDurationEndDate > '2022-05-23'
		--AND (DATENAME(dw, EventDurationEndDate) = 'Saturday' OR DATENAME(dw, EventDurationEndDate) = 'Sunday')
		AND Employee_Id = '125'
	GROUP BY EventDurationStartDate, EventDurationEndDate, Employee_Id;


-- Fails of the Previous week
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
	ORDER BY e.Employee_ID;



-- Total failures
WITH Failures (Employee_Id, Failures, MostRecent)
AS
(
	SELECT DISTINCT Employee_Id, COUNT(DISTINCT EventDurationEndDate) AS Failures, MAX(EventDurationEndDate) AS MostRecent
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
SELECT e.Employee_ID, e.Fname, e.Lname, f.Failures, t.Total, CAST(((f.Failures * 1.00) / t.Total) AS numeric(10,4)) AS FailureRate, f.MostRecent
	FROM tbl_Employees e
		INNER JOIN Failures f
			ON e.Employee_Id = f.Employee_ID
		INNER JOIN totals t
			ON e.Employee_ID = t.Employee_Id
		WHERE e.IsActive = '1'
				AND t.Total > 10
		--AND e.Employee_ID IN ('48','126','128','150','105','148','149') -- Dev Team
		--AND e.Employee_ID IN ('144','131','159','129','56','157','140','96','139','155','156','73','168','169','164','163','166','143') -- Data Team
		--AND e.Employee_ID IN ('103','127','120','154','135','57','49','133','170','58','119','146','62','161','173') -- Env Team
		--AND e.Employee_ID IN ('50','158','151','125','134') -- Excluded
	ORDER BY FailureRate DESC;
	

	


-- Fails per submission
WITH submissionPeriods (StartDay, EventDurationStartDate, EndDay, EventDurationEndDate)
AS
(
	SELECT DISTINCT DATENAME(dw, EventDurationStartDate) AS StartDay, EventDurationStartDate, DATENAME(dw, EventDurationEndDate) AS EndDay, EventDurationEndDate
		FROM Submission.SubmissionApprovalEvents ae
		WHERE ae.EventDurationEndDate <= GETDATE()
		AND ae.EventDurationEndDate > '2022-05-23'
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
	ORDER BY sp.EventDurationEndDate ASC;



-- Close Calls
WITH closeCalls (EmployeeId, CloseCallsCount)
AS
(
SELECT ae.Employee_Id, COUNT(EventId) AS CloseCallsCount
	FROM Submission.SubmissionApprovalEvents ae
	WHERE EventTypeId = 1 
		AND ae.EventDateStamp BETWEEN DATEADD(hh, 23, CONVERT(datetime, ae.EventDurationEndDate)) AND DATEADD(dd, 1,  CONVERT(datetime, ae.EventDurationEndDate))
		--AND ae.Employee_Id = '126'
		GROUP BY Employee_Id
)
SELECT e.Employee_ID, e.FName,  e.Lname,  CONVERT(nvarchar(10), CloseCallsCount) AS CloseCalls
	FROM closeCalls c
		INNER JOIN tbl_Employees e
			ON c.EmployeeId = e.Employee_ID
	ORDER BY CloseCallsCount desc;


-- All Close Calls
SELECT e.Employee_ID, e.FName, e.Lname, DATEDIFF(s, EventDateStamp, DATEADD(dd, 1,  CONVERT(datetime, ae.EventDurationEndDate))) AS SecondsTilFail, ae.EventDateStamp, DATENAME(dw, EventDurationEndDate) AS FailDayOfWeek
	FROM Submission.SubmissionApprovalEvents ae
		INNER JOIN tbl_Employees e
			ON ae.Employee_Id = e.Employee_ID
	WHERE EventTypeId = 1 
		AND ae.EventDateStamp BETWEEN DATEADD(hh, 23, CONVERT(datetime, ae.EventDurationEndDate)) AND DATEADD(dd, 1,  CONVERT(datetime, ae.EventDurationEndDate))
		--AND ae.EventDurationEndDate >= '2023-09-30'
	ORDER BY DATEDIFF(s, EventDateStamp, DATEADD(dd, 1,  CONVERT(datetime, ae.EventDurationEndDate))) ASC;


-- On times for standard weeks
WITH onTimes (EmployeeId, OnTimeCount)
AS
(
SELECT ae.Employee_Id, COUNT(EventId) AS OnTimeCount
	FROM Submission.SubmissionApprovalEvents ae
	WHERE EventTypeId = 1 
		AND DATENAME(dw, EventDateStamp) = 'Friday'
		AND DATEPART(hh, ae.EventDateStamp) BETWEEN 15 AND 17
		AND DATENAME(dw, EventDurationStartDate) = 'Monday'
		AND (DATENAME(dw, EventDurationEndDate) = 'Saturday' OR DATENAME(dw, EventDurationEndDate) = 'Sunday')
		GROUP BY Employee_Id
)
SELECT ot.EmployeeId, e.FName, e.Lname, ot.OnTimeCount
	FROM onTimes ot
		INNER JOIN tbl_Employees e
			ON ot.EmployeeId = e.Employee_ID
	ORDER BY OnTimeCount desc;


-- All On times
SELECT e.FName, e.Lname, 
		CONVERT(nvarchar(8), DATEPART(hh, ae.EventDateStamp)) + ':' + CONVERT(nvarchar(8), FORMAT(DATEPART(mi, ae.EventDateStamp), '0#')) AS SubmissionTime,
		ae.EventDateStamp, 
		DATENAME(dw, EventDurationEndDate) AS FailDayOfWeek
	FROM Submission.SubmissionApprovalEvents ae
		INNER JOIN tbl_Employees e
			ON ae.Employee_Id = e.Employee_ID
	WHERE EventTypeId = 1 
		AND DATENAME(dw, EventDateStamp) = 'Friday'
		AND DATEPART(hh, ae.EventDateStamp) BETWEEN 15 AND 17
		AND DATENAME(dw, EventDurationStartDate) = 'Monday'
		AND (DATENAME(dw, EventDurationEndDate) = 'Saturday' OR DATENAME(dw, EventDurationEndDate) = 'Sunday')
	ORDER BY DATEDIFF(s, EventDateStamp, DATEADD(dd, 1,  CONVERT(datetime, ae.EventDurationEndDate))) ASC