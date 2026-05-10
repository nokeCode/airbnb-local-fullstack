from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers as nested_routers
from .views import (
    ContractViewSet, PaiementViewSet, DashboardStatsView,
    ApplicationViewSet, VisitViewSet, LeaseViewSet
)

router = DefaultRouter()
router.register('contracts', ContractViewSet, basename='contract')
router.register('applications', ApplicationViewSet, basename='application')
router.register('visits', VisitViewSet, basename='visit')
router.register('leases', LeaseViewSet, basename='lease')

contracts_router = nested_routers.NestedDefaultRouter(router, 'contracts', lookup='contract')
contracts_router.register('payments', PaiementViewSet, basename='contract-payments')

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard'),
] + router.urls + contracts_router.urls