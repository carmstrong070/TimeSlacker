USE TimeTracker
GO

-- Close Call Achievement
SELECT DISTINCT ae.Employee_Id
	FROM Submission.SubmissionApprovalEvents ae
	WHERE EventTypeId = 1 
		AND ae.EventDateStamp BETWEEN DATEADD(hh, 23, CONVERT(datetime, ae.EventDurationEndDate)) AND DATEADD(dd, 1,  CONVERT(datetime, ae.EventDurationEndDate))