using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeSlackerApi.Data.Models
{
    public class CloseCall
    {
        public string Name { get; set; }

        public int SecondsTilFail { get; set; }

        public DateTime CloseCallDate { get; set; }
    }
}
