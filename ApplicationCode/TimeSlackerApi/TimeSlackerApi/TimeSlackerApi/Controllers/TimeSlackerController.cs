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
        #region ConnectionString
        public TimeSlackerController(IConfiguration config)
        {
            TimeSlackerApiDatabaseConnection conn = new TimeSlackerApiDatabaseConnection(config);
        }
        #endregion

        [HttpGet]
        [Route("GetTotalFails")]
        public int GetTotalFails() => TimeSlackerDataProcessor.GetTotalFails();

        [HttpGet]
        [Route("GetRecentFails")]
        public List<RecentFail> GetRecentFails() => TimeSlackerDataProcessor.GetRecentFails();

        [HttpGet]
        [Route("GetMostRecentPeriod")]
        public TimePeriod GetMostRecentPeriod() => TimeSlackerDataProcessor.GetMostRecentPeriod();

        [HttpGet]
        [Route("GetClosestCall")]
        public CloseCall GetClosestCall() => TimeSlackerDataProcessor.GetClosestCall();

        [HttpGet]
        [Route("GetAllFails")]
        public List<PersonFails> GetAllFails() => TimeSlackerDataProcessor.GetAllFails();

        [HttpGet]
        [Route("GetFailsPerPeriod")]
        public List<SubmissionPeriod> GetFailsPerPeriod() => TimeSlackerDataProcessor.GetFailsPerPeriod();
    }
}
