from app.db.models import UserRole
from app.services.auth_service import normalize_role


def test_normalize_role_maps_legacy_hr_to_recruiter():
    assert normalize_role(UserRole.hr) == UserRole.recruiter


def test_normalize_role_keeps_supported_roles():
    assert normalize_role(UserRole.candidate) == UserRole.candidate
    assert normalize_role(UserRole.recruiter) == UserRole.recruiter
    assert normalize_role(UserRole.admin) == UserRole.admin
