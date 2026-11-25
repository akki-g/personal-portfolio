import os

from rest_framework.permissions import SAFE_METHODS, BasePermission


class ReadOnlyOrStaff(BasePermission):
    """Anyone can read; only staff (Django admin users) can create or change content."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


def allowed_remote_hosts():
    """SSH targets the remote-access page may reach, from REMOTE_SSH_HOSTS (comma-separated).

    Empty by default, so the server can't be used to open SSH connections to arbitrary hosts.
    """
    return {host.strip() for host in os.getenv('REMOTE_SSH_HOSTS', '').split(',') if host.strip()}
