using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeSlackerApi.Data.Models
{
    public class RecentFail
    {
        public long EmployeeId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public int TotalFails { get; set; }

        public string MostRecent { get; set; }

        public decimal FailRate { get; set; }
    }
}
