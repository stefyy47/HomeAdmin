using System;
using Microsoft.AspNetCore.Identity;

namespace Hostt.Models
{
    public class ApplicationUser : IdentityUser<string>
    {
        public ApplicationUser()
        {
            AccessFailedCount = 0;
            SecurityStamp = Guid.NewGuid().ToString();
            EmailConfirmed = true;
            Id = Guid.NewGuid().ToString();

        }

        public ApplicationUser(string email, string userName)
        {
            Id = Guid.NewGuid().ToString();
            Email = email ?? string.Empty;
            UserName = userName;
            NormalizedUserName = userName.ToUpper();
            NormalizedEmail = string.IsNullOrEmpty(email) ? string.Empty : email.ToUpper();
            AccessFailedCount = 0;
            SecurityStamp = Guid.NewGuid().ToString();
            EmailConfirmed = true;
        }
    }

    public class ApplicationRole : IdentityRole<string>
    {
    }
}