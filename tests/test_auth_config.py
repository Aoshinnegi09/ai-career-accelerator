from app.core.config import Settings


def test_registration_allowlist_enforcement_disabled_by_default():
    settings = Settings(_env_file=None)
    assert settings.email_allowlist_enforce_registration is False
