using Microsoft.IdentityModel.Tokens;

namespace DRSAlert.API.Utilities;

public class KeysHandler
{
    public const string OurIssuer = "DRSAlert.API";
    private const string KeysSection = "Authentication:Schemes:Bearer:SigningKeys";
    private const string KeysSectionIssuer = "Issuer";
    private const string KeysSectionValue = "Value";
    
    public static IEnumerable<SecurityKey> GetKey(IConfiguration configuration)
        => GetKey(configuration, OurIssuer);

    public static IEnumerable<SecurityKey> GetKey(IConfiguration configuration, string issuer)
    {
        var signingKey = configuration.GetSection(KeysSection)
            .GetChildren()
            .SingleOrDefault(key => key[KeysSectionIssuer] == issuer);
        
        if (signingKey is not null && signingKey[KeysSectionValue] is string secretKey)
        {
            yield return new SymmetricSecurityKey(Convert.FromBase64String(secretKey));
        }
    }
    
    public static IEnumerable<SecurityKey> GetAllKeys(IConfiguration configuration)
    {
        var signingKeys = configuration.GetSection(KeysSection)
            .GetChildren();
        
        foreach (var signingKey in signingKeys)
        {
            if (signingKey[KeysSectionValue] is string secretKey)
            {
                yield return new SymmetricSecurityKey(Convert.FromBase64String(secretKey));
            }
        }
    }
}   