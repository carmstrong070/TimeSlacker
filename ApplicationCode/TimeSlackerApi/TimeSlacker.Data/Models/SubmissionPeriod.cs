using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeSlackerApi.Data.Models
{
    public class SubmissionPeriod
    {
        public string StartDayName { get; set; }

        public DateTime StartDate { get; set; }

        public string EndDayName { get; set; }

        public DateTime EndDate { get; set; }

        public int TotalFails { get; set; }
    }
}
