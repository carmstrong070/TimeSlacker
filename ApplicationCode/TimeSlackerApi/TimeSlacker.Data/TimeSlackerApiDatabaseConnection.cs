using static System.Reflection.Metadata.BlobBuilder;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace TimeSlackerApi.Data
{
    public class TimeSlackerApiDatabaseConnection
    {
        public static string conn {  get; set; }

        public TimeSlackerApiDatabaseConnection(IConfiguration config)
        {
            conn = config.GetConnectionString("DefaultConnection");
        }
    }
}
