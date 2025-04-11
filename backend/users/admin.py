from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

# Register your models here.

class CustomUserAdmin(UserAdmin):
    """
    Angepasstes Admin-Interface für das Django User-Modell mit Jazzmin-Styling.
    """
    # Felder in der Listenansicht
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_active', 'date_joined', 'groups')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    # Anpassung der Bearbeitungsfelder in Tab-Form
    fieldsets = (
        (_('Benutzerinformationen'), {'fields': ('username', 'password')}),
        (_('Persönliche Informationen'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Berechtigungen'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Wichtige Daten'), {'fields': ('last_login', 'date_joined')}),
    )
    
    # Anpassung der Felder beim Hinzufügen eines neuen Benutzers
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'email', 'first_name', 'last_name', 'is_staff', 'is_active'),
        }),
    )
    
    # Aktionen im Admin-Interface
    actions = ['activate_users', 'deactivate_users']
    
    def activate_users(self, request, queryset):
        """Aktiviert ausgewählte Benutzer."""
        queryset.update(is_active=True)
    activate_users.short_description = _("Ausgewählte Benutzer aktivieren")
    
    def deactivate_users(self, request, queryset):
        """Deaktiviert ausgewählte Benutzer."""
        queryset.update(is_active=False)
    deactivate_users.short_description = _("Ausgewählte Benutzer deaktivieren")

# Das Standard-User-Admin durch unsere angepasste Version ersetzen
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
