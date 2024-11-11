using DRSAlert.API.DTOs;
using FluentValidation;

namespace DRSAlert.API.Filters;

public class ValidationFilter<T> : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var validator = context.HttpContext
            .RequestServices.GetRequiredService<IValidator<T>>();

        if (validator is null)
        {
            return await next(context);
        }

        var obj = context.Arguments.OfType<T>().FirstOrDefault();

        if (obj is null)
        {
            return Results.Problem("The object to validate could not be found");
        }

        var validationResult = await validator.ValidateAsync(obj);

        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }

        return await next(context);
    }
}