using DRSAlert.API.DTOs;
using FluentValidation;

namespace DRSAlert.API.Validations;

public class EditClaimDTOValidator : AbstractValidator<EditClaimDTO>
{
    public EditClaimDTOValidator()
    {
        RuleFor(x => x.Email).EmailAddress().WithMessage("Email is not valid");
    }
}