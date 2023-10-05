using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeSlackerApi.Data.Models
{
    public class PersonFails
    {
        public long EmployeeId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public int TotalFails { get; set; }

        public int TotalTimesheets { get; set; }

        public decimal FailRate { get; set; }
    }
}
