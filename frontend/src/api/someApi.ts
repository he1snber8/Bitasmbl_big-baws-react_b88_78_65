using MediatR;
using Microsoft.AspNetCore.Mvc;
using Project_Backend_2024.Facade.Interfaces;
using Project_Backend_2024.Services.CommandServices.AWS;

namespace Project_Backend_2024.Controllers.CommandControllers;

[Route("api/email")]
[ApiController]
public class EmailController(IEmailService emailService) : ControllerBase
{

    [HttpPost("send-sns-direct")]
    public async Task<IActionResult> SendSnsDirectEmail()
    {
        try
        {
            string htmlBody = @"
<html>
<body style='font-family: sans-serif; background-color: #f4f4f4; padding: 20px;'>
    <div style='background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;'>
        <h1 style='color: #333;'>Hello from AWS!</h1>
        <p style='font-size: 16px; color: #666;'>
            This is a <strong>test HTML email</strong> sent via SNS.
        </p>
        <hr style='border: 0; border-top: 1px solid #eee;' />
        <p style='font-size: 12px; color: #999;'>Sent at: " + DateTime.Now.ToString("f") + @"</p>
    </div>
</body>
</html>";

            await emailService.SendEmailAsync("lukakhajavelidze@bitasmbl.com", "Hello", htmlBody);
            return Ok("email sent in this bitch");
        }
        catch (Exception e)
        {
            return BadRequest("bad");
        }
    }

    [HttpPost("send-direct")]
    public async Task<IActionResult> SendDirectEmail([FromBody] SendEmailRequest request)
    {

        try
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.HtmlContent))
            {
                return BadRequest("Email and content are required.");
            }

            await emailService.SendEmailAsync(
                request.Email,
                request.Subject,
                request.HtmlContent);


            return Ok(new { message = "Email sent successfully." });
        }
        catch (Exception e)
        {
            return BadRequest($"Failed to send email {e.Message}");

        }

    }

}