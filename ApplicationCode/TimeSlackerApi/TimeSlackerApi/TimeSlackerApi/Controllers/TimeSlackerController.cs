using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TimeSlackerApi.Data;
using TimeSlackerApi.Data.Models;

namespace TimeSlackerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeSlackerController : ControllerBase
    {
        public TimeSlackerController(IConfiguration config)
        {
            TimeSlackerApiDatabaseConnection conn = new TimeSlackerApiDatabaseConnection(config);
        }

        [HttpGet]
        [Route("GetTotalFails")]
        public int GetTotalFails() => TimeSlackerDataProcessor.GetTotalFails();

        [HttpGet]
        [Route("GetMostRecentPeriod")]
        public object GetMostRecentPeriod()
        {
            var ret = TimeSlackerDataProcessor.GetMostRecentPeriod();

            return new { recentStartDate = ret.recentStartDate, recentEndDate = ret.recentEndDate };
        }

        [HttpGet]
        [Route("GetRecentFails")]
        public List<RecentFail> GetRecentFails() => TimeSlackerDataProcessor.GetRecentFails();

        [HttpGet]
        [Route("GetClosestCall")]
        public object GetClosestCall()
        {
            var ret = TimeSlackerDataProcessor.GetClosestCall();

            return new { Name = ret.Name, SecondsTilFail = ret.SecondsTilFail };
        }

        [HttpGet]
        [Route("GetAllFails")]
        public List<PersonFails> GetAllFails() => TimeSlackerDataProcessor.GetAllFails();

        [HttpGet]
        [Route("GetFailsPerPeriod")]
        public List<SubmissionPeriod> GetFailsPerPeriod() => TimeSlackerDataProcessor.GetFailsPerPeriod();
    }
}
