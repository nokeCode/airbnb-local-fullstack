from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        return hasattr(request.user, 'profile') and request.user.profile.role == 'admin'

class IsOwner(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and request.user.profile.role == 'owner'

class IsAdminOrOwner(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser:
            return True
        if not hasattr(user, 'profile'):
            return False
        return user.profile.role in ['admin', 'owner']

class IsAdminOrReadOnly(BasePermission):
    """Lecture pour tous les authentifiés, écriture uniquement pour admin"""
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.is_authenticated
        return hasattr(request.user, 'profile') and request.user.profile.role == 'admin'