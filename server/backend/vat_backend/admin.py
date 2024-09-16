from django.contrib import admin
from .models import Dashboard, Widget, Feed

# class DashboardAdmin(admin.ModelAdmin):
# 	list_display = ('name', 'description', 'created_at', 'updated_at', 'link_public', 'public')

# # Register your models here.
# admin.site.register(Dashboard, DashboardAdmin)

# # class UserAdmin(admin.ModelAdmin):
# # 	list_display = ('username', 'firstName', 'lastName', 'password')
# # admin.site.register(User, UserAdmin)

# class WidgetAdmin(admin.ModelAdmin):
# 	list_display = ('type', 'name', 'x', 'y', 'w', 'h')
# admin.site.register(Widget, WidgetAdmin)

# class FeedAdmin(admin.ModelAdmin):
# 	list_display = ('name', 'value', 'created_at', 'updated_at')
# admin.site.register(Feed, FeedAdmin)

# class ConnectedAdmin(admin.ModelAdmin):
# 	list_display = ('feedID', 'widgetID')
# admin.site.register(Connected, ConnectedAdmin)