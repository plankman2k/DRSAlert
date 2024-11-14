using DRSAlert.API.DTOs;
using FluentValidation;

namespace DRSAlert.API.Validations;

public class LoginCredentialsDtoValidator : AbstractValidator<LoginCredentialsDto>
{
        public LoginCredentialsDtoValidator()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email cannot be empty")
                .MaximumLength(256).WithMessage("Maximum length for email is 256 characters")
                .EmailAddress().WithMessage("Email is not valid");

            RuleFor(x => x.Password).NotEmpty().WithMessage("Password cannot be empty");
        
        }
}