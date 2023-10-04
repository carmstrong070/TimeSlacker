using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TimeSlackerApi.Data;

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
        [Route("GetRecentFails")]
        public List<string> GetRecentFails() => TimeSlackerDataProcessor.GetRecentFails();

        [HttpGet]
        [Route("GetClosestCall")]
        public object GetClosestCall()
        {
            var ret = TimeSlackerDataProcessor.GetClosestCall();

            return new {Name = ret.Name, SecondsTilFail = ret.SecondsTilFail };
        }
    }
}
