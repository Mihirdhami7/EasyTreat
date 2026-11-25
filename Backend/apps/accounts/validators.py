"""Shared validation for people's details (sign-up, reception, super admin forms)."""
from datetime import date, datetime

from rest_framework import serializers

# Minimum age per account type (the same rules as the sign-up page)
MIN_AGE = {"Patient": 10, "Doctor": 25, "Supplier": 18, "Admin": 18}


def check_birth_date(value, min_age=10, who="You"):
    """
    value: 'YYYY-MM-DD' (or 'DD-MM-YYYY'). Returns 'YYYY-MM-DD'.
    Raises ValidationError when the date is invalid, in the future or the person is too young.
    """
    text = str(value or "").strip()[:10]
    born = None
    for fmt in ("%Y-%m-%d", "%d-%m-%Y"):
        try:
            born = datetime.strptime(text, fmt).date()
            break
        except ValueError:
            continue
    if born is None:
        raise serializers.ValidationError("Enter a valid date of birth.")
    today = date.today()
    if born > today:
        raise serializers.ValidationError("Date of birth cannot be in the future.")
    if born.year < 1900:
        raise serializers.ValidationError("Enter a valid date of birth.")
    age = today.year - born.year - ((today.month, today.day) < (born.month, born.day))
    if age < min_age:
        raise serializers.ValidationError(f"{who} must be at least {min_age} years old.")
    return born.isoformat()
