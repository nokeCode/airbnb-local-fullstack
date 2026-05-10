from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and request.user.profile.role == 'admin'

class IsAdminOrAgent(BasePermission):
    def has_permission(self, request, view):
        if not hasattr(request.user, 'profile'):
            return False
        return request.user.profile.role in ['admin', 'agent']

class IsOwnerClient(BasePermission):
    """Un client ne voit que ses propres contrats"""
    def has_object_permission(self, request, view, obj):
        return obj.client.user == request.user