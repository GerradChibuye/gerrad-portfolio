from django import forms

from .models import ContactMessage


class ContactMessageForm(forms.ModelForm):
    # Honeypot field: legitimate visitors should leave this empty.
    website = forms.CharField(
        required=False,
        widget=forms.HiddenInput(),
    )

    class Meta:
        model = ContactMessage
        fields = ["name", "email", "subject", "message"]

        widgets = {
            "name": forms.TextInput(attrs={
                "placeholder": "Your name",
                "autocomplete": "name",
            }),
            "email": forms.EmailInput(attrs={
                "placeholder": "you@example.com",
                "autocomplete": "email",
            }),
            "subject": forms.TextInput(attrs={
                "placeholder": "What would you like to discuss?",
            }),
            "message": forms.Textarea(attrs={
                "placeholder": "Tell me a little about your enquiry...",
                "rows": 5,
            }),
        }
