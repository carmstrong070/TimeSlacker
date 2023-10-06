using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeSlackerApi.Data.Models
{
    public class SubmissionPeriods
    {
        public List<SubmissionPeriod> Periods { get; set; } = new List<SubmissionPeriod>();
    }
    public class SubmissionPeriod
    {
        public string StartDayName { get; set; }

        public DateTime StartDate { get; set; }

        public string EndDayName { get; set; }

        public DateTime EndDate { get; set; }

        public int TotalFails { get; set; }

        public decimal RollingAverage { get; set; }
    }

    public static class SubmissionPeriodExtensionMethods
    {
        public static List<SubmissionPeriod> CalculateRollingAverages(this SubmissionPeriods p, int RollingAverageSize)
        {
            var queue = new Queue<int>(RollingAverageSize);
            for (int i = 0; i < p.Periods.Count(); i++)
            {
                //-- If there are too many items in the queue. Remove one
                if (queue.Count() >= RollingAverageSize)
                    queue.Dequeue();

                //-- Add next item to the queue
                queue.Enqueue(p.Periods[i].TotalFails);

                //-- Average items in queue and add it to SubmissionPeriod
                p.Periods[i].RollingAverage = (decimal)queue.Average();
            }

            return p.Periods;
        }
    }
}
